import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  AppState,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'

import { useKlineSocketStore } from '@/store/klineSocketStore'
import { useTheme } from '@/theme'

import HeaderTrade from './components/HeaderTrade'
import OneClickButton from './components/OneClickButton'

type Bar = {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

const API_URL = process.env.API_CHART_URL

/**
 * Convert TradingView resolution string to seconds.
 * "1" → 60, "5" → 300, "15" → 900, "60" → 3600, "240" → 14400, "1D" → 86400
 */
function resolutionToSeconds(resolution: string): number {
  if (resolution.includes('D')) return (parseInt(resolution) || 1) * 86400
  if (resolution.includes('W')) return (parseInt(resolution) || 1) * 604800

  return (parseInt(resolution) || 1) * 60
}

export default function TradingView({
  symbol: initialSymbol = 'XAUUSD',
  descSymbol = 'Gold vs US Dollar',
  interval: initialInterval = 3600, // Interval in seconds (60 = 1 minute, 300 = 5 minutes, etc.)
  theme = 'Light', // "Dark" or "Light"
}) {
  const { colors } = useTheme()
  const webviewRef = useRef<WebView>(null)
  const callbackRef = useRef<((candle: any) => void) | null>(null)
  const subscriptionRef = useRef<{
    symbol: string
    interval: number
  } | null>(null)
  // Track previous symbol to avoid sending CHANGE_SYMBOL when chart first becomes ready
  const prevSymbolRef = useRef(initialSymbol)
  // Capture initial config for injectedJS (only needed once — symbol changes via postMessage)
  const initialConfigRef = useRef({
    symbol: initialSymbol,
    interval: initialInterval,
    theme,
  })

  // No destructuring needed — setupWebSocket uses getState() directly
  // This prevents re-renders when klineData updates in the store

  // Increment to force WebView remount when symbol changes before chart is ready
  const [webviewKey, setWebviewKey] = useState(0)

  const [_isChartReady, setIsChartReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const barsRef = useRef<Bar[]>([])

  /**
   * Connect socket ONCE on mount
   */
  useEffect(() => {
    console.log('🔌 Connecting kline socket on mount...')

    useKlineSocketStore.getState().connect()
  }, [])

  /**
   * Re-connect socket & re-subscribe when app comes back from background.
   * Also tell WebView to resume real-time updates.
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        console.log('🔄 App foregrounded — reconnecting socket')

        const state = useKlineSocketStore.getState()
        const sub = subscriptionRef.current

        // Helper: force-emit subscribeKline once the socket is connected
        const resubscribeOnce = () => {
          if (!sub) return

          const { socket: s } = useKlineSocketStore.getState()
          if (s?.connected) {
            s.emit('subscribeKline', {
              symbol: sub.symbol,
              timeframe: sub.interval,
            })

            console.log(
              `🟢 [Socket] Re-subscribed after resume: ${sub.symbol}-${sub.interval}`,
            )
          }
        }

        if (state.socket?.connected) {
          // Socket still alive — just re-emit subscribe (server may have dropped it)
          resubscribeOnce()
        } else {
          // Socket disconnected — reconnect, then resubscribe when 'connect' fires
          // The store's on("connect") already loops subscriptions Map, but we also
          // listen here as a safety net in case subscriptions Map drifted.
          const { socket: sock } = useKlineSocketStore.getState()
          if (sock) {
            sock.once('connect', resubscribeOnce)
          }
          useKlineSocketStore.getState().connect()
        }

        // Tell WebView to resume (datafeed will re-push last bar)
        webviewRef.current?.postMessage(JSON.stringify({ type: 'APP_RESUMED' }))
      }
    })

    return () => subscription.remove()
  }, [])

  /**
   * Handle symbol prop change:
   * - Before chart ready → reload WebView with the new symbol injected as global
   * - After chart ready  → postMessage CHANGE_SYMBOL (no WebView reload)
   */
  useEffect(() => {
    if (prevSymbolRef.current === initialSymbol) return

    if (!_isChartReady) {
      // Chart is still loading. Update injected config and reload WebView so it
      // starts fresh with the correct symbol — avoids the load-old-symbol then
      // switch-to-new-symbol pattern that causes a double loading flash.
      console.log(
        `🔄 [Symbol] Pre-ready change to: ${initialSymbol}, reloading WebView`,
      )

      initialConfigRef.current = {
        ...initialConfigRef.current,
        symbol: initialSymbol,
      }

      prevSymbolRef.current = initialSymbol
      setIsLoading(true)
      setWebviewKey((k) => k + 1)

      return
    }

    // Chart is ready — switch via postMessage (no WebView reload)
    prevSymbolRef.current = initialSymbol
    console.log(`🔄 [Symbol] Prop changed to: ${initialSymbol}`)
    setIsLoading(true)

    webviewRef.current?.postMessage(
      JSON.stringify({
        type: 'CHANGE_SYMBOL',
        symbol: initialSymbol,
      }),
    )
  }, [initialSymbol, _isChartReady])

  /**
   * Fetch historical data from API
   */
  const fetchHistoricalData = useCallback(
    async (symbol: string, interval: number, loadMore = false) => {
      try {
        const limit = 200

        let url = `${API_URL}/api/v1/market/klines/${symbol}?limit=${limit}&timeframe=${interval}`

        if (loadMore && barsRef.current.length > 0) {
          const oldestBar = barsRef.current[0]

          url += `&endTime=${Math.floor(oldestBar.time / 1000)}`
        }

        console.log(
          `📊 Fetching ${loadMore ? 'more' : 'initial'} data: ${symbol} ${interval}s`,
        )

        const response = await fetch(url)

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const data = await response.json()

        if (!data.success || !data.candles || data.candles.length === 0) {
          webviewRef.current?.postMessage(
            JSON.stringify({
              type: loadMore ? 'NO_MORE_DATA' : 'NO_DATA',
              symbol,
              interval,
            }),
          )

          return
        }

        const newBars: Bar[] = data.candles
          .map((candle: any) => ({
            time: candle.timestamp * 1000,
            open: parseFloat(candle.open),
            high: parseFloat(candle.high),
            low: parseFloat(candle.low),
            close: parseFloat(candle.close),
            volume: parseFloat(candle.volume),
          }))
          .sort((a: Bar, b: Bar) => a.time - b.time)

        // If returned fewer than limit, no more historical data available
        const noMoreData = data.candles.length < limit

        // Update barsRef only (no state update → no re-render → no jitter)
        if (loadMore) {
          barsRef.current = [...newBars, ...barsRef.current]
        } else {
          barsRef.current = newBars
        }

        webviewRef.current?.postMessage(
          JSON.stringify({
            type: loadMore ? 'LOAD_MORE_DATA' : 'INITIAL_DATA',
            symbol,
            interval,
            bars: newBars,
            noMoreData,
          }),
        )

        console.log(
          `✅ Sent ${newBars.length} bars (noMoreData: ${noMoreData}) to WebView`,
        )

        if (!loadMore) {
          setIsLoading(false)
        }
      } catch (err) {
        console.error('❌ Fetch error:', err)

        // Prevent stuck loading overlay on fetch error
        if (!loadMore) setIsLoading(false)

        // CRITICAL: Always notify WebView so TradingView doesn't hang
        webviewRef.current?.postMessage(
          JSON.stringify({
            type: loadMore ? 'NO_MORE_DATA' : 'NO_DATA',
            symbol,
            interval,
          }),
        )
      }
    },
    [],
  )

  /**
   * Subscribe/unsubscribe socket for real-time kline updates.
   * - Does NOT call store.connect() (already connected on mount)
   * - Emits subscribe/unsubscribe ONCE directly on socket
   * - Manages store listeners for kline event routing
   */
  const setupWebSocket = useCallback((symbol: string, interval: number) => {
    const { socket, listeners } = useKlineSocketStore.getState()
    const oldSub = subscriptionRef.current
    const newKey = `${symbol}-${interval}`

    // Skip if already subscribed to same pair (prevents double sub from SUBSCRIBE_REALTIME + INTERVAL_CHANGED)
    if (oldSub?.symbol === symbol && oldSub?.interval === interval) {
      console.log(`⏭️ [Socket] Already on ${newKey}, skip`)

      return
    }

    // ── 1. Unsubscribe old ─────────────────────────────────
    if (oldSub && callbackRef.current) {
      const oldKey = `${oldSub.symbol}-${oldSub.interval}`

      console.log(`🔴 [Socket] Unsubscribing: ${oldKey}`)

      // Remove callback from store's listener Set
      const listenerSet = listeners.get(oldKey)

      if (listenerSet) {
        listenerSet.delete(callbackRef.current)

        if (listenerSet.size === 0) {
          listeners.delete(oldKey)
        }
      }

      // Emit unsubscribe ONCE to server
      if (socket?.connected) {
        socket.emit('unsubscribeKline', {
          symbol: oldSub.symbol,
          timeframe: oldSub.interval,
        })
      }

      // Remove from subscriptions Map
      const { subscriptions: subs } = useKlineSocketStore.getState()
      subs.delete(oldKey)
      useKlineSocketStore.setState({ subscriptions: new Map(subs) })

      callbackRef.current = null
      subscriptionRef.current = null
    }

    // ── 2. Create new callback ─────────────────────────────
    const handleKlineUpdate = (candle: any) => {
      const bar = {
        time: candle.timestamp * 1000,
        open: parseFloat(candle.open),
        high: parseFloat(candle.high),
        low: parseFloat(candle.low),
        close: parseFloat(candle.close),
        volume: parseFloat(candle.volume),
      }

      // Update barsRef directly (no setState → no re-render)
      const current = barsRef.current

      if (current.length > 0) {
        const lastBar = current[current.length - 1]

        if (lastBar.time === bar.time) {
          current[current.length - 1] = bar
        } else {
          current.push(bar)
        }
      }

      // Post to WebView
      webviewRef.current?.postMessage(
        JSON.stringify({
          type: 'UPDATE_BAR',
          symbol,
          interval,
          bar,
        }),
      )
    }

    // ── 3. Add listener to store ───────────────────────────
    const existingSet = listeners.get(newKey) ?? new Set()

    existingSet.add(handleKlineUpdate)
    listeners.set(newKey, existingSet)

    // Update store state so kline event handler can find the listener
    useKlineSocketStore.setState({
      listeners: new Map(listeners),
    })

    // ── 4. Also add to store's subscriptions Map so auto-reconnect resubscribes ──
    const { subscriptions } = useKlineSocketStore.getState()
    const subKey = `${symbol}-${interval}`
    if (!subscriptions.has(subKey)) {
      subscriptions.set(subKey, { symbol, timeframe: interval })
      useKlineSocketStore.setState({ subscriptions: new Map(subscriptions) })
    }

    // ── 5. Emit subscribe ONCE to server ───────────────────
    if (socket?.connected) {
      socket.emit('subscribeKline', { symbol, timeframe: interval })

      console.log(`🟢 [Socket] Subscribed: ${newKey}`)
    } else {
      console.log(
        `⚠️ [Socket] Not connected, registered listener for: ${newKey}`,
      )
    }

    // ── 6. Save refs ───────────────────────────────────────
    callbackRef.current = handleKlineUpdate
    subscriptionRef.current = { symbol, interval }
  }, [])

  /**
   * Handle messages from WebView
   */
  const handleWebViewMessage = useCallback(
    (event: any) => {
      try {
        const message = JSON.parse(event.nativeEvent.data)

        console.log('📨', message.type)

        switch (message.type) {
          case 'CHART_READY':
            console.log('✅ Chart ready')
            setIsChartReady(true)
            setIsLoading(false)
            break

          case 'FETCH_INITIAL_DATA':
            fetchHistoricalData(message.symbol, Number(message.interval) || 60)
            break

          case 'FETCH_MORE_DATA':
            fetchHistoricalData(
              message.symbol,
              Number(message.interval) || 60,
              true,
            )

            break

          case 'SUBSCRIBE_REALTIME':
            setupWebSocket(message.symbol, Number(message.interval) || 60)
            break

          case 'INTERVAL_CHANGED': {
            // TradingView may use cached data when switching back to a previous interval,
            // skipping getBars/subscribeBars entirely. Handle here to ensure socket resubscribe.
            const intervalSeconds = resolutionToSeconds(
              String(message.interval),
            )

            console.log(
              `🔄 [Interval] Changed to ${message.interval} (${intervalSeconds}s)`,
            )

            setupWebSocket(message.symbol, intervalSeconds)
            break
          }

          case 'SYMBOL_CHANGED': {
            // Handle symbol change from TradingView chart
            const intervalSeconds = resolutionToSeconds(
              String(message.interval),
            )

            console.log(
              `🔄 [Symbol] Changed to ${message.symbol} (${intervalSeconds}s)`,
            )

            // Update socket subscription to new symbol
            setupWebSocket(message.symbol, intervalSeconds)

            // Clear loading state
            setIsLoading(false)
            break
          }
        }
      } catch (err) {
        console.error('❌ WebView message error:', err)
      }
    },
    [fetchHistoricalData, setupWebSocket],
  )

  /**
   * Cleanup on unmount — unsubscribe and emit directly
   */
  useEffect(() => {
    return () => {
      if (callbackRef.current && subscriptionRef.current) {
        const { socket, listeners } = useKlineSocketStore.getState()
        const old = subscriptionRef.current
        const oldKey = `${old.symbol}-${old.interval}`

        console.log(`🔴 [Socket] Cleanup on unmount: ${oldKey}`)

        // Remove listener
        const listenerSet = listeners.get(oldKey)

        if (listenerSet) {
          listenerSet.delete(callbackRef.current)

          if (listenerSet.size === 0) {
            listeners.delete(oldKey)
          }
        }

        useKlineSocketStore.setState({
          listeners: new Map(listeners),
        })

        // Also remove from subscriptions Map
        const { subscriptions } = useKlineSocketStore.getState()
        subscriptions.delete(oldKey)

        useKlineSocketStore.setState({
          subscriptions: new Map(subscriptions),
        })

        // Emit unsubscribe
        if (socket?.connected) {
          socket.emit('unsubscribeKline', {
            symbol: old.symbol,
            timeframe: old.interval,
          })
        }
      }
    }
  }, [])

  /**
   * Inject symbol/interval/theme as globals BEFORE HTML scripts run.
   * Recomputed when webviewKey changes (WebView forced remount due to pre-ready symbol change).
   * After chart is ready, symbol switches are handled via postMessage — no WebView reload.
   */
  const injectedJS = useMemo(() => {
    const { symbol, interval: iv, theme: th } = initialConfigRef.current
    const safeSymbol = symbol.replace(/[^A-Za-z0-9]/g, '')
    const safeInterval = Number(iv) || 60
    const safeTheme = th === 'Dark' ? 'Dark' : 'Light'

    return `window.__RN_SYMBOL__='${safeSymbol}';window.__RN_INTERVAL__=${safeInterval};window.__RN_THEME__='${safeTheme}';true;`
  }, [webviewKey]) // recomputes when WebView remounts (pre-ready symbol change)

  /**
   * HTML source - no query params needed (symbol/interval injected via JS globals)
   */
  const [htmlSource] = useState(() =>
    Platform.select({
      android: {
        // uri: 'file:///android_asset/tradingview-MTX/index-rn-driven.html',
        uri: 'https://tdv.x-download-private.space/index-rn-driven.html',
      },
      ios: {
        // uri: 'http://localhost:8000/index-rn-driven.html',
        uri: 'https://tdv.x-download-private.space/index-rn-driven.html',
      },
      default: {
        uri: 'file:///android_asset/tradingview-MTX/index-rn-driven.html',
      },
    }),
  )

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <View className='flex-1 bg-red-500'>
      <SafeAreaView style={styles.container}>
        {/* header */}
        <HeaderTrade descSymbol={descSymbol} symbol={initialSymbol} />
        <StatusBar barStyle='dark-content' />

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={colors.primary500} size='large' />
            <Text style={styles.loadingText}>Loading Chart...</Text>
          </View>
        )}

        <WebView
          key={webviewKey}
          ref={webviewRef}
          androidLayerType='hardware'
          domStorageEnabled={true}
          injectedJavaScriptBeforeContentLoaded={injectedJS}
          javaScriptEnabled={true}
          source={htmlSource}
          style={styles.webview}
          onError={(error) => {
            console.error('Chart error:', error)
            setError('Chart error')
          }}
          onHttpError={(error) => {
            console.error('HTTP error:', error.nativeEvent.statusCode)
          }}
          onMessage={handleWebViewMessage}
        />
        <OneClickButton symbol={initialSymbol} />
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
})
