import { type GetAssetsParams, type GetAssetsResponse } from '@/types/assets'

import { apiRequest } from './axiosClient'
import { apiClient } from './ApiClient'
import { ASSETS_ENDPOINTS } from '@/constants/api'

function normalizeAssetsParameters(parameters: GetAssetsParams) {
  const { skip = 0, take = 20, ...rest } = parameters

  return {
    skip,
    take,
    ...rest,
  }
}

export const getAssetsListAPI = async (
  parameters: GetAssetsParams,
): Promise<GetAssetsResponse> => {
  const normalized = normalizeAssetsParameters(parameters)

  const data = await apiClient.get<GetAssetsResponse>(
    ASSETS_ENDPOINTS.LIST,
    normalized,
    {
      skipAuth: true,
    },
    true,
  )

  return data
}
