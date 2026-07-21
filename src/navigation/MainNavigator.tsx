import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { ComponentPropsWithoutRef } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Paths } from '@/navigation/paths'
import type { MainTabParamList } from '@/navigation/types'
import { Chart as ChartScreen, Discover, Home, Positions } from '@/screens'
import { useTheme } from '@/theme'

import MarketStackNavigator from './MarketStackNavigator'

const Tab = createBottomTabNavigator<MainTabParamList>()

const INDICATOR_HEIGHT = 4

function AnimatedTabButton(props: BottomTabBarButtonProps) {
  const { colors } = useTheme()
  const focused = props.accessibilityState?.selected ?? false
  const opacity = useRef(new Animated.Value(focused ? 1 : 0)).current
  const scaleX = useRef(new Animated.Value(focused ? 1 : 0)).current
  const contentScale = useRef(new Animated.Value(focused ? 1 : 0.92)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        duration: 220,
        toValue: focused ? 1 : 0,
        useNativeDriver: true,
      }),
      Animated.spring(scaleX, {
        damping: 14,
        stiffness: 180,
        toValue: focused ? 1 : 0,
        useNativeDriver: true,
      }),
      Animated.spring(contentScale, {
        damping: 12,
        stiffness: 160,
        toValue: focused ? 1 : 0.92,
        useNativeDriver: true,
      }),
    ]).start()
  }, [focused, opacity, scaleX, contentScale])

  return (
    <View style={styles.tabButtonWrap}>
      <Pressable
        {...(props as ComponentPropsWithoutRef<typeof Pressable>)}
        style={[styles.tabPressable, props.style]}>
        <Animated.View
          pointerEvents='none'
          style={[
            styles.tabContentWrap,
            { transform: [{ scale: contentScale }] },
          ]}>
          {props.children}
        </Animated.View>
      </Pressable>
      <Animated.View
        pointerEvents='none'
        style={[
          styles.tabIndicator,
          {
            backgroundColor: colors.primary500,
            opacity,
            transform: [{ scaleX }],
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  tabButtonWrap: {
    flex: 1,
  },
  tabContentWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  tabIndicator: {
    borderRadius: 2,
    bottom: 2,
    height: INDICATOR_HEIGHT,
    left: 16,
    position: 'absolute',
    right: 16,
    zIndex: 2,
  },
  tabPressable: {
    flex: 1,
    zIndex: 1,
  },
})

const NAV_ICONS = {
  discover: require('@/assets/images/nav/discover.png'),
  discoverActive: require('@/assets/images/nav/discover-active.png'),
  home: require('@/assets/images/nav/home.png'),
  homeActive: require('@/assets/images/nav/home-active.png'),
  market: require('@/assets/images/nav/market.png'),
  marketActive: require('@/assets/images/nav/market-active.png'),
  position: require('@/assets/images/nav/position.png'),
  positionActive: require('@/assets/images/nav/position-active.png'),
  trade: require('@/assets/images/nav/trade.png'),
} as const

const ICON_SIZE = 24

function HomeTabIcon({ focused }: { color: string; focused: boolean }) {
  return (
    <Image
      resizeMode='contain'
      source={focused ? NAV_ICONS.homeActive : NAV_ICONS.home}
      style={{ height: ICON_SIZE, width: ICON_SIZE }}
    />
  )
}

function MarketTabIcon({ focused }: { color: string; focused: boolean }) {
  return (
    <Image
      resizeMode='contain'
      source={focused ? NAV_ICONS.marketActive : NAV_ICONS.market}
      style={{
        height: ICON_SIZE,
        // tintColor: color,
        width: ICON_SIZE,
      }}
    />
  )
}

function TradeTabIcon({ color }: { color: string; focused: boolean }) {
  return (
    <Image
      resizeMode='contain'
      source={NAV_ICONS.trade}
      style={{
        height: ICON_SIZE,
        tintColor: color,
        width: ICON_SIZE,
      }}
    />
  )
}

function PositionsTabIcon({ focused }: { color: string; focused: boolean }) {
  return (
    <View style={{ height: ICON_SIZE, width: ICON_SIZE }}>
      <Image
        resizeMode='contain'
        source={focused ? NAV_ICONS.positionActive : NAV_ICONS.position}
        style={{ height: ICON_SIZE, width: ICON_SIZE }}
      />
      {/* <View
        style={{
          position: 'absolute',
          top: -4,
          right: -6,
          backgroundColor: 'red',
          borderRadius: 8,
          minWidth: 16,
          height: 16,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 3,
        }}>
        <Text className='text-neutral-0 text-[10px] font-bold leading-[14px]'>
          1
        </Text>
      </View> */}
    </View>
  )
}

function DiscoverTabIcon({ focused }: { color: string; focused: boolean }) {
  return (
    <Image
      resizeMode='contain'
      source={focused ? NAV_ICONS.discoverActive : NAV_ICONS.discover}
      style={{
        height: ICON_SIZE,
        width: ICON_SIZE,
      }}
    />
  )
}

const TAB_BAR_HEIGHT = 76

function MainNavigator() {
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  const screenOptions = useMemo(
    () => ({
      detachInactiveScreens: true,
      headerShown: false,
      tabBarActiveTintColor: colors.primary500,
      tabBarButton: (props: BottomTabBarButtonProps) => (
        <AnimatedTabButton {...props} />
      ),
      tabBarInactiveTintColor: colors.neutral500,
      tabBarItemStyle: {
        flex: 1,
        minWidth: 0,
      },
      tabBarLabelStyle: {
        flexShrink: 0,
        fontSize: 12,
        fontWeight: '600' as const,
        marginTop: 4,
      },
      tabBarShowLabel: true,
      tabBarStyle: {
        backgroundColor: colors.neutral0,
        borderTopColor: colors.neutral200,
        borderTopWidth: StyleSheet.hairlineWidth,
        height: TAB_BAR_HEIGHT + insets.bottom,
        paddingTop: 8,
      },
    }),
    [
      colors.neutral0,
      colors.neutral200,
      colors.neutral500,
      colors.primary500,
      insets.bottom,
    ],
  )

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        component={Home}
        name={Paths.Home}
        options={{
          tabBarIcon: HomeTabIcon,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        component={MarketStackNavigator}
        name={Paths.Market}
        options={{
          tabBarIcon: MarketTabIcon,
          tabBarLabel: 'Market',
        }}
      />
      <Tab.Screen
        component={ChartScreen}
        name={Paths.Trade}
        options={{
          tabBarIcon: TradeTabIcon,
          tabBarLabel: 'Trade',
        }}
      />
      <Tab.Screen
        component={Positions}
        name={Paths.Positions}
        options={{
          tabBarIcon: PositionsTabIcon,
          tabBarLabel: 'Positions',
        }}
      />
      <Tab.Screen
        component={Discover}
        name={Paths.Discover}
        options={{
          tabBarIcon: DiscoverTabIcon,
          tabBarLabel: 'Discover',
        }}
      />
    </Tab.Navigator>
  )
}

export default MainNavigator
