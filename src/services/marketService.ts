/**
 * Market API Service
 * Fetches market data including klines (candlestick) data
 */

import ky from 'ky'

import { API_CHART_URL, MARKET_ENDPOINTS } from '@/constants/api'

import { apiClient } from './ApiClient'

export type Candle = {
  close: number
  high: number
  low: number
  open: number
  time: number
  volume?: number
}

export type KlineData = {
  candles: Candle[]
  symbol: string
  timeframe: number
}

export type KlineResponse = {
  success: boolean
  symbol: string
  candles: Candle[]
}

export type GetKlinesParams = {
  includeActive?: boolean
  limit?: number
  symbol: string
  timeframe: number // Timeframe in seconds (e.g., 60, 300, 900, 3600, 14400, 86400)
}

export type TrendingMarketItem = {
  id: string
  symbol: string
}

export type TrendingMarketResponse = {
  trendingMarket: TrendingMarketItem[]
  topMovers: {
    topRisers: TrendingMarketItem[]
    topFallers: TrendingMarketItem[]
  }
}

/**
 * Fetch klines (candlestick) data for a symbol
 * @param params - Parameters for klines query
 * @returns Promise with kline data
 */
async function getKlines(params: GetKlinesParams): Promise<KlineData> {
  const { includeActive = true, limit = 100, symbol, timeframe } = params

  const url = `${API_CHART_URL}/api/v1/market/klines/${symbol}`

  const searchParams = new URLSearchParams({
    includeActive: String(includeActive),
    limit: String(limit),
    timeframe: String(timeframe),
  })

  const response = await ky
    .get(`${url}?${searchParams.toString()}`)
    .json<KlineResponse>()

  return {
    candles: response.candles || [],
    symbol: response.symbol || symbol,
    timeframe,
  }
}

/**
 * Fetch trending market data
 * @returns Promise with trending market items (limited to 4)
 */
async function getTrendingMarket(): Promise<TrendingMarketItem[]> {
  const response = await apiClient.get<TrendingMarketResponse>(
    MARKET_ENDPOINTS.TRENDING,
    undefined,
    { skipAuth: true },
    true,
  )

  // Return only first 4 items
  return response.trendingMarket.slice(0, 4)
}

/**
 * Fetch full trending data including top risers and fallers
 * @returns Promise with full trending market response
 */
async function getTrendingData(): Promise<TrendingMarketResponse> {
  const response = await apiClient.get<TrendingMarketResponse>(
    MARKET_ENDPOINTS.TRENDING,
    undefined,
    { skipAuth: true },
    true,
  )

  return response
}

export const marketService = {
  getKlines,
  getTrendingMarket,
  getTrendingData,
}
