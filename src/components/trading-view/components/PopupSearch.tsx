import { SearchIcon, X } from 'lucide-react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { useAssetsList } from '@/hooks/assets/useAssetsList'
import { useFavoriteAssetsStore } from '@/store/favoriteAssetsStore'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useTransactionStore } from '@/store/transactionStore'
import { useTheme } from '@/theme'

import ItemSymbolSearchRow from './ItemSymbolSearchRow'

const tabs = [
  { id: 'risers', label: 'Risers' },
  { id: 'fallers', label: 'Fallers' },
  { id: 'hot', label: 'Fav' },
]

const PopupSearch = ({ onClose }: { onClose?: () => void }) => {
  const { colors } = useTheme()
  const { height: screenHeight } = useWindowDimensions()
  // const setSymbolTrade = useTransactionStore((s) => s.setSymbolTrade)
  const setSymbolStore = useTransactionStore((s) => s.setSymbolStore)
  const [searchText, setSearchText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputReference = useRef<TextInput>(null)
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  useEffect(() => {
    const timer = setTimeout(() => {
      inputReference.current?.focus()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAssetsList({ take: 50 })

  const rtBySymbol = useMarketSocketStore(useShallow((s) => s.rtBySymbol))
  const favoritesByAssetId = useFavoriteAssetsStore((s) => s.favoritesByAssetId)
  const favoritesBySymbol = useFavoriteAssetsStore((s) => s.favoritesBySymbol)

  const allAssets = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  )

  // Merge real-time favorite state from store (same pattern as TabAsset)
  const allAssetsWithFavorite = useMemo(() => {
    return allAssets.map((item) => {
      const byId = item.id ? favoritesByAssetId[item.id] : undefined
      const bySymbol = item.symbol ? favoritesBySymbol[item.symbol] : undefined

      return {
        ...item,
        isFavorite: (byId ?? bySymbol ?? item.isFavorite) || false,
      }
    })
  }, [allAssets, favoritesByAssetId, favoritesBySymbol])

  const displayedAssets = useMemo(() => {
    const getPC = (symbol: string) => rtBySymbol[symbol]?.changePercent ?? 0

    // When searching, just filter by symbol/desc and skip tab logic
    if (searchText.trim()) {
      const lower = searchText.toLowerCase().trim()

      return allAssetsWithFavorite.filter(
        (a) =>
          a.symbol?.toLowerCase().includes(lower) ||
          a.name?.toLowerCase().includes(lower),
      )
    }

    if (activeTab === 'risers') {
      return [...allAssetsWithFavorite]
        .filter((a) => getPC(a.symbol) > 0)
        .sort((a, b) => getPC(b.symbol) - getPC(a.symbol))
    }

    if (activeTab === 'fallers') {
      return [...allAssetsWithFavorite]
        .filter((a) => getPC(a.symbol) < 0)
        .sort((a, b) => getPC(a.symbol) - getPC(b.symbol))
    }

    // Fav
    return allAssetsWithFavorite.filter((a) => a.isFavorite === true)
  }, [allAssetsWithFavorite, activeTab, rtBySymbol, searchText])

  const renderItem = useCallback(
    ({ item }: { item: (typeof displayedAssets)[0] }) => (
      <ItemSymbolSearchRow
        accessId={item.id}
        desc={item.name}
        digit={item.digit}
        initialBid={parseFloat(item.bid)}
        isFavorite={item.isFavorite}
        symbol={item.symbol}
        onPress={() => {
          setSymbolStore(item.symbol, item.name)
          onClose?.()
        }}
      />
    ),
    [displayedAssets, setSymbolStore, onClose],
  )

  return (
    <View
      className='px-4 pt-4'
      style={{ maxHeight: screenHeight * 0.82, flex: 1 }}>
      {/* Search Header */}
      <View className='flex-row items-center gap-3'>
        <View
          className={`flex-1 h-[46px] p-[3px] rounded-lg overflow-hidden ${isFocused ? 'bg-primary-100' : ''}`}>
          <TouchableOpacity
            activeOpacity={1}
            className='flex-1 flex-row items-center bg-neutral-100 rounded-md px-3 h-[40px]'
            style={{
              borderWidth: 1,
              borderColor: isFocused ? colors.primary500 : colors.neutral200,
              shadowColor: isFocused ? colors.primary500 : 'transparent',
              padding: isFocused ? 3 : 0,
              backgroundColor: colors.neutral0,
            }}
            onPress={() => inputReference.current?.focus()}>
            <SearchIcon color={colors.neutral500} size={20} />
            <TextInput
              ref={inputReference}
              autoFocus
              className='text-body-large-medium'
              placeholder='Search'
              placeholderTextColor={colors.neutral500}
              returnKeyType='search'
              style={{
                color: colors.neutral900,
                flex: 1,
                marginLeft: 8,
                height: 44,
                fontSize: 15,
                fontWeight: '500',
                lineHeight: 18,
              }}
              value={searchText}
              onBlur={() => setIsFocused(false)}
              onChangeText={setSearchText}
              onFocus={() => setIsFocused(true)}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <X color={colors.neutral500} size={20} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      {!searchText && (
        <ScrollView
          horizontal
          className='py-4'
          contentContainerStyle={{ width: '100%' }}
          showsHorizontalScrollIndicator={false}>
          <View className='flex-row justify-between gap-6 border-b h-[36px] flex-1 border-neutral-200'>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                className='items-center h-full justify-center'
                style={{
                  flex: 1,
                  borderBottomColor:
                    activeTab === tab.id ? colors.primary500 : 'transparent',
                  borderBottomWidth: 2,
                }}
                onPress={() => setActiveTab(tab.id)}>
                <Text
                  className='text-body-large-regular'
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
      )}

      {/* Column headers */}
      <View className='flex-row items-center justify-between mt-3'>
        <Text className='text-body-small-regular text-neutral-500'>Name</Text>
        <View className='flex-row items-center gap-3'>
          <Text className='text-body-small-regular text-neutral-500 w-[100px] text-center'>
            Last Price
          </Text>
          <Text className='text-body-small-regular text-neutral-500 w-[100px] text-center'>
            Change
          </Text>
        </View>
      </View>

      {/* List */}
      {isLoading ? (
        <ActivityIndicator className='mt-8' color={colors.primary500} />
      ) : (
        <FlatList
          ListEmptyComponent={
            <Text className='text-body-large-regular text-neutral-500 text-center mt-8'>
              No results
            </Text>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator color={colors.primary500} />
            ) : null
          }
          data={displayedAssets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage()
          }}
          onEndReachedThreshold={0.3}
        />
      )}
    </View>
  )
}

export default PopupSearch
