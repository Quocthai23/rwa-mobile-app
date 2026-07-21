import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { RefreshCw } from 'lucide-react-native'
import React, { useCallback, useState } from 'react'
import type { ListRenderItem } from 'react-native'
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { Button } from '@/components/atoms'
import { useAppNavigation } from '@/hooks'
import { useNewsList, useNewsTopics } from '@/hooks/useNews'
import { Paths } from '@/navigation/paths'
import colors from '@/theme/colors'
import type { NewsDataItem } from '@/types'
import { cn } from '@/utils'

dayjs.extend(relativeTime)

const TAKE = 20

interface HomeNewsProps {
  /** Khi true: FlatList tự scroll, bật onEndReached load more (dùng ở Discover) */
  scrollableList?: boolean
}

function formatTimeAgo(publishedAt: string): string {
  const date = dayjs(publishedAt)
  const diffMinutes = dayjs().diff(date, 'minute')
  if (diffMinutes < 60) return `${diffMinutes} min ago`

  const diffHours = dayjs().diff(date, 'hour')
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`

  const diffDays = dayjs().diff(date, 'day')

  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

export const HomeNews = ({ scrollableList = false }: HomeNewsProps) => {
  const navigation = useAppNavigation()

  const { data: topicsData } = useNewsTopics()
  const topics = topicsData || []

  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [skip, setSkip] = useState(0)
  const [allEvents, setAllEvents] = useState<NewsDataItem[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  React.useEffect(() => {
    if (topics.length > 0 && selectedTopics.length === 0) {
      setSelectedTopics([topics[0]])
    }
  }, [topics, selectedTopics])

  const {
    data: newsData,
    isLoading,
    isError,
    refetch,
  } = useNewsList({
    topics: selectedTopics,
    take: TAKE,
    skip,
  })

  React.useEffect(() => {
    if (!newsData?.data) return
    setAllEvents((prev) =>
      skip === 0 ? newsData.data : [...prev, ...newsData.data],
    )
    setIsLoadingMore(false)
    setIsResetting(false)
  }, [newsData, skip])

  const handleLoadMore = () => {
    if (isLoading || isLoadingMore || !newsData) return
    if ((newsData.data?.length ?? 0) < TAKE) return
    const currentLoaded = skip + TAKE
    if (currentLoaded < newsData.total) {
      setIsLoadingMore(true)
      setSkip((p) => p + TAKE)
    }
  }

  const onRefresh = () => {
    setSkip(0)
    setAllEvents([])
    refetch()
  }

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => {
      const newTopics = prev.includes(topic)
        ? prev.length === 1
          ? prev
          : prev.filter((t) => t !== topic)
        : [...prev, topic]
      setSkip(0)
      setAllEvents([])
      setIsResetting(true)
      return newTopics
    })
  }

  const renderEventItem: ListRenderItem<NewsDataItem> = useCallback(
    ({ item: event }) => {
      const handlePress = () => {
        navigation.navigate(Paths.NewsWebView, {
          title: event.title,
          url: event.url,
        })
      }

      return (
        <TouchableOpacity className='py-4' onPress={handlePress}>
          <View className='flex-row gap-3'>
            {/* Left - Text Content */}
            <View className='flex-1'>
              <Text className='typo-body-semibold text-neutral-900'>
                {event.title}
              </Text>
              <View className='flex-row items-center gap-3 mt-1'>
                <Text className='typo-body-small-medium text-neutral-900'>
                  {event.topic}
                </Text>
                <View className='bg-neutral-400 w-[1px] h-5' />
                <Text className='typo-body-small-medium text-neutral-400'>
                  {formatTimeAgo(event.publishedAt)}
                </Text>
              </View>
            </View>
            {/* Right - Image */}
            {event.imageUrl && (
              <Image
                className='w-20 h-20 rounded-lg bg-neutral-100'
                source={{ uri: event.imageUrl }}
              />
            )}
          </View>
        </TouchableOpacity>
      )
    },
    [navigation],
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
    if (newsData && allEvents.length < newsData.total) {
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
                      params: { initialTab: 'News' },
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
          <Text className='typo-body-large-regular text-neutral-500 mt-4'>
            Loading...
          </Text>
        </View>
      )
    }
    if (isError) {
      return (
        <View className='p-8 items-center'>
          <Text className='typo-body-large-regular text-neutral-500 mb-4'>
            Failed to load data
          </Text>
          <TouchableOpacity
            className='flex-row items-center gap-2 py-2 px-4 rounded-lg bg-neutral-100'
            onPress={onRefresh}>
            <RefreshCw color={colors.iconColors.subtle} size={16} />
            <Text className='typo-body-large-semibold text-neutral-700'>
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
          <Text className='typo-body-large-regular text-neutral-500'>
            No data available
          </Text>
        </View>
      )
    }
    return null
  }

  const renderSeparator = () => <View className='h-px bg-neutral-200' />

  const topicTabs = (
    <ScrollView
      horizontal
      className='mb-4 -mx-4'
      showsHorizontalScrollIndicator={false}>
      <View className='flex-row items-center px-4 gap-x-1'>
        {topics.map((topic) => (
          <TouchableOpacity key={topic} onPress={() => toggleTopic(topic)}>
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
  )

  return (
    <View className={scrollableList ? 'flex-1' : ''}>
      {!scrollableList && topicTabs}

      <View
        className={
          scrollableList
            ? 'flex-1 border border-neutral-200 rounded-lg'
            : 'border border-neutral-200 rounded-lg'
        }>
        <FlatList
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={scrollableList ? topicTabs : undefined}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          data={allEvents}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderEventItem}
          scrollEnabled={scrollableList}
          showsVerticalScrollIndicator={scrollableList}
          initialNumToRender={21}
          maxToRenderPerBatch={10}
          onEndReached={scrollableList ? handleLoadMore : undefined}
          onEndReachedThreshold={0.3}
        />
      </View>
    </View>
  )
}
