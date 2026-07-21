/**
 * Economic Calendar React Query Hook
 * Custom hook for fetching economic calendar events
 */

import { useQuery } from '@tanstack/react-query'

import { CACHE_TIMES } from '@/constants/api'
import { economicCalendarService } from '@/services/economicCalendarService'
import type { EconomicCalendarResponse } from '@/types'
import { toISODateString } from '@/utils/dateUtils'

export const economicCalendarQueryKeys = {
  all: ['economicCalendar'] as const,
  byDate: (date: string) => [...economicCalendarQueryKeys.all, date] as const,
}

export function useEconomicCalendar(date?: Date) {
  const dateString = date ? toISODateString(date) : toISODateString(new Date())

  return useQuery<EconomicCalendarResponse>({
    queryFn: () => economicCalendarService.getEvents({ date }),
    queryKey: economicCalendarQueryKeys.byDate(dateString),
    staleTime: CACHE_TIMES.CALENDAR,
  })
}

export { COUNTRY_FLAGS as countryFlags } from '@/constants/api'
