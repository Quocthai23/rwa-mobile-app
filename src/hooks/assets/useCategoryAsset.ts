import { useQuery } from '@tanstack/react-query'

import { getAssetsListAPI } from '@/services/assetService'
import type { GetAssetsResponse } from '@/types/assets'

export const useCategoryAsset = (categoryCode: string) => {
  return useQuery<GetAssetsResponse>({
    queryFn: () =>
      getAssetsListAPI({
        categoryCode,
        search: '',
        skip: 0,
        take: 100,
      }),
    queryKey: ['category-assets', categoryCode],
    staleTime: 30_000,
  })
}
