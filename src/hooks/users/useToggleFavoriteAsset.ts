import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type ApiError } from '@/services/ApiClient'
import { toggleFavoriteAssetAPI } from '@/services/userService'
import { useFavoriteAssetsStore } from '@/store/favoriteAssetsStore'
import type {
  ToggleFavoriteAssetPayload,
  ToggleFavoriteAssetResponse,
} from '@/types/users'

import { useToast } from '../useToast'

export const useToggleFavoriteAsset = () => {
  const queryClient = useQueryClient()
  const { showError } = useToast()
  const setFavoriteByAssetId = useFavoriteAssetsStore(
    (s) => s.setFavoriteByAssetId,
  )

  return useMutation<
    ToggleFavoriteAssetResponse,
    ApiError,
    ToggleFavoriteAssetPayload
  >({
    mutationFn: toggleFavoriteAssetAPI,
    onError: (error) => {
      console.error('Error toggling favorite asset:', error)
      showError('Failed to toggle favorite status', error.code)
    },
    onSuccess: (data, variables) => {
      // Update Zustand store
      setFavoriteByAssetId(variables.assetId, data.isFavorite)
      // Invalidate assets list to refresh favorite status
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      // showSuccess('Success', 'Favorite status toggled successfully');
    },
  })
}
