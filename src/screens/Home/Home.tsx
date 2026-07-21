import { useIsFocused } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { RefreshControl, ScrollView, StatusBar, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { queryClient } from '@/App'
import { trendingMarketQueryKeys } from '@/hooks/market/useTrendingMarket'
import { useAuthStore } from '@/store/authStore'
import { useTheme } from '@/theme'

import AccountInfo from './components/AccountInfo'
import { GuestHomeHeader } from './components/GuestHomeHeader'
import { HomeFeatures } from './components/HomeFeatures'
import HomeHeader from './components/HomeHeader'
import MarketTrending from './components/MarketTrending'
import StrategyNews from './components/StrategyNews'
import TopRisersFallers from './components/TopRisersFallers'

function HomeScreen() {
  const { colors } = useTheme()
  const user = useAuthStore((state) => state.user)
  const isFocused = useIsFocused()
  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(async () => {
    setRefreshing(true)

    try {
      // Invalidate specific queries only
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['accounts'] }),
        queryClient.invalidateQueries({
          queryKey: trendingMarketQueryKeys.list(),
        }),
        queryClient.invalidateQueries({
          queryKey: trendingMarketQueryKeys.full(),
        }),
      ])
    } finally {
      setTimeout(() => {
        setRefreshing(false)
      }, 200)
    }
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-neutral-0' edges={['top']}>
      {isFocused && <StatusBar hidden={false} translucent={false} />}
      {user ? (
        <View>
          <HomeHeader />
          <ScrollView
            contentContainerClassName='pb-4'
            refreshControl={
              <RefreshControl
                colors={[colors.primary500]}
                refreshing={refreshing}
                tintColor={colors.primary500}
                onRefresh={onRefresh}
              />
            }
            scrollEventThrottle={16}>
            <AccountInfo />
            <HomeFeatures />
            <MarketTrending />
            <TopRisersFallers />
            <StrategyNews />
          </ScrollView>
        </View>
      ) : (
        <ScrollView
          contentContainerClassName='pb-8 pt-4'
          refreshControl={
            <RefreshControl
              colors={[colors.primary500]}
              refreshing={refreshing}
              tintColor={colors.primary500}
              onRefresh={onRefresh}
            />
          }>
          <GuestHomeHeader />
          <HomeFeatures />
          <MarketTrending />
          <TopRisersFallers />
          <StrategyNews />
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default HomeScreen
