import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { memo } from 'react'
import { Pressable, Text, View } from 'react-native'

import { ToggleFavouriteAsset } from '@/components/atoms'
import { Paths } from '@/navigation/paths'
import type { MarketStackParamList } from '@/navigation/types'
import { formatPriceDecimal2 } from '@/utils/currency'

import MT5PriceText from './MT5PriceText'
import { useTheme } from '@/theme'

type ItemSymbolProps = {
  readonly accessId: string
  readonly ask?: number
  readonly bid?: number
  readonly change?: number
  readonly desc?: string
  readonly high?: number
  readonly isFavorite?: boolean
  readonly low?: number
  readonly percentChange?: number
  readonly spread: number
  readonly symbol?: string
}

function ItemSymbol({
  accessId,
  ask = 0,
  bid = 0,
  change = -0.06,
  desc = '',
  high = 0,
  isFavorite = false,
  low = 0,
  percentChange = -1.27,
  spread = 3,
  symbol = 'XAUUSD',
}: ItemSymbolProps) {
  const navigation = useNavigation<StackNavigationProp<MarketStackParamList>>()
  const { colors } = useTheme()
  return (
    <Pressable
      className='flex-row items-center gap-2 border-b border-neutral-100 py-3'
      onPress={() => {
        navigation.navigate(Paths.SymbolDetail, {
          assetId: accessId,
          isFavorite,
          symbol,
          symbolDesc: desc,
        })
      }}>
      <View className='w-[40%] gap-[2px] '>
        <View className='flex-row items-center gap-2'>
          <Text className='text-body-semibold font-bold'>
            {symbol?.slice(0, 3)}/{symbol?.slice(3)}
          </Text>
          <ToggleFavouriteAsset assetId={accessId} />

          {/* */}
        </View>
        <Text className='text-neutral-500'>Spread: {spread}</Text>
        <Text
          className={`text-body-small-regular ${change >= 0 ? 'text-success-500' : 'text-error-500'}`}>
          {change > 0 ? '+' : ''}
          {change}( {percentChange > 0 ? '+' : ''}
          {percentChange}%)
        </Text>
      </View>

      <View className='flex-1 flex-row'>
        <View className='w-1/2 justify-center gap-1'>
          <Text>
            {/* {formarPrice(bid)} */}
            <MT5PriceText style={{ color: colors.error500 }} value={bid} />
          </Text>
          <Text className='text-neutral-500'>
            Low: {formatPriceDecimal2(low)}
          </Text>
        </View>
        <View className='w-1/2 justify-center gap-1'>
          <Text>
            <MT5PriceText style={{ color: colors.success500 }} value={ask} />
          </Text>
          <Text className='text-neutral-500'>
            High: {formatPriceDecimal2(high)}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default memo(ItemSymbol)
