import { ORDERS_ENDPOINTS } from '@/constants/api'
import {
  type CreateOrderPayload,
  type CreateOrderResponse,
  type GetOrdersParams,
  type GetOrdersResponse,
} from '@/types/orders'

import { apiClient } from './ApiClient'
import { apiRequest } from './axiosClient'

export const createOrderAPI = (payload: CreateOrderPayload) => {
  return apiRequest<CreateOrderResponse>({
    data: payload,
    method: 'post',
    url: '/orders/',
  })
}

function normalizeOrdersParameters(parameters: GetOrdersParams) {
  const {
    skip = 0,
    sortBy = 'createdAt',
    sortDir = 'desc',
    take = 20,
    ...rest
  } = parameters

  return {
    skip,
    sortBy,
    sortDir,
    take,
    ...rest,
  }
}

export const getOrdersListAPI = async (
  parameters: GetOrdersParams,
): Promise<GetOrdersResponse> => {
  const normalized = normalizeOrdersParameters(parameters)
  const data = await apiClient.get<GetOrdersResponse>('orders', normalized)
  return data
}

export const deleteOrderAPI = async (
  orderId: string,
  accountId: string,
): Promise<GetOrdersResponse> => {
  const data = await apiClient.patch<GetOrdersResponse>(`orders/${orderId}`, {
    accountId,
    cancel: true,
  })
  return data
}
