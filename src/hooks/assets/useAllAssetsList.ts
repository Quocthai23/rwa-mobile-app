import { useQuery } from '@tanstack/react-query'

import { getAssetsListAPI } from '@/services/assetService'
import type { GetAssetsResponse } from '@/types/assets'

export const useAllAssetsList = () => {
  return useQuery<GetAssetsResponse>({
    queryFn: () =>
      getAssetsListAPI({
        skip: 0,
        take: 100,
      }),
    queryKey: ['all-assets'],
    staleTime: 30_000,
  })
}
