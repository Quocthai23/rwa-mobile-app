import { COMMISSION_ENDPOINTS } from '@/constants/api'
import { apiClient } from './ApiClient'
import type { CommissionResponse } from '@/types'

/**
 * Fetch referral commission data
 */
export const getCommission = async (
  fromDate?: string,
  toDate?: string,
): Promise<CommissionResponse> => {
  return apiClient.get<CommissionResponse>(
    COMMISSION_ENDPOINTS.GET_COMMISSION,
    {
      fromDate,
      toDate,
    },
  )
}
