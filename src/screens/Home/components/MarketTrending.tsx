import { ChevronRight } from 'lucide-react-native'
import React from 'react'
import { Dimensions, Text, View } from 'react-native'

import { useAppNavigation, useTrendingMarket } from '@/hooks'
import { Paths } from '@/navigation/paths'
import { useTheme } from '@/theme'

import TrendingCard from './TrendingCard'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = (SCREEN_WIDTH - 40) / 2

// Icon mapping for different symbols
const SYMBOL_ICONS: Record<string, any> = {
  BTCUSD: require('@/assets/images/market-trending/bitcoin.png'),
  ETHUSD: require('@/assets/images/market-trending/ethereum.png'),
  XAGUSD: require('@/assets/images/market-trending/silver.png'),
  XAUUSD: require('@/assets/images/market-trending/gold.png'),
}

// Symbol name mapping
const SYMBOL_NAMES: Record<string, string> = {
  BTCUSD: 'Bitcoin',
  ETHUSD: 'Ethereum',
  XAGUSD: 'Silver',
  XAUUSD: 'Gold',
}

const TrendingCardSkeleton = () => {
  const { colors } = useTheme()

  return (
    <View
      className='rounded'
      style={{
        backgroundColor: colors.neutral50,
        gap: 8,
        padding: 12,
        width: CARD_WIDTH,
      }}>
      {/* Header skeleton */}
      <View className='flex-row items-center justify-between w-full'>
        <View
          className='h-4 rounded'
          style={{ backgroundColor: colors.neutral200, width: '50%' }}
        />
        <View
          className='rounded-full'
          style={{
            backgroundColor: colors.neutral200,
            height: 24,
            width: 24,
          }}
        />
      </View>

      {/* Price and chart skeleton */}
      <View
        className='flex-row items-center justify-between'
        style={{ gap: 2 }}>
        <View className='flex-1 gap-1'>
          <View
            className='h-3 rounded'
            style={{ backgroundColor: colors.neutral200, width: '60%' }}
          />
          <View
            className='h-3 rounded'
            style={{ backgroundColor: colors.neutral200, width: '80%' }}
          />
        </View>
        <View
          className='rounded'
          style={{
            backgroundColor: colors.neutral200,
            height: 37.5,
            width: 75,
          }}
        />
      </View>

      {/* Progress bar skeleton */}
      <View
        className='rounded'
        style={{
          backgroundColor: colors.neutral200,
          height: 6,
          width: '100%',
        }}
      />

      {/* Percentages skeleton */}
      <View
        className='flex-row items-center justify-between'
        style={{ gap: 4 }}>
        <View
          className='h-3 rounded'
          style={{ backgroundColor: colors.neutral200, width: '30%' }}
        />
        <View
          className='h-3 rounded'
          style={{ backgroundColor: colors.neutral200, width: '30%' }}
        />
      </View>
    </View>
  )
}

const MarketTrending = () => {
  const { colors } = useTheme()
  const navigation = useAppNavigation()
  const { data: trendingData, isLoading } = useTrendingMarket()

  return (
    <View>
      <View className='flex-row justify-between items-center p-4'>
        <Text className='text-h3-semibold'>Market Trending</Text>

        <ChevronRight
          color={colors.neutral900}
          size={24}
          onPress={() => {
            navigation.navigate(Paths.Main, {
              screen: Paths.Market,
            })
          }}
        />
      </View>

      {/* List of Cards */}
      {isLoading ? (
        <View
          className='flex-row flex-wrap'
          style={{ gap: 8, paddingHorizontal: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <TrendingCardSkeleton key={i} />
          ))}
        </View>
      ) : (
        <View
          className='flex-row flex-wrap'
          style={{ gap: 8, paddingHorizontal: 16 }}>
          {trendingData?.map((item) => (
            <TrendingCard
              key={item.id}
              assetId={item.id}
              icon={SYMBOL_ICONS[item.symbol]}
              symbol={item.symbol}
              symbolName={SYMBOL_NAMES[item.symbol] || item.symbol}
              timeframe={300}
            />
          ))}
        </View>
      )}
    </View>
  )
}

export default MarketTrending
