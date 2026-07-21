import { Image, View } from 'react-native'

import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import type { Message } from '@/types/messages'

type MessageItemProps = {
  readonly currentUserId: string
  readonly isConsecutive?: boolean
  readonly message: Message
  readonly showAvatar?: boolean
  readonly showUserName?: boolean
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${hours}:${minutes}`
}

const getUserDisplayName = (user: Message['user']) => {
  if (user.profile?.firstName && user.profile?.lastName) {
    return `${user.profile.firstName} ${user.profile.lastName}`
  }
  if (user.profile?.firstName) {
    return user.profile.firstName
  }
  if (user.username) {
    return user.username
  }

  return user.id
}

export function MessageItem({
  currentUserId,
  isConsecutive = false,
  message,
  showAvatar = true,
  showUserName = true,
}: MessageItemProps) {
  const isOwnMessage = message.userId === currentUserId
  const hasContent = Boolean(message.content)
  const hasMedia = message.media && message.media.length > 0

  const renderContent = () => {
    if (message.isDeleted) {
      return (
        <Text
          className={`text-sm italic ${isOwnMessage ? 'text-gray-400' : 'text-gray-500'}`}>
          Tin nhắn đã bị xóa
        </Text>
      )
    }

    if (!hasContent) {
      return null
    }

    // Rich text rendering - preserve newlines and basic formatting
    const content = message.content || ''

    return (
      <Text className='text-sm text-gray-900' style={{ lineHeight: 20 }}>
        {content}
      </Text>
    )
  }

  const renderMedia = () => {
    if (!hasMedia) {
      return null
    }

    const images = message.media.filter((m) => m.mediaType === 'image')
    const videos = message.media.filter((m) => m.mediaType === 'video')
    const files = message.media.filter((m) => m.mediaType === 'file')

    return (
      <View className='mt-2'>
        {images.length > 0 && (
          <View className='flex-row flex-wrap gap-2'>
            {images.map((media) => (
              <Image
                key={media.id}
                className='rounded-lg'
                resizeMode='cover'
                source={{ uri: media.mediaUrl }}
                style={{ height: 150, width: 150 }}
              />
            ))}
          </View>
        )}
        {videos.length > 0 && (
          <View className='flex-row flex-wrap gap-2'>
            {videos.map((media) => (
              <View key={media.id} className='rounded-lg bg-gray-200 p-4'>
                <Text className='text-xs text-gray-600'>
                  Video: {media.mediaUrl}
                </Text>
              </View>
            ))}
          </View>
        )}
        {files.length > 0 && (
          <View className='flex-row flex-wrap gap-2'>
            {files.map((media) => (
              <View key={media.id} className='rounded-lg bg-gray-200 p-3'>
                <Text className='text-xs text-gray-600'>
                  File: {media.mediaUrl}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    )
  }

  const renderReplyPreview = () => {
    if (!message.parent) {
      return null
    }

    const parentContent = message.parent.content || '[Media]'
    const parentUserName = getUserDisplayName(message.parent.user)

    return (
      <View className='mb-2 rounded-lg border-l-4 border-blue-500 bg-gray-50 px-2 py-1'>
        <Text className='text-xs font-semibold text-blue-600'>
          {parentUserName}
        </Text>
        <Text className='text-xs text-gray-600' numberOfLines={2}>
          {parentContent}
        </Text>
      </View>
    )
  }

  return (
    <View
      className={`flex-row gap-3 items-start ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {!isOwnMessage && showAvatar && !isConsecutive ? (
        <View className='w-8 h-8 rounded-full bg-orange-500 items-center justify-center flex-shrink-0'>
          <Text className='text-white text-xs font-bold'>
            {getUserDisplayName(message.user).charAt(0).toUpperCase()}
          </Text>
        </View>
      ) : !isOwnMessage && !isConsecutive ? (
        <View className='w-8 h-8 flex-shrink-0' />
      ) : null}

      {/* Message Content */}
      <View
        className={`flex-1 max-w-[85%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {/* User Name */}
        {!isOwnMessage && showUserName && !isConsecutive ? (
          <Text className='text-xs font-semibold text-blue-600 mb-1'>
            {getUserDisplayName(message.user)}
          </Text>
        ) : null}

        {/* Bot Badge - only show in header, not in message bubble */}
        {message.userId === 'droppii-bot' && !isConsecutive && showUserName ? (
          <View className='mb-1'>
            <View className='bg-amber-600 rounded px-2 py-0.5 self-start'>
              <Text className='text-white text-xs font-semibold'>Bot</Text>
            </View>
          </View>
        ) : null}

        {/* Message Bubble */}
        {hasContent || hasMedia ? (
          <View
            className={`rounded-lg ${
              isOwnMessage ? 'bg-blue-100' : 'bg-gray-100'
            } ${isConsecutive ? 'p-2' : 'p-3'}`}>
            {/* Reply Preview */}
            {renderReplyPreview()}

            {/* Content */}
            {renderContent()}

            {/* Media */}
            {renderMedia()}

            {/* Time and Status */}
            <View
              className={`flex-row items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <Text className='text-xs text-gray-500'>
                {formatTime(message.createdAt)}
              </Text>
              {isOwnMessage ? (
                <View className='w-3 h-3 rounded-full bg-blue-500' />
              ) : null}
            </View>
          </View>
        ) : null}
      </View>
    </View>
  )
}
