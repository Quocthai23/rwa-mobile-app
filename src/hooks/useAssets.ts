/**
 * useAssets Hook
 * React Query hook for fetching trading assets
 */

import { useQuery } from '@tanstack/react-query'

import { CACHE_TIMES } from '@/constants/api'
import {
  getActiveAssets,
  getAssetCategories,
  getAssets,
  getAssetsByCategory,
} from '@/services/assetsService'
import type { Category } from '@/types'

/**
 * Fetch all assets
 */
export const useAssets = () => {
  return useQuery({
    gcTime: CACHE_TIMES.TRENDING * 2,
    queryFn: async () => {
      const result = await getAssets()

      return result
    },
    queryKey: ['assets'],
    retry: 2,
    staleTime: CACHE_TIMES.TRENDING,
  })
}

/**
 * Fetch only active assets
 */
export const useActiveAssets = () => {
  return useQuery({
    gcTime: CACHE_TIMES.TRENDING * 2,
    queryFn: async () => {
      const result = await getActiveAssets()

      return result
    },
    queryKey: ['assets', 'active'],
    retry: 2,
    staleTime: CACHE_TIMES.TRENDING,
  })
}

/**
 * Fetch assets by category
 */
export const useAssetsByCategory = (categoryId: string) => {
  return useQuery({
    enabled: !!categoryId,
    gcTime: CACHE_TIMES.TRENDING * 2,
    queryFn: () => getAssetsByCategory(categoryId),
    queryKey: ['assets', 'category', categoryId],
    staleTime: CACHE_TIMES.TRENDING,
  })
}

/**
 * Fetch asset categories
 */
export const useAssetCategories = () => {
  return useQuery<Category[]>({
    gcTime: CACHE_TIMES.TRENDING * 2,
    queryFn: () => getAssetCategories(),
    queryKey: ['asset-categories'],
    retry: 2,
    staleTime: CACHE_TIMES.TRENDING,
  })
}

/**
 * Fetch a specific asset by ID
 */
export const useAssetById = (assetId: string | undefined) => {
  const { data: assets, ...rest } = useAssets()

  return {
    ...rest,
    data: assets?.find((asset) => asset.id === assetId),
  }
}
