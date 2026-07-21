import React from 'react'
import { Pressable, ScrollView, Text } from 'react-native'

import { cn } from '@/utils'

import type { TabId, TabInfo } from './types'

type TradeTabsProps = {
  activeTab: TabId
  tabs: TabInfo[]
  onTabPress: (tabId: TabId) => void
}

const TradeTabs = ({ activeTab, tabs, onTabPress }: TradeTabsProps) => {
  const scrollViewRef = React.useRef<ScrollView>(null)
  const tabLayoutsRef = React.useRef<
    Partial<Record<TabId, { x: number; width: number }>>
  >({})
  const scrollViewWidthRef = React.useRef(0)

  const handlePress = (tabId: TabId, index: number) => {
    onTabPress(tabId)

    if (index === 0) {
      scrollViewRef.current?.scrollTo({ x: 0, animated: true })

      return
    }

    if (index === tabs.length - 1) {
      scrollViewRef.current?.scrollToEnd({ animated: true })

      return
    }

    const layout = tabLayoutsRef.current[tabId]

    if (!layout) return

    const offset = layout.x + layout.width / 2 - scrollViewWidthRef.current / 2

    scrollViewRef.current?.scrollTo({ x: Math.max(0, offset), animated: true })
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      className='mt-4'
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 8,
        alignItems: 'center',
        height: 40,
      }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={{ height: 40, flexShrink: 0 }}
      onLayout={(e) => {
        scrollViewWidthRef.current = e.nativeEvent.layout.width
      }}>
      {tabs.map((tab, index) => (
        <Pressable
          key={tab.id}
          className={cn(
            'h-[36px] px-4 items-center justify-center bg-neutral-100 rounded',
            activeTab === tab.id ? 'bg-primary-100' : '',
          )}
          onLayout={(e) => {
            tabLayoutsRef.current[tab.id] = {
              x: e.nativeEvent.layout.x,
              width: e.nativeEvent.layout.width,
            }
          }}
          onPress={() => handlePress(tab.id, index)}>
          <Text
            className={cn(
              'text-body-regular text-neutral-500',
              activeTab === tab.id ? 'text-primary-500 font-semibold' : '',
            )}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}

export default TradeTabs
