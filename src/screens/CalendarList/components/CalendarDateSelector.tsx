import { CalendarIcon } from 'lucide-react-native'
import React, { useMemo } from 'react'
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useTheme } from '@/theme'
import { formatToMMDD, toISODateString } from '@/utils/dateUtils'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getCenteredDates(
  centerDate: Date,
  numberOfDays: number,
): Array<{ dateKey: string; displayDate: string; day: string }> {
  const offset = Math.floor(numberOfDays / 2)

  return Array.from({ length: numberOfDays }, (_, i) => {
    const day = new Date(centerDate)
    day.setDate(centerDate.getDate() - offset + i)

    return {
      dateKey: toISODateString(day),
      displayDate: formatToMMDD(day),
      day: DAY_NAMES[day.getDay()],
    }
  })
}

interface CalendarDateSelectorProps {
  displayDays?: number
  selectedDate: string
  anchorDate?: string
  onDateSelect: (dateKey: string) => void
  onShowCalendarModal?: () => void
}

export const CalendarDateSelector = ({
  displayDays = 5,
  selectedDate,
  anchorDate,
  onDateSelect,
  onShowCalendarModal,
}: CalendarDateSelectorProps) => {
  const { colors } = useTheme()

  const dates = useMemo(() => {
    const centerDate = new Date(anchorDate || selectedDate)

    return getCenteredDates(centerDate, displayDays)
  }, [anchorDate, selectedDate, displayDays])

  const screenWidth = Dimensions.get('window').width
  const containerPadding = 16
  const calendarIconWidth = 68
  const availableWidth = screenWidth - containerPadding - calendarIconWidth
  const itemWidth = availableWidth / displayDays

  return (
    <View className='flex-row items-center mb-4 p-2 rounded-md bg-neutral-100'>
      <ScrollView
        horizontal
        className='flex-1'
        showsHorizontalScrollIndicator={false}>
        {dates.map((dateItem) => (
          <TouchableOpacity
            key={dateItem.dateKey}
            className='items-center rounded-lg px-2 py-1'
            style={{
              width: itemWidth,
              backgroundColor:
                selectedDate === dateItem.dateKey
                  ? colors.primary500
                  : 'transparent',
            }}
            onPress={() => {
              onDateSelect(dateItem.dateKey)
            }}>
            <Text
              className={`text-body-small-regular text-${selectedDate === dateItem.dateKey ? 'white' : 'neutral-500'}`}>
              {dateItem.day}
            </Text>
            <Text
              className={`text-body-small-regular text-${selectedDate === dateItem.dateKey ? 'white' : 'neutral-900'}`}>
              {dateItem.displayDate}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {onShowCalendarModal && (
        <TouchableOpacity
          className='p-2 flex-shrink-0'
          onPress={onShowCalendarModal}>
          <CalendarIcon className='text-neutral-700' size={24} />
        </TouchableOpacity>
      )}
    </View>
  )
}
