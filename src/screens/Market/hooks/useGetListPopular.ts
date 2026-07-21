import { useEffect, useState } from 'react'

import { API_CHART_URL } from '@/constants/api'

type IDataPopular = {
  // "symbol": "USDJPY",
  // "symbolTradingView": "FX:USDJPY",
  // "lastPrice": 154.248,
  // "change": 1.17,
  // "changePercent": 0.76,
  // "timestamp": 1769789115,
  // "bid": 154.248,
  // "ask": 154.248,
  // "bidSize": 0,
  // "askSize": 0,
  // "updatedAt": "2026-01-30T16:05:15.996Z"
  //   "stats": {
  //       "symbol": "EURUSD",
  //       "symbolTradingView": "FX:EURUSD",
  //       "high24h": 1.19545,
  //       "low24h": 1.18462,
  //       "volume24h": 155378,
  //       "turnover24h": 184814.20076000007,
  //       "priceChange24h": -0.01227,
  //       "priceChangePercent24h": -1.03,
  //       "updatedAt": "2026-01-30T22:01:00.104Z",
  //       "highDaily": 1.19545,
  //       "lowDaily": 1.18462,
  //       "volumeDaily": 155378,
  //       "turnoverDaily": 184814.20076000007,
  //       "tradingDayStart": 1769724000,
  //       "isWeekend": false
  //     }
  ask: number
  askSize: number
  bid: number
  bidSize: number
  change: number
  changePercent: number
  lastPrice: number
  stats: {
    high24h: number
    highDaily: number
    isWeekend: boolean
    low24h: number
    lowDaily: number
    priceChange24h: number
    priceChangePercent24h: number
    symbol: string
    symbolTradingView: string
    tradingDayStart: number
    turnover24h: number
    turnoverDaily: number
    updatedAt: string
    volume24h: number
    volumeDaily: number
  }
  symbol: string
  symbolTradingView: string
  timestamp: number
  updatedAt: string
}
export const useGetListPopular = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<IDataPopular[]>([])
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [keywordDebounce, setKeywordDebounce] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setKeywordDebounce(keyword)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [keyword])

  const getListPopular = async () => {
    try {
      const res = await fetch(
        `${API_CHART_URL}/api/v1/market/tickers?limit=${limit}&page=${page}&keyword=XAUUSD`,
      )
      const json = await res?.json()
      console.log('json', json?.data)

      const results = json?.data || []
      if (page === 1) {
        setData(results)
      } else {
        setData((previous) => [...previous, ...results])
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching popular symbols:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getListPopular()
  }, [limit, page, keywordDebounce])

  return {
    isLoading,
    keyword,
    listPopular: data,
    page,
    setKeyword,
    setLimit,
    setPage,
  }
}
