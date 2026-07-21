import { memo } from 'react'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useShallow } from 'zustand/react/shallow'
import ItemSymbol from './ItemSymbol'
import { ZodBoolean } from 'zod'

type ItemSymbolConnectedProps = {
  readonly accessId: string
  readonly symbol: string
  readonly desc?: string
  readonly initialBid?: number
  readonly digit?: number
  readonly initialChange?: number
  readonly initialChangePercent?: number
}

function ItemSymbolConnected({
  accessId,
  symbol,
  desc,
  initialBid = 0,
  initialChange = 0,
  initialChangePercent = 0,
}: ItemSymbolConnectedProps) {
  // Use real-time data if available, fallback to initial props
  const bid =
    useMarketSocketStore((s) => s.rtBySymbol?.[symbol]?.bid) ?? initialBid
  const change =
    useMarketSocketStore((s) => s.rtBySymbol?.[symbol]?.change) ?? initialChange
  const percentChange =
    useMarketSocketStore((s) => s.rtBySymbol?.[symbol]?.changePercent) ??
    initialChangePercent

  return (
    <ItemSymbol
      accessId={accessId}
      bid={bid}
      change={change}
      desc={desc}
      percentChange={percentChange}
      symbol={symbol}
    />
  )
}

// ✅ Memo prevents re-render when adjacent items update
export default memo(ItemSymbolConnected, (prev, next) => {
  // Only re-render if these props change (symbol change = different item)
  return prev.symbol === next.symbol && prev.accessId === next.accessId
})
