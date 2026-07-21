import React from 'react'
import { InteractionManager, Pressable, Text, View } from 'react-native'

import { useAppNavigation, useKlineData } from '@/hooks'
import { Paths } from '@/navigation/paths'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useTheme } from '@/theme'

import MiniChart from './MiniChart'

type TopRiserItemProps = {
  assetId: string
  rank: number
  symbol: string
  symbolCode: string
  symbolName: string
  timeframe?: number
}

const TopRiserItem = ({
  assetId,
  rank,
  symbol,
  symbolCode,
  symbolName,
  timeframe = 60,
}: TopRiserItemProps) => {
  const { colors } = useTheme()
  const navigation = useAppNavigation()

  // Fetch kline data for chart display
  const { data: klineData } = useKlineData({
    symbol,
    timeframe,
    limit: 15,
    enabled: true,
  })

  // Get market data from socket store with specific selector to avoid unnecessary re-renders
  const marketData = useMarketSocketStore((s) => s.rtBySymbol?.[symbol])

  const lastPriceRaw = marketData?.lastPrice ?? 0
  const lastPrice =
    typeof lastPriceRaw === 'number' && Number.isFinite(lastPriceRaw)
      ? lastPriceRaw
      : 0
  const changePercentRaw = marketData?.changePercent ?? 0
  const changePercent =
    typeof changePercentRaw === 'number' && !Number.isNaN(changePercentRaw)
      ? changePercentRaw
      : 0

  const isPositive = changePercent >= 0
  const percentageText = `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`

  const candles = klineData?.candles || []

  return (
    <Pressable
      style={{
        borderBottomColor: colors.neutral200,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
      }}
      onPress={() => {
        // Step 1: Navigate to Market tab first to ensure Market screen is mounted
        navigation.navigate(Paths.Main, {
          screen: Paths.Market,
        })

        // Step 2: After tab transition completes, navigate to SymbolDetail
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            navigation.navigate(Paths.Main, {
              screen: Paths.Market,
              params: {
                screen: Paths.SymbolDetail,
                params: {
                  assetId,
                  symbol: symbolCode,
                  symbolDesc: symbolName,
                },
              },
            })
          }, 50)
        })
      }}>
      {/* Left: Rank and Symbol Info */}
      <View className='flex-row items-center gap-3 w-[40%]'>
        <Text
          className='text-body-large-semibold text-neutral-900 whitespace-nowrap'
          style={{ width: 20 }}>
          {rank}
        </Text>
        <View style={{}}>
          <Text className='text-body-large-semibold text-neutral-900 whitespace-nowrap'>
            {symbolCode}
          </Text>
          <Text
            className='text-body-small-medium text-neutral-600 whitespace-nowrap'
            ellipsizeMode='tail'
            numberOfLines={1}>
            {symbolName}
          </Text>
        </View>
      </View>

      {/* Right: Chart and Price Info */}
      <View
        className='flex-row items-center justify-end flex-1'
        style={{ gap: 12 }}>
        {/* Mini chart */}
        {candles.length > 0 && (
          <MiniChart
            candles={candles}
            height={45}
            isPositive={isPositive}
            width={93}
          />
        )}
      </View>

      {/* Price info */}
      <View style={{ alignItems: 'flex-end', gap: 2, width: 80 }}>
        <Text
          className='text-body-large-semibold'
          style={{ color: isPositive ? colors.success500 : colors.error500 }}>
          {percentageText}
        </Text>
        <Text className='text-body-small-medium text-neutral-900'>
          {lastPrice > 0 && Number.isFinite(lastPrice)
            ? lastPrice.toFixed(2)
            : '-'}
        </Text>
      </View>
    </Pressable>
  )
}

export default TopRiserItem
