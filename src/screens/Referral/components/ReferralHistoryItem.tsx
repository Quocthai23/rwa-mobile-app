import { ChevronDown, ChevronUp } from 'lucide-react-native'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface Item {
  amount: string
  quantity: string
  symbol: string
}

interface ReferralHistoryItemProps {
  details: Item[]
  email: string
  totalEarned: string
  totalLots: string
}

export const ReferralHistoryItem = ({
  details,
  email,
  totalEarned,
  totalLots,
}: ReferralHistoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <View className='bg-white border border-neutral-100 rounded-2xl mb-4 overflow-hidden'>
      <TouchableOpacity
        activeOpacity={0.7}
        className='p-4 flex-row items-center justify-between'
        onPress={() => setIsExpanded(!isExpanded)}>
        <View className='flex-1'>
          <Text className='text-body-semibold text-neutral-900 mb-1'>
            {email}
          </Text>
          <Text className='text-body-small-regular text-neutral-500'>
            {totalLots} lots traded
          </Text>
        </View>

        <View className='flex-row items-center'>
          <Text className='text-h4-bold text-success-500 mr-3'>
            {totalEarned}
          </Text>
          {isExpanded ? (
            <ChevronUp size={20} color='#6B7280' />
          ) : (
            <ChevronDown size={20} color='#6B7280' />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className='px-4 pb-4 pt-2 border-t border-neutral-50'>
          {details.map((detail, index) => (
            <View
              key={index}
              className='flex-row items-center justify-between py-2'>
              <Text className='text-body-regular text-neutral-900'>
                {detail.symbol}
              </Text>
              <View className='flex-row items-center'>
                <Text className='text-body-regular text-neutral-500 mr-4'>
                  {detail.quantity} lots
                </Text>
                <Text className='text-body-semibold text-neutral-900'>
                  ${detail.amount}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
