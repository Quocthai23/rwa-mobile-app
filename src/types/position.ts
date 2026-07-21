export type Position = {
  id: string
  accountId: string
  symbol: string
  side: number
  quantity: string
  leverage: number
  margin: string
  realizedPnl: string
  openPrice: string
  closePrice: string | null
  totalFees: string
  initialQuantity: string
  isLiquidation: boolean
  openedAt: string
  closedAt: string | null
  lastUpdatedAt: string
  status: number
  // Optional fields for UI
  takeProfit?: string
  stopLoss?: string
  trailingStop?: string
  overnightFunding?: string
}

// Extended Position type with calculated PnL values
export type CustomPosition = Position & {
  digit?: number
  contractSize?: number
}

export type PositionsResponse = {
  data: Position[]
  total: number
}
