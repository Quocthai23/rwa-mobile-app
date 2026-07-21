import { useMarketSocketStore } from '@/store/marketSocketStore'
import { memo } from 'react'
import ItemSymbol from './ItemSymbol'

type ItemSymbolConnectedProps = {
  readonly accessId: string
  readonly symbol: string
  readonly desc?: string
  readonly isFavorite?: boolean
  readonly initialAsk?: number
  readonly initialBid?: number
  readonly digit?: number
  readonly initialChange?: number
  readonly initialChangePercent?: number
  readonly initialHigh?: number
  readonly initialLow?: number
}

function ItemSymbolConnected({
  accessId,
  symbol,
  desc,
  digit = 2,
  isFavorite = false,
  initialAsk = 0,
  initialBid = 0,
  initialChange = 0,
  initialChangePercent = 0,
  initialHigh = 0,
  initialLow = 0,
}: ItemSymbolConnectedProps) {
  // Use real-time data if available, fallback to initial props
  const ask =
    useMarketSocketStore((s) => s.rtBySymbol?.[symbol]?.ask) ?? initialAsk
  const bid =
    useMarketSocketStore((s) => s.rtBySymbol?.[symbol]?.bid) ?? initialBid
  const change =
    useMarketSocketStore((s) => s.rtBySymbol?.[symbol]?.change) ?? initialChange
  const percentChange =
    useMarketSocketStore((s) => s.rtBySymbol?.[symbol]?.changePercent) ??
    initialChangePercent
  const high =
    useMarketSocketStore((s) => s.rtBySymbol?.[symbol]?.sessionStats?.high) ??
    initialHigh
  const low =
    useMarketSocketStore((s) => s.rtBySymbol?.[symbol]?.sessionStats?.low) ??
    initialLow
  const spread = bid && ask ? ((ask - bid) * 100).toFixed(digit) : 0

  return (
    <ItemSymbol
      accessId={accessId}
      ask={ask}
      bid={bid}
      change={change}
      desc={desc}
      high={high}
      isFavorite={isFavorite}
      low={low}
      percentChange={percentChange}
      spread={Number(spread)}
      symbol={symbol}
    />
  )
}

// ✅ Memo prevents re-render when adjacent items update
export default memo(ItemSymbolConnected, (prev, next) => {
  // Only re-render if these props change (symbol change = different item)
  return (
    prev.symbol === next.symbol &&
    prev.isFavorite === next.isFavorite &&
    prev.accessId === next.accessId
  )
})
