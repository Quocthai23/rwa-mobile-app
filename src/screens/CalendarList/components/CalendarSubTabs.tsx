import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import type { CalendarEventType } from '@/types/calendar'
import { cn } from '@/utils'

interface CalendarSubTabsProps {
  activeSubTab: CalendarEventType
  onSubTabChange: (subTab: CalendarEventType) => void
}

const SUB_TABS: Array<{ id: CalendarEventType; label: string }> = [
  { id: 'featured', label: 'Featured' },
  { id: 'data', label: 'Data' },
  { id: 'event', label: 'Event' },
  { id: 'holiday', label: 'Holiday' },
]

export const CalendarSubTabs = ({
  activeSubTab,
  onSubTabChange,
}: CalendarSubTabsProps) => {
  return (
    <ScrollView
      horizontal
      className='mb-4 -mx-4'
      showsHorizontalScrollIndicator={false}>
      <View className='flex-row items-center px-4 gap-x-1'>
        {SUB_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => {
              onSubTabChange(tab.id)
            }}>
            <Text
              className={cn(
                'text-neutral-400 typo-body-regular px-3 py-1',
                activeSubTab === tab.id
                  ? 'text-neutral-900 typo-body-medium bg-neutral-100 rounded-sm'
                  : '',
              )}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}
