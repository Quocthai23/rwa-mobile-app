import { ChevronLeft } from 'lucide-react-native'
import React, { useCallback, useState } from 'react'
import type { ListRenderItem } from 'react-native'
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/atoms'
import { useAppNavigation } from '@/hooks'
import { useNewsList, useNewsTopics } from '@/hooks/useNews'
import type { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import type { NewsDataItem } from '@/types'
import { cn } from '@/utils'

import { NewsEventItem } from './components'

function NewsList({ route }: RootScreenProps<Paths.NewsList>) {
  const navigation = useAppNavigation()
  const { activeSubTab: initialSubTab } = route.params

  // Fetch topics from API
  const { data: topicsData } = useNewsTopics()
  const topics = topicsData || []

  // Parse initial topics from comma-separated string
  const initialTopics = initialSubTab ? initialSubTab.split(',') : []
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialTopics)
  const [skip, setSkip] = useState(0)
  const take = 20

  const {
    data: newsData,
    error: newsError,
    isLoading,
    refetch: refetchNews,
  } = useNewsList({
    skip,
    take,
    topics: selectedTopics,
  })

  const [allEvents, setAllEvents] = useState<NewsDataItem[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  React.useEffect(() => {
    if (!newsData?.data) return

    setAllEvents((prev) => {
      const base = skip === 0 ? [] : prev

      return [...base, ...newsData.data]
    })

    setIsLoadingMore(false)
    setIsResetting(false)
  }, [newsData, skip])

  const hasError = !!newsError
  const handleLoadMore = () => {
    if (isLoading || isLoadingMore) return
    if (!newsData) return

    if ((newsData.data?.length ?? 0) < take) return

    const currentLoaded = skip + take
    if (currentLoaded < newsData.total) {
      setIsLoadingMore(true)
      setSkip((p) => p + take)
    }
  }

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => {
      const newTopics = prev.includes(topic)
        ? prev.length === 1
          ? prev // Don't allow deselecting all topics
          : prev.filter((t) => t !== topic)
        : [...prev, topic]

      // Reset pagination when topics change
      setSkip(0)
      setAllEvents([])
      setIsResetting(true)

      return newTopics
    })
  }

  const renderEventItem: ListRenderItem<NewsDataItem> = useCallback(
    ({ item: event }) => <NewsEventItem event={event} />,

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

    if (newsData && allEvents.length < newsData.total) {
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
              refetchNews()
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

  const renderSeparator = () => <View className='h-px bg-neutral-200' />

  return (
    <SafeAreaView className='flex-1 bg-white ' edges={['top', 'bottom']}>
      <View className='flex-1'>
        <View className='h-[60px] px-4 flex-row relative items-center justify-center'>
          <TouchableOpacity
            className='absolute left-0 ml-4 h-10 w-10 items-center justify-center'
            onPress={() => {
              navigation.goBack()
            }}>
            <ChevronLeft className='text-neutral-900' size={24} />
          </TouchableOpacity>
          <Text className='text-h3-semibold text-center text-neutral-900'>
            News List
          </Text>
        </View>
        {/* Sub Tabs */}
        <ScrollView
          horizontal
          className='mb-4 px-4 '
          contentContainerStyle={{ alignItems: 'center' }} // canh giữa theo chiều dọc
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}>
          <View className='flex-row items-center gap-x-1'>
            {topics.map((topic) => (
              <TouchableOpacity
                key={topic}
                onPress={() => {
                  toggleTopic(topic)
                }}>
                <Text
                  className={cn(
                    'text-neutral-400 typo-body-regular px-3 py-1',
                    selectedTopics.includes(topic)
                      ? 'text-neutral-900 typo-body-medium bg-neutral-100 rounded-sm'
                      : '',
                  )}>
                  {topic.charAt(0).toUpperCase() + topic.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* News List */}
        <View className='flex-1 mx-4'>
          <FlatList
            ItemSeparatorComponent={renderSeparator}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{
              borderColor: '#E5E5E5',
              borderRadius: 8,
              borderWidth: 1,
              paddingHorizontal: 16,
            }}
            data={allEvents}
            initialNumToRender={21}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            maxToRenderPerBatch={10}
            removeClippedSubviews={false}
            renderItem={renderEventItem}
            showsVerticalScrollIndicator={false}
            windowSize={10}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default NewsList
