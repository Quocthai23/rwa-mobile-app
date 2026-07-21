/**
 * Economic Calendar API Service
 * Fetches directly from ForexFactory (faireconomy.media) - free, no API key
 */

import { COUNTRY_FLAGS, FOREXFACTORY_CALENDAR_URL } from '@/constants/api'
import type { EconomicCalendarResponse, EconomicEvent } from '@/types'
import { toISODateString } from '@/utils/dateUtils'

type FFItem = {
  title: string
  country: string
  date: string
  impact: string
  forecast: string
  previous: string
}

type GetCalendarEventsParameters = {
  date?: Date
}

const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: 'US',
  EUR: 'EU',
  GBP: 'GB',
  JPY: 'JP',
  CAD: 'CA',
  AUD: 'AU',
  CHF: 'CH',
  CNY: 'CN',
  NZD: 'NZ',
  SGD: 'SG',
  HKD: 'HK',
  KRW: 'KR',
  INR: 'IN',
  MXN: 'MX',
  BRL: 'BR',
  ZAR: 'ZA',
  TRY: 'TR',
  RUB: 'RU',
  NOK: 'NO',
  SEK: 'SE',
  DKK: 'DK',
}

function getCountryCode(currency: string): string {
  return (
    CURRENCY_TO_COUNTRY[currency] ??
    currency?.slice(0, 2)?.toUpperCase() ??
    'XX'
  )
}

function normalizeImpact(impact: string): 'high' | 'medium' | 'low' {
  const lower = impact?.toLowerCase() ?? ''
  if (lower === 'high') return 'high'
  if (lower === 'medium' || lower === 'med') return 'medium'

  return 'low'
}

function extractTime(isoDate: string): string {
  try {
    const d = new Date(isoDate)
    const h = d.getHours()
    const m = d.getMinutes()
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12

    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
  } catch {
    return '--:--'
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ForexApp/1.0)',
      Accept: 'application/json',
    },
  })
  if (!response.ok) {
    throw new Error(`API failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export const economicCalendarService = {
  getCountryFlag(countryCode: string): string {
    return COUNTRY_FLAGS[countryCode] ?? '🌍'
  },

  async getEvents(
    parameters: GetCalendarEventsParameters = {},
  ): Promise<EconomicCalendarResponse> {
    const dateString = parameters.date
      ? toISODateString(parameters.date)
      : toISODateString(new Date())

    const raw = await fetchJson<FFItem[]>(FOREXFACTORY_CALENDAR_URL)
    const items = Array.isArray(raw) ? raw : []

    const filtered = items
      .filter((item) => item.date?.split('T')[0] === dateString)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const events: EconomicEvent[] = filtered.map((item, index) => {
      const countryCode = getCountryCode(item.country)

      return {
        id: `ff-${dateString}-${item.country}-${index}`,
        time: extractTime(item.date),
        country: item.country,
        countryCode,
        event: item.title,
        impact: normalizeImpact(item.impact),
        forecast: item.forecast || undefined,
        previous: item.previous || undefined,
      }
    })

    return {
      date: dateString,
      events,
      total: events.length,
    }
  },
}

export { COUNTRY_FLAGS as countryFlags } from '@/constants/api'
