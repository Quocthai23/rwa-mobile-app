import React, { useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'

import { useTrendingData } from '@/hooks/market/useTrendingMarket'
import type { TrendingMarketItem } from '@/services/marketService'
import { useTheme } from '@/theme'

import TopRiserItem from './TopRiserItem'

type TabType = 'risers' | 'fallers'

const TopRisersFallers = () => {
  const { colors } = useTheme()
  const [activeTab, setActiveTab] = useState<TabType>('risers')

  // Fetch trending data with auto-refresh every 5s
  const { data, isLoading } = useTrendingData()

  // Get top risers and fallers from API response
  const topRisers = data?.topMovers?.topRisers ?? []
  const topFallers = data?.topMovers?.topFallers ?? []

  const currentList = activeTab === 'risers' ? topRisers : topFallers

  if (isLoading) {
    return (
      <View className='mt-3 px-4 py-12 items-center'>
        <ActivityIndicator color={colors.primary500} size='large' />
      </View>
    )
  }

  return (
    <View className='mt-3'>
      {/* Tab Header */}
      <View className='flex-row px-4 py-3 gap-3'>
        <Pressable onPress={() => setActiveTab('risers')}>
          <Text
            className={
              activeTab === 'risers'
                ? 'text-h3-semibold text-neutral-900'
                : 'text-h3-regular text-neutral-600'
            }>
            Top Risers
          </Text>
        </Pressable>

        <Pressable onPress={() => setActiveTab('fallers')}>
          <Text
            className={
              activeTab === 'fallers'
                ? 'text-h3-semibold text-neutral-900'
                : 'text-h3-regular text-neutral-600'
            }>
            Top Fallers
          </Text>
        </Pressable>
      </View>

      {/* List of Items */}
      <View className='px-4'>
        {currentList.length > 0 ? (
          currentList.map((item: TrendingMarketItem, index: number) => (
            <TopRiserItem
              key={item.id}
              assetId={item.id}
              rank={index + 1}
              symbol={item.symbol}
              symbolCode={item.symbol}
              symbolName={item.symbol}
              timeframe={60}
            />
          ))
        ) : (
          <View className='py-8 items-center'>
            <Text className='text-body-large-regular text-neutral-400'>
              No {activeTab} available
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default TopRisersFallers
