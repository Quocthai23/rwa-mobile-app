import { useMutation, useQuery } from '@tanstack/react-query'

import { CACHE_TIMES } from '@/constants/api'
import {
  closeAllPositions,
  getPositions,
  GetPositionsParams,
} from '@/services/positionService'
import { type Position } from '@/types/position'

/**
 * Fetch all positions
 */
export const usePositions = (params: GetPositionsParams) => {
  return useQuery({
    enabled: !!params.accountId,
    gcTime: CACHE_TIMES.TRENDING * 2,
    queryFn: async () => {
      const result = await getPositions(params)
      return result
    },
    queryKey: ['positions', params.accountId, params.sortBy, params.sortDir],
    retry: 2,
    staleTime: CACHE_TIMES.TRENDING,
  })
}

export const useClosePositions = (accountId: string) => {
  return useMutation({
    mutationFn: async (positions: Position[]) => {
      const result = await closeAllPositions(accountId, positions)

      return result
    },
  })
}
