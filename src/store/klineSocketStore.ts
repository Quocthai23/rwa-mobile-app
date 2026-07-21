import { io, type Socket } from 'socket.io-client'
import { create } from 'zustand'

import { SOCKET_CHART_URL } from '@/constants/api'

type Candle = {
  close: number
  high: number
  isClosed: boolean
  low: number
  open: number
  timestamp: number
  volume: number
}

type ClientToServerEvents = {
  subscribeKline: (payload: { symbol: string; timeframe: number }) => void
  unsubscribeKline: (payload: { symbol: string; timeframe: number }) => void
}

type KlineData = {
  candle: Candle
  symbol: string
  timeframe: number
  timeframeDisplay: string
}

type KlineMessage = {
  data: KlineData
  event: 'kline'
}

type KlineSocketState = {
  isConnected: boolean
  socket: null | Socket<ServerToClientEvents, ClientToServerEvents>

  // Track active subscriptions
  subscriptions: Map<string, KlineSubscription>

  // Store latest candle data by symbol-timeframe key
  klineData: Record<string, Candle>

  // Callbacks for real-time updates
  connect: () => void

  disconnect: () => void
  listeners: Map<string, Set<(candle: Candle) => void>>

  subscribe: (
    symbol: string,
    timeframe: number,
    callback: (candle: Candle) => void,
  ) => void
  unsubscribe: (
    symbol: string,
    timeframe: number,
    callback: (candle: Candle) => void,
  ) => void
}

type KlineSubscription = {
  symbol: string
  timeframe: number
}

type ServerToClientEvents = {
  kline: (message: KlineMessage) => void
}

// const SOCKET_URL = 'wss://price-service-integration.tnwteam.dev';

const getKey = (symbol: string, timeframe: number) => `${symbol}-${timeframe}`

export const useKlineSocketStore = create<KlineSocketState>((set, get) => ({
  connect: () => {
    const existing = get().socket
    if (existing) {
      if (!existing.connected) existing.connect()

      return
    }
    console.log('SOCKET_CHART_URL', SOCKET_CHART_URL)
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      SOCKET_CHART_URL,
      {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 500,
        reconnectionDelayMax: 5000,
        timeout: 10_000,
        transports: ['websocket'],
      },
    )

    socket.on('connect', () => {
      console.log('✅ Kline socket connected')
      set({ isConnected: true })

      // Resubscribe all active subscriptions
      const { subscriptions } = get()
      for (const sub of subscriptions.values()) {
        console.log('🔄 Resubscribing:', sub)

        socket.emit('subscribeKline', {
          symbol: sub.symbol,
          timeframe: sub.timeframe,
        })
      }
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ Kline socket disconnected:', reason)
      set({ isConnected: false })
    })

    socket.on('connect_error', (error) => {
      console.error('🔴 Kline socket error:', error)
    })

    // Listen to kline events
    socket.on('kline', (message: KlineMessage) => {
      // console.log('📊 Received kline:', message)

      const { data } = message
      const key = getKey(data.symbol, data.timeframe)

      // Update stored data
      set((state) => ({
        klineData: {
          ...state.klineData,
          [key]: data.candle,
        },
      }))

      // Notify all listeners for this key
      const listeners = get().listeners.get(key)
      if (listeners) {
        for (const callback of listeners) callback(data.candle)
      }
    })

    socket.connect()
    set({ socket })
  },
  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ isConnected: false, socket: null })
    }
  },
  isConnected: false,
  klineData: {},
  listeners: new Map(),

  socket: null,

  // subscribe: (
  //   symbol: string,
  //   timeframe: number,
  //   callback: (candle: Candle) => void,
  // ) => {
  //   const { listeners, socket, subscriptions } = get();
  //   const key = getKey(symbol, timeframe);

  //   // Add listener
  //   const existingListeners = listeners.get(key) || new Set();
  //   existingListeners.add(callback);
  //   listeners.set(key, existingListeners);

  //   // If first subscription for this key, emit to server
  //   if (!subscriptions.has(key)) {
  //     console.log('📡 Subscribing to kline:', symbol, timeframe);
  //     subscriptions.set(key, { symbol, timeframe });

  //     if (socket?.connected) {
  //       socket.emit('subscribeKline', { symbol, timeframe });
  //     }

  //     set({
  //       listeners: new Map(listeners),
  //       subscriptions: new Map(subscriptions),
  //     });
  //   }
  // },

  subscribe: (symbol, timeframe, callback) => {
    const key = getKey(symbol, timeframe)
    const { socket } = get()

    set((state) => {
      const listeners = new Map(state.listeners)
      const subscriptions = new Map(state.subscriptions)

      const setForKey = new Set(listeners.get(key) ?? [])
      setForKey.add(callback)
      listeners.set(key, setForKey)

      if (!subscriptions.has(key)) {
        subscriptions.set(key, { symbol, timeframe })
        if (socket?.connected)
          socket.emit('subscribeKline', { symbol, timeframe })
      }

      return { listeners, subscriptions }
    })
  },

  subscriptions: new Map(),

  unsubscribe: (
    symbol: string,
    timeframe: number,
    callback: (candle: Candle) => void,
  ) => {
    const { listeners, socket, subscriptions } = get()
    const key = getKey(symbol, timeframe)

    // Remove listener
    const existingListeners = listeners.get(key)
    if (existingListeners) {
      existingListeners.delete(callback)

      // If no more listeners, unsubscribe from server
      if (existingListeners.size === 0) {
        console.log('📡 Unsubscribing from kline:', symbol, timeframe)
        listeners.delete(key)
        subscriptions.delete(key)

        if (socket?.connected) {
          socket.emit('unsubscribeKline', { symbol, timeframe })
        }
      }

      set({
        listeners: new Map(listeners),
        subscriptions: new Map(subscriptions),
      })
    }
  },
}))
