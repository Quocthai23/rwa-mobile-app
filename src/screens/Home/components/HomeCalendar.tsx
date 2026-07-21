import { RefreshCw } from 'lucide-react-native'
import React, { useCallback, useMemo, useState } from 'react'
import type { ListRenderItem } from 'react-native'
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { Button } from '@/components/atoms'
import { useAppNavigation } from '@/hooks'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'
import { Paths } from '@/navigation/paths'
import type { CalendarEvent, CalendarEventType } from '@/types/calendar'
import { toISODateString } from '@/utils/dateUtils'

import {
  CalendarDateSelector,
  CalendarEventItem,
  CalendarSubTabs,
} from '../../CalendarList/components'
import CalendarModal from './CalendarModal'

const TAKE = 20

interface HomeCalendarProps {
  /** Khi true: FlatList tự scroll, bật onEndReached load more (dùng ở Discover) */
  scrollableList?: boolean
}

export const HomeCalendar = ({ scrollableList = false }: HomeCalendarProps) => {
  const navigation = useAppNavigation()
  const [activeSubTab, setActiveSubTab] =
    useState<CalendarEventType>('featured')
  const today = new Date()
  const todayKey = useMemo(() => toISODateString(today), [])

  const [selectedDate, setSelectedDate] = useState(todayKey)
  const [skip, setSkip] = useState(0)
  const [anchorDate, setAnchorDate] = useState(todayKey)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const {
    data: calendarData,
    error: calendarError,
    isLoading,
    refetch: refetchCalendar,
  } = useCalendarEvents({
    date: selectedDate,
    take: TAKE,
    skip,
    type: activeSubTab,
  })

  React.useEffect(() => {
    if (!calendarData?.data) return

    setAllEvents((prev) =>
      skip === 0 ? calendarData.data : [...prev, ...calendarData.data],
    )

    setIsLoadingMore(false)

    setIsResetting(false)
  }, [calendarData, skip])

  const hasError = !!calendarError

  const handleLoadMore = () => {
    if (isLoading || isLoadingMore || !calendarData) return
    if ((calendarData.data?.length ?? 0) < TAKE) return

    const currentLoaded = skip + TAKE

    if (currentLoaded < calendarData.total) {
      setIsLoadingMore(true)

      setSkip((p) => p + TAKE)
    }
  }

  const onDateSelect = (dateKey: string) => {
    setSelectedDate(dateKey)
    setSkip(0)
    setAllEvents([])
    setIsResetting(true)
  }

  const onSubTabChange = (newSubTab: CalendarEventType) => {
    setActiveSubTab(newSubTab)
    setSkip(0)
    setAllEvents([])
    setIsResetting(true)
  }

  const onRefresh = () => {
    setSkip(0)
    setAllEvents([])
    refetchCalendar()
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

  const listHeader = () => (
    <>
      <CalendarSubTabs
        activeSubTab={activeSubTab}
        onSubTabChange={onSubTabChange}
      />
      <CalendarDateSelector
        anchorDate={anchorDate}
        displayDays={5}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        onShowCalendarModal={() => onShowCalendarModal(true)}
      />
    </>
  )

  const renderFooter = () => {
    if (isLoading && skip === 0) return null
    if (allEvents.length === 0) return null
    if (isLoadingMore) {
      return (
        <View className='py-3 items-center'>
          <ActivityIndicator size='small' />
        </View>
      )
    }
    if (calendarData && allEvents.length < calendarData.total) {
      return (
        <View className='pt-4'>
          <Button
            label='Load more'
            size={40}
            variant='secondary'
            onPress={
              scrollableList
                ? handleLoadMore
                : () =>
                    navigation.navigate(Paths.Main, {
                      screen: Paths.Discover,
                      params: { initialTab: 'Calendar' },
                    })
            }
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
          <ActivityIndicator size='large' />
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
          <TouchableOpacity
            className='flex-row items-center gap-2 py-2 px-4 rounded-lg bg-neutral-100'
            onPress={onRefresh}>
            <RefreshCw className='text-neutral-700' size={16} />
            <Text className='text-body-large-semibold text-neutral-700'>
              Retry
            </Text>
          </TouchableOpacity>
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
    <View className={scrollableList ? 'flex-1' : ''}>
      {!scrollableList && listHeader()}

      <View
        className={
          scrollableList
            ? 'flex-1 border rounded-lg border-neutral-200'
            : 'border rounded-lg border-neutral-200'
        }>
        <FlatList
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={scrollableList ? listHeader : undefined}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          data={allEvents}
          initialNumToRender={21}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          maxToRenderPerBatch={10}
          renderItem={renderEventItem}
          scrollEnabled={scrollableList}
          showsVerticalScrollIndicator={scrollableList}
          onEndReached={scrollableList ? handleLoadMore : undefined}
          onEndReachedThreshold={0.3}
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
          onDateSelect(date)
          setAnchorDate(date)
          onShowCalendarModal(false)
        }}
        onMonthChange={onMonthChange}
      />
    </View>
  )
}
