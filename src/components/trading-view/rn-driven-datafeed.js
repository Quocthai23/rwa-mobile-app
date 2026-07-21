class RNDrivenDatafeed {
  constructor() {
    this.bars = new Map() // Store bars by symbol_interval key
    this.subscribers = new Map() // Real-time update subscribers
    this.currentSymbol = null
    this.currentInterval = null
    this.onSymbolChangeCallback = null
    this.onIntervalChangeCallback = null
    this.pendingCallbacks = new Map() // Store pending getBars callbacks
    this.noMoreDataKeys = new Set() // Track keys where all historical data is loaded

    // Listen for data from React Native
    this.setupMessageListener()

    console.log(
      '🎯 RN-Driven Datafeed initialized - waiting for data from React Native',
    )
  }

  /**
   * Setup listener for messages from React Native
   */
  setupMessageListener() {
    let lastEventData = null

    const handleMessage = (event) => {
      try {
        // Deduplicate: both document and window listeners may fire for same message
        if (event.data === lastEventData) {
          lastEventData = null
          return
        }
        lastEventData = event.data

        const message =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data

        console.log('📬 Datafeed received message:', message.type)
        this.handleRNMessage(message)
      } catch (error) {
        console.error('Error parsing RN message:', error)
      }
    }

    // Listen on both for iOS/Android compatibility
    if (typeof document !== 'undefined') {
      document.addEventListener('message', handleMessage)
      window.addEventListener('message', handleMessage)
    }
  }

  /**
   * Handle messages from React Native
   */
  handleRNMessage(message) {
    switch (message.type) {
      case 'INITIAL_DATA':
        // RN sends initial historical data
        this.handleInitialData(message)
        break

      case 'UPDATE_BAR':
        // RN sends single bar update (real-time)
        this.handleBarUpdate(message)
        break

      case 'LOAD_MORE_DATA':
        // RN sends more historical data (pagination)
        this.handleLoadMoreData(message)
        break

      case 'NO_DATA':
        // RN says no initial data available
        this.handleNoData(message)
        break

      case 'NO_MORE_DATA':
        // RN says no more historical data
        this.handleNoMoreData(message)
        break

      default:
        // Other message types handled by chart-init.js
        break
    }
  }

  /**
   * Handle initial data from RN
   */
  handleInitialData(message) {
    const { symbol, interval, bars, noMoreData } = message

    // Convert interval (seconds) to resolution (TradingView format)
    const resolution = this.secondsToResolution(interval)
    const key = `${symbol}_${resolution}`

    console.log(
      '📊 handleInitialData:',
      bars.length,
      'bars, key:',
      key,
      'noMoreData:',
      noMoreData,
    )

    // Store bars with both keys for flexibility
    this.bars.set(key, bars)
    this.bars.set(`${symbol}_${interval}`, bars)
    this.currentSymbol = symbol
    this.currentInterval = interval

    // Track if there's more historical data to load
    if (noMoreData) {
      this.noMoreDataKeys = this.noMoreDataKeys || new Set()
      this.noMoreDataKeys.add(key)
    }

    // Hide loading overlay since we have data
    if (
      typeof window !== 'undefined' &&
      typeof window.hideLoading === 'function'
    ) {
      window.hideLoading()
    }

    // Call pending callback if exists
    const pending = this.pendingCallbacks.get(key)

    if (pending) {
      // Pass ALL bars to TradingView — display whatever API returned
      console.log('✅ Resolving getBars callback with', bars.length, 'bars')
      pending.callback(bars, { noData: bars.length === 0 })
      this.pendingCallbacks.delete(key)
    } else {
      console.log(
        '⚠️ No pending callback for key:',
        key,
        '| available:',
        Array.from(this.pendingCallbacks.keys()),
      )
    }
  }

  /**
   * Handle bar update from RN (real-time)
   */
  handleBarUpdate(message) {
    const { symbol, interval, bar } = message

    // Convert interval to resolution for key consistency
    const resolution = this.secondsToResolution(interval)
    const key = `${symbol}_${resolution}`

    // Update stored bars (try both keys for compatibility)
    let storedBars =
      this.bars.get(key) || this.bars.get(`${symbol}_${interval}`) || []
    const lastBar = storedBars[storedBars.length - 1]

    if (lastBar && lastBar.time === bar.time) {
      // Update existing bar
      storedBars[storedBars.length - 1] = bar
    } else {
      // New bar
      storedBars.push(bar)
    }

    this.bars.set(key, storedBars)
    this.bars.set(`${symbol}_${interval}`, storedBars)

    // Notify subscribers
    const subscriberKey = `${symbol}_${resolution}`
    const subscriber = this.subscribers.get(subscriberKey)

    if (subscriber) {
      console.log('📡 Notifying subscriber of bar update:', {
        symbol,
        resolution,
        time: bar.time,
      })
      subscriber.callback(bar)
    } else {
      console.log('⚠️ No subscriber found for key:', subscriberKey)
    }
  }

  /**
   * Handle load more data from RN (pagination)
   */
  handleLoadMoreData(message) {
    const { symbol, interval, bars, noMoreData } = message

    // Convert interval to resolution
    const resolution = this.secondsToResolution(interval)
    const key = `${symbol}_${resolution}`

    console.log(
      '📊 handleLoadMoreData:',
      bars.length,
      'bars, key:',
      key,
      'noMoreData:',
      noMoreData,
    )

    // Track if there's more historical data
    if (noMoreData) {
      this.noMoreDataKeys = this.noMoreDataKeys || new Set()
      this.noMoreDataKeys.add(key)
    }

    // Prepend historical bars (try both keys)
    let storedBars =
      this.bars.get(key) || this.bars.get(`${symbol}_${interval}`) || []
    const mergedBars = [...bars, ...storedBars]
    this.bars.set(key, mergedBars)
    this.bars.set(`${symbol}_${interval}`, mergedBars)

    // Call pending callback if exists
    const pending = this.pendingCallbacks.get(key + '_more')
    if (pending) {
      // Pass the NEW bars directly
      console.log('✅ Resolving load-more callback with', bars.length, 'bars')
      pending.callback(bars, { noData: bars.length === 0 })
      this.pendingCallbacks.delete(key + '_more')
    }
  }

  /**
   * Handle NO_DATA from RN
   */
  handleNoData(message) {
    const { symbol, interval } = message
    const resolution = this.secondsToResolution(interval)
    const key = `${symbol}_${resolution}`

    console.log('⚠️ No data available from RN for key:', key)

    // Call pending callback with noData flag (try both keys)
    const pending =
      this.pendingCallbacks.get(key) ||
      this.pendingCallbacks.get(`${symbol}_${interval}`)
    if (pending) {
      pending.callback([], { noData: true })
      this.pendingCallbacks.delete(key)
      this.pendingCallbacks.delete(`${symbol}_${interval}`)
    }
  }

  /**
   * Handle NO_MORE_DATA from RN
   */
  handleNoMoreData(message) {
    const { symbol, interval } = message
    const resolution = this.secondsToResolution(interval)
    const key = `${symbol}_${resolution}`

    console.log('⚠️ No more historical data available for key:', key)

    // Call pending callback with noData flag (try both keys)
    const pending =
      this.pendingCallbacks.get(key + '_more') ||
      this.pendingCallbacks.get(`${symbol}_${interval}` + '_more')
    if (pending) {
      pending.callback([], { noData: true })
      this.pendingCallbacks.delete(key + '_more')
      this.pendingCallbacks.delete(`${symbol}_${interval}` + '_more')
    }
  }

  /**
   * Convert TradingView resolution to seconds
   */
  resolutionToSeconds(resolution) {
    // TradingView resolutions: "1", "5", "15", "60", "240", "1D", "1W", "1M"
    if (resolution.includes('D')) {
      return parseInt(resolution) * 86400 // days to seconds
    }
    if (resolution.includes('W')) {
      return parseInt(resolution) * 604800 // weeks to seconds
    }
    if (resolution.includes('M')) {
      return parseInt(resolution) * 2592000 // months to seconds (30 days)
    }
    // Default: resolution is in minutes
    return parseInt(resolution) * 60
  }

  /**
   * Convert seconds back to TradingView resolution
   */
  secondsToResolution(seconds) {
    const mins = seconds / 60
    if (mins < 60) {
      return mins.toString() // "1", "5", "15", "30"
    }
    const hours = mins / 60
    if (hours < 24) {
      return (hours * 60).toString() // "60", "240"
    }
    const days = hours / 24
    return days + 'D' // "1D"
  }

  /**
   * Notify React Native about symbol/interval change
   */
  notifyRN(type, data) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type,
          ...data,
        }),
      )
    }
  }

  /**
   * TradingView Datafeed API Implementation
   */

  onReady(callback) {
    setTimeout(() => {
      callback({
        supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D'],
        supports_marks: false,
        supports_time: true,
        supports_timescale_marks: false,
      })
    }, 0)
  }

  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    // Not implemented - RN handles symbol search
    setTimeout(() => {
      onResultReadyCallback([])
    }, 0)
  }

  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    const symbolInfo = {
      name: symbolName,
      full_name: symbolName,
      description: symbolName,
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      exchange: '',
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      supported_resolutions: ['1', '5', '15', '30', '60', '240', '1D'],
      volume_precision: 2,
      data_status: 'streaming',
    }

    setTimeout(() => {
      onSymbolResolvedCallback(symbolInfo)
    }, 0)
  }

  getBars(
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback,
  ) {
    const { from, to, countBack, firstDataRequest } = periodParams
    const symbol = symbolInfo.name
    const key = `${symbol}_${resolution}`

    console.log('📊 getBars called:', {
      symbol,
      resolution,
      from,
      to,
      countBack,
      firstDataRequest,
    })

    if (firstDataRequest) {
      // ALWAYS request fresh data from RN for first/initial data request
      // This ensures interval changes work correctly (no stale cached data)
      console.log('🔔 First data request, storing callback key:', key)

      // Clear any old stored bars for this key to avoid stale data
      this.bars.delete(key)

      // Remove noMoreData flag for this key (fresh interval)
      if (this.noMoreDataKeys) {
        this.noMoreDataKeys.delete(key)
      }

      // Store callback to be called when data arrives
      this.pendingCallbacks.set(key, {
        callback: onHistoryCallback,
        from,
        to,
        firstDataRequest,
      })

      // Notify RN to fetch
      this.notifyRN('FETCH_INITIAL_DATA', {
        symbol,
        interval: this.resolutionToSeconds(resolution),
        from,
        to,
      })

      // Safety timeout: resolve with noData if RN doesn't respond
      setTimeout(() => {
        const pending = this.pendingCallbacks.get(key)
        if (pending) {
          console.warn('⏰ Timeout: No data from RN for', key)
          pending.callback([], { noData: true })
          this.pendingCallbacks.delete(key)
        }
      }, 15000)
    } else {
      // Load more (pagination) request

      // If we know there's no more data, resolve immediately
      if (this.noMoreDataKeys && this.noMoreDataKeys.has(key)) {
        console.log('🚫 No more data available for:', key)
        onHistoryCallback([], { noData: true })
        return
      }

      console.log('🔔 Load more request, storing callback key:', key + '_more')

      // Store callback
      this.pendingCallbacks.set(key + '_more', {
        callback: onHistoryCallback,
        from,
        to,
        firstDataRequest: false,
      })

      // Notify RN to fetch older data
      this.notifyRN('FETCH_MORE_DATA', {
        symbol,
        interval: this.resolutionToSeconds(resolution),
        from,
        to,
      })

      // Safety timeout for load-more
      setTimeout(() => {
        const pending = this.pendingCallbacks.get(key + '_more')
        if (pending) {
          console.warn('⏰ Timeout: No more data from RN for', key)
          pending.callback([], { noData: true })
          this.pendingCallbacks.delete(key + '_more')
        }
      }, 15000)
    }
  }

  subscribeBars(
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback,
  ) {
    const symbol = symbolInfo.name
    const subscriberKey = `${symbol}_${resolution}`

    console.log('📊 Subscribe to real-time updates:', { symbol, resolution })

    // Store subscriber
    this.subscribers.set(subscriberKey, {
      symbol,
      resolution,
      callback: onRealtimeCallback,
      uid: subscriberUID,
    })

    // Notify RN to subscribe to real-time updates
    this.notifyRN('SUBSCRIBE_REALTIME', {
      symbol,
      interval: this.resolutionToSeconds(resolution),
    })
  }

  unsubscribeBars(subscriberUID) {
    // Find and remove subscriber
    for (let [key, subscriber] of this.subscribers.entries()) {
      if (subscriber.uid === subscriberUID) {
        console.log('📊 Unsubscribe from real-time updates:', subscriber)

        this.subscribers.delete(key)

        // Notify RN to unsubscribe
        this.notifyRN('UNSUBSCRIBE_REALTIME', {
          symbol: subscriber.symbol,
          interval: subscriber.resolution,
        })
        break
      }
    }
  }

  /**
   * Public method: Update symbol/interval (called by chart-init when user changes)
   */
  onSymbolChange(callback) {
    this.onSymbolChangeCallback = callback
  }

  onIntervalChange(callback) {
    this.onIntervalChangeCallback = callback
  }
}

// Make it globally available
window.RNDrivenDatafeed = RNDrivenDatafeed
