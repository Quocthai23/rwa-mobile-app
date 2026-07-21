import ky from 'ky'

import { MIRROTO_API_BASE_URL, ORDERS_ENDPOINTS } from '@/constants/api'
import type { GetOrdersResponse, OrderItem } from '@/types'

import { tokenStorage } from './tokenStorage'

/**
 * Fetch all available positions
 * This endpoint requires authentication
 * Note: This API returns data directly without the standard ApiResponse wrapper
 */
export const getOrders = async (accountId: string): Promise<OrderItem[]> => {
  try {
    // Get access token from storage
    const accessToken = tokenStorage.getAccessToken()

    if (!accessToken) {
      throw new Error('No access token found. Please login again.')
    }

    const response = await ky
      .get(
        `${MIRROTO_API_BASE_URL}${ORDERS_ENDPOINTS.LIST}?accountId=${accountId}`,
        {
          headers: {
            Authorization: accessToken.startsWith('Bearer ')
              ? accessToken
              : `Bearer ${accessToken}`,
          },
        },
      )
      .json<GetOrdersResponse>()
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteOrderAPI = async (
  accountId: string,
): Promise<OrderItem[]> => {
  try {
    // Get access token from storage
    const accessToken = tokenStorage.getAccessToken()

    if (!accessToken) {
      throw new Error('No access token found. Please login again.')
    }

    const response = await ky
      .get(
        `${MIRROTO_API_BASE_URL}${ORDERS_ENDPOINTS.LIST}?accountId=${accountId}`,
        {
          headers: {
            Authorization: accessToken.startsWith('Bearer ')
              ? accessToken
              : `Bearer ${accessToken}`,
          },
        },
      )
      .json<GetOrdersResponse>()

    return response.data
  } catch (error) {
    throw error
  }
}
