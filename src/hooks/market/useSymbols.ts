import * as React from 'react'

import { useMarketSocketStore } from '@/store/marketSocketStore'

export function useSymbols(symbols: string[], enabled: boolean) {
  const connect = useMarketSocketStore((s) => s.connect)
  const subscribeSymbols = useMarketSocketStore((s) => s.subscribeSymbols)
  const unsubscribeSymbols = useMarketSocketStore((s) => s.unsubscribeSymbols)

  const stableSymbols = React.useMemo(
    () => [...new Set(symbols)].filter(Boolean),
    [JSON.stringify(symbols)],
  )

  React.useEffect(() => {
    if (!enabled) return

    connect()
    subscribeSymbols(stableSymbols)

    return () => {
      unsubscribeSymbols(stableSymbols)
    }
  }, [enabled, connect, subscribeSymbols, unsubscribeSymbols, stableSymbols])
}
