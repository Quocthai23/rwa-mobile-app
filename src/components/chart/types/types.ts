export type IndicatorType =
  | 'BOLL'
  | 'EMA'
  | 'MA'
  | 'MACD'
  | 'RSI'
  | 'KDJ'
  | 'ATR'
  | 'none'

export type Order = {
  entryPrice: number
  entryTime: number // Unix timestamp in seconds
  exitPrice?: number
  exitTime?: number
  id: string
  pnl?: number
  status: 'closed' | 'open'
  stopLoss?: number
  takeProfit?: number
  type: 'buy' | 'sell'
  volume: number
}

export type TimeFrame =
  | '10m'
  | '12h'
  | '12m'
  | '15m'
  | '1d'
  | '1h'
  | '1m'
  | '1M'
  | '1w'
  | '20m'
  | '2h'
  | '2m'
  | '30m'
  | '3h'
  | '3m'
  | '4h'
  | '4m'
  | '5m'
  | '6h'
  | '6m'
  | '8h'

export type UnitType = 'LOTS' | 'MARGIN'
