import { CALENDAR_ENDPOINTS } from '@/constants/api'
import type {
  CalendarResponse,
  GetCalendarEventsRequest,
} from '@/types/calendar'

import { apiClient } from './ApiClient'

export const getCalendarEvents = async (
  parameters?: GetCalendarEventsRequest,
): Promise<CalendarResponse> => {
  try {
    console.log('Fetching calendar events...', parameters)

    const searchParameters: Record<string, string> = {}

    if (parameters?.take !== undefined) {
      searchParameters.take = parameters.take.toString()
    }
    if (parameters?.skip !== undefined) {
      searchParameters.skip = parameters.skip.toString()
    }
    if (parameters?.date) {
      searchParameters.dates = parameters.date
    }
    if (parameters?.type) {
      searchParameters.type = parameters.type
    }

    console.log('searchParameters', searchParameters)

    const response = await apiClient.get<CalendarResponse>(
      CALENDAR_ENDPOINTS.LIST,
      searchParameters,
      { skipAuth: true },
      true,
    )
    console.log('Calendar events fetched:', response)

    return response
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    throw error
  }
}
