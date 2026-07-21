/**
 * Assets Service
 * Handles fetching trading assets from Mirroto API
 */

import ky from 'ky'

import { ASSETS_ENDPOINTS, MIRROTO_API_BASE_URL } from '@/constants/api'
import type {
  Asset,
  AssetsResponse,
  CategoriesResponse,
  Category,
} from '@/types'

/**
 * Fetch all asset categories
 * This endpoint does not require authentication
 */
export const getAssetCategories = async (): Promise<Category[]> => {
  try {
    const response = await ky
      .get(`${MIRROTO_API_BASE_URL}${ASSETS_ENDPOINTS.CATEGORIES}`)
      .json<CategoriesResponse>()

    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Fetch all available trading assets
 * This endpoint does not require authentication
 * Note: This API returns data directly without the standard ApiResponse wrapper
 */
export const getAssets = async (): Promise<Asset[]> => {
  try {
    const response = await ky
      .get(`${MIRROTO_API_BASE_URL}${ASSETS_ENDPOINTS.LIST}`)
      .json<AssetsResponse>()

    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Fetch a specific asset by symbol
 */
export const getAssetBySymbol = async (
  symbol: string,
): Promise<Asset | undefined> => {
  const assets = await getAssets()

  return assets.find((asset) => asset.symbol === symbol)
}

/**
 * Fetch assets by category
 */
export const getAssetsByCategory = async (
  categoryId: string,
): Promise<Asset[]> => {
  const assets = await getAssets()

  return assets.filter((asset) => asset.categoryId === categoryId)
}

/**
 * Fetch only active assets
 */
export const getActiveAssets = async (): Promise<Asset[]> => {
  const assets = await getAssets()

  return assets.filter((asset) => asset.isActive)
}
