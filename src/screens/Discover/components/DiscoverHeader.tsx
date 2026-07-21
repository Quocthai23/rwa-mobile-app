import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import ButtonCustom from '@/components/atoms/Button/ButtonCustom'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { Paths } from '@/navigation/paths'
import { useAuthStore } from '@/store/authStore'
import { useTheme } from '@/theme'

const TABS = ['Strategy', 'Calendar', 'News']

interface DiscoverHeaderProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function DiscoverHeader({
  activeTab,
  setActiveTab,
}: DiscoverHeaderProps) {
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  const navigation = useNavigation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return (
    <View className='bg-white px-5' style={{ paddingTop: insets.top }}>
      {!isAuthenticated && (
        <View className='flex-row items-center justify-between h-14'>
          <View className='flex-row items-center gap-1.5'>
            <Pressable
              onPress={() =>
                navigation.navigate(
                  Paths.Login as never,
                  {
                    fromDiscover: true,
                  } as never,
                )
              }>
              <Text className='text-body-large-semibold text-neutral-900'>
                Log In
              </Text>
            </Pressable>
            <Text className='text-[25px] text-neutral-900'>|</Text>
            <Pressable
              onPress={() => navigation.navigate(Paths.Register as never)}>
              <Text className='text-body-large-semibold text-neutral-900'>
                Sign Up
              </Text>
            </Pressable>
          </View>
          <ButtonCustom
            type='APPLY'
            title='Log In'
            onPress={() =>
              navigation.navigate(
                Paths.Login as never,
                {
                  fromDiscover: true,
                } as never,
              )
            }
            style={{ flex: 0 }}
            className='h-[20px] w-[80px]'
          />
        </View>
      )}
      <View className='flex-row items-center h-16 mt-2'>
        {TABS.map((tab) => {
          const isActive = activeTab === tab
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              className='mr-6 h-full justify-center'>
              <Text
                style={{
                  color: isActive ? colors.neutral900 : colors.neutral500,
                  fontSize: isActive ? 24 : 18,
                  fontWeight: isActive ? '700' : '500',
                }}>
                {tab}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
