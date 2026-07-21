import React, { useState } from 'react'
import { View, Pressable } from 'react-native'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { useTheme } from '@/theme'

const CATEGORIES = ['Follow', 'Recommend', 'Latest']

export function DiscoverCategories() {
  const [activeCat, setActiveCat] = useState('Follow')
  const { colors } = useTheme()

  return (
    <View className='flex-row items-center border-b border-neutral-200 bg-white'>
      {CATEGORIES.map((cat) => {
        const isActive = activeCat === cat
        return (
          <Pressable
            key={cat}
            onPress={() => setActiveCat(cat)}
            className='flex-1 items-center justify-center py-3'
            style={{
              borderBottomWidth: 2,
              borderBottomColor: isActive ? colors.primary500 : 'transparent',
            }}>
            <Text
              style={{
                color: isActive ? colors.primary500 : colors.neutral500,
                fontSize: 16,
                fontWeight: isActive ? '600' : '500',
              }}>
              {cat}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
