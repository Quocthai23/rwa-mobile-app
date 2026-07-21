import { memo } from 'react'
import { Pressable, Text, View } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'

import { ToggleFavouriteAsset } from '@/components/atoms'
import { Paths } from '@/navigation/paths'
import type { MarketStackParamList } from '@/navigation/types'
import { useTheme } from '@/theme'
import { formatPriceDecimal2 } from '@/utils/currency'

type ItemSymbolChartViewProps = {
  readonly accessId: string
  readonly ask?: number
  readonly bid?: number
  readonly change?: number
  readonly desc?: string
  readonly isFavorite?: boolean
  readonly percentChange?: number
  readonly spread?: number
  readonly symbol?: string
  readonly chartData?: Array<{ value: number }>
}

function ItemSymbolChartView({
  accessId,
  ask = 0,
  bid = 0,
  change = 68.43,
  desc = '',
  isFavorite = false,
  percentChange = 1.4,
  spread = 3,
  symbol = 'EURUSD',
  chartData = [
    { value: 50 },
    { value: 80 },
    { value: 40 },
    { value: 30 },
    { value: 55 },
    { value: 36 },
    { value: 88 },
    { value: 92 },
    { value: 100 },
    { value: 98 },
  ],
}: ItemSymbolChartViewProps) {
  const navigation = useNavigation<StackNavigationProp<MarketStackParamList>>()
  const { colors } = useTheme()

  const isPositive = change >= 0

  return (
    <Pressable
      className='flex-row items-center gap-4 border-b border-neutral-100 py-3'
      onPress={() => {
        navigation.navigate(Paths.SymbolDetail, {
          assetId: accessId,
          isFavorite,
          symbol,
          symbolDesc: desc,
        })
      }}>
      {/* Left Section - Symbol Info & Buttons */}
      <View className='flex-col flex-1 justify-between h-[72px]'>
        {/* Symbol Name and Star */}
        <View className='flex-row items-center justify-between gap-4'>
          <View className='flex-row items-center gap-1'>
            <Text className='text-body-large-semibold font-semibold'>
              {symbol?.slice(0, 3)}/{symbol?.slice(3)}
            </Text>
            <ToggleFavouriteAsset assetId={accessId} />
          </View>
          {/* Spread */}
          <Text className='text-body-small-regular text-neutral-500'>
            Spread: {spread}
          </Text>
        </View>

        {/* Buy/Sell Buttons */}
        <View className='flex-row items-center self-stretch gap-2'>
          <Pressable className='flex-1 flex-row items-center justify-center rounded px-3 py-2 gap-1 bg-error-500'>
            <Text className='text-body-small-medium text-neutral-0'>Sell </Text>
            <Text className='text-body-small-medium text-neutral-0'>
              {formatPriceDecimal2(bid)}
            </Text>
          </Pressable>

          <Pressable className='flex-1 flex-row items-center justify-center rounded px-3 py-2 gap-1 bg-success-500'>
            <Text className='text-body-small-medium text-neutral-0'>Buy </Text>
            <Text className='text-body-small-medium text-neutral-0'>
              {formatPriceDecimal2(ask)}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Right Section - Chart */}
      <View className='h-[72px] w-[137px] justify-end relative'>
        {/* Change Amount and Percentage */}
        <View className='flex-row items-center gap-1 absolute top-0 left-0'>
          <Text
            className='text-body-small-regular'
            style={{ color: isPositive ? colors.success500 : colors.error500 }}>
            {isPositive ? '+' : ''}
            {change?.toFixed(2)}
          </Text>
          <Text
            className='text-body-small-regular'
            style={{ color: isPositive ? colors.success500 : colors.error500 }}>
            ({isPositive ? '+' : ''}
            {percentChange?.toFixed(2)}%)
          </Text>
        </View>
        <View className='relative' style={{ height: 60, marginLeft: -10 }}>
          <LineChart
            data={chartData}
            width={147}
            height={60}
            hideDataPoints
            hideRules
            hideYAxisText
            hideAxesAndRules
            color={isPositive ? colors.success500 : colors.error500}
            thickness={0.6}
            curved={false}
            areaChart
            startFillColor={
              isPositive
                ? 'rgba(18, 183, 106, 0.15)'
                : 'rgba(240, 68, 56, 0.15)'
            }
            endFillColor={
              isPositive ? 'rgba(18, 183, 106, 0)' : 'rgba(240, 68, 56, 0)'
            }
            startOpacity={0.2}
            endOpacity={0}
            initialSpacing={0}
            spacing={20}
            yAxisOffset={0}
            noOfSections={4}
            disableScroll
          />
        </View>
      </View>
    </Pressable>
  )
}

export default memo(ItemSymbolChartView)
