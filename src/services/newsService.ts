/**
 * News API Service
 * Fetches directly from sources - React Native has no CORS restrictions
 */

import dayjs from 'dayjs'

import {
  BLOOMBERG_NEWS_URL,
  NEWS_ENDPOINTS,
  PAGINATION,
  REUTERS_NEWS_URL,
  TRADINGECONOMICS_NEWS_URL,
  VNWALLSTREET_NEWS_URL,
} from '@/constants/api'
import type {
  BloombergRawItem,
  BloombergStoriesResponse,
  GetNewsListRequest,
  NewsDataResponse,
  NewsItem,
  NewsListResponse,
  ReutersContentResponse,
  ReutersRawItem,
  TradingEconomicsRawItem,
  VnWallStreetResponse,
} from '@/types'

import { apiClient } from './ApiClient'
import {
  mapBloombergItem,
  mapReutersItem,
  mapTradingEconomicsItem,
  mapVnWallStreetItem,
} from './mappers'

type GetAggregatedNewsParameters = {
  language?: string
  limit?: number
  page?: number
}

type GetBloombergParameters = {
  limit?: number
  locale?: string
  pageNumber?: number
}

type GetReutersParameters = {
  offset?: number
  section?: string
  size?: number
}

type GetTradingEconomicsParameters = {
  category?: string
  size?: number
  start?: number
}

const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
  Accept: 'application/json',
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: FETCH_HEADERS })
  if (!response.ok) {
    throw new Error(`API failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

function sortByDate(items: NewsItem[]): NewsItem[] {
  return [...items].sort(
    (a, b) => dayjs(b.publishedAt).valueOf() - dayjs(a.publishedAt).valueOf(),
  )
}

export const newsService = {
  async getAggregatedNews(
    parameters: GetAggregatedNewsParameters = {},
  ): Promise<NewsListResponse> {
    const { limit = PAGINATION.DEFAULT_LIMIT } = parameters
    const results = await Promise.allSettled([
      this.getVnWallStreetNews({ limit: 20, start: 0 }),
      this.getTradingEconomicsNews({ size: 15 }),
      this.getBloombergNews({ limit: 15 }),
      this.getReutersNews({ size: 10 }),
    ])
    const allItems = results.flatMap((r) =>
      r.status === 'fulfilled' ? r.value.data : [],
    )

    return {
      data: sortByDate(allItems).slice(0, limit),
      limit,
      page: 1,
      total: allItems.length,
    }
  },

  async getBloombergNews(
    parameters: GetBloombergParameters = {},
  ): Promise<NewsListResponse> {
    const {
      limit = PAGINATION.DEFAULT_LIMIT,
      locale = 'en',
      pageNumber = 1,
    } = parameters
    const url = `${BLOOMBERG_NEWS_URL}?types=ARTICLE%2CFEATURE%2CINTERACTIVE%2CLETTER%2CEXPLAINERS&locale=${locale}&pageNumber=${pageNumber}&limit=${limit}`
    const response = await fetchJson<BloombergStoriesResponse>(url)
    const raw = response.stories ?? response.data ?? response.items ?? []
    const items = (raw as BloombergRawItem[]).map((item, i) =>
      mapBloombergItem(item, i),
    )

    return { data: items, limit, page: pageNumber, total: items.length }
  },

  async getReutersNews(
    parameters: GetReutersParameters = {},
  ): Promise<NewsListResponse> {
    const {
      offset = 0,
      section = '/world/',
      size = PAGINATION.DEFAULT_LIMIT,
    } = parameters
    const query = {
      'arc-site': 'reuters',
      fetch_type: 'collection',
      offset,
      requestId: 1,
      section_id: section,
      size: String(size),
      uri: section,
      website: 'reuters',
    }
    const url = `${REUTERS_NEWS_URL}?query=${encodeURIComponent(JSON.stringify(query))}&d=341&mxId=00000000&_website=reuters`
    const response = await fetchJson<ReutersContentResponse>(url)
    const raw =
      response.content_elements ?? response.articles ?? ([] as ReutersRawItem[])
    const items = raw.map((item, i) => mapReutersItem(item, i))

    return { data: items, limit: size, page: 1, total: items.length }
  },

  async getTradingEconomicsNews(
    parameters: GetTradingEconomicsParameters = {},
  ): Promise<NewsListResponse> {
    const {
      category = 'economy',
      size = PAGINATION.DEFAULT_LIMIT,
      start = 0,
    } = parameters
    const url = `${TRADINGECONOMICS_NEWS_URL}?start=${start}&size=${size}&i=${category}`
    const response = await fetchJson<
      TradingEconomicsRawItem[] | { data: TradingEconomicsRawItem[] }
    >(url)
    const raw = Array.isArray(response)
      ? response
      : ((response as { data?: TradingEconomicsRawItem[] }).data ?? [])
    const items = raw.map((item, i) => mapTradingEconomicsItem(item, i))

    return { data: items, limit: size, page: 1, total: items.length }
  },

  async getVnWallStreetNews(
    parameters: { limit?: number; start?: number } = {},
  ): Promise<NewsListResponse> {
    const { limit = 50, start = 0 } = parameters
    const url = `${VNWALLSTREET_NEWS_URL}?limit=${limit}&start=${start}&uid=-1&time_=1767113855632&sign_=F96851E4343F3ACCE702D28EBEEDB756`
    const response = await fetchJson<VnWallStreetResponse>(url)
    const items = (response.data ?? []).map(mapVnWallStreetItem)

    return {
      data: items,
      limit,
      page: 1,
      total: response.allCount ?? items.length,
    }
  },

  async getMultiSourceNews(
    sources: ('bloomberg' | 'reuters' | 'tradingeconomics')[],
    limit = 10,
  ): Promise<NewsListResponse> {
    const results = await Promise.allSettled(
      sources.map(async (source) => {
        switch (source) {
          case 'bloomberg':
            return (await this.getBloombergNews({ limit })).data
          case 'reuters':
            return (await this.getReutersNews({ size: limit })).data
          case 'tradingeconomics':
            return (await this.getTradingEconomicsNews({ size: limit })).data
          default:
            return []
        }
      }),
    )
    const allItems = results.flatMap((r) =>
      r.status === 'fulfilled' ? r.value : [],
    )

    return {
      data: sortByDate(allItems).slice(0, limit),
      limit,
      page: 1,
      total: allItems.length,
    }
  },

  async getNewsList(
    parameters?: GetNewsListRequest,
  ): Promise<NewsDataResponse> {
    try {
      console.log('Fetching news list...', parameters)

      const searchParameters: Record<string, string> = {}

      if (parameters?.take !== undefined) {
        searchParameters.take = parameters.take.toString()
      }
      if (parameters?.skip !== undefined) {
        searchParameters.skip = parameters.skip.toString()
      }
      if (parameters?.topics && parameters.topics.length > 0) {
        searchParameters.topics = parameters.topics.join(',')
      }

      const response = await apiClient.get<NewsDataResponse>(
        NEWS_ENDPOINTS.LIST,
        searchParameters,
        { skipAuth: true },
        true,
      )
      console.log('News list fetched:', response)

      return response
    } catch (error) {
      console.error('Error fetching news list:', error)
      throw error
    }
  },

  async getNewsTopics(): Promise<string[]> {
    try {
      console.log('Fetching news topics...')

      const response = await apiClient.get<string[]>(
        NEWS_ENDPOINTS.TOPICS,
        {},
        { skipAuth: true },
        true,
      )
      console.log('News topics fetched:', response)

      return response
    } catch (error) {
      console.error('Error fetching news topics:', error)
      throw error
    }
  },
}
