import React, { useCallback, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Star } from 'lucide-react-native'

import { useAssetCategories } from '@/hooks/useAssets'
import { useAssetsList } from '@/hooks/assets/useAssetsList'
import { useFavoriteAssetsStore } from '@/store/favoriteAssetsStore'
import { useTheme } from '@/theme'
import ItemSymbolConnected from './ItemSymbolConnected'
import { SymbolRowSkeleton } from '@/screens/Market/components/ItemSymbolSeketon'
import ItemSymbol from './ItemSymbol'

type TabAssetProps = {
  readonly searchText?: string
}

const TabAsset = ({ searchText = '' }: TabAssetProps) => {
  const { colors } = useTheme()
  const [activeFilterTab, setActiveFilterTab] = useState('Forex')
  const [activeCategoryCode, setActiveCategoryCode] = useState<
    string | undefined
  >(undefined)

  const { data: categories, isLoading: isCategoriesLoading } =
    useAssetCategories()

  // Set default category to Crypto on first load
  React.useEffect(() => {
    if (categories && categories.length > 0 && !activeCategoryCode) {
      const cryptoCategory = categories.find(
        (cat) => cat.code === 'CRYPTO' || cat.name.toLowerCase() === 'crypto',
      )
      if (cryptoCategory) {
        setActiveCategoryCode(cryptoCategory.code)
      }
    }
  }, [categories, activeCategoryCode])

  const favoritesByAssetId = useFavoriteAssetsStore((s) => s.favoritesByAssetId)
  const favoritesBySymbol = useFavoriteAssetsStore((s) => s.favoritesBySymbol)
  const setFavoriteByAssetId = useFavoriteAssetsStore(
    (s) => s.setFavoriteByAssetId,
  )

  // Fetch assets based on active category and search
  const parameters = useMemo(
    () => ({
      categoryCode: searchText ? undefined : activeCategoryCode,
      search: searchText,
      take: 20,
    }),
    [activeCategoryCode, searchText],
  )

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAssetsList(parameters)

  const listAssets = useMemo(() => {
    return data?.pages.flatMap((p) => p.data) ?? []
  }, [data])

  // Merge favorite state from store
  const listWithFavoriteState = useMemo(() => {
    return listAssets.map((item) => {
      const id = item.id || ''
      const byId = id ? favoritesByAssetId[id] : undefined
      const bySymbol = item.symbol ? favoritesBySymbol[item.symbol] : undefined

      return {
        ...item,
        isFavorite: (byId ?? bySymbol ?? item.isFavorite) || false,
      }
    })
  }, [listAssets, favoritesByAssetId, favoritesBySymbol])

  // Filter based on active category + active filter tab
  const filteredList = useMemo(() => {
    let filtered = listWithFavoriteState

    // 0. Filter theo searchText nếu có (filter ở client để đảm bảo chính xác)
    if (searchText && searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim()
      filtered = filtered.filter((item) => {
        const symbol = item.symbol?.toLowerCase() || ''
        const name = item.name?.toLowerCase() || ''
        return symbol.includes(searchLower) || name.includes(searchLower)
      })
    }

    // 1. Filter theo category (Crypto / Forex / Metals ...) - chỉ khi không search
    if (activeCategoryCode && !searchText) {
      filtered = filtered.filter(
        (item) => item.category?.code === activeCategoryCode,
      )
    }

    // 2. Filter thêm theo tab (risers / fallers / hot / fav)
    switch (activeFilterTab) {
      case 'risers': {
        filtered = filtered.filter((item) => {
          const ask = Number.parseFloat(item.ask || '0')
          const bid = Number.parseFloat(item.bid || '0')
          return ask > bid
        })
        break
      }
      case 'fallers': {
        filtered = filtered.filter((item) => {
          const ask = Number.parseFloat(item.ask || '0')
          const bid = Number.parseFloat(item.bid || '0')
          return ask < bid
        })
        break
      }
      case 'hot': {
        filtered = filtered.filter((item) => item.isHot)
        break
      }
      case 'fav': {
        filtered = filtered.filter((item) => item.isFavorite)
        break
      }
      default: {
        // 'all' hoặc giá trị khác -> không filter thêm
        break
      }
    }

    return filtered
  }, [listWithFavoriteState, activeFilterTab, activeCategoryCode, searchText])

  const onEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return
    fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Sync API data to store
  React.useLayoutEffect(() => {
    for (const item of listAssets) {
      const assetId = item.id || ''
      if (assetId && !(assetId in favoritesByAssetId)) {
        setFavoriteByAssetId(assetId, item.isFavorite || false)
      }
    }
  }, [listAssets, favoritesByAssetId, setFavoriteByAssetId])

  const renderItem = useCallback(
    ({ item }: { readonly item: (typeof filteredList)[0] }) => {
      return (
        <ItemSymbolConnected
          accessId={item.id || ''}
          symbol={item.symbol}
          desc={item.name}
          initialBid={item.bid ? Number.parseFloat(item.bid) : 0}
        />
      )
    },
    [],
  )

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null

    return (
      <View className='py-4'>
        <SymbolRowSkeleton />
      </View>
    )
  }, [isFetchingNextPage])

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <>
          <SymbolRowSkeleton />
          <SymbolRowSkeleton />
          <SymbolRowSkeleton />
        </>
      )
    }

    return (
      <View className='items-center justify-center py-10'>
        <Text className='text-neutral-500'>No assets found.</Text>
      </View>
    )
  }, [isLoading])

  return (
    <View className='flex-1'>
      {/* Category Tabs */}
      {!searchText && (
        <View className='px-4 border-b border-neutral-200'>
          {isCategoriesLoading ? (
            <View className='py-2'>
              <ActivityIndicator size='small' color={colors.primary500} />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}>
              {categories?.map((category) => {
                const isActive = activeCategoryCode === category.code
                return (
                  <TouchableOpacity
                    key={category.id}
                    className='px-3 py-2'
                    style={
                      isActive
                        ? {
                            borderBottomWidth: 2,
                            borderBottomColor: colors.primary500,
                          }
                        : undefined
                    }
                    onPress={() => setActiveCategoryCode(category.code)}>
                    <Text
                      className={` ${
                        isActive
                          ? 'text-primary-500 text-body-small-semibold'
                          : 'text-secondary-500 text-body-small-regular'
                      }`}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          )}
        </View>
      )}

      {/* Assets List */}
      <View className='flex-1 px-4'>
        <FlatList
          removeClippedSubviews
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          data={filteredList}
          initialNumToRender={15}
          keyExtractor={(item) => item.id || item.symbol}
          maxToRenderPerBatch={10}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          windowSize={5}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
        />
      </View>
    </View>
  )
}

export default TabAsset
