import { useMutation, useQuery } from '@tanstack/react-query'

import { CACHE_TIMES } from '@/constants/api'
import { deleteOrderAPI, getOrdersListAPI } from '@/services/oderService'
import type { OrderItem, GetOrdersParams } from '@/types/orders'

/**
 * Fetch all positions
 */
export const useOrders = (params: GetOrdersParams | string) => {
  const resolvedParams =
    typeof params === 'string' ? { accountId: params } : params

  return useQuery({
    enabled: !!resolvedParams.accountId,
    gcTime: CACHE_TIMES.TRENDING * 2,
    queryFn: async () => {
      const result = await getOrdersListAPI(resolvedParams)

      return result
    },
    queryKey: [
      'orders',
      resolvedParams.accountId,
      resolvedParams.sortBy,
      resolvedParams.sortDir,
    ],
    retry: 2,
    staleTime: CACHE_TIMES.TRENDING,
  })
}

export const useCancelOrders = (accountId: string) => {
  return useMutation({
    mutationFn: async (orders: OrderItem[]) => {
      const result = await Promise.all(
        orders.map((order) => deleteOrderAPI(order.id, order.accountId)),
      )
      return result
    },
  })
}
