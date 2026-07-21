// hooks/useOrdersList.ts
import { useQuery } from '@tanstack/react-query'

import { getOrdersListAPI } from '@/services/oderService'
import type { GetOrdersParams, GetOrdersResponse } from '@/types/orders'

export const useOrdersList = (parameters: GetOrdersParams) => {
  const enabled = !!parameters?.accountId

  return useQuery<GetOrdersResponse>({
    enabled,
    placeholderData: (previous) => previous,
    queryFn: () => getOrdersListAPI(parameters),
    queryKey: ['orders', parameters],
    staleTime: 5000,
  })
}
