import type { RouteProp } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

import { Paths } from '@/navigation/paths'
import type { DiscoverTabId, MainTabParamList } from '@/navigation/types'
import { HomeCalendar } from '@/screens/Home/components/HomeCalendar'
import { HomeNews } from '@/screens/Home/components/HomeNews'
import { HomeStrategy } from '@/screens/Home/components/HomeStrategy'

import { DiscoverHeader } from './components/DiscoverHeader'

export default function Discover() {
  const route = useRoute<RouteProp<MainTabParamList, Paths.Discover>>()
  const initialTabFromParams = route.params?.initialTab
  const [activeTab, setActiveTab] = useState<DiscoverTabId>('Strategy')

  useEffect(() => {
    if (
      initialTabFromParams &&
      ['Strategy', 'Calendar', 'News'].includes(initialTabFromParams)
    ) {
      setActiveTab(initialTabFromParams)
    }
  }, [initialTabFromParams])

  const renderContent = () => {
    switch (activeTab) {
      case 'Strategy':
        return (
          <View className='px-4 mt-4 pb-8'>
            <HomeStrategy />
          </View>
        )
      case 'Calendar':
        return (
          <View className='flex-1 px-4 mt-4'>
            <HomeCalendar scrollableList />
          </View>
        )
      case 'News':
        return (
          <View className='flex-1 px-4 mt-4'>
            <HomeNews scrollableList />
          </View>
        )
      default:
        return (
          <View className='px-4 mt-4 pb-8'>
            <HomeStrategy />
          </View>
        )
    }
  }

  return (
    <View className='flex-1 bg-white'>
      <DiscoverHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </View>
  )
}
