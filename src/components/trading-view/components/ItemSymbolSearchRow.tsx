import { memo } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import { ToggleFavouriteAsset } from '@/components/atoms'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useTheme } from '@/theme'

type ItemSymbolSearchRowProps = {
  readonly accessId: string
  readonly symbol: string
  readonly desc?: string
  readonly isFavorite?: boolean
  readonly initialBid?: number
  readonly initialChange?: number
  readonly initialChangePercent?: number
  readonly digit?: number
  readonly onPress: () => void
}

function ItemSymbolSearchRow({
  accessId,
  symbol,
  desc = '',
  initialBid = 0,
  initialChange = 0,
  initialChangePercent = 0,
  onPress,
}: ItemSymbolSearchRowProps) {
  const { colors } = useTheme()

  const rt = useMarketSocketStore(useShallow((s) => s.rtBySymbol?.[symbol]))
  const bid = rt?.bid ?? initialBid
  const percentChange = rt?.changePercent ?? initialChangePercent
  const change = rt?.change ?? initialChange

  const isPositive = change >= 0

  const formatBid = (value: number) => {
    if (!value) return '0.00'

    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    })
  }

  return (
    <Pressable
      className='flex-row items-center justify-between gap-2 border-b border-neutral-100 py-3'
      onPress={onPress}>
      {/* Name */}
      <View className='flex-1'>
        <View className='flex-row items-center gap-2'>
          <Text className='text-body-large-semibold'>
            {symbol?.slice(0, 3)}/{symbol?.slice(3)}
          </Text>
          <ToggleFavouriteAsset assetId={accessId} />
        </View>
        <Text
          className='text-body-small-regular text-neutral-500'
          ellipsizeMode='tail'
          numberOfLines={1}>
          {desc || symbol}
        </Text>
      </View>

      {/* Last Price */}
      <View className='w-[100px] items-center'>
        <Text
          className='text-body-large-medium'
          style={{ color: isPositive ? colors.success500 : colors.error500 }}>
          {formatBid(bid)}
        </Text>
      </View>

      {/* Change % */}
      <View className='w-[100px] items-center'>
        <Text
          className='text-body-large-medium'
          style={{ color: isPositive ? colors.success500 : colors.error500 }}>
          {percentChange > 0 ? '+' : ''}
          {percentChange.toFixed(2)}%
        </Text>
      </View>
    </Pressable>
  )
}

export default memo(ItemSymbolSearchRow, (prev, next) => {
  return (
    prev.symbol === next.symbol &&
    prev.accessId === next.accessId &&
    prev.isFavorite === next.isFavorite &&
    prev.onPress === next.onPress
  )
})
