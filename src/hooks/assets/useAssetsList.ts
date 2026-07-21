// hooks/useAssetsList.ts
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { getAssetsListAPI } from '@/services/assetService'
import type { GetAssetsParams, GetAssetsResponse } from '@/types/assets'

import { useDebouncedValue } from './useDebouncedValue'

// Hook to handle debounced search

export const useAssetsList = (
  parameters: { take?: number } & Omit<GetAssetsParams, 'skip'>,
) => {
  const debouncedSearch = useDebouncedValue(parameters.search, 500)
  const take = parameters.take || 20

  const baseParameters = useMemo(
    () => ({
      categoryCode: parameters.categoryCode,
      search: debouncedSearch,
      take,
    }),
    [take, parameters.categoryCode, debouncedSearch],
  )

  return useInfiniteQuery<GetAssetsResponse>({
    getNextPageParam: (lastPage, allPages) => {
      const currentTotal = allPages.reduce(
        (sum, page) => sum + page.data.length,
        0,
      )
      if (currentTotal >= lastPage.total) {
        return undefined
      }

      return currentTotal
    },
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getAssetsListAPI({
        ...baseParameters,
        skip: pageParam as number,
      }),
    queryKey: ['assets', baseParameters],
    staleTime: 30_000,
  })
}
