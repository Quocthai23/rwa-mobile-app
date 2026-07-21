import { useMarketSocketStore } from '@/store/marketSocketStore'
import { memo } from 'react'
import ItemSymbolChartView from './ItemSymbolChartView'

type ItemSymbolChartViewConnectedProps = {
  readonly accessId: string
  readonly symbol: string
  readonly desc?: string
  readonly isFavorite?: boolean
  readonly initialAsk?: number
  readonly initialBid?: number
  readonly initialChange?: number
  readonly initialChangePercent?: number
  readonly digit?: number
}

/**
 * ✅ CRITICAL OPTIMIZATION: Chart view with hyper-targeted symbol subscription
 */
function ItemSymbolChartViewConnected({
  accessId,
  symbol,
  desc,
  isFavorite = false,
  initialAsk = 0,
  initialBid = 0,
  initialChange = 0,
  initialChangePercent = 0,
  digit = 2,
}: ItemSymbolChartViewConnectedProps) {
  const ask =
    useMarketSocketStore((s) => s.rtBySymbol[symbol]?.ask) ?? initialAsk
  const bid =
    useMarketSocketStore((s) => s.rtBySymbol[symbol]?.bid) ?? initialBid
  const change =
    useMarketSocketStore((s) => s.rtBySymbol[symbol]?.change) ?? initialChange
  const percentChange =
    useMarketSocketStore((s) => s.rtBySymbol[symbol]?.changePercent) ??
    initialChangePercent

  const spread = bid && ask ? ((ask - bid) * 100).toFixed(digit) : 0

  return (
    <ItemSymbolChartView
      accessId={accessId}
      ask={ask}
      bid={bid}
      change={change}
      desc={desc}
      isFavorite={isFavorite}
      percentChange={percentChange}
      spread={Number(spread)}
      symbol={symbol}
    />
  )
}

export default memo(ItemSymbolChartViewConnected, (prev, next) => {
  return (
    prev.symbol === next.symbol &&
    prev.isFavorite === next.isFavorite &&
    prev.accessId === next.accessId
  )
})
