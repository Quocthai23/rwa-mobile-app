import { ChevronLeft, Funnel } from 'lucide-react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ToggleFavouriteAsset } from '@/components/atoms'
import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import ButtonCustom from '@/components/atoms/Button/ButtonCustom'
import { CustomCheckbox } from '@/components/atoms/CustomCheckbox'
import { CustomSwitch } from '@/components/atoms/CustomSwitch'
import { useAssetsList } from '@/hooks/assets/useAssetsList'
import { useSymbols } from '@/hooks/market/useSymbols'
import { Paths } from '@/navigation/paths'
import { type RootScreenProps } from '@/navigation/types'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useTheme } from '@/theme'
import Layer1Icon from '@/theme/assets/icons/Layer_1.svg'

type Props = RootScreenProps<Paths.Ranking>

type Tab = {
  id: string
  label: string
}

type RankingItem = {
  id: string
  name: string
  symbol: string
  lastPrice?: number
  change?: number
  changePercent?: number
  priceDirection: 'up' | 'down' | 'neutral'
  isFavorite: boolean
  isHot: boolean
  ask?: number
  bid?: number
}

type Category =
  | 'All'
  | 'Crypto'
  | 'Commodities'
  | 'Forex'
  | 'Share'
  | 'Indices'
  | 'ETFs'
  | 'Bonds'

const ALL_CATEGORIES: Category[] = [
  'All',
  'Crypto',
  'Commodities',
  'Forex',
  'Share',
  'Indices',
  'ETFs',
  'Bonds',
]

type FilterState = {
  onlyFavourite: boolean
  categories: Category[]
}

function Ranking({ navigation }: Props) {
  const { colors } = useTheme()
  const [activeTab, setActiveTab] = useState('risers')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Filter state
  const filterSheetRef = useRef<AppBottomSheetModalHandle>(null)
  const [filter, setFilter] = useState<FilterState>({
    onlyFavourite: false,
    categories: ALL_CATEGORIES,
  })
  const [tempFilter, setTempFilter] = useState<FilterState>(filter)

  // Fetch assets from API with pagination
  const parameters = useMemo(
    () => ({
      take: 20,
    }),
    [],
  )

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useAssetsList(parameters)

  // Flatten all pages into a single array
  const assets = useMemo(() => {
    return data?.pages.flatMap((p) => p.data) ?? []
  }, [data])

  // Subscribe to real-time data for all symbols
  const symbols = useMemo(() => assets.map((asset) => asset.symbol), [assets])
  useSymbols(symbols, symbols.length > 0)

  // Get real-time data from socket
  const rtBySymbol = useMarketSocketStore((s) => s.rtBySymbol)

  // Convert assets to ranking items with real-time data
  const rankingItems: RankingItem[] = useMemo(() => {
    if (!assets) return []
    return assets.map((asset) => {
      console.log('🚀 ~ Ranking ~ asset:', asset)
      const rt = rtBySymbol?.[asset.symbol]
      const changePercent = rt?.changePercent ?? 0
      const priceDirection =
        changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'neutral'

      return {
        id: asset.id,
        name: asset.name || asset.symbol,
        symbol: asset.symbol,
        lastPrice: rt?.lastPrice,
        change: rt?.change,
        changePercent: rt?.changePercent,
        priceDirection,
        isFavorite: favorites.has(asset.id),
        isHot: asset.isHot ?? false,
        ask: rt?.ask,
        bid: rt?.bid,
      }
    })
  }, [assets, favorites, rtBySymbol])

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId)
      } else {
        newFavorites.add(itemId)
      }
      return newFavorites
    })
  }

  // Handle load more
  const onEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return
    fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const tabs: Tab[] = [
    { id: 'risers', label: 'Risers' },
    { id: 'fallers', label: 'Fallers' },
    { id: 'hot', label: 'Hot' },
  ]

  const filteredItems = useMemo(() => {
    return rankingItems.filter((item) => {
      // Filter by tab
      if (activeTab === 'risers' && item.priceDirection !== 'up') return false
      if (activeTab === 'fallers' && item.priceDirection !== 'down')
        return false
      if (activeTab === 'hot' && !item.isHot) return false

      // Filter by favourite
      if (filter.onlyFavourite && !item.isFavorite) return false

      // Filter by category
      // Note: You may need to add category field to your assets
      // If no categories selected, show nothing
      if (filter.categories.length === 0) return false

      // If 'All' is selected, show all items
      if (!filter.categories.includes('All')) {
        // Add your category filtering logic here
        // For example: if (!filter.categories.includes(item.category)) return false
      }

      return true
    })
  }, [rankingItems, activeTab, filter])

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const aPercent = a.changePercent ?? 0
      const bPercent = b.changePercent ?? 0
      if (activeTab === 'risers') {
        return bPercent - aPercent // Highest first
      }
      if (activeTab === 'fallers') {
        return aPercent - bPercent // Lowest first
      }
      return 0
    })
  }, [filteredItems, activeTab])

  const renderItem = useCallback(
    ({ item }: { item: RankingItem }) => {
      const displayPrice = item.lastPrice ?? item.ask ?? 0
      const displayChange = item.changePercent ?? 0
      const priceColor =
        item.priceDirection === 'up'
          ? colors.success500
          : item.priceDirection === 'down'
            ? colors.error500
            : colors.neutral900

      return (
        <TouchableOpacity className='flex-row items-center justify-between py-4 border-b border-neutral-100'>
          <View className='flex-1 flex-row items-center gap-2'>
            <View className='flex-1'>
              <View className='flex-row items-center gap-2'>
                <Text className='text-body-large-semibold text-neutral-900'>
                  {item.symbol?.slice(0, 3)}/{item.symbol?.slice(3)}
                </Text>
                <ToggleFavouriteAsset assetId={item.id} />
              </View>
              <Text className='text-body-small-regular text-secondary-500'>
                {item.symbol}
              </Text>
            </View>
          </View>

          <View className='items-end'>
            <View className='flex-row items-center gap-3'>
              <View className='w-24'>
                <Text
                  className='text-body-large-medium'
                  style={{ color: priceColor }}>
                  {displayPrice > 0 ? displayPrice.toFixed(3) : '-'}
                </Text>
              </View>

              <View className='w-24'>
                <Text
                  className='text-body-large-medium'
                  style={{ color: priceColor }}>
                  {displayChange !== 0
                    ? `${displayChange > 0 ? '+' : ''}${displayChange.toFixed(2)}%`
                    : '-'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )
    },
    [colors, toggleFavorite],
  )

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* Header */}
      <View className='h-[60px] px-4 flex-row items-center justify-between'>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}>
          <ChevronLeft color={colors.neutral900} size={24} />
        </TouchableOpacity>

        <Text className='text-h3-semibold text-neutral-900 text-center flex-1'>
          Daily Ranking
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView className='flex-1'>
        {/* Hot Banner */}
        <View className='px-4 py-4 bg-white'>
          <View className='flex-row items-center justify-between gap-6'>
            <View className='flex-1'>
              <Text className='text-h1-semibold text-neutral-900 mb-2'>
                Hot
              </Text>
              <Text className='text-body-small-regular text-secondary-500'>
                Discover crypto with the most traders in the last 24h
              </Text>
            </View>
            <View>
              <Layer1Icon width={150} height={150} />
            </View>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView
          className='py-4'
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ width: '100%', paddingHorizontal: 16 }}>
          <View className='flex-row justify-between gap-6 border-b flex-1 border-neutral-200'>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                className='items-center w-[50%]'
                onPress={() => {
                  setActiveTab(tab.id)
                }}
                style={{
                  flex: 1,
                  borderBottomColor:
                    activeTab === tab.id ? colors.primary500 : 'transparent',
                  borderBottomWidth: 2,
                }}>
                <Text
                  className={`text-body-large-regular ${activeTab === tab.id ? 'font-semibold' : 'font-normal'}`}
                  style={{
                    color:
                      activeTab === tab.id
                        ? colors.primary500
                        : colors.neutral600,
                  }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Sort and Filter */}
        <View className='px-4 flex-row items-center gap-3'>
          <TouchableOpacity
            className='flex-row items-center gap-2 px-3 py-2 rounded-sm bg-neutral-100'
            onPress={() => {
              setTempFilter(filter)
              filterSheetRef.current?.open()
            }}>
            <Funnel color={colors.neutral700} size={16} />
            <Text className='text-button-small-medium text-neutral-900'>
              Filter
            </Text>
          </TouchableOpacity>
        </View>

        {/* Header Row */}
        <View className='px-4 pt-4 flex-row justify-between'>
          <Text className='text-body-small-regular text-secondary-500'>
            Name
          </Text>
          <View className='items-end'>
            <View className='flex-row items-center gap-3'>
              <View className='w-24'>
                <Text className='text-body-small-regular text-secondary-500'>
                  Last Price
                </Text>
              </View>
              <View className='w-24'>
                <Text className='text-body-small-regular text-secondary-500'>
                  Change
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* List */}
        <View className='px-4'>
          {isLoading ? (
            <View className='py-12 items-center justify-center'>
              <ActivityIndicator color={colors.primary500} size='large' />
              <Text className='text-sm text-neutral-500 mt-4'>Loading...</Text>
            </View>
          ) : error ? (
            <View className='py-12 items-center justify-center'>
              <Text className='text-base font-semibold text-error-500'>
                Failed to load data
              </Text>
              <Text className='text-sm text-neutral-500 mt-2'>
                {error.message}
              </Text>
            </View>
          ) : sortedItems.length > 0 ? (
            <FlatList
              data={sortedItems}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              scrollEnabled={false}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isFetchingNextPage ? (
                  <View className='py-4 items-center'>
                    <ActivityIndicator color={colors.primary500} />
                  </View>
                ) : null
              }
            />
          ) : (
            <View className='py-12 items-center justify-center'>
              <Text className='text-base text-neutral-400'>
                {activeTab === 'fav'
                  ? 'No favorites yet'
                  : `No ${activeTab} items at the moment`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filter Bottom Sheet */}
      <AppBottomSheetModal
        ref={filterSheetRef}
        snapPoints={['100%']}
        enablePanDownToClose>
        <View className='flex-1'>
          {/* Header */}
          <Text className='text-h3-semibold text-neutral-900 my-4  px-3'>
            Filter
          </Text>

          <View className=' w-full py-4 border-t border-neutral-200'>
            <View className='flex-row items-center justify-between  px-4'>
              <Text className='text-button-large-semibold text-neutral-900'>
                Only Favourite
              </Text>
              <CustomSwitch
                value={tempFilter.onlyFavourite}
                onValueChange={(value) => {
                  setTempFilter((prev) => ({ ...prev, onlyFavourite: value }))
                }}
                activeColor={colors.primary500}
                inactiveColor={colors.neutral300}
                thumbColor={colors.neutral0}
                width={35}
                height={20}
              />
            </View>

            {/* Categories */}
            <View className='pt-6 pb-4 px-4'>
              <Text className='text-button-large-semibold text-neutral-900'>
                Categories
              </Text>
              <ScrollView
                className='flex-1'
                showsVerticalScrollIndicator={false}>
                {ALL_CATEGORIES.map((category) => {
                  const isAll = category === 'All'
                  const isSelected = isAll
                    ? tempFilter.categories.length === ALL_CATEGORIES.length
                    : tempFilter.categories.includes(category)

                  return (
                    <View key={category} className='flex-row items-center py-3'>
                      <View className='mr-3'>
                        <CustomCheckbox
                          value={isSelected}
                          onValueChange={() => {
                            setTempFilter((prev) => {
                              if (isAll) {
                                // If clicking 'All'
                                if (
                                  prev.categories.length ===
                                  ALL_CATEGORIES.length
                                ) {
                                  // If all selected, deselect all
                                  return { ...prev, categories: [] }
                                } else {
                                  // If not all selected, select all
                                  return { ...prev, categories: ALL_CATEGORIES }
                                }
                              }

                              let newCategories = [...prev.categories]

                              if (isSelected) {
                                // Deselect this category
                                newCategories = newCategories.filter(
                                  (c) => c !== category,
                                )
                              } else {
                                // Select this category
                                newCategories.push(category)

                                // Check if all non-All categories are now selected
                                const nonAllCategories = ALL_CATEGORIES.filter(
                                  (c) => c !== 'All',
                                )
                                const allNonAllSelected =
                                  nonAllCategories.every((c) =>
                                    newCategories.includes(c),
                                  )

                                // If all non-All categories are selected, add 'All' too
                                if (
                                  allNonAllSelected &&
                                  !newCategories.includes('All')
                                ) {
                                  newCategories.push('All')
                                }
                              }

                              return { ...prev, categories: newCategories }
                            })
                          }}
                          activeColor={colors.primary500}
                          inactiveColor={colors.neutral300}
                          size={20}
                        />
                      </View>
                      <Text className='text-body-large-medium text-neutral-900'>
                        {category}
                      </Text>
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          </View>

          {/* Action Buttons */}
          <View className='flex-row gap-3 pb-10 px-4'>
            <ButtonCustom
              type='CANCEL'
              onPress={() => {
                filterSheetRef.current?.close()
              }}
            />
            <ButtonCustom
              type='APPLY'
              onPress={() => {
                setFilter(tempFilter)
                filterSheetRef.current?.close()
              }}
            />
          </View>
        </View>
      </AppBottomSheetModal>
    </SafeAreaView>
  )
}

export default Ranking
