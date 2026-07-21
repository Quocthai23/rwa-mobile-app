import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { memo } from 'react'
import { Pressable, Text, View } from 'react-native'

import { ToggleFavouriteAsset } from '@/components/atoms'
import { Paths } from '@/navigation/paths'
import type { MarketStackParamList } from '@/navigation/types'
import { formatPriceDecimal2 } from '@/utils/currency'

import MT5PriceText from '@/screens/Market/components/MT5PriceText'
import { useTheme } from '@/theme'

type ItemSymbolProps = {
  readonly accessId: string
  readonly bid?: number
  readonly change?: number
  readonly desc?: string
  readonly isFavorite?: boolean
  readonly percentChange?: number
  readonly symbol?: string
}

function ItemSymbol({
  accessId,
  bid = 0,
  change = -0.06,
  desc = '',
  isFavorite = false,
  percentChange = -1.27,
  symbol = 'XAUUSD',
}: ItemSymbolProps) {
  const navigation = useNavigation<StackNavigationProp<MarketStackParamList>>()
  const { colors } = useTheme()
  return (
    <Pressable
      className='flex-row items-center justify-between gap-2 border-b border-neutral-100 py-3'
      onPress={() => {
        navigation.navigate(Paths.SymbolDetail, {
          assetId: accessId,
          isFavorite,
          symbol,
          symbolDesc: desc,
        })
      }}>
      <View className=''>
        <View className='flex-row items-center gap-2'>
          <Text className='text-body-large-semibold'>
            {symbol?.slice(0, 3)}/{symbol?.slice(3)}
          </Text>
          <ToggleFavouriteAsset assetId={accessId} />
        </View>
        <View>
          <Text className='text-body-large-regular text-secondary-500'>
            {symbol}
          </Text>
        </View>
      </View>

      <View>
        <View className='items-center gap-1'>
          <Text className='text-body-large-medium text-error-500'>
            {formatPriceDecimal2(bid)}
          </Text>
        </View>
      </View>

      <View className='items-center gap-1'>
        <Text
          className={`text-body-large-medium ${change >= 0 ? 'text-success-500' : 'text-error-500'}`}>
          {change > 0 ? '+' : ''}
          {change}
        </Text>
      </View>
    </Pressable>
  )
}

export default memo(ItemSymbol)
