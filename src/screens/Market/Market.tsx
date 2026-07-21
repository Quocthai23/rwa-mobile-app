import { useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react'
import { Pressable, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { Paths } from '@/navigation/paths'
import type { MainTabScreenProps } from '@/navigation/types'

import MarketTabs from './components/tabs/MarketTabs'
import { useTheme } from '@/theme'
import AccountDropdown from './components/AccountDropdown'
import SearchIcon from '@/components/icons/SearchIcon'

type Props = MainTabScreenProps<Paths.Market>

function MarketScreen({ navigation: tabNavigation }: Props) {
  const [activeTab, setActiveTab] = useState<'Market' | 'Strategy'>('Market')
  const { colors } = useTheme()

  // Reset navigation stack to Market screen when tab is focused
  useFocusEffect(
    useCallback(() => {
      // Check if we're not on the Market screen (i.e., we're on SymbolDetail, Alerts, or Search)
      const state = tabNavigation.getState()
      if (state.routes.length > 1) {
        // Reset to the Market screen only
        tabNavigation.reset({
          index: 0,
          routes: [{ name: Paths.Market }],
        })
      }
    }, [tabNavigation]),
  )
  return (
    <SafeAreaView
      className='flex-1'
      edges={['top']}
      style={{ backgroundColor: colors.neutral0 }}>
      {/* header */}
      <View className='relative '>
        <View className='flex-row h-[70px] items-center justify-between px-4 '>
          {/* Left side - Tabs */}
          <View className='flex-row gap-4'>
            {['Market', 'Strategy'].map((tab) => (
              <Pressable
                key={tab}
                onPress={() => {
                  setActiveTab(tab as 'Market' | 'Strategy')
                }}>
                <View
                  className='px-3 py-1 rounded-[4px]'
                  style={{
                    backgroundColor:
                      activeTab === tab ? colors.neutral100 : 'transparent',
                  }}>
                  <Text
                    style={{
                      color:
                        activeTab === tab
                          ? colors.neutral900
                          : colors.neutral500,
                    }}
                    className={`leading-9 text-center ${activeTab === tab ? 'text-h3-semibold' : 'text-h3-regular'}`}>
                    {tab}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Right side - Account info */}
          <AccountDropdown />
        </View>
      </View>
      <View className='px-4'>
        <Pressable
          onPress={() => {
            tabNavigation.navigate(Paths.Search)
          }}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            gap: 8,
            height: 40,
            paddingHorizontal: 12,
            borderRadius: 4,
            borderColor: colors.neutral200,
            borderWidth: 1,
          }}>
          {/* <Icon name="search" size={18} color="#9CA3AF" /> */}
          <SearchIcon
            size={18}
            strokeColor={colors.neutral500}
            color={colors.neutral0}
          />
          <Text className='text-base text-neutral-500'>Search</Text>
          {/* <TextInput
            placeholder="Search"
            placeholderTextColor="#9CA3AF"
            style={{
              flex: 1,
              fontSize: 14,
              color: '#111827',
              paddingVertical: 0,
            }}
            returnKeyType="search"
          /> */}
        </Pressable>
      </View>
      <MarketTabs />
    </SafeAreaView>
  )
}

export default MarketScreen
