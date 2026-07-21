import { ChevronDown, ChevronUp } from 'lucide-react-native'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface Instrument {
  ibCommissionPerLot?: string
  symbol: string
}

interface RewardCategoryItemProps {
  icon: React.ReactNode
  instruments: Instrument[]
  label: string
}

export const RewardCategoryItem = ({
  icon,
  instruments,
  label,
}: RewardCategoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const minCommission = Math.min(
    ...instruments.map((i) => parseFloat(i.ibCommissionPerLot || '0')),
  )
  const maxCommission = Math.max(
    ...instruments.map((i) => parseFloat(i.ibCommissionPerLot || '0')),
  )
  const commissionRange =
    minCommission === maxCommission
      ? `$${minCommission.toFixed(2)}`
      : `$${minCommission.toFixed(2)} – $${maxCommission.toFixed(2)}`

  return (
    <View className='bg-white border border-neutral-100 rounded-2xl mb-4 overflow-hidden'>
      <TouchableOpacity
        activeOpacity={0.7}
        className='p-4 flex-row items-center justify-between'
        onPress={() => setIsExpanded(!isExpanded)}>
        <View className='flex-row items-center flex-1'>
          <View className='w-10 h-10 rounded-xl bg-neutral-50 items-center justify-center mr-3'>
            {icon}
          </View>
          <Text className='text-body-semibold text-neutral-900 flex-1'>
            {label}
          </Text>
        </View>

        <View className='flex-row items-center'>
          <View className='items-end mr-3'>
            <Text className='text-[10px] uppercase font-bold text-neutral-400'>
              PER LOT
            </Text>
            <Text className='text-body-semibold text-neutral-900'>
              {commissionRange}
            </Text>
          </View>
          {isExpanded ? (
            <ChevronUp size={20} color='#6B7280' />
          ) : (
            <ChevronDown size={20} color='#6B7280' />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className='px-4 pb-4 pt-2 flex-row flex-wrap'>
          {instruments.map((instrument, index) => (
            <View
              key={index}
              className='bg-neutral-50 border border-neutral-100 rounded-lg px-2 py-1.5 flex-row items-center mr-2 mb-2'>
              <Text className='text-[11px] font-bold text-neutral-900 uppercase'>
                {instrument.symbol}
              </Text>
              <View className='w-[1px] h-3 bg-neutral-200 mx-1.5' />
              <Text className='text-[10px] font-medium text-primary-500'>
                ${parseFloat(instrument.ibCommissionPerLot || '0').toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
