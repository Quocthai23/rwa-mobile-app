export type Candle = {
  close: number
  high: number
  low: number
  open: number
  time: number
}

export type SymbolQuote = {
  ask: number
  bid: number
  changePct24h: number
  symbol: string
  updatedAt: number
}

const now = Date.now()

export const mockXAUUSDQuote: SymbolQuote = {
  ask: 2034.38,
  bid: 2034.12,
  changePct24h: 0.42,
  symbol: 'XAUUSD',
  updatedAt: now,
}

export const mockXAUUSDCandles: Candle[] = [
  {
    close: 2031.4,
    high: 2032.5,
    low: 2029.9,
    open: 2030.2,
    time: now - 11 * 60_000,
  },
  {
    close: 2032.7,
    high: 2033.1,
    low: 2030.8,
    open: 2031.4,
    time: now - 10 * 60_000,
  },
  {
    close: 2033.6,
    high: 2034,
    low: 2032.2,
    open: 2032.7,
    time: now - 9 * 60_000,
  },
  {
    close: 2033.1,
    high: 2034.4,
    low: 2032.9,
    open: 2033.6,
    time: now - 8 * 60_000,
  },
  {
    close: 2032,
    high: 2033.8,
    low: 2031.6,
    open: 2033.1,
    time: now - 7 * 60_000,
  },
  {
    close: 2032.4,
    high: 2032.9,
    low: 2031.3,
    open: 2032,
    time: now - 6 * 60_000,
  },
  {
    close: 2034.8,
    high: 2035.2,
    low: 2032,
    open: 2032.4,
    time: now - 5 * 60_000,
  },
  {
    close: 2035.3,
    high: 2036,
    low: 2034.1,
    open: 2034.8,
    time: now - 4 * 60_000,
  },
  {
    close: 2035,
    high: 2036.2,
    low: 2034.7,
    open: 2035.3,
    time: now - 3 * 60_000,
  },
  {
    close: 2034.2,
    high: 2035.5,
    low: 2033.9,
    open: 2035,
    time: now - 2 * 60_000,
  },
  {
    close: 2034.6,
    high: 2034.9,
    low: 2033.6,
    open: 2034.2,
    time: now - 1 * 60_000,
  },
  { close: 2034.1, high: 2035.1, low: 2033.8, open: 2034.6, time: now },
]

export const mockWatchlist: SymbolQuote[] = [
  mockXAUUSDQuote,
  {
    ask: 1.086_66,
    bid: 1.086_52,
    changePct24h: -0.12,
    symbol: 'EURUSD',
    updatedAt: now,
  },
  {
    ask: 1.271_22,
    bid: 1.271_04,
    changePct24h: 0.08,
    symbol: 'GBPUSD',
    updatedAt: now,
  },
  {
    ask: 155.18,
    bid: 155.12,
    changePct24h: 0.31,
    symbol: 'USDJPY',
    updatedAt: now,
  },
]
