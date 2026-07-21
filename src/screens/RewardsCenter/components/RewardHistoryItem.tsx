import { View } from 'react-native'

import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import useTheme from '@/theme/hooks/useTheme'

import { SUCCESS_GREEN } from '../constants'
import { PairIcon } from './PairIcon'

const TEXT_SECONDARY = '#6B7280'

export type RewardHistoryItemData = {
  pair: string
  lot: string
  amount: string
}

type RewardHistoryItemProps = {
  item: RewardHistoryItemData
}

export function RewardHistoryItem({ item }: RewardHistoryItemProps) {
  const { colors } = useTheme()

  return (
    <View className='flex-row items-center py-3'>
      <PairIcon pair={item.pair} />
      <View className='ml-3 flex-1'>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: colors.neutral900,
          }}>
          {item.pair}
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '400',
            color: TEXT_SECONDARY,
          }}>
          {item.lot} Lot
        </Text>
      </View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: SUCCESS_GREEN,
        }}>
        +${item.amount}
      </Text>
    </View>
  )
}
