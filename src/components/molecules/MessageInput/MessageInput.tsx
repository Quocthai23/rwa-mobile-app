import { useCallback, useState } from 'react'
import { Image, Pressable, ScrollView, TextInput, View } from 'react-native'

import {
  Camera,
  FileText,
  Plus,
  Send,
  Smile,
  Video,
} from '@/components/atoms/Icon'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { StickerPicker } from '@/components/molecules/StickerPicker'
import { gray, iconColors } from '@/theme/colors'
import type { Message, SendMessageRequest } from '@/types/messages'
import type { Sticker } from '@/utils/stickerLoader'

type MessageInputProps = {
  readonly isSending?: boolean
  readonly onCancelReply?: (() => void) | undefined
  readonly onSendMessage:
    | ((data: SendMessageRequest) => Promise<void>)
    | undefined
  readonly replyingTo?: Message | undefined
}

export function MessageInput({
  isSending = false,
  onCancelReply,
  onSendMessage,
  replyingTo,
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [queuedMedia, setQueuedMedia] = useState<
    { id: string; type: 'file' | 'image' | 'video'; uri: string }[]
  >([])
  const [showActions, setShowActions] = useState(false)
  const [showStickerPicker, setShowStickerPicker] = useState(false)

  const handleSend = useCallback(async () => {
    if (
      (!message.trim() && queuedMedia.length === 0) ||
      isSending ||
      !onSendMessage
    ) {
      return
    }

    const messageData: SendMessageRequest = {
      content: message.trim() || undefined,
      mediaUrls: queuedMedia.map((m) => m.uri),
      messageType:
        queuedMedia.length > 0
          ? queuedMedia[0].type === 'video'
            ? 'video'
            : queuedMedia[0].type === 'file'
              ? 'file'
              : 'image'
          : 'text',
      parentId: replyingTo?.id,
    }

    // Clear input
    const previousMessage = message
    const previousMedia = queuedMedia
    setMessage('')
    setQueuedMedia([])
    if (onCancelReply) {
      onCancelReply()
    }

    try {
      await onSendMessage(messageData)
    } catch (error) {
      // Restore on failure
      console.error('Failed to send message:', error)
      setMessage(previousMessage)
      setQueuedMedia(previousMedia)
    }
  }, [
    isSending,
    message,
    onCancelReply,
    onSendMessage,
    queuedMedia,
    replyingTo,
  ])

  const handleRemoveMedia = useCallback((id: string) => {
    setQueuedMedia((previous) => previous.filter((m) => m.id !== id))
  }, [])

  // Mock file picker - in real app, use react-native-image-picker or similar
  const handlePickMedia = useCallback(() => {
    // For now, just add a mock image
    // In production, use react-native-image-picker
    const mockMedia = {
      id: `media-${Date.now()}`,
      type: 'image' as const,
      uri: 'https://via.placeholder.com/300',
    }
    setQueuedMedia((previous) => [...previous, mockMedia])
    setShowActions(false)
  }, [])

  const handlePickFile = useCallback(() => {
    // Mock file picker
    const mockFile = {
      id: `file-${Date.now()}`,
      type: 'file' as const,
      uri: 'https://example.com/file.pdf',
    }
    setQueuedMedia((previous) => [...previous, mockFile])
    setShowActions(false)
  }, [])

  const handlePickSticker = useCallback(() => {
    // Mock sticker picker
    const mockSticker = {
      id: `sticker-${Date.now()}`,
      type: 'image' as const,
      uri: 'https://via.placeholder.com/200',
    }
    setQueuedMedia((previous) => [...previous, mockSticker])
    setShowActions(false)
  }, [])

  const handleSelectSticker = useCallback((sticker: Sticker) => {
    const media = {
      id: `sticker-${Date.now()}`,
      type: 'image' as const,
      uri: typeof sticker.uri === 'string' ? sticker.uri : '',
    }
    setQueuedMedia((previous) => [...previous, media])
    setShowStickerPicker(false)
  }, [])

  return (
    <View className='bg-white border-t border-gray-200'>
      {/* Reply Preview */}
      {replyingTo ? (
        <View className='bg-blue-50 border-l-4 border-blue-500 px-4 py-3 mx-4 mt-2 rounded-lg'>
          <View className='flex-row items-start justify-between'>
            <View className='flex-1'>
              <Text className='text-sm font-semibold text-blue-900'>
                Replying to {replyingTo.user?.username || 'user'}
              </Text>
              <Text className='text-sm text-blue-700 mt-1' numberOfLines={2}>
                {replyingTo.content || '[Media]'}
              </Text>
            </View>
            <Pressable className='ml-2' onPress={onCancelReply}>
              <View className='w-6 h-6 items-center justify-center'>
                <Text className='text-blue-500 text-lg'>×</Text>
              </View>
            </Pressable>
          </View>
        </View>
      ) : null}

      {/* Media Preview */}
      {queuedMedia.length > 0 && (
        <ScrollView
          horizontal
          className='px-4 py-2'
          showsHorizontalScrollIndicator={false}>
          <View className='flex-row gap-2'>
            {queuedMedia.map((media) => (
              <View key={media.id} className='relative'>
                {media.type === 'image' ? (
                  <Image
                    className='w-24 h-24 rounded-lg'
                    resizeMode='cover'
                    source={{ uri: media.uri }}
                  />
                ) : (
                  <View className='w-24 h-24 rounded-lg bg-gray-200 items-center justify-center'>
                    {media.type === 'file' ? (
                      <FileText color={iconColors.subtle} size={24} />
                    ) : (
                      <Video color={iconColors.subtle} size={24} />
                    )}
                  </View>
                )}
                <Pressable
                  className='absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/70 items-center justify-center'
                  onPress={() => {
                    handleRemoveMedia(media.id)
                  }}>
                  <Text className='text-white text-xs'>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Input Area */}
      <View className='px-4 py-3'>
        <View className='flex-row items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2'>
          {/* Plus Button */}
          <Pressable
            className='w-9 h-9 items-center justify-center'
            onPress={() => {
              setShowActions(!showActions)
              setShowStickerPicker(false)
            }}>
            <Plus color={iconColors.subtle} size={22} />
          </Pressable>

          {/* Text Input */}
          <TextInput
            multiline
            className='flex-1 text-base text-gray-900 py-2'
            placeholder='Type a message...'
            placeholderTextColor={gray[200]}
            style={{
              maxHeight: 120,
              minHeight: 36,
              textAlignVertical: 'center',
            }}
            value={message}
            onChangeText={setMessage}
          />

          {/* Emoji/Sticker Button */}
          <Pressable
            className='w-9 h-9 items-center justify-center'
            onPress={() => {
              setShowStickerPicker(!showStickerPicker)
              setShowActions(false)
            }}>
            <Smile
              color={showStickerPicker ? iconColors.primary : iconColors.subtle}
              size={22}
            />
          </Pressable>

          {/* Send Button */}
          <Pressable
            className={`w-9 h-9 rounded-full items-center justify-center ${
              (message.trim() || queuedMedia.length > 0) && !isSending
                ? 'bg-blue-500'
                : 'bg-gray-300'
            }`}
            disabled={
              (!message.trim() && queuedMedia.length === 0) || isSending
            }
            onPress={handleSend}>
            {isSending ? (
              <View className='w-4 h-4 border-2 border-white border-t-transparent rounded-full' />
            ) : (
              <Send color={iconColors.light} size={16} />
            )}
          </Pressable>
        </View>
      </View>

      {/* Actions Panel */}
      {showActions ? (
        <View className='px-4 pb-4 border-t border-gray-200'>
          <View className='flex-row gap-4 pt-4'>
            <Pressable
              className='flex-1 items-center bg-gray-50 rounded-xl p-4'
              onPress={handlePickMedia}>
              <View className='mb-2'>
                <Camera color={iconColors.subtle} size={28} />
              </View>
              <Text className='text-xs text-gray-700'>Photo/Video</Text>
            </Pressable>
            <Pressable
              className='flex-1 items-center bg-gray-50 rounded-xl p-4'
              onPress={handlePickFile}>
              <View className='mb-2'>
                <FileText color={iconColors.subtle} size={28} />
              </View>
              <Text className='text-xs text-gray-700'>File</Text>
            </Pressable>
            <Pressable
              className='flex-1 items-center bg-gray-50 rounded-xl p-4'
              onPress={handlePickSticker}>
              <View className='mb-2'>
                <Smile color={iconColors.subtle} size={28} />
              </View>
              <Text className='text-xs text-gray-700'>Sticker</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {/* Sticker Picker */}
      {showStickerPicker ? (
        <StickerPicker
          onClose={() => {
            setShowStickerPicker(false)
          }}
          onSelectSticker={handleSelectSticker}
        />
      ) : null}
    </View>
  )
}
