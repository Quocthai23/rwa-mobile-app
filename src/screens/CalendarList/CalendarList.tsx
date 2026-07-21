import { ChevronLeft } from 'lucide-react-native'
import React, { useCallback, useState } from 'react'
import type { ListRenderItem } from 'react-native'
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/atoms'
import { useAppNavigation } from '@/hooks'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'
import type { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import type { CalendarEvent, CalendarEventType } from '@/types/calendar'

import CalendarModal from '../Home/components/CalendarModal'
import {
  CalendarDateSelector,
  CalendarEventItem,
  CalendarSubTabs,
} from './components'

function CalendarList({ route }: RootScreenProps<Paths.CalendarList>) {
  const navigation = useAppNavigation()
  const { activeSubTab: initialSubTab, selectedDate: initialDate } =
    route.params

  const [activeSubTab, setActiveSubTab] = useState<CalendarEventType>(
    initialSubTab as CalendarEventType,
  )
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [skip, setSkip] = useState(0)
  const take = 20
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const {
    data: calendarData,
    error: calendarError,
    isLoading,
    refetch: refetchCalendar,
  } = useCalendarEvents({
    date: selectedDate,
    skip,
    take,
    type: activeSubTab,
  })

  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  React.useEffect(() => {
    if (!calendarData?.data) return

    setAllEvents((prev) => {
      const base = skip === 0 ? [] : prev

      return [...base, ...calendarData.data]
    })

    setIsLoadingMore(false)
    setIsResetting(false)
  }, [calendarData, skip])

  const hasError = !!calendarError
  const handleLoadMore = () => {
    if (isLoading || isLoadingMore) return
    if (!calendarData) return

    if ((calendarData.data?.length ?? 0) < take) return

    const currentLoaded = skip + take
    if (currentLoaded < calendarData.total) {
      setIsLoadingMore(true)
      setSkip((p) => p + take)
    }
  }

  const handleSubTabChange = (newSubTab: CalendarEventType) => {
    setActiveSubTab(newSubTab)
    setSkip(0)
    setAllEvents([])
    setIsResetting(true)
  }

  const handleDateSelect = (newDate: string) => {
    setSelectedDate(newDate)
    setSkip(0)
    setAllEvents([])
    setIsResetting(true)
  }

  const onShowCalendarModal = (show: boolean) => {
    setShowCalendarModal(show)
  }

  const onMonthChange = (direction: 'next' | 'prev') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const renderEventItem: ListRenderItem<CalendarEvent> = useCallback(
    ({ item: event }) => <CalendarEventItem event={event} />,

    [],
  )

  const renderFooter = () => {
    if (isLoading && skip === 0) return null

    if (allEvents.length === 0) return null

    if (isLoadingMore) {
      return (
        <View style={{ paddingTop: 12, paddingBottom: 16 }}>
          <ActivityIndicator size='small' />
        </View>
      )
    }

    if (calendarData && allEvents.length < calendarData.total) {
      return (
        <View style={{ paddingTop: 12, paddingBottom: 16 }}>
          <Button
            label='Load more'
            size={40}
            variant='secondary'
            onPress={handleLoadMore}
          />
        </View>
      )
    }

    return null
  }

  const renderEmpty = () => {
    if (isLoading || isResetting) {
      return (
        <View className='p-8 items-center'>
          <ActivityIndicator className='text-neutral-500' size='large' />
          <Text className='text-body-large-regular text-neutral-500 mt-4'>
            Loading...
          </Text>
        </View>
      )
    }

    if (hasError) {
      return (
        <View className='p-8 items-center'>
          <Text className='text-body-large-regular text-neutral-500 mb-4'>
            Failed to load data
          </Text>
          <Button
            label='Retry'
            size={40}
            variant='secondary'
            onPress={() => {
              setSkip(0)
              refetchCalendar()
            }}
          />
        </View>
      )
    }

    if (
      !isLoading &&
      !isLoadingMore &&
      !isResetting &&
      allEvents.length === 0
    ) {
      return (
        <View className='p-8 items-center'>
          <Text className='text-body-large-regular text-neutral-500'>
            No data available
          </Text>
        </View>
      )
    }

    return null
  }

  return (
    <SafeAreaView className='flex-1 bg-white pb-4' edges={['top', 'bottom']}>
      <View className='flex-1'>
        <View className='h-[60px] px-4 flex-row relative items-center justify-center'>
          <TouchableOpacity
            className='absolute left-4'
            onPress={() => {
              navigation.goBack()
            }}>
            <ChevronLeft size={24} />
          </TouchableOpacity>
          <Text className='text-h3-semibold text-center'>Calendar</Text>
        </View>
        <View className='px-4'>
          <CalendarSubTabs
            activeSubTab={activeSubTab}
            onSubTabChange={handleSubTabChange}
          />

          <CalendarDateSelector
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onShowCalendarModal={() => {
              onShowCalendarModal(true)
            }}
          />
        </View>

        <FlatList
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          data={allEvents}
          initialNumToRender={21}
          keyExtractor={(item: any) => item.id}
          maxToRenderPerBatch={10}
          removeClippedSubviews={false}
          renderItem={renderEventItem}
          style={{ flex: 1 }}
        />
      </View>

      {/* Calendar Modal */}
      <CalendarModal
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        visible={showCalendarModal}
        onClose={() => {
          onShowCalendarModal(false)
        }}
        onDateSelect={(date) => {
          handleDateSelect(date)
          onShowCalendarModal(false)
        }}
        onMonthChange={onMonthChange}
      />
    </SafeAreaView>
  )
}

export default CalendarList
