/**
 * API Constants and Configuration
 * Centralized configuration for all API endpoints
 */

/**
 * Direct API URLs - mobile-app fetches directly (no app2 proxy)
 * React Native has no CORS restrictions
 */
export const API_BASE_URL =
  process.env.API_BASE_URL ?? process.env.EXPO_PUBLIC_API_BASE_URL ?? ''

/** ForexFactory calendar - free, no API key */
export const FOREXFACTORY_CALENDAR_URL =
  'https://nfs.faireconomy.media/ff_calendar_thisweek.json'

/** VnWallStreet flash news - time_ and sign_ from their page */
export const VNWALLSTREET_NEWS_URL =
  'https://vnwallstreet.top/api/inter/newsFlash/page'

/** TradingEconomics news stream */
export const TRADINGECONOMICS_NEWS_URL =
  'https://tradingeconomics.com/ws/stream.ashx'

/** Bloomberg stories API */
export const BLOOMBERG_NEWS_URL =
  'https://www.bloomberg.com/lineup-next/api/stories'

/** Reuters content API */
export const REUTERS_NEWS_URL =
  'https://www.reuters.com/pf/api/v3/content/fetch/articles-by-section-alias-or-id-v1'
export const API_CHART_URL =
  process.env.API_CHART_URL ?? 'https://mirroto-market.muskcoin.io'
export const SOCKET_CHART_URL =
  process.env.SOCKET_CHART_URL ?? 'wss://mirroto-market.muskcoin.io'
export const MIRROTO_API_BASE_URL =
  process.env.MIRROTO_API_BASE_URL ?? 'https://mirroto-api.muskcoin.io'

/**
 * News API Endpoints
 */
export const NEWS_ENDPOINTS = {
  AGGREGATE: '/api/news/aggregate',
  BLOOMBERG: '/api/news/bloomberg',
  LIST: 'home/news',
  REUTERS: '/api/news/reuters',
  TOPICS: 'home/news/topics',
  TRADING_ECONOMICS: '/api/news/tradingeconomics',
  VN_WALLSTREET: '/api/news/external',
} as const

/**
 * Market Trending Endpoints
 */
export const MARKET_ENDPOINTS = {
  TRENDING: 'home/trending',
} as const

/**
 * Economic Calendar Endpoints
 */
export const CALENDAR_ENDPOINTS = {
  EVENTS: '/api/economic-calendar',
  LIST: 'home/calendar',
} as const

/**
 * Trading Assets Endpoints
 */
export const ASSETS_ENDPOINTS = {
  CATEGORIES: '/asset-categories',
  LIST: '/assets',
} as const

export const COMMISSION_ENDPOINTS = {
  GET_COMMISSION: '/commission',
} as const

export const PAYMENT_ENDPOINTS = {
  DEPOSIT_DEMO: '/payment/deposit-demo',
  CREATE_WALLET: '/payment/create-wallet',
  WITHDRAW: '/payment/withdraw',
  HISTORY: '/payment/history',
  TRANSFER: '/payment/transfer',
} as const

/**
 * Positions Endpoints
 */
export const POSITIONS_ENDPOINTS = {
  BULK_CLOSE: '/positions/bulk-close',
  LIST: '/positions',
} as const

export const ORDERS_ENDPOINTS = {
  CREATE: '/orders',
  LIST: '/orders',
} as const

export const ACCOUNTS_ENDPOINTS = {
  BALANCE: '/accounts/balance',
  CREATE: '/accounts',
  DELETE: (id: string) => `/accounts/${id}`,
  LIST: '/accounts',
  TYPES: '/accounts/types',
  UPDATE: (id: string) => `/accounts/${id}`,
} as const

/**
 * Cache timing configuration (in milliseconds)
 */
export const CACHE_TIMES = {
  CALENDAR: 10 * 60 * 1000, // 10 minutes for calendar
  NEWS: 5 * 60 * 1000, // 5 minutes for news
  TRENDING: 3 * 60 * 1000, // 3 minutes for trending
} as const

/**
 * API delay configuration for development (in milliseconds)
 */
export const API_DELAY_MS = {
  LONG: 400,
  MEDIUM: 300,
  SHORT: 200,
  VERY_LONG: 500,
} as const

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  DEFAULT_PAGE: 1,
} as const

/**
 * Country code to flag emoji mapping
 */
export const COUNTRY_FLAGS: Record<string, string> = {
  AR: '🇦🇷',
  AU: '🇦🇺',
  BR: '🇧🇷',
  CA: '🇨🇦',
  CH: '🇨🇭',
  CN: '🇨🇳',
  DE: '🇩🇪',
  DK: '🇩🇰',
  ES: '🇪🇸',
  EU: '🇪🇺',
  FR: '🇫🇷',
  GB: '🇬🇧',
  HK: '🇭🇰',
  IN: '🇮🇳',
  IT: '🇮🇹',
  JP: '🇯🇵',
  KR: '🇰🇷',
  MX: '🇲🇽',
  NO: '🇳🇴',
  NZ: '🇳🇿',
  PL: '🇵🇱',
  RU: '🇷🇺',
  SE: '🇸🇪',
  SG: '🇸🇬',
  TR: '🇹🇷',
  US: '🇺🇸',
  ZA: '🇿🇦',
}

/**
 * News source config for emoji display
 */
export const NEWS_SOURCE_ICONS: Record<string, string> = {
  bloomberg: '📊',
  crypto: '₿',
  default: '📰',
  reuters: '📈',
  tradingeconomics: '💹',
  vnwallstreet: '🇻🇳',
}
