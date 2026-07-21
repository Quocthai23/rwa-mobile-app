import { Check, ChevronDown } from 'lucide-react-native'
import React from 'react'
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useTheme } from '@/theme'

import { TRIGGER_OPTIONS, type TriggerType } from './types'

type TriggerSelectorProps = {
  showDropdown: boolean
  triggerType: TriggerType
  onSelect: (type: TriggerType) => void
  onToggleDropdown: () => void
}

const TriggerSelector = ({
  showDropdown,
  triggerType,
  onSelect,
  onToggleDropdown,
}: TriggerSelectorProps) => {
  const { colors } = useTheme()

  return (
    <View className='relative px-4'>
      <View className='flex-row items-center justify-between px-4 py-3 rounded-[4px] bg-neutral-100'>
        <Text className='text-body-medium text-neutral-500'>Trigger</Text>
        <TouchableOpacity
          className='flex-row items-center gap-2'
          onPress={onToggleDropdown}>
          <Text className='text-body-medium text-neutral-900'>
            {triggerType}
          </Text>
          <ChevronDown color={colors.neutral700} size={20} />
        </TouchableOpacity>
      </View>
      {showDropdown && (
        <>
          <Pressable
            style={{ position: 'absolute', zIndex: 40 }}
            onPress={onToggleDropdown}
          />
          <View
            className='absolute left-0 mt-1 py-2 border border-neutral-200 rounded-[8px] bg-white overflow-hidden'
            style={{
              top: '100%',
              zIndex: 50,
              maxHeight: 300,
              left: 16,
              right: 16,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {TRIGGER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  className='px-4 py-2'
                  onPress={() => onSelect(option.label)}>
                  <View className='flex-row items-start justify-between gap-3'>
                    <View className='flex-1'>
                      <Text
                        className={`text-body-large-semibold mb-1 ${
                          triggerType === option.label
                            ? 'text-primary-500'
                            : 'text-neutral-900'
                        }`}>
                        {option.label}
                      </Text>
                    </View>
                    {triggerType === option.label && (
                      <View className='pt-1'>
                        <View className='w-6 h-6 rounded-full items-center justify-center'>
                          <Check color={colors.primary500} size={20} />
                        </View>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  )
}

export default TriggerSelector
