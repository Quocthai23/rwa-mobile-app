import {
  type ToggleFavoriteAssetPayload,
  type ToggleFavoriteAssetResponse,
} from '@/types/users'

import { apiRequest } from './axiosClient'

export const toggleFavoriteAssetAPI = (payload: ToggleFavoriteAssetPayload) => {
  return apiRequest<ToggleFavoriteAssetResponse>({
    data: payload,
    method: 'post',
    url: '/user/favorites/assets',
  })
}
