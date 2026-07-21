import { useNavigation } from '@react-navigation/native'
import { type StackNavigationProp } from '@react-navigation/stack'
import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react-native'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import WebView from 'react-native-webview'

import { type AppBottomSheetModalHandle } from '@/components/atoms/AppBottomSheetModal'
import { API_CHART_URL } from '@/constants/api'
import { ORDER_SIDES, ORDER_TYPE_CODES } from '@/constants/order'
import { useCreateOrder } from '@/hooks/orders/useCreateOrder'
import { useOrders } from '@/hooks/useOrder'
import { usePositions } from '@/hooks/usePosition'
import { Paths } from '@/navigation/paths'
import { type RootStackParamList } from '@/navigation/types'
import MT5PriceText from '@/screens/Market/components/MT5PriceText'
import { useGetListPopular } from '@/screens/Market/hooks/useGetListPopular'
import { useAuthStore } from '@/store/authStore'
import { useIndicatorStore } from '@/store/indicatorStore'
import { useKlineSocketStore } from '@/store/klineSocketStore'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useTransactionStore } from '@/store/transactionStore'
import { useAccountStore } from '@/store/useAccountStore'
import { useTheme } from '@/theme'
import IconLimit from '@/theme/assets/icons/chart/limitOrder.svg'
import IconOneClick from '@/theme/assets/icons/chart/oneClick.svg'
import IconStreamScopeMinus from '@/theme/assets/icons/lucide-lab_crosshair-plus.svg'
import IconStreamScope from '@/theme/assets/icons/streamScop.svg'

import TradePanel from './components/TradePanel'
import {
  sanitizeDecimalInput,
  timeframeGroups,
  timeFrameLabels,
  timeRanges,
} from './helpers/helpers'
import { type IndicatorType } from './types/types'

function ChartCommon({
  assetId,
  descSymbol,
  isShowBuyCell = true,
  isShowPanel = false,
  isShowSelectSymbol = true,
  ohlcCb,
  setSymbol,
  symbol,
  isShowVolumeControl = true,
  openTradePanelOnBuySell,
  isChartMini,
  timeFrame,
}: {
  readonly isChartMini?: boolean
  readonly assetId?: string
  readonly descSymbol?: string
  readonly isShowBuyCell?: boolean
  readonly isShowPanel?: boolean
  readonly isShowSelectSymbol?: boolean
  readonly ohlcCb?: (ohlc: {
    close: number
    high: number
    low: number
    open: number
  }) => void
  readonly setSymbol?: (sym: string) => void
  readonly symbol: string
  readonly isShowVolumeControl?: boolean

  readonly openTradePanelOnBuySell?: boolean
  readonly timeFrame?: number
}) {
  const { colors } = useTheme()
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const [currentSymbol, setCurrentSymbol] = useState(symbol)
  const [ohlc, setOhlc] = useState({ close: 0, high: 0, low: 0, open: 0 })
  const user = useAuthStore((s) => s.user)
  const selectedAccount = useAccountStore((s) => s.selectedAccount)

  // Keep internal symbol in sync with parent prop updates (e.g., when jumping to Trade tab)
  useEffect(() => {
    setCurrentSymbol(symbol)
  }, [symbol])

  const connect = useKlineSocketStore((s) => s.connect)
  const disconnect = useKlineSocketStore((s) => s.disconnect)
  const subscribe = useKlineSocketStore((s) => s.subscribe)
  const unsubscribe = useKlineSocketStore((s) => s.unsubscribe)
  const isConnected = useKlineSocketStore((s) => s.isConnected)
  // const rt = useMarketSocketStore((s) => s.rtBySymbol?.[currentSymbol])
  const bid = useMarketSocketStore((s) => s.rtBySymbol?.[currentSymbol]?.bid)
  const ask = useMarketSocketStore((s) => s.rtBySymbol?.[currentSymbol]?.ask)
  const { listPopular } = useGetListPopular()
  const { isPending, mutateAsync: createOrder } = useCreateOrder()
  const quickBuy = useTransactionStore((s) => s.quickBuy)
  const setSymbolTrade = useTransactionStore((s) => s.setSymbolTrade)
  const [status, setStatus] = useState<'error' | 'live' | 'loading'>('loading')
  const [isChartReady, setIsChartReady] = useState(false)
  const [hasData, setHasData] = useState(false)
  const { indicator } = useIndicatorStore()
  const [timeframe, setTimeframe] = useState<number>(timeFrame ?? 60) // 60 seconds = 1 minute
  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false)
  const tradePanelReference = useRef<AppBottomSheetModalHandle>(null)
  const [showListTimeframe, setShowListTimeframe] = useState(false)
  const [showTimeframeMenu, setShowTimeframeMenu] = useState(false)
  const [indicatorValues, setIndicatorValues] = useState<{
    bollLower?: number
    bollMiddle?: number
    bollUpper?: number
    ema12?: number
    ema50?: number
    ma10?: number
    ma20?: number
    ma5?: number
  }>({})
  const [volume, setVolume] = useState(0.01)
  const [volumeText, setVolumeText] = useState('0.01')
  const [showDecreaseMenu, setShowDecreaseMenu] = useState(false)
  const [showIncreaseMenu, setShowIncreaseMenu] = useState(false)
  const [tpValue, setTpValue] = useState('')
  const [slValue, setSlValue] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [displayOption, setDisplayOption] = useState<'%' | 'log' | 'auto'>(
    'auto',
  )
  const webReference = useRef<WebView>(null)
  const isMountedRef = useRef(true)
  const {
    data: apiPositions,
    error,
    isLoading: isLoadingPositions,
    refetch: refetchPositions,
  } = usePositions(selectedAccount?.id || '')

  const { data: apiOrders, refetch: refetchOrders } = useOrders(
    selectedAccount?.id || '',
  )

  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getUTCHours().toString().padStart(2, '0')
      const minutes = now.getUTCMinutes().toString().padStart(2, '0')
      const seconds = now.getUTCSeconds().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}:${seconds} (UTC)`)
    }

    updateTime()

    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  // Calculate increment/decrement options based on volume
  const getIncrementOptions = () => {
    const currentVol = Number.parseFloat(volumeText) || volume
    if (currentVol <= 1) {
      return [0.01, 0.1, 0.5]
    } else if (currentVol < 10) {
      return [0.1, 1, 5]
    } else {
      return [0.1, 1, 10]
    }
  }

  // Calculate quick select options based on volume
  const getQuickSelectOptions = () => {
    const currentVol = Number.parseFloat(volumeText) || volume
    if (currentVol <= 1) {
      // 0.1 steps from 1.1 to 2.0
      const options = []
      for (let index = 11; index <= 20; index++) {
        options.push(index / 10)
      }

      return options
    } else if (currentVol < 10) {
      // 1 step increments, show 10 numbers starting from next integer
      const start = Math.ceil(currentVol)
      const options = []
      for (let index = 0; index < 10; index++) {
        options.push(start + index)
      }

      return options
    } else {
      // Multiples of 5 from next multiple of 5 up to 100
      const nextMultiple = Math.ceil(currentVol / 5) * 5
      const options = []
      for (let index = nextMultiple; index <= 100; index += 5) {
        options.push(index)
      }

      return options
    }
  }

  // Function to load more historical data
  const handleIndicatorChange = (type: IndicatorType) => {
    if (isChartReady) {
      webReference.current?.postMessage(
        JSON.stringify({ payload: type, type: 'setIndicator' }),
      )
    }
  }

  // Sync indicator with chart when it changes
  useEffect(() => {
    handleIndicatorChange(indicator)
  }, [indicator, isChartReady])

  // Send positions to chart to display entry lines
  useEffect(() => {
    // Không hiển thị các mốc position trên mini chart
    if (isChartMini) return

    if (isChartReady && apiPositions && currentSymbol && apiOrders) {
      // Filter positions for current symbol and only open positions (status = 0)
      const openPositions = apiPositions.filter(
        (pos) => pos.symbol === currentSymbol && pos.status === 0,
      )

      const openOrders = apiOrders.filter(
        (order) => order.symbol === currentSymbol && order.status === 0,
      )

      const ordersData = openOrders.map((order) => ({
        id: order.id,
        price: parseFloat(order.price || '0'),
        tp: parseFloat(order.takeProfit || '0'),
        sl: parseFloat(order.stopLoss || '0'),
        side: order.side,
        quantity: order.quantity,
        openedAt: order.createdAt,
      }))

      // Format positions data for chart
      const positionsData = openPositions.map((pos) => ({
        id: pos.id,
        price: parseFloat(pos.openPrice),
        tp: parseFloat(pos.takeProfit || '0'),
        sl: parseFloat(pos.stopLoss || '0'),
        side: pos.side, // 0 = BUY, 1 = SELL
        quantity: pos.quantity,
        openedAt: pos.openedAt,
      }))

      webReference.current?.postMessage(
        JSON.stringify({
          type: 'updatePositions',
          payload: positionsData,
          ordersData: ordersData,
        }),
      )
    }
  }, [isChartMini, isChartReady, apiPositions, currentSymbol, apiOrders])

  const handleOrder = async (
    side: (typeof ORDER_SIDES)[keyof typeof ORDER_SIDES],
    orderType: (typeof ORDER_TYPE_CODES)[keyof typeof ORDER_TYPE_CODES],
  ) => {
    if (isPending) return
    if (!currentSymbol) return
    if (volume <= 0 || !volumeText) {
      Toast.show({
        text1: 'Invalid Volume',
        type: 'error',
      })

      return
    }
    try {
      console.log('createOrder', {
        accountId: selectedAccount?.id || '',
        leverage: 100,
        orderType: orderType,
        quantity: volume,
        side: side,
        symbol: currentSymbol,
        type: orderType === ORDER_TYPE_CODES.MARKET ? 'MARKET' : 'LIMIT',
      })

      const res = await createOrder({
        accountId: selectedAccount?.id || '',
        leverage: 100,
        orderType: orderType,
        quantity: volume,
        side: side,
        symbol: currentSymbol,
        type: orderType === ORDER_TYPE_CODES.MARKET ? 'MARKET' : 'LIMIT',
      })

      console.log(res.orderId, res.status)
    } catch (error) {
      console.error(error)
    }
  }

  const onOrderPress = (
    side: (typeof ORDER_SIDES)[keyof typeof ORDER_SIDES],
  ) => {
    if (!user) {
      navigation.navigate(Paths.Login)

      return
    }
    if (quickBuy) {
      // addDemoOrder('buy');
      handleOrder(side, ORDER_TYPE_CODES.MARKET)

      return
    }

    navigation.navigate(Paths.Transaction, {
      assetId,
      symbol: currentSymbol,
      type: side === ORDER_SIDES.BUY ? 'buy' : 'sell',
    })
  }

  const loadMoreHistoricalData = async (
    oldestTime: number,
    interval: string,
  ) => {
    try {
      console.log('🔄 Loading more data before timestamp:', oldestTime)
      console.log('⏱️ Current timeframe:', timeframe)

      // Fetch 100 more candles ending at oldestTime
      const endTime = oldestTime // Already in seconds
      const url = `${API_CHART_URL}/api/v1/market/klines/${currentSymbol}?timeframe=${timeframe}&limit=100&includeActive=true&endTime=${endTime}`
      console.log('🌐 LoadMore URL:', url)

      const res = await fetch(url)
      const data = await res.json()
      console.log('📦 LoadMore received:', data)

      const olderCandles = data.candles.map((k: any) => ({
        close: k.close,
        high: k.high,
        low: k.low,
        open: k.open,
        time: k.timestamp,
      }))

      // Send older candles to chart
      webReference.current?.postMessage(
        JSON.stringify({ payload: olderCandles, type: 'prependData' }),
      )

      console.log(`Loaded ${olderCandles.length} older candles`)
    } catch (error) {
      console.error('Failed to load more data:', error)
    }
  }

  // Connect socket on mount, disconnect on unmount
  useEffect(() => {
    connect()

    return () => {
      console.log('🔌 ChartCommon unmounting - disconnecting socket')
      disconnect()
    }
  }, [])

  useEffect(() => {
    if (!isChartReady) return

    let cancelled = false
    const ac = new AbortController()

    const handleKlineUpdate = (candle: any) => {
      if (cancelled) return

      if (!isMountedRef.current) return // ✅ Stop if component unmounted

      setOhlc({
        close: candle.close,
        high: candle.high,
        low: candle.low,
        open: candle.open,
      })

      webReference.current?.postMessage(
        JSON.stringify({
          payload: {
            close: candle.close,
            high: candle.high,
            low: candle.low,
            open: candle.open,
            time: candle.timestamp,
          },
          type: 'update',
        }),
      )
    }

    ;(async () => {
      try {
        setStatus('loading')
        setHasData(false)

        const url = `${API_CHART_URL}/api/v1/market/klines/${currentSymbol}?timeframe=${timeframe}&limit=100&includeActive=true`

        console.log('url', url)

        const res = await fetch(url, { signal: ac.signal })
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)

        const data = await res.json()
        if (cancelled) return

        const candles = (data.candles ?? []).map((k: any) => ({
          close: k.close,
          high: k.high,
          low: k.low,
          open: k.open,
          time: k.timestamp,
        }))

        console.log('Fetched candles:', candles)

        if (candles.length === 0) throw new Error('No candles')

        const latest = candles.at(-1)

        setOhlc({
          close: latest.close,
          high: latest.high,
          low: latest.low,
          open: latest.open,
        })

        webReference.current?.postMessage(
          JSON.stringify({
            payload: { candles, interval: timeframe },
            type: 'setData',
          }),
        )

        if (cancelled) return
        subscribe(currentSymbol, timeframe, handleKlineUpdate)

        setHasData(true)
        setStatus(isConnected ? 'live' : 'loading')
      } catch (error) {
        if (cancelled) return
        console.error(error)
        setStatus('error')
        setHasData(false)
      }
    })()

    return () => {
      cancelled = true
      ac.abort()

      console.log(
        '🧹 Cleaning up kline subscription:',
        currentSymbol,
        timeframe,
      )

      unsubscribe(currentSymbol, timeframe, handleKlineUpdate)
    }
  }, [timeframe, isChartReady, currentSymbol, subscribe, unsubscribe])

  useEffect(() => {
    if (!isChartReady) return
    setStatus(isConnected ? 'live' : 'loading')
  }, [isConnected, isChartReady])

  // Send indicator change to WebView
  useEffect(() => {
    if (!isChartReady) return
    handleIndicatorChange(indicator)
  }, [indicator, isChartReady])

  const handleChangeText = useCallback(
    (text: string) => {
      const next = sanitizeDecimalInput(text)

      setVolumeText((previous) => (previous === next ? previous : next))
    },
    [setVolumeText],
  )

  const handleBlur = useCallback(() => {
    setVolumeText((t) => {
      const s = t.trim()
      if (s === '' || s === '.') return volume.toFixed(2)

      const n = Number(s)
      if (Number.isFinite(n) && n > 0) {
        setVolume(n)

        return n.toFixed(2)
      }

      return volume.toFixed(2)
    })
  }, [volume, setVolume, setVolumeText])

  const handleFocus = useCallback(() => {
    setShowDecreaseMenu(false)
    setShowIncreaseMenu(false)
  }, [setShowDecreaseMenu, setShowIncreaseMenu])

  useEffect(() => {
    if (ohlcCb && ohlc) {
      ohlcCb(ohlc)
    }
  }, [ohlc, ohlcCb])

  return (
    <View className='flex-1'>
      {isShowPanel ? (
        <>
          {!showListTimeframe && (
            <View className='flex-row items-center justify-between px-4 h-[32px] relative'>
              <View className='items-center gap-2 flex-row'>
                {/* <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft />
            </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    setShowListTimeframe(true)
                  }}>
                  <Text className='text-body-large-semibold'>
                    {timeFrameLabels?.[timeframe]}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className='flex-row gap-5 absolute inset-0 items-center justify-center'>
                <TouchableOpacity>
                  <IconStreamScopeMinus height={24} width={24} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <IconStreamScope height={24} width={24} />
                </TouchableOpacity>
              </View>
              <View className='flex-row gap-4'>
                <TouchableOpacity
                  onPress={() => {
                    setSymbolTrade(currentSymbol)
                    if (tradePanelReference.current?.isOpen()) {
                      tradePanelReference.current?.close()
                    } else {
                      tradePanelReference.current?.open('orderLimit')
                    }
                  }}>
                  {/* <Image
               source={require('@/assets/images/symbol-details/icon_1.png')}
               style={{ width: 22, height: 22 }}
             /> */}
                  <IconLimit height={22} width={22} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    // Set symbol vào store để Trade tab có thể sử dụng
                    setSymbolTrade(currentSymbol)

                    // Navigate đến Trade tab
                    navigation.navigate(Paths.Main, {
                      screen: Paths.Trade,
                    })
                  }}>
                  {/* <Image
                source={require('@/assets/images/symbol-details/icon_2.png')}
                style={{ width: 22, height: 22 }}
              /> */}
                  <IconOneClick height={22} width={22} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {showListTimeframe ? (
            <>
              {/* Full screen overlay to close menus when clicking outside */}
              <Pressable
                className='absolute inset-0 z-40'
                style={{
                  bottom: 0,
                  height: '100%',
                  left: 0,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: '100%',
                }}
                onPress={() => {
                  setShowTimeframeMenu(false)
                  setShowListTimeframe(false)
                }}
              />
              <View className='flex-row items-center justify-between px-4 h-[32px] relative z-50'>
                {timeRanges.map((time) => (
                  <TouchableOpacity
                    key={time.value}
                    onPress={() => {
                      setTimeframe(time.value)
                      setShowListTimeframe(false)
                    }}>
                    <Text
                      className={`text-lg font-semibold ${time.value == timeframe ? 'text-primary-500' : 'text-secondary'}`}>
                      {time.lable}
                    </Text>
                  </TouchableOpacity>
                ))}
                <View className='relative'>
                  <TouchableOpacity
                    onPress={() => {
                      setShowTimeframeMenu(!showTimeframeMenu)
                    }}>
                    <MoreHorizontal size={20} />
                  </TouchableOpacity>

                  {/* Dropdown Menu */}
                  {showTimeframeMenu ? (
                    <View
                      className='absolute top-8 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50'
                      style={{ width: 200 }}>
                      {/* Phút */}
                      <View className='border-b border-gray-200'>
                        <Text className='px-4 py-2 text-xs font-semibold text-gray-500'>
                          {timeframeGroups.minute.label}
                        </Text>
                        <View className='flex-row flex-wrap pb-2'>
                          {timeframeGroups.minute.items.map((item) => (
                            <TouchableOpacity
                              key={item.value}
                              className='w-1/2 px-4 py-2'
                              onPress={() => {
                                setTimeframe(item.value)
                                setShowTimeframeMenu(false)
                              }}>
                              <Text
                                className={
                                  timeframe === item.value
                                    ? 'text-primary-500 font-semibold'
                                    : 'text-gray-700'
                                }>
                                {item.lable}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {}
                      <View className='border-b border-gray-200'>
                        <Text className='px-4 py-2 text-xs font-semibold text-gray-500'>
                          {timeframeGroups.hour.label}
                        </Text>
                        <View className='flex-row flex-wrap pb-2'>
                          {timeframeGroups.hour.items.map((item) => (
                            <TouchableOpacity
                              key={item.value}
                              className='w-1/2 px-4 py-2'
                              onPress={() => {
                                setTimeframe(item.value)
                                setShowTimeframeMenu(false)
                              }}>
                              <Text
                                className={
                                  timeframe === item.value
                                    ? 'text-primary-500 font-semibold'
                                    : 'text-gray-700'
                                }>
                                {item.lable}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Ngày */}
                      <View>
                        <Text className='px-4 py-2 text-xs font-semibold text-gray-500'>
                          {timeframeGroups.day.label}
                        </Text>
                        <View className='flex-row flex-wrap pb-2'>
                          {timeframeGroups.day.items.map((item) => (
                            <TouchableOpacity
                              key={item.value}
                              className='w-1/2 px-4 py-2'
                              onPress={() => {
                                setTimeframe(item.value)
                                setShowTimeframeMenu(false)
                              }}>
                              <Text
                                className={
                                  timeframe === item.value
                                    ? 'text-primary-500 font-semibold'
                                    : 'text-gray-700'
                                }>
                                {item.lable}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            </>
          ) : null}
        </>
      ) : null}
      <View style={styles.chartWrapper}>
        {/* Symbol selector in top-left corner */}
        {isShowSelectSymbol ? (
          <View className='absolute top-2 left-2 z-30'>
            {!isChartMini && (
              <TouchableOpacity
                className='bg-white px-3 py-1.5 flex-row items-center gap-1'
                onPress={() => {
                  setShowSymbolDropdown(!showSymbolDropdown)
                }}>
                <Text className='text-sm font-semibold text-primary-500'>
                  {currentSymbol}
                </Text>
                <ChevronDown color={colors.primary500} size={14} />

                <Text className='text-[12px]'>
                  {timeFrameLabels?.[timeframe]}
                </Text>
              </TouchableOpacity>
            )}

            {/* Symbol Dropdown */}
            {showSymbolDropdown ? (
              <>
                {/* Overlay to close dropdown */}
                <Pressable
                  className='absolute -top-2 -left-2 z-30'
                  style={{
                    height: 5000,
                    width: 5000,
                  }}
                  onPress={() => {
                    setShowSymbolDropdown(false)
                  }}
                />
                <ScrollView
                  className='absolute top-8 z-30 left-0 bg-white border border-gray-300 rounded-lg shadow-lg'
                  style={{
                    maxHeight: 250,
                    width: 150,
                  }}>
                  {listPopular?.map((sym) => (
                    <TouchableOpacity
                      key={sym.symbol}
                      className='px-4 py-3 border-b border-gray-100'
                      onPress={() => {
                        setShowSymbolDropdown(false)
                        if (sym.symbol !== currentSymbol) {
                          setCurrentSymbol(sym.symbol)
                          if (setSymbol) {
                            setSymbol(sym.symbol)
                          }
                        }
                      }}>
                      <Text
                        className={
                          sym.symbol === currentSymbol
                            ? 'text-primary-500 font-semibold'
                            : 'text-gray-700'
                        }>
                        {sym.symbol}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : null}
          </View>
        ) : null}
        {/* indicatorValues */}
        {indicator !== 'none' && (
          <View className='absolute top-7 left-2  px-3 py-2 rounded-md z-20'>
            {indicator === 'MA' && (
              <View className='flex-row gap-3'>
                {indicatorValues.ma5 !== undefined && (
                  <Text
                    className='text-xs font-semibold'
                    style={{ color: '#22c55e' }}>
                    MA5: {indicatorValues.ma5.toFixed(2)}
                  </Text>
                )}
                {indicatorValues.ma10 !== undefined && (
                  <Text
                    className='text-xs font-semibold'
                    style={{ color: '#3b82f6' }}>
                    MA10: {indicatorValues.ma10.toFixed(2)}
                  </Text>
                )}
                {indicatorValues.ma20 !== undefined && (
                  <Text
                    className='text-xs font-semibold'
                    style={{ color: '#ef4444' }}>
                    MA20: {indicatorValues.ma20.toFixed(2)}
                  </Text>
                )}
              </View>
            )}
            {indicator === 'EMA' && (
              <View className='flex-row gap-3'>
                {indicatorValues.ema12 !== undefined && (
                  <Text
                    className='text-xs font-semibold'
                    style={{ color: '#22c55e' }}>
                    EMA12: {indicatorValues.ema12.toFixed(2)}
                  </Text>
                )}
                {indicatorValues.ema50 !== undefined && (
                  <Text
                    className='text-xs font-semibold'
                    style={{ color: '#ef4444' }}>
                    EMA50: {indicatorValues.ema50.toFixed(2)}
                  </Text>
                )}
              </View>
            )}
            {indicator === 'BOLL' && (
              <View className='flex-row gap-3'>
                {indicatorValues.bollUpper !== undefined && (
                  <Text
                    className='text-xs font-semibold'
                    style={{ color: '#ef4444' }}>
                    Upper: {indicatorValues.bollUpper.toFixed(2)}
                  </Text>
                )}
                {indicatorValues.bollMiddle !== undefined && (
                  <Text
                    className='text-xs font-semibold'
                    style={{ color: '#3b82f6' }}>
                    Mid: {indicatorValues.bollMiddle.toFixed(2)}
                  </Text>
                )}
                {indicatorValues.bollLower !== undefined && (
                  <Text
                    className='text-xs font-semibold'
                    style={{ color: '#22c55e' }}>
                    Lower: {indicatorValues.bollLower.toFixed(2)}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
        {!hasData && (
          <View className='absolute inset-0 items-center justify-center z-10 bg-white'>
            {status === 'error' ? (
              <Text className='text-neutral-500'>No data available.</Text>
            ) : (
              <>
                <ActivityIndicator size='large' />
                <Text className='text-neutral-500 mt-2'>Loading...</Text>
              </>
            )}
          </View>
        )}

        <WebView
          ref={webReference}
          allowFileAccess
          allowUniversalAccessFromFileURLs
          domStorageEnabled
          javaScriptEnabled
          cacheEnabled={false}
          mixedContentMode='always'
          originWhitelist={['*']}
          source={
            Platform.OS === 'android'
              ? { uri: 'file:///android_asset/chartMt5.html' }
              : require('./html/chartMt5.html')
          }
          style={styles.webview}
          onError={(e) => {
            console.log('WV onError', e.nativeEvent)
          }}
          onHttpError={(e) => {
            console.log('WV onHttpError', e.nativeEvent)
          }}
          onLoadEnd={() => {
            console.log('WV onLoadEnd')
          }}
          onMessage={(event) => {
            const data = event.nativeEvent.data
            // console.log('📨 Received message from chart:', data);
            if (data === 'ready') {
              setIsChartReady(true)
            } else if (data === 'dataRendered') {
              console.log('✅ Chart data rendered')
              setHasData(true)
            } else {
              try {
                const parsed = JSON.parse(data)
                // console.log('📊 Parsed message:', parsed.type);
                switch (parsed.type) {
                  case 'indicators': {
                    setIndicatorValues(parsed.payload)

                    break
                  }
                  case 'loadMore': {
                    // Handle load more request from chart
                    console.log('🔄 LoadMore triggered from chart')

                    const { interval, oldestTime } = parsed.payload
                    loadMoreHistoricalData(oldestTime, interval)

                    break
                  }
                  case 'ohlc': {
                    setOhlc(parsed.payload)

                    break
                  }
                  // No default
                }
              } catch (error) {
                console.log('❌ Error parsing message:', error)
              }
            }
          }}
        />
      </View>

      {/* Indicator List */}
      {!isChartMini && (
        <>
          <ScrollView
            horizontal
            className='border-t border-b border-neutral-100'
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 4,
            }}
            showsHorizontalScrollIndicator={false}
            style={{ maxHeight: 40 }}>
            <View className='flex-row gap-2 items-center'>
              {[
                { id: 'MA', label: 'MA' },
                { id: 'EMA', label: 'EMA' },
                { id: 'BOLL', label: 'BOLL' },
                { id: 'MACD', label: 'MACD' },
                { id: 'RSI', label: 'RSI' },
                { id: 'KDJ', label: 'KDJ' },
                { id: 'ATR', label: 'ATR' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className={`rounded-full px-2`}
                  onPress={() => {
                    if (indicator === item.id) {
                      useIndicatorStore.getState().setIndicator('none')
                    } else {
                      useIndicatorStore
                        .getState()
                        .setIndicator(item.id as IndicatorType)
                    }
                  }}>
                  <Text
                    className={`text-body-small-medium ${
                      indicator === item.id
                        ? 'text-primary-500'
                        : 'text-neutral-700'
                    }`}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </>
      )}

      {/* Data Range Selector */}
      {isChartMini && (
        <>
          {/* Data Range Selector */}
          <View className='border-t border-b border-neutral-200 px-4 py-2'>
            <View className='flex-row items-center justify-between'>
              <TouchableOpacity className='flex-row items-center'>
                <Text className='text-caption-regular text-neutral-900 mr-2'>
                  Date Range
                </Text>
                <ChevronDown color={colors.neutral700} size={12} />
              </TouchableOpacity>

              <View className='flex-row items-center gap-2'>
                <Text className='text-caption-regular text-neutral-900'>
                  {currentTime}
                </Text>

                <View className='border-r border-neutral-200 self-stretch' />

                <TouchableOpacity onPress={() => setDisplayOption('%')}>
                  <Text
                    className={`text-caption-regular ${displayOption === '%' ? 'text-primary-500' : 'text-neutral-900'}`}>
                    %
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setDisplayOption('log')}>
                  <Text
                    className={`text-caption-regular ${displayOption === 'log' ? 'text-primary-500' : 'text-neutral-900'}`}>
                    log
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setDisplayOption('auto')}>
                  <Text
                    className={`text-caption-regular ${displayOption === 'auto' ? 'text-primary-500' : 'text-neutral-900'}`}>
                    auto
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      )}

      {!isChartMini && (
        <>
          {isShowVolumeControl ? (
            <>
              {isShowBuyCell ? (
                <View className='flex-row items-center h-[48px]'>
                  {/* Sell Button */}
                  <TouchableOpacity
                    className={`bg-error-500 items-center justify-center flex-row h-full relative w-1/3 gap-2`}
                    onPress={() => {
                      if (openTradePanelOnBuySell) {
                        setSymbolTrade(currentSymbol)
                        tradePanelReference.current?.open('buySell')
                      } else {
                        onOrderPress(ORDER_SIDES.SELL)
                      }
                    }}>
                    {isPending ? (
                      <View className='absolute inset-0 flex-row items-center justify-center'>
                        <ActivityIndicator
                          className=''
                          color='#fff'
                          size='small'
                        />
                      </View>
                    ) : null}
                    {!isPending && (
                      <>
                        <Text className='text-neutral-0 text-body-medium font-medium'>
                          Sell
                        </Text>
                        {isShowVolumeControl && (
                          <Text className='w-[72px] flex-row items-center justify-center '>
                            <MT5PriceText
                              style={{ color: colors.neutral0 }}
                              value={bid || 0}
                            />
                          </Text>
                        )}
                      </>
                    )}
                  </TouchableOpacity>

                  <View className='border border-neutral-200 h-full w-1/3'>
                    <View
                      className='flex-row items-stretch'
                      style={{ height: 48 }}>
                      {/* Decrease Button with Dropdown */}
                      <Pressable
                        className='px-2 items-center justify-center'
                        style={{ width: 40 }}
                        onPress={() => {
                          setShowIncreaseMenu(false)
                          setShowDecreaseMenu(!showDecreaseMenu)
                        }}>
                        <ChevronDown className='text-neutral-700' size={26} />
                      </Pressable>

                      {/* Volume Display/Input */}
                      <TextInput
                        inputMode='decimal'
                        keyboardType={
                          Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'
                        }
                        placeholder='Volume'
                        placeholderTextColor='#9ca3af'
                        onBlur={handleBlur}
                        onChangeText={handleChangeText}
                        onFocus={handleFocus}
                        value={volumeText}
                        // returnKeyType="done"
                        style={{
                          flex: 1,
                          height: 48, // quan trọng
                          paddingVertical: 0, // quan trọng để không bị tụt
                          textAlign: 'center',
                          ...(Platform.OS === 'android'
                            ? { textAlignVertical: 'center' as const }
                            : {}),
                          fontSize: 16,
                          fontWeight: 500,
                          color: colors.neutral500,
                        }}
                      />

                      {/* Increase Button with Dropdown */}
                      <Pressable
                        className='px-2 items-center justify-center'
                        style={{ width: 40 }}
                        onPress={() => {
                          setShowDecreaseMenu(false)
                          setShowIncreaseMenu(!showIncreaseMenu)
                        }}>
                        <ChevronUp className='text-neutral-700' size={26} />
                      </Pressable>
                    </View>

                    {/* Decrease Menu */}
                    {showDecreaseMenu ? (
                      <View
                        className='absolute bottom-full left-0 right-0 bg-white border border-gray-300 mb-1'
                        style={{ zIndex: 10 }}>
                        <View className='flex-row'>
                          {getIncrementOptions().map((increment) => (
                            <TouchableOpacity
                              key={`dec-${increment}`}
                              className='border-b border-gray-200 flex-1 py-2'
                              onPress={() => {
                                const newVol = Math.max(
                                  0.01,
                                  volume - increment,
                                )
                                setVolume(newVol)
                                setVolumeText(newVol.toFixed(2))
                                setShowDecreaseMenu(false)
                              }}>
                              <Text className='text-center font-semibold text-primary-500'>
                                -{increment}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <View className='px-4 py-2'>
                          <View className='flex-row flex-wrap'>
                            {getQuickSelectOptions().map((value) => (
                              <TouchableOpacity
                                key={value}
                                className='w-1/2 px-2 py-4 items-center'
                                onPress={() => {
                                  setVolume(value)
                                  setVolumeText(value.toFixed(2))
                                  setShowDecreaseMenu(false)
                                }}>
                                <Text className='text-[14px] font-semibold items-center'>
                                  {value % 1 === 0
                                    ? value.toFixed(0)
                                    : value.toFixed(1)}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      </View>
                    ) : null}

                    {/* Increase Menu */}
                    {showIncreaseMenu ? (
                      <View
                        className='absolute bottom-full left-0 right-0 bg-white border border-gray-300 mb-1 '
                        style={{ zIndex: 10 }}>
                        <View className='flex-row'>
                          {getIncrementOptions().map((increment) => (
                            <TouchableOpacity
                              key={`inc-${increment}`}
                              className='border-b border-gray-200 flex-1 py-2'
                              onPress={() => {
                                const newVol = volume + increment
                                setVolume(newVol)
                                setVolumeText(newVol.toFixed(2))
                                setShowIncreaseMenu(false)
                              }}>
                              <Text className='text-center font-semibold text-primary-500'>
                                +{increment}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <View className='px-4 py-2'>
                          <View className='flex-row flex-wrap'>
                            {getQuickSelectOptions().map((value) => (
                              <TouchableOpacity
                                key={value}
                                className='w-1/2 px-2 py-4 items-center'
                                onPress={() => {
                                  setVolume(value)
                                  setVolumeText(value.toFixed(2))
                                  setShowIncreaseMenu(false)
                                }}>
                                <Text className='text-[14px] font-semibold items-center'>
                                  {value % 1 === 0
                                    ? value.toFixed(0)
                                    : value.toFixed(1)}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  {/* Buy Button */}
                  <TouchableOpacity
                    className={`bg-success-500 items-center justify-center flex-row h-full relative w-1/3 gap-2`}
                    disabled={isPending}
                    onPress={() => {
                      if (openTradePanelOnBuySell) {
                        setSymbolTrade(currentSymbol)
                        tradePanelReference.current?.open('buySell')
                      } else {
                        onOrderPress(ORDER_SIDES.BUY)
                      }
                    }}>
                    {isPending ? (
                      <View className='absolute inset-0 flex-row items-center justify-center'>
                        <ActivityIndicator
                          className=''
                          color='#fff'
                          size='small'
                        />
                      </View>
                    ) : null}
                    {!isPending && (
                      <>
                        <Text className='text-neutral-0 text-body-medium font-medium'>
                          Buy
                        </Text>
                        {isShowVolumeControl && (
                          <Text className='w-[72px] flex-row items-center justify-center'>
                            <MT5PriceText
                              style={{ color: colors.neutral0 }}
                              value={ask || 0}
                            />
                          </Text>
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              ) : null}
            </>
          ) : (
            <>
              {isShowBuyCell ? (
                <View className='flex-row gap-3 items-center px-4 py-2'>
                  {/* Sell Button */}
                  <TouchableOpacity
                    className={`flex-1 bg-error-500 items-center justify-center flex-row rounded px-4 py-3 relative gap-2`}
                    onPress={() => {
                      if (openTradePanelOnBuySell) {
                        setSymbolTrade(currentSymbol)
                        tradePanelReference.current?.open('buySell')
                      } else {
                        onOrderPress(ORDER_SIDES.SELL)
                      }
                    }}>
                    {isPending ? (
                      <View className='absolute inset-0 flex-row items-center justify-center'>
                        <ActivityIndicator
                          className=''
                          color='#fff'
                          size='small'
                        />
                      </View>
                    ) : null}
                    {!isPending && (
                      <>
                        <Text className='text-neutral-0 text-button-large-medium'>
                          Sell {bid || 0}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Buy Button */}
                  <TouchableOpacity
                    className={`flex-1 bg-success-500 items-center justify-center flex-row rounded px-4 py-3 relative gap-2`}
                    disabled={isPending}
                    onPress={() => {
                      if (openTradePanelOnBuySell) {
                        setSymbolTrade(currentSymbol)
                        tradePanelReference.current?.open('buySell')
                      } else {
                        onOrderPress(ORDER_SIDES.BUY)
                      }
                    }}>
                    {isPending ? (
                      <View className='absolute inset-0 flex-row items-center justify-center'>
                        <ActivityIndicator
                          className=''
                          color='#fff'
                          size='small'
                        />
                      </View>
                    ) : null}
                    {!isPending && (
                      <>
                        <Text className='text-neutral-0 text-button-large-medium'>
                          Buy {ask || 0}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              ) : null}
            </>
          )}
        </>
      )}

      <TradePanel
        descSymbol={descSymbol || ''}
        limitPrice={limitPrice}
        setLimitPrice={setLimitPrice}
        symbol={currentSymbol}
        tradePanelRef={tradePanelReference}
      />
    </View>
  )
}

export default ChartCommon

const styles = StyleSheet.create({
  chartWrapper: {
    backgroundColor: '#0B0E11',
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  container: { flex: 1, padding: 12 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  info: { gap: 4 },

  infoText: { color: '#888', fontSize: 12 },
  priceBox: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  priceHigh: { color: '#22c55e' },
  priceLabel: {
    color: '#888',
    fontSize: 11,
    fontWeight: '700',
    width: 12,
  },
  priceLow: { color: '#ef4444' },

  priceOverlay: {
    backgroundColor: 'rgba(11, 14, 17, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 8,
    pointerEvents: 'none',
    position: 'absolute',
    right: 8,
    top: 40,
  },
  priceValue: { color: '#fff', fontSize: 12, fontWeight: '600' },

  status: { color: '#fff', fontSize: 12 },
  tfBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tfBtnActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  tfRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tfText: { color: '#888', fontSize: 14, fontWeight: '600' },
  tfTextActive: { color: '#fff' },

  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  webview: { flex: 1, width: '100%' },
})
