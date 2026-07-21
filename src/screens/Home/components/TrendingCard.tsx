import React from 'react'
import {
  Dimensions,
  Image,
  type ImageSourcePropType,
  InteractionManager,
  Pressable,
  Text,
  View,
} from 'react-native'
import Svg, { Line, Rect } from 'react-native-svg'

import { useAppNavigation, useKlineData } from '@/hooks'
import { Paths } from '@/navigation/paths'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useTheme } from '@/theme'

import MiniChart from './MiniChart'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = (SCREEN_WIDTH - 40) / 2

type TrendingCardProps = {
  assetId?: string
  icon?: ImageSourcePropType
  symbol: string
  symbolName: string
  timeframe?: number
}

const TrendingCard = ({
  assetId,
  icon,
  symbol,
  symbolName,
  timeframe = 60,
}: TrendingCardProps) => {
  const { colors } = useTheme()
  const navigation = useAppNavigation()
  const { data: klineData } = useKlineData({
    symbol,
    timeframe,
    limit: 15,
  })

  const lastPrice = useMarketSocketStore(
    (s) => s.rtBySymbol?.[symbol]?.lastPrice,
  )
  const changePercent = useMarketSocketStore(
    (s) => s.rtBySymbol?.[symbol]?.changePercent,
  )

  const takerBuyRatio24h = useMarketSocketStore(
    (s) => s.rtBySymbol?.[symbol]?.takerBuyRatio24h,
  )

  const price = Number(lastPrice) || 0
  const priceChange =
    typeof changePercent === 'number' && !Number.isNaN(changePercent)
      ? changePercent
      : 0

  // Calculate buy/sell percentages from bid/ask sizes (default 50/50 when no data)
  const buyPercentageNum =
    typeof takerBuyRatio24h === 'number' && !Number.isNaN(takerBuyRatio24h)
      ? takerBuyRatio24h
      : 50
  const sellPercentageNum = 100 - buyPercentageNum
  const buyPercentage = buyPercentageNum
  const sellPercentage = sellPercentageNum.toFixed(2)

  const isPositive = priceChange >= 0
  const percentageText = `${isPositive ? '+' : ''}${priceChange.toFixed(2)}%`

  return (
    <Pressable
      className='rounded'
      style={{
        backgroundColor: colors.neutral50,
        gap: 8,
        padding: 12,
        width: CARD_WIDTH,
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
                  symbol,
                  symbolDesc: symbolName,
                },
              },
            })
          }, 50)
        })
      }}>
      {/* Header with symbol name and icon */}
      <View className='flex-row items-center justify-between w-full'>
        <Text className='text-body-large-semibold text-neutral-900'>
          {symbolName}
        </Text>
        {icon && (
          <Image
            source={icon}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
            }}
          />
        )}
      </View>

      {/* Price and chart section */}
      <View
        className='flex-row items-center justify-between'
        style={{ gap: 2 }}>
        {/* Price info */}
        <View
          className='flex-1 gap-1
        '>
          <Text
            className='text-body-small-semibold '
            style={{ color: isPositive ? colors.success500 : colors.error500 }}>
            {percentageText}
          </Text>
          <Text className='text-body-small-medium text-neutral-900'>
            {Number.isFinite(price) ? price.toFixed(2) : '0.00'}
          </Text>
        </View>

        {/* Mini chart */}
        {klineData && klineData.candles.length > 0 && (
          <MiniChart
            candles={klineData.candles}
            height={37.5}
            isPositive={isPositive}
            width={75}
          />
        )}
      </View>

      <View className='gap-1'>
        {/* Progress bar with diagonal separator */}
        <View
          style={{
            height: 6,
            overflow: 'hidden',
            borderRadius: 3,
            width: '100%',
          }}>
          <Svg
            height={6}
            preserveAspectRatio='none'
            viewBox='0 0 100 6'
            width='100%'>
            {/* Green (Buy) section */}
            <Rect
              fill={colors.success500}
              height={6}
              width={buyPercentageNum}
              x={0}
              y={0}
            />
            {/* Red (Sell) section */}
            <Rect
              fill={colors.error500}
              height={6}
              width={sellPercentageNum}
              x={buyPercentageNum}
              y={0}
            />
            {/* White diagonal separator line - wider and more visible */}
            <Line
              stroke='white'
              strokeWidth={2}
              x1={buyPercentageNum - 1.5}
              x2={buyPercentageNum + 1.5}
              y1={0}
              y2={6}
            />
          </Svg>
        </View>
        {/* Buy/Sell percentages */}
        <View
          className='flex-row items-center justify-between'
          style={{ gap: 4 }}>
          <Text className='text-body-small-medium text-success-500'>
            {buyPercentageNum.toFixed(2)}%
          </Text>

          <Text className='text-body-small-medium text-error-500'>
            {sellPercentage}%
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default TrendingCard
