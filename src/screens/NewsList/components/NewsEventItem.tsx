import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import { useAppNavigation } from '@/hooks/useAppNavigation'
import { Paths } from '@/navigation/paths'
import type { NewsDataItem } from '@/types'

dayjs.extend(relativeTime)

interface NewsEventItemProps {
  event: NewsDataItem
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

const NewsEventItemComponent = ({ event }: NewsEventItemProps) => {
  const navigation = useAppNavigation()

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
}

export const NewsEventItem = React.memo(NewsEventItemComponent)
