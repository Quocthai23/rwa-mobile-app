import React from 'react'
import { View, Image, Pressable } from 'react-native'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import {
  MessageCircle,
  Forward,
  Repeat,
  Bookmark,
  ThumbsUp,
  BadgeCheck,
} from 'lucide-react-native'
import { useTheme } from '@/theme'

interface FeedItemProps {
  post: {
    id: string
    author: {
      name: string
      avatar: string
      verified: boolean
      followers: number
    }
    content: {
      title: string
      text: string
      images: string[]
    }
    stats: {
      likes: number
      comments: number
      shares: number
      reposts: number
    }
  }
}

export function FeedItem({ post }: FeedItemProps) {
  const { colors } = useTheme()

  return (
    <View className='bg-white p-5 border-b border-neutral-200'>
      {/* Header */}
      <View className='flex-row items-center mb-4'>
        {post.author.avatar ? (
          <Image
            source={{ uri: post.author.avatar }}
            className='w-12 h-12 rounded-full mr-3 bg-neutral-100'
          />
        ) : (
          <View className='w-12 h-12 rounded-full mr-3 bg-neutral-200' />
        )}
        <View className='flex-1'>
          <View className='flex-row items-center'>
            <Text className='text-base font-bold text-neutral-900 mr-1'>
              {post.author.name}
            </Text>
            {post.author.verified && (
              <BadgeCheck
                size={18}
                color={colors.primary500}
                fill={colors.primary500}
                stroke='white'
              />
            )}
          </View>
          <View className='flex-row items-center mt-1'>
            <Text className='text-sm font-medium text-neutral-500'>
              <Text style={{ fontSize: 14 }}>👥</Text>{' '}
              {post.author.followers.toLocaleString()}
            </Text>
          </View>
        </View>
        <Pressable className='bg-primary-500 px-5 py-2 rounded-lg'>
          <Text className='text-white font-semibold text-sm'>Follow</Text>
        </Pressable>
      </View>

      {/* Content */}
      <Text className='text-base font-bold text-neutral-900 mb-2'>
        {post.content.title}
      </Text>
      <Text
        className='text-base text-neutral-700 leading-6 mb-4'
        numberOfLines={4}>
        {post.content.text}
      </Text>

      {/* Images - Grid Layout */}
      {post.content.images.length === 1 && (
        <View className='w-full h-40 mb-4 rounded-xl overflow-hidden'>
          <Image
            source={{ uri: post.content.images[0] }}
            className='w-full h-full bg-neutral-100'
            resizeMode='cover'
          />
        </View>
      )}

      {post.content.images.length > 1 && (
        <View className='flex-row w-full h-32 mb-4'>
          {post.content.images.slice(0, 3).map((img, index) => (
            <View
              key={index}
              className='flex-1 rounded-xl overflow-hidden relative'
              style={{ marginLeft: index > 0 ? 8 : 0 }}>
              <Image
                source={{ uri: img }}
                className='w-full h-full bg-neutral-100'
                resizeMode='cover'
              />
              {index === 2 && post.content.images.length > 3 && (
                <View className='absolute inset-0 bg-black/50 items-center justify-center'>
                  <Text className='text-white text-xl font-bold'>
                    +{post.content.images.length - 3}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Action Bar */}
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center flex-1 justify-between pr-8'>
          <Pressable className='flex-row items-center'>
            <ThumbsUp size={20} color={colors.neutral700} />
            <Text className='text-sm font-medium text-neutral-700 ml-2'>
              {post.stats.likes}
            </Text>
          </Pressable>
          <Pressable className='flex-row items-center'>
            <MessageCircle size={20} color={colors.neutral700} />
            <Text className='text-sm font-medium text-neutral-700 ml-2'>
              {post.stats.comments}
            </Text>
          </Pressable>
          <Pressable className='flex-row items-center'>
            <Forward size={22} color={colors.neutral700} />
            <Text className='text-sm font-medium text-neutral-700 ml-2'>
              {post.stats.shares}
            </Text>
          </Pressable>
          <Pressable className='flex-row items-center'>
            <Repeat size={20} color={colors.neutral700} />
            <Text className='text-sm font-medium text-neutral-700 ml-2'>
              {post.stats.reposts}
            </Text>
          </Pressable>
        </View>
        <Pressable className='p-2 -mr-2'>
          <Bookmark size={22} color={colors.neutral700} />
        </Pressable>
      </View>
    </View>
  )
}
