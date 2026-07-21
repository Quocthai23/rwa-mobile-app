/**
 * News React Query Hooks
 * Custom hooks for fetching news data with caching
 */

import { useQuery } from '@tanstack/react-query'

import { CACHE_TIMES } from '@/constants/api'
import { newsService } from '@/services/newsService'
import type {
  GetNewsListRequest,
  NewsDataResponse,
  NewsListResponse,
} from '@/types'

export const newsQueryKeys = {
  aggregated: (parameters?: {
    language?: string
    limit?: number
    page?: number
  }) => [...newsQueryKeys.all, 'aggregated', parameters] as const,
  all: ['news'] as const,
  bloomberg: (parameters?: {
    limit?: number
    locale?: string
    pageNumber?: number
  }) => [...newsQueryKeys.all, 'bloomberg', parameters] as const,
  list: (parameters?: GetNewsListRequest) =>
    [...newsQueryKeys.all, 'list', parameters] as const,
  multiSource: (sources: string[], limit: number) =>
    [...newsQueryKeys.all, 'multiSource', sources, limit] as const,
  reuters: (parameters?: {
    offset?: number
    section?: string
    size?: number
  }) => [...newsQueryKeys.all, 'reuters', parameters] as const,
  topics: () => [...newsQueryKeys.all, 'topics'] as const,
  tradingEconomics: (parameters?: {
    category?: string
    size?: number
    start?: number
  }) => [...newsQueryKeys.all, 'tradingEconomics', parameters] as const,
  vnWallStreet: (parameters?: { limit?: number; start?: number }) =>
    [...newsQueryKeys.all, 'vnWallStreet', parameters] as const,
}

export function useAggregatedNews(parameters?: {
  language?: string
  limit?: number
  page?: number
}) {
  return useQuery<NewsListResponse>({
    queryFn: () => newsService.getAggregatedNews(parameters),
    queryKey: newsQueryKeys.aggregated(parameters),
    staleTime: CACHE_TIMES.NEWS,
  })
}

export function useBloombergNews(parameters?: {
  limit?: number
  locale?: string
  pageNumber?: number
}) {
  return useQuery<NewsListResponse>({
    queryFn: () => newsService.getBloombergNews(parameters),
    queryKey: newsQueryKeys.bloomberg(parameters),
    staleTime: CACHE_TIMES.NEWS,
  })
}

export function useMultiSourceNews(
  sources: ('bloomberg' | 'reuters' | 'tradingeconomics')[],
  limit = 10,
) {
  return useQuery<NewsListResponse>({
    queryFn: () => newsService.getMultiSourceNews(sources, limit),
    queryKey: newsQueryKeys.multiSource(sources, limit),
    staleTime: CACHE_TIMES.NEWS,
  })
}

export function useReutersNews(parameters?: {
  offset?: number
  section?: string
  size?: number
}) {
  return useQuery<NewsListResponse>({
    queryFn: () => newsService.getReutersNews(parameters),
    queryKey: newsQueryKeys.reuters(parameters),
    staleTime: CACHE_TIMES.NEWS,
  })
}

export function useTradingEconomicsNews(parameters?: {
  category?: string
  size?: number
  start?: number
}) {
  return useQuery<NewsListResponse>({
    queryFn: () => newsService.getTradingEconomicsNews(parameters),
    queryKey: newsQueryKeys.tradingEconomics(parameters),
    staleTime: CACHE_TIMES.NEWS,
  })
}

export function useVnWallStreetNews(parameters?: {
  limit?: number
  start?: number
}) {
  return useQuery<NewsListResponse>({
    queryFn: () => newsService.getVnWallStreetNews(parameters),
    queryKey: newsQueryKeys.vnWallStreet(parameters),
    staleTime: CACHE_TIMES.NEWS,
  })
}

export function useNewsList(parameters?: GetNewsListRequest) {
  return useQuery<NewsDataResponse>({
    queryFn: () => newsService.getNewsList(parameters),
    queryKey: newsQueryKeys.list(parameters),
    staleTime: CACHE_TIMES.NEWS,
  })
}

export function useNewsTopics() {
  return useQuery<string[]>({
    queryFn: () => newsService.getNewsTopics(),
    queryKey: newsQueryKeys.topics(),
    staleTime: CACHE_TIMES.NEWS,
  })
}
