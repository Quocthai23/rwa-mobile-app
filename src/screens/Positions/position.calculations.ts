import Decimal from 'decimal.js'
import { CustomPosition, Position } from '@/types'

export const calculatePositionFields = (
  position: Position,
  assetsBySymbol: any,
  rtBySymbol: any,
) => {
  const isBuy = position.side === 0
  const openPrice = parseFloat(position.openPrice)
  const rt = rtBySymbol?.[position.symbol]
  const currentPrice = isBuy ? rt?.bid : rt?.ask
  const contractSize = assetsBySymbol[position.symbol]?.contractSize || 100
  const digit = assetsBySymbol[position.symbol]?.digit || 2
  const quantity = parseFloat(position.quantity)
  const priceDiff = isBuy ? currentPrice - openPrice : openPrice - currentPrice
  const profit = priceDiff * quantity * contractSize
  const percentage = (priceDiff / openPrice) * 100

  return {
    isBuy,
    openPrice,
    currentPrice,
    contractSize,
    digit,
    quantity,
    priceDiff,
    profit,
    percentage,
  }
}

export const calculateUnrealizedPnL = (
  position: CustomPosition,
  rtBySymbol: Record<string, any>,
): number => {
  const isBuy = position.side === 0
  const openPrice = new Decimal(position.openPrice)
  const rt = rtBySymbol?.[position.symbol]
  const realtimePrice = isBuy ? rt?.bid : rt?.ask
  if (!realtimePrice) return 0
  const contractSize = new Decimal(position?.contractSize || 100)
  const quantity = new Decimal(position.quantity)
  const priceDiff = new Decimal(realtimePrice).minus(openPrice)

  return priceDiff.mul(quantity).mul(contractSize).toNumber()
}

export const calculateTotalUnrealizedPnL = (
  openPositions: CustomPosition[],
  rtBySymbol: Record<string, any>,
): number => {
  return openPositions.reduce((acc, position) => {
    return acc + calculateUnrealizedPnL(position, rtBySymbol)
  }, 0)
}

export const calculateRequiredMargin = (
  lot: number,
  position: CustomPosition,
  price: number,
): number => {
  if (!position?.leverage || !position?.contractSize) return 0
  return (lot * position?.contractSize * price) / position.leverage
}
