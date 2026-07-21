import { ChevronLeft } from 'lucide-react-native'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAppNavigation } from '@/hooks'
import type { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'

import {
  formatTime,
  getCurrencyFlag,
} from '../CalendarList/components/calendarUtils'

function CalendarDetail({ route }: RootScreenProps<Paths.CalendarDetail>) {
  const navigation = useAppNavigation()
  const { event } = route.params

  const flag = getCurrencyFlag(event.currency)
  const time = formatTime(event.date)

  const renderRow = (label: string, value: string | null) => {
    if (!value) return null

    return (
      <View className='py-3 border-b border-neutral-100'>
        <Text className='text-body-small-regular text-neutral-500 mb-1'>
          {label}
        </Text>
        <Text className='text-body-large-semibold text-neutral-900'>
          {value}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'bottom']}>
      <View className='h-[60px] px-4 flex-row relative items-center border-b border-neutral-100'>
        <TouchableOpacity
          className='absolute left-4 p-2 -ml-2'
          onPress={() => {
            navigation.goBack()
          }}>
          <ChevronLeft size={24} />
        </TouchableOpacity>
        <View className='flex-1 items-center'>
          <Text className='text-h3-semibold'>Event Details</Text>
        </View>
      </View>

      <ScrollView className='flex-1'>
        <View className='px-4 py-6'>
          {/* Title Section */}
          <View className='mb-6'>
            <View className='flex-row items-center gap-2 mb-2'>
              <Text className='text-base'>{flag}</Text>
              <Text className='text-body-small-regular text-neutral-500'>
                {event.currency}
              </Text>
            </View>
            <Text className='text-h2-semibold text-neutral-900 mb-2'>
              {event.title}
            </Text>
            <View className='flex-row items-center gap-3'>
              <Text className='text-body-large-regular text-neutral-600'>
                {time}
              </Text>
              <View className='rounded-md py-1 px-3 bg-neutral-100'>
                <Text className='text-body-small-semibold text-neutral-700'>
                  {event.impact}
                </Text>
              </View>
            </View>
          </View>

          {/* Data Section */}
          <View className='bg-neutral-50 rounded-lg p-4 mb-4'>
            <Text className='text-h4-semibold text-neutral-900 mb-3'>
              Economic Data
            </Text>

            {renderRow('Actual', event.actual)}
            {renderRow('Forecast', event.forecast)}
            {renderRow('Previous', event.previous)}
            {renderRow('Currency', event.currency)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CalendarDetail
