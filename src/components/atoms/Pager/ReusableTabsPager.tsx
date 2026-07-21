import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useTheme } from '@/theme'
import { formatPriceDecimal, formatPriceDecimal2 } from '@/utils/currency'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  type FlatList,
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'

type TabLayout = { width: number; x: number }

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v))

export type TabItem = {
  key: string // unique
  label: string // text on header
  render: (() => React.ReactNode) | React.ReactNode // component/render fn
  // optional: override label render
  renderLabel?: (isActive: boolean) => React.ReactNode
}

type Props = {
  readonly defaultIndex?: number
  readonly ohlc: { close: number; high: number; low: number; open: number }
  readonly tabs: readonly TabItem[]
  readonly currentSymbol: string
  // lazy mount: chỉ render tab đã visited (giống code của bạn)
  readonly lazy?: boolean
  readonly placeholder?: React.ReactNode

  readonly swipeEnabled?: boolean

  // style options
  readonly activeColor?: string
  readonly containerStyle?: ViewStyle
  readonly headerBorderColor?: string
  readonly inactiveColor?: string
  readonly underlineColor?: string

  readonly equalWidth?: boolean

  // right icon/action in header (list/filter...)
  readonly rightAction?: React.ReactNode

  // callback
  readonly onIndexChange?: (index: number, tab: TabItem) => void
}

export default function ReusableTabsPager({
  ohlc,
  currentSymbol,
  activeColor,
  containerStyle,
  defaultIndex = 0,
  equalWidth = false,
  inactiveColor,
  lazy = true,
  onIndexChange,
  placeholder,
  rightAction,
  swipeEnabled = true,
  tabs,
  underlineColor,
}: Props) {
  const { colors } = useTheme()

  // Set defaults from theme if not provided
  const activeColorResolved = activeColor ?? colors.primary600
  const inactiveColorResolved = inactiveColor ?? colors.neutral600
  const underlineColorResolved = underlineColor ?? colors.primary600
  const { width: SCREEN_W } = Dimensions.get('window')
  const EMPTY_SESSION_STATS = useMemo(
    () => ({ high: 0, low: 0, open: 0, prevClose: 0 }),
    [],
  )

  const change = useMarketSocketStore(
    (s) => s.rtBySymbol?.[currentSymbol]?.change,
  )
  const changePercent = useMarketSocketStore(
    (s) => s.rtBySymbol?.[currentSymbol]?.changePercent,
  )

  const rawSessionStats = useMarketSocketStore(
    (s) => s.rtBySymbol?.[currentSymbol]?.sessionStats,
  )

  const sessionStats = useMemo(
    () => rawSessionStats ?? EMPTY_SESSION_STATS,
    [rawSessionStats, EMPTY_SESSION_STATS],
  )

  const safeDefaultIndex = useMemo(() => {
    if (tabs.length === 0) return 0

    return Math.max(0, Math.min(defaultIndex, tabs.length - 1))
  }, [defaultIndex, tabs.length])

  const inputRange = useMemo(
    () => tabs.map((_, index) => index * SCREEN_W),
    [tabs, SCREEN_W],
  )

  const [activeIndex, setActiveIndex] = useState(safeDefaultIndex)
  const [activeKey, setActiveKey] = useState(tabs[safeDefaultIndex]?.key)

  // visited logic
  const visitedReference = useRef<Set<number>>(new Set([safeDefaultIndex]))
  const [, force] = useState(0)
  const markVisited = useCallback((index: number) => {
    if (!visitedReference.current.has(index)) {
      visitedReference.current.add(index)
      force((x) => x + 1)
    }
  }, [])

  const scrollViewReference = useRef<ScrollView>(null)
  const contentReference = useRef<FlatList<TabItem>>(null)

  // Animated scroll value
  const scrollX = useRef(
    new Animated.Value(safeDefaultIndex * SCREEN_W),
  ).current

  // header layout refs
  const tabLayoutsReference = useRef<Record<number, TabLayout>>({})
  const [layoutsVersion, setLayoutsVersion] = useState(0)
  const headerViewportWReference = useRef(0)
  const headerContentWReference = useRef(0)

  const underlineTranslateX = useMemo(() => {
    const outputRange = tabs.map((_, index) => {
      const x = tabLayoutsReference.current[index]?.x ?? 0

      return equalWidth ? x + 16 : x
    })

    return scrollX.interpolate({
      extrapolate: 'clamp',
      inputRange,
      outputRange,
    })
  }, [layoutsVersion, tabs, inputRange, equalWidth])

  const underlineWidth = useMemo(() => {
    const outputRange = tabs.map(
      (_, index) => tabLayoutsReference.current[index]?.width ?? 0,
    )

    return scrollX.interpolate({
      extrapolate: 'clamp',
      inputRange,
      outputRange,
    })
  }, [layoutsVersion, tabs, inputRange])

  const scrollHeaderToCenter = useCallback((index: number, animated = true) => {
    const layout = tabLayoutsReference.current[index]
    const viewportW = headerViewportWReference.current
    const contentW = headerContentWReference.current
    if (!layout || !viewportW || !contentW) return

    const tabCenter = layout.x + layout.width / 2
    const maxScrollX = Math.max(0, contentW - viewportW)
    const targetX = clamp(tabCenter - viewportW / 2, 0, maxScrollX)

    scrollViewReference.current?.scrollTo({ animated, x: targetX })
  }, [])

  const isPressingTabReference = useRef(false)

  const setIndexInternal = useCallback(
    (index: number, fromUserSwipe: boolean) => {
      const tab = tabs[index]
      if (!tab) return

      setActiveIndex(index)
      setActiveKey(tab.key)
      markVisited(index)
      scrollHeaderToCenter(index, true)
      onIndexChange?.(index, tab)

      if (!fromUserSwipe) {
        contentReference.current?.scrollToOffset({
          animated: false,
          offset: index * SCREEN_W,
        })
      }
    },
    [SCREEN_W, tabs, markVisited, scrollHeaderToCenter, onIndexChange],
  )

  const handlePressTab = useCallback(
    (index: number) => {
      if (!tabs[index]) return

      isPressingTabReference.current = true
      setIndexInternal(index, false)

      requestAnimationFrame(() => {
        isPressingTabReference.current = false
      })
    },
    [tabs, setIndexInternal],
  )

  // update activeIndex khi swipe
  const lastIndexReference = useRef(safeDefaultIndex)

  useEffect(() => {
    const id = scrollX.addListener(({ value }) => {
      if (isPressingTabReference.current) return

      const index = Math.round(value / SCREEN_W)
      if (index !== lastIndexReference.current && tabs[index]) {
        lastIndexReference.current = index
        setIndexInternal(index, true)
      }
    })

    return () => {
      scrollX.removeListener(id)
    }
  }, [SCREEN_W, scrollX, tabs, setIndexInternal, safeDefaultIndex])

  const onTabLayout = (index: number) => (e: LayoutChangeEvent) => {
    const { width, x } = e.nativeEvent.layout
    tabLayoutsReference.current[index] = { width, x }
    setLayoutsVersion((v) => v + 1)
  }

  const defaultPlaceholder = (
    <View
      style={{ alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
      <ActivityIndicator />
      <Text style={{ color: colors.neutral400, marginTop: 8 }}>Loading...</Text>
    </View>
  )

  const labelTextActive: TextStyle = {
    color: activeColorResolved,
    fontSize: 16,
    fontWeight: '500',
  }
  const labelTextInactive: TextStyle = {
    color: inactiveColorResolved,
    fontSize: 16,
    fontWeight: '500',
  }

  const renderTabContent = (tab: TabItem) => {
    if (typeof tab.render === 'function') return tab.render()

    return tab.render
  }

  if (tabs.length === 0) {
    return <View style={[{ flex: 1 }, containerStyle]} />
  }

  return (
    <View style={[{ flex: 1 }, containerStyle]}>
      {/* Header */}
      <View className='w-full'>
        <View className='flex-row items-center'>
          {equalWidth ? (
            // Equal width mode - tabs fill container equally
            <View style={{ flex: 1, position: 'relative' }}>
              <View style={{ flexDirection: 'row' }}>
                {tabs.map((tab, index) => {
                  const isActive = tab.key === activeKey

                  return (
                    <Pressable
                      key={tab.key}
                      style={{
                        alignItems: 'center',
                        flex: 1,
                        paddingVertical: 12,
                      }}
                      onLayout={onTabLayout(index)}
                      onPress={() => {
                        handlePressTab(index)
                      }}>
                      {tab.renderLabel ? (
                        tab.renderLabel(isActive)
                      ) : (
                        <Text
                          style={
                            isActive ? labelTextActive : labelTextInactive
                          }>
                          {tab.label}
                        </Text>
                      )}
                    </Pressable>
                  )
                })}
              </View>

              {/* Animated Underline */}
              <Animated.View
                pointerEvents='none'
                style={{
                  backgroundColor: underlineColorResolved,
                  bottom: 0,
                  height: 2,
                  position: 'absolute',
                  transform: [{ translateX: underlineTranslateX }],
                  width: underlineWidth,
                }}
              />
            </View>
          ) : (
            // Scrollable mode - original behavior
            <View
              className='flex-1 w-full'
              onLayout={(e) => {
                headerViewportWReference.current = e.nativeEvent.layout.width
              }}>
              <ScrollView
                ref={scrollViewReference}
                horizontal
                contentContainerStyle={{ paddingHorizontal: 16 }}
                showsHorizontalScrollIndicator={false}
                onContentSizeChange={(w) => {
                  headerContentWReference.current = w
                }}>
                <View className='flex-row' style={{ flex: 1, minWidth: '80%' }}>
                  {tabs.map((tab, index) => {
                    const isActive = tab.key === activeKey

                    return (
                      <Pressable
                        key={tab.key}
                        className='py-2'
                        style={{ flex: 1, alignItems: 'center' }}
                        onLayout={onTabLayout(index)}
                        onPress={() => {
                          handlePressTab(index)
                        }}>
                        {tab.renderLabel ? (
                          tab.renderLabel(isActive)
                        ) : (
                          <Text
                            className={`${isActive ? 'text-primary-500 text-body-large-semibold' : 'text-secondary-500 text-body-large-regular'}`}>
                            {tab.label}
                          </Text>
                        )}
                      </Pressable>
                    )
                  })}

                  {/* Underline */}
                  <Animated.View
                    pointerEvents='none'
                    style={{
                      backgroundColor: underlineColorResolved,
                      bottom: 0,
                      height: 2,
                      position: 'absolute',
                      transform: [{ translateX: underlineTranslateX }],
                      width: underlineWidth,
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          )}

          {rightAction ? (
            <View style={{ paddingHorizontal: 12 }}>{rightAction}</View>
          ) : null}
        </View>
      </View>
      {/* Content */}
      <Animated.FlatList
        ref={contentReference}
        horizontal
        pagingEnabled
        removeClippedSubviews
        data={tabs as TabItem[]}
        getItemLayout={(_, index) => ({
          index,
          length: SCREEN_W,
          offset: SCREEN_W * index,
        })}
        initialNumToRender={1}
        initialScrollIndex={safeDefaultIndex}
        keyExtractor={(item) => item.key}
        renderItem={({ index, item: tab }) => {
          const shouldRender =
            !lazy ||
            visitedReference.current.has(index) ||
            index === activeIndex

          return (
            <View style={{ width: SCREEN_W }}>
              {shouldRender
                ? renderTabContent(tab)
                : (placeholder ?? defaultPlaceholder)}
            </View>
          )
        }}
        scrollEnabled={swipeEnabled}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        windowSize={3}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W)
          setIndexInternal(index, true)
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          },
        )}
      />
    </View>
  )
}
