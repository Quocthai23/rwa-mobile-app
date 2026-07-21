import { ArrowDown, ArrowUp, Check } from 'lucide-react-native'
import React, { memo, useCallback, useMemo, useRef } from 'react'
import { FlatList, Pressable, Text, TouchableOpacity, View } from 'react-native'

import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import ButtonCustom from '@/components/atoms/Button/ButtonCustom'
import FilterIcon from '@/components/icons/FilterIcon'
import LayoutIcon from '@/components/icons/LayoutIcon'
import SortIcon from '@/components/icons/SortIcon'
import SortIcon2 from '@/components/icons/SortIcon2'
import { useAssetsList } from '@/hooks/assets/useAssetsList'
import { useFavoriteAssetsStore } from '@/store/favoriteAssetsStore'
import { useTheme } from '@/theme'
import {
  filterCategoryOptions,
  filterCategoryStatus,
  sortByOptions,
} from '../../constant/options'
import { useRealtimeSortedListByRT } from '../../hooks/useRealtimeSortedListByRT'
import ItemSymbolChartViewConnected from '../ItemSymbolChartViewConnected'
import ItemSymbolConnected from '../ItemSymbolConnected'
import { SymbolRowSkeleton } from '../ItemSymbolSeketon'
import LayoutSymbolView from '../LayoutSymbolView'

type AssetListTabProps = {
  readonly categoryCode?: string
  readonly defaultSearch?: string
  readonly favoriteOnly?: boolean
  readonly isHotOnly?: boolean
}

function AssetListTab({
  categoryCode,
  defaultSearch = '',
  favoriteOnly = false,
  isHotOnly = false,
}: AssetListTabProps) {
  const { colors } = useTheme()

  const setFavoriteByAssetId = useFavoriteAssetsStore(
    (s) => s.setFavoriteByAssetId,
  )
  const favoritesByAssetId = useFavoriteAssetsStore((s) => s.favoritesByAssetId)
  const favoritesBySymbol = useFavoriteAssetsStore((s) => s.favoritesBySymbol)
  const optionsReference = useRef<AppBottomSheetModalHandle>(null)
  const filterReference = useRef<AppBottomSheetModalHandle>(null)
  const layoutReference = useRef<AppBottomSheetModalHandle>(null)

  const [openSortBy, setOpenSortBy] = React.useState(sortByOptions[0])
  const [categoryFilter, setCategoryFilter] = React.useState(
    filterCategoryOptions[0],
  )

  const [categoryStatus, setCategoryStatus] = React.useState(
    filterCategoryStatus[0],
  )

  const [viewType, setViewType] = React.useState<'spread' | 'chart'>('spread')

  const parameters = useMemo(
    () => ({
      categoryCode,
      search: defaultSearch,
      take: 20,
    }),
    [categoryCode, defaultSearch],
  )

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAssetsList(parameters)

  const listPopular = useMemo(() => {
    return data?.pages.flatMap((p) => p.data) ?? []
  }, [data])

  // Merge favorite state from store into API list (so Favourite tab + icons reflect user toggles)
  const listWithFavoriteState = useMemo(() => {
    return listPopular.map((item) => {
      const id = item.id || ''
      const byId = id ? favoritesByAssetId[id] : undefined
      const bySymbol = item.symbol ? favoritesBySymbol[item.symbol] : undefined

      return {
        ...item,
        isFavorite: (byId ?? bySymbol ?? item.isFavorite) || false,
      }
    })
  }, [listPopular, favoritesByAssetId, favoritesBySymbol])

  const onEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return
    fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Sync API data to store for other components to use
  React.useLayoutEffect(() => {
    for (const item of listPopular) {
      const assetId = item.id || ''
      // Only update if not already set by user interaction
      if (assetId && !(assetId in favoritesByAssetId)) {
        setFavoriteByAssetId(assetId, item.isFavorite || false)
      }
    }
  }, [listPopular, favoritesByAssetId, setFavoriteByAssetId])

  const { sortedList } = useRealtimeSortedListByRT({
    list: listWithFavoriteState,
    categoryCode,
    openSortBy,
    favoriteOnly,
    isHotOnly,
  })

  const renderHeader = React.useCallback(
    () => (
      <>
        <View className='flex-row items-center gap-3'>
          <TouchableOpacity
            className='bg-neutral-100 rounded-md h-[36px] px-3 flex-row items-center gap-2'
            onPress={() => optionsReference.current?.open()}>
            {openSortBy.id === 'default' ? (
              <SortIcon size={20} color={colors.neutral700} />
            ) : openSortBy.id.includes('high_to_low') ? (
              <ArrowDown color={colors.primary500} size={20} />
            ) : (
              <ArrowUp color={colors.primary500} size={20} />
            )}
            <Text
              style={{
                color:
                  openSortBy.id === 'default'
                    ? colors.neutral900
                    : colors.primary500,
              }}>
              Sort by: {openSortBy.name}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='bg-neutral-100 rounded-md h-[36px] px-3 flex-row items-center gap-2'
            onPress={() => filterReference.current?.open()}>
            <FilterIcon
              size={20}
              strokeColor={colors.neutral700}
              color={colors.neutral0}
            />
            <Text>Filter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className='ml-auto'
            onPress={() => layoutReference.current?.open()}>
            <LayoutIcon size={20} strokeColor={colors.neutral700} />
          </TouchableOpacity>
        </View>

        {/* content */}
        <View className='mt-4'>
          <View className='flex-row items-center pb-2'>
            <TouchableOpacity
              className='w-[40%] flex-row items-center gap-1'
              onPress={() => {
                // Cycle through 3 states: default -> high_to_low -> low_to_high -> default
                switch (openSortBy.id) {
                  case 'default': {
                    setOpenSortBy(sortByOptions[1]) // percentChange_high_to_low

                    break
                  }
                  case 'percentChange_hight_to_low': {
                    setOpenSortBy(sortByOptions[2]) // percentChange_low_to_high

                    break
                  }
                  case 'percentChange_low_to_high': {
                    setOpenSortBy(sortByOptions[0]) // default

                    break
                  }
                  default: {
                    setOpenSortBy(sortByOptions[1])
                  }
                }
              }}>
              <Text
                className={`text-body-small-regular ${
                  openSortBy.id.startsWith('percentChange')
                    ? 'text-blue-600'
                    : 'text-neutral-500'
                }`}>
                Market / % Change
              </Text>
              {openSortBy.id === 'percentChange_hight_to_low' ? (
                <ArrowDown color={colors.primary500} size={20} />
              ) : openSortBy.id === 'percentChange_low_to_high' ? (
                <ArrowUp color={colors.primary500} size={20} />
              ) : (
                <SortIcon2 color={colors.neutral500} size={20} />
              )}
            </TouchableOpacity>

            <View className='flex-1 flex-row'>
              <View className='w-1/2 items-center'>
                <Text className='text-body-small-regular text-neutral-500'>
                  Short
                </Text>
              </View>
              <View className='w-1/2 items-center'>
                <Text className='text-body-small-regular text-neutral-500'>
                  Long
                </Text>
              </View>
            </View>
          </View>
        </View>
      </>
    ),
    [openSortBy],
  )

  // ✅ CRITICAL FIX: Use connected components that subscribe individually
  // Each item subscribes to its own symbol → only that item re-renders on update!
  const renderItem = React.useCallback(
    ({ item }: { readonly item: (typeof sortedList)[0] }) => {
      const commonProps = {
        accessId: item.id || '',
        symbol: item.symbol,
        desc: item.name,
        isFavorite: item.isFavorite,
        digit: item.digit,
        // Pass initial values from API (convert string to number)
        initialAsk: Number.parseFloat(item.ask || '0'),
        initialBid: Number.parseFloat(item.bid || '0'),
      }

      if (viewType === 'spread') {
        return <ItemSymbolConnected {...commonProps} />
      }

      return <ItemSymbolChartViewConnected {...commonProps} />
    },
    [viewType],
  )

  const renderFooter = React.useCallback(() => {
    if (!isFetchingNextPage) return null

    return (
      <View className='py-4'>
        <SymbolRowSkeleton />
      </View>
    )
  }, [isFetchingNextPage])

  const renderEmpty = React.useCallback(() => {
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
      <View className='items-center justify-center mt-10'>
        <Text className='text-neutral-500'>No data available.</Text>
      </View>
    )
  }, [isLoading])
  return (
    <View className='flex-1'>
      <FlatList
        removeClippedSubviews
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        data={sortedList}
        initialNumToRender={15}
        keyExtractor={(item) => item.id || item.symbol}
        maxToRenderPerBatch={10}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />

      {/* modal */}

      {/* sort */}
      <AppBottomSheetModal ref={optionsReference} animationDuration={250}>
        <View className='pt-2'>
          <Text className='text-h3-semibold pb-4 px-4 border-b border-neutral-200'>
            Sort By
          </Text>

          <View className='-mx-2 mt-4 pb-4 px-4'>
            {sortByOptions.map((tab) => (
              <Pressable
                key={tab.id}
                className='w-full px-2 mb-3'
                onPress={() => {
                  setOpenSortBy(tab)
                  optionsReference.current?.close()
                }}>
                <View
                  className={`p-2 flex-row items-center justify-between rounded-xl `}>
                  <Text
                    className={`text-center font-medium ${
                      openSortBy.id === tab.id
                        ? 'text-primary-500'
                        : 'text-neutral-900'
                    }`}>
                    {tab.label}
                  </Text>
                  {openSortBy.id === tab.id && (
                    <Check color={colors.primary500} size={18} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </AppBottomSheetModal>

      {/* filter */}
      <AppBottomSheetModal ref={filterReference} animationDuration={250}>
        <View className='pt-2 pb-10'>
          <Text className='text-h3-semibold pb-4 px-4 border-b border-neutral-200'>
            Filter
          </Text>

          {/* Add filter options here */}
          <View className='mt-5 px-4'>
            <Text className='text-body-semibold font-semibold mb-1'>
              Categories
            </Text>
            <View className='flex-row flex-wrap'>
              {filterCategoryOptions.map((category, index) => {
                const isSelected = categoryFilter.id === category.id

                return (
                  <TouchableOpacity
                    key={category.id}
                    className={`w-1/2 py-2 ${index % 2 === 0 ? 'pr-2' : 'pl-2'}`}
                    onPress={() => {
                      setCategoryFilter(category)
                    }}>
                    <View
                      className={`flex-row h-[40px] gap-2 items-center justify-center rounded-[4px] ${isSelected ? ' bg-primary-500' : ' bg-neutral-100'}`}>
                      <Text
                        className={`${isSelected ? 'text-neutral-0' : 'text-neutral-500'} text-body-regular`}>
                        {category.option}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
          <View className='mt-3 px-4'>
            <Text className='text-body-semibold font-semibold mb-1'>
              Status
            </Text>
            <View className='flex-row flex-wrap'>
              {filterCategoryStatus.map((category, index) => {
                const isSelected = categoryStatus.id === category.id

                return (
                  <TouchableOpacity
                    key={category.id}
                    className={`w-1/2 py-2 ${index % 2 === 0 ? 'pr-2' : 'pl-2'}`}
                    onPress={() => {
                      setCategoryStatus(category)
                    }}>
                    <View
                      className={`flex-row h-[40px] gap-2 items-center justify-center rounded-[4px] ${isSelected ? ' bg-primary-500' : ' bg-neutral-100'}`}>
                      <Text
                        className={`${isSelected ? 'text-neutral-0' : 'text-neutral-500'} text-body-regular`}>
                        {category.option}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          <View className='flex-row gap-4 mt-2 p-4'>
            <ButtonCustom
              style={{ borderRadius: 4 }}
              textStyle={{ color: colors.neutral900 }}
              type='CANCEL'
              onPress={() => filterReference.current?.close()}
            />
            <ButtonCustom
              style={{ borderRadius: 4 }}
              type='APPLY'
              onPress={() => filterReference.current?.close()}
            />
          </View>
        </View>
      </AppBottomSheetModal>

      {/* layout */}
      <AppBottomSheetModal ref={layoutReference} animationDuration={250}>
        <LayoutSymbolView
          selectedView={viewType}
          onSelect={(type) => {
            setViewType(type)
            layoutReference.current?.close()
          }}
        />
      </AppBottomSheetModal>
    </View>
  )
}

export default memo(AssetListTab)
