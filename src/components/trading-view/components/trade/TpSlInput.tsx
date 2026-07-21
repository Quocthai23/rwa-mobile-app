import { Minus, Plus } from 'lucide-react-native'
import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

import { useTheme } from '@/theme'

import type { EstimateItem } from './types'

type TpSlInputProps = {
  estimates: (EstimateItem | null)[]
  label: string
  unitLabel: string
  value: string
  onBlur: () => void
  onChangeText: (text: string) => void
  onDecrement: () => void
  onIncrement: () => void
}

const TpSlInput = ({
  estimates,
  label,
  unitLabel,
  value,
  onBlur,
  onChangeText,
  onDecrement,
  onIncrement,
}: TpSlInputProps) => {
  const { colors } = useTheme()

  return (
    <View className='px-4'>
      <View className='flex-row items-center gap-3'>
        <Text className='text-body-large-medium text-neutral-900 w-[80px] mr-6'>
          {label}
        </Text>
        <TouchableOpacity
          className='bg-neutral-100 rounded-lg py-2.5 px-3 items-center justify-center'
          onPress={onDecrement}>
          <Minus size={18} strokeWidth={2} />
        </TouchableOpacity>
        <View className='flex-1 flex-row gap-2 items-center justify-center'>
          <TextInput
            className='flex-1 text-center rounded-lg py-2.5 px-3 text-lg font-medium text-neutral-900'
            keyboardType='decimal-pad'
            placeholder='Not set'
            placeholderTextColor={colors.neutral400}
            value={value}
            onBlur={onBlur}
            onChangeText={onChangeText}
          />
        </View>

        <TouchableOpacity
          className='bg-neutral-100 rounded-lg py-2.5 px-3 items-center justify-center'
          onPress={onIncrement}>
          <Plus size={18} strokeWidth={2} />
        </TouchableOpacity>
        <Text className='text-body-small-medium text-neutral-400 min-w-[32px]'>
          {unitLabel}
        </Text>
      </View>
      {estimates.some(Boolean) && (
        <View className='flex-row justify-between mt-1 px-1'>
          {estimates.map((est, index) =>
            est ? (
              <Text
                key={index}
                className={`text-caption-regular ${est.isPositive ? 'text-success-500' : 'text-error-500'}`}>
                {est.prefix}: {est.label}
              </Text>
            ) : null,
          )}
        </View>
      )}
    </View>
  )
}

export default TpSlInput
