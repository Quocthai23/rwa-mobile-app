import { useMarketSocketStore } from '@/store/marketSocketStore'
import { Asset } from '@/types'
import * as React from 'react'

export type SortByOption = { id: string; label: string; name: string }

type Params<Item extends Asset> = {
  list: Item[]
  openSortBy: SortByOption
  favoriteOnly?: boolean
  isHotOnly?: boolean
  categoryCode?: string
  intervalMs?: number
  enabled?: boolean
  getSymbol?: (item: Item) => string | undefined
}

const toNum = (v: unknown) => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  if (typeof v === 'string') {
    const n = Number.parseFloat(v)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

export function useRealtimeSortedListByRT<Item extends Asset>({
  list,
  openSortBy,
  favoriteOnly = false,
  isHotOnly = false,
  categoryCode,
  intervalMs = 150,
  enabled = true,
  getSymbol = (item) => item.symbol ?? item.id,
}: Params<Item>) {
  const [sortedList, setSortedList] = React.useState<Item[]>(list)

  const listRef = React.useRef(list)
  listRef.current = list

  const sortIdRef = React.useRef(openSortBy.id)
  sortIdRef.current = openSortBy.id

  const favoriteOnlyRef = React.useRef(favoriteOnly)
  favoriteOnlyRef.current = favoriteOnly

  const isHotOnlyRef = React.useRef(isHotOnly)
  isHotOnlyRef.current = isHotOnly

  const categoryCodeRef = React.useRef(categoryCode)
  categoryCodeRef.current = categoryCode

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const dirtyRef = React.useRef(false)

  const doSort = React.useCallback(() => {
    const sortId = sortIdRef.current
    let filteredList = listRef.current

    // ✅ Filter by categoryCode if needed
    if (categoryCodeRef.current) {
      filteredList = filteredList.filter(
        (item) => item.category?.code === categoryCodeRef.current,
      )
    }

    // ✅ Filter by favorite first if needed
    if (favoriteOnlyRef.current) {
      filteredList = filteredList.filter((item) => item.isFavorite)
    }

    // ✅ Filter by hot status if needed
    if (isHotOnlyRef.current) {
      filteredList = filteredList.filter((item) => item.isHot)
    }

    if (sortId === 'default') return filteredList

    const isHighToLow =
      sortId.includes('high_to_low') || sortId.includes('hight_to_low')
    const dirMul = isHighToLow ? 1 : -1

    const rtBySymbol = useMarketSocketStore.getState().rtBySymbol

    const getKeys = (item: Item) => {
      const sym = getSymbol(item)
      const rt = sym ? rtBySymbol[sym] : undefined

      return {
        _sortAsk: rt?.ask ?? toNum(item.ask),
        _sortBid: rt?.bid ?? toNum(item.bid),
        _sortChangePercent: rt?.changePercent ?? 0,
        _sortHigh: rt?.sessionStats?.high ?? 0,
        _sortLow: rt?.sessionStats?.low ?? 0,
      }
    }

    const sorted = [...filteredList].sort((a, b) => {
      const ka = getKeys(a)
      const kb = getKeys(b)

      // % Change sorting
      if (sortId.startsWith('percentChange')) {
        const diff = (kb._sortChangePercent || 0) - (ka._sortChangePercent || 0)
        return diff * dirMul
      }

      // Price sorting (using ask price)
      if (sortId.startsWith('price')) {
        const diff = (kb._sortAsk || 0) - (ka._sortAsk || 0)
        return diff * dirMul
      }

      // Volatility sorting (high - low range)
      if (sortId.startsWith('volatility')) {
        const volatilityA = (ka._sortHigh || 0) - (ka._sortLow || 0)
        const volatilityB = (kb._sortHigh || 0) - (kb._sortLow || 0)
        const diff = volatilityB - volatilityA
        return diff * dirMul
      }

      return 0
    })

    return sorted
  }, [getSymbol])

  React.useEffect(() => {
    setSortedList(doSort())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, openSortBy.id, favoriteOnly, isHotOnly, categoryCode])

  // Re-sort theo realtime (throttle)
  React.useEffect(() => {
    if (!enabled) return

    let prevRtBySymbol = useMarketSocketStore.getState().rtBySymbol

    const unsub = useMarketSocketStore.subscribe((state) => {
      // Check if rtBySymbol changed
      if (state.rtBySymbol === prevRtBySymbol) return
      prevRtBySymbol = state.rtBySymbol

      if (sortIdRef.current === 'default') return

      dirtyRef.current = true
      if (timerRef.current) return

      timerRef.current = setTimeout(() => {
        timerRef.current = null
        if (!dirtyRef.current) return
        dirtyRef.current = false
        setSortedList(doSort())
      }, intervalMs)
    })

    return () => {
      unsub()
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [enabled, intervalMs, doSort])

  return { sortedList }
}
