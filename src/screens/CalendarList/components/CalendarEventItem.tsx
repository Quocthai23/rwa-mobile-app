import { CalendarPlus } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { useAppNavigation } from '@/hooks'
import { Paths } from '@/navigation/paths'
import { useTheme } from '@/theme'
import type { CalendarEvent } from '@/types/calendar'

import { formatTime, getCurrencyFlag } from './calendarUtils'

interface CalendarEventItemProps {
  event: CalendarEvent
}

const CalendarEventItemComponent = ({ event }: CalendarEventItemProps) => {
  const { colors } = useTheme()
  const navigation = useAppNavigation()
  const flag = getCurrencyFlag(event.currency)
  const time = formatTime(event.date)

  const handlePress = () => {
    navigation.navigate(Paths.CalendarDetail, { event })
  }

  return (
    <TouchableOpacity
      className='border-b border-neutral-200 py-4'
      onPress={handlePress}>
      {/* Title */}
      <View className='flex-row items-center gap-3 min-h-[28px]'>
        <Text
          className='text-body-large-semibold text-neutral-900'
          ellipsizeMode='tail'
          numberOfLines={2}
          style={{ flexShrink: 1 }}>
          {event.title}
        </Text>
      </View>
      {/* Metadata */}
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center gap-2'>
          <Text className='text-base'>{flag}</Text>
          <Text className='text-body-large-regular text-neutral-500'>
            {time}
          </Text>
          <TouchableOpacity>
            <CalendarPlus
              color={colors.neutral500}
              size={20}
              strokeWidth={1.5}
            />
          </TouchableOpacity>
        </View>
        <View className='rounded-md py-1.5 px-3 bg-neutral-100'>
          <Text className='text-body-small-regular text-neutral-700'>
            {event.impact}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export const CalendarEventItem = React.memo(CalendarEventItemComponent)
