import AppBottomSheetModal, {
  AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import IconList from '@/components/icons/IconList'
import { useTheme } from '@/theme'
import { Check } from 'lucide-react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import Fav from './Fav'
import ForexTab from './ForexTab'
import Popular from './Popular'
import AssetListTab from './AssetListTab'
import { useAssetCategories } from '@/hooks'

const STATIC_TABS = ['Fav', 'Popular'] as const
const DEFAULT_INDEX = STATIC_TABS.indexOf('Popular')
const { width: SCREEN_W } = Dimensions.get('window')
type TabLayout = { x: number; width: number }

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v))

export default function MarketTabs() {
  const { colors } = useTheme()
  const { data: categories } = useAssetCategories()

  const tabs = useMemo(
    () => [
      ...STATIC_TABS,
      ...(categories ?? []).map((category) => category.name),
    ],
    [categories],
  )

  const [activeTab, setActiveTab] = useState<string>(STATIC_TABS[DEFAULT_INDEX])
  const [activeIndex, setActiveIndex] = useState(DEFAULT_INDEX)
  const visitedRef = useRef<Set<number>>(new Set([DEFAULT_INDEX]))

  const [, force] = React.useState(0)
  const markVisited = (index: number) => {
    if (!visitedRef.current.has(index)) {
      visitedRef.current.add(index)
      force((x) => x + 1)
    }
  }
  const scrollViewRef = useRef<ScrollView>(null)
  //   const contentScrollRef = useRef<ScrollView>(null);
  const contentScrollRef = useRef<FlatList<string>>(null)

  const scrollX = useRef(new Animated.Value(0)).current
  const sheetRef = useRef<AppBottomSheetModalHandle>(null)
  const tabLayoutsRef = useRef<Record<number, TabLayout>>({})
  const [layoutsVersion, setLayoutsVersion] = useState(0)
  const headerViewportWRef = useRef(0)
  const headerContentWRef = useRef(0)
  const inputRange = useMemo(
    () => tabs.map((_, i) => i * SCREEN_W),
    [tabs.length],
  )
  const underlineTranslateX = useMemo(() => {
    const outputRange = tabs.map((_, i) => tabLayoutsRef.current[i]?.x ?? 0)
    return scrollX.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    })
  }, [inputRange, layoutsVersion, tabs.length])

  const underlineWidth = useMemo(() => {
    const outputRange = tabs.map((_, i) => tabLayoutsRef.current[i]?.width ?? 0)
    return scrollX.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    })
  }, [inputRange, layoutsVersion, tabs.length])

  const scrollHeaderToCenter = (index: number, animated = true) => {
    const layout = tabLayoutsRef.current[index]
    const viewportW = headerViewportWRef.current
    const contentW = headerContentWRef.current

    if (!layout || !viewportW || !contentW) return

    const tabCenter = layout.x + layout.width / 2

    const maxScrollX = Math.max(0, contentW - viewportW)
    const targetX = clamp(tabCenter - viewportW / 2, 0, maxScrollX)

    scrollViewRef.current?.scrollTo({ x: targetX, animated })
  }

  const isPressingTabRef = useRef(false)
  const handleTabChange = (tab: string) => {
    const index = tabs.indexOf(tab)
    if (index < 0) return

    isPressingTabRef.current = true

    setActiveTab(tab)

    // contentScrollRef.current?.scrollTo({
    //   x: index * SCREEN_W,
    //   animated: false,
    // });
    contentScrollRef.current?.scrollToOffset({
      offset: index * SCREEN_W,
      animated: false,
    })
    scrollHeaderToCenter(index, true)

    setActiveIndex(index)
    markVisited(index)

    requestAnimationFrame(() => {
      isPressingTabRef.current = false
    })
  }

  const lastIndexRef = useRef(0)
  useEffect(() => {
    const id = scrollX.addListener(({ value }) => {
      const idx = Math.round(value / SCREEN_W)
      if (idx !== lastIndexRef.current && tabs[idx]) {
        lastIndexRef.current = idx
        setActiveTab(tabs[idx])
        scrollHeaderToCenter(idx, true)
      }
    })
    return () => scrollX.removeListener(id)
  }, [scrollX, tabs])

  const onTabLayout = (index: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout
    tabLayoutsRef.current[index] = { x, width }

    setLayoutsVersion((v) => v + 1)
  }

  return (
    <View className='flex-1'>
      {/* Tabs Header */}
      <View className='pt-2'>
        <View className='flex-row items-center'>
          <View
            className='flex-row items-center'
            onLayout={(e) => {
              headerViewportWRef.current = e.nativeEvent.layout.width
            }}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              onContentSizeChange={(w) => {
                headerContentWRef.current = w
              }}>
              <View className='relative flex-row border-b border-neutral-200'>
                {tabs.map((tab, i) => (
                  <Pressable
                    key={tab}
                    onPress={() => handleTabChange(tab)}
                    onLayout={onTabLayout(i)}
                    className='mr-6 py-2 px-3'>
                    <Text
                      className={` ${
                        activeTab === tab
                          ? 'text-primary-500 text-body-small-semibold'
                          : 'text-neutral-500 text-body-small-regular'
                      }`}>
                      {tab}
                    </Text>
                  </Pressable>
                ))}
                {}
                <Animated.View
                  pointerEvents='none'
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    height: 2,
                    backgroundColor: colors.primary500,
                    transform: [{ translateX: underlineTranslateX }],
                    width: underlineWidth,
                  }}
                />
              </View>
            </ScrollView>
            {/* List Icon Button */}
            <Pressable
              // onPress={() => setShowTabModal(true)}
              onPress={() => sheetRef.current?.open()}
              className='px-4 pl-2 py-2'>
              <IconList />
            </Pressable>
          </View>
        </View>
      </View>

      <Animated.FlatList
        ref={contentScrollRef}
        data={tabs}
        initialScrollIndex={DEFAULT_INDEX}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W)
          setActiveIndex(index)
          markVisited(index)
        }}
        renderItem={({ item: tab, index }) => {
          const shouldRender =
            visitedRef.current.has(index) || index === activeIndex

          return (
            <View style={{ width: SCREEN_W }} className='p-4'>
              {!shouldRender ? (
                <View className='items-center justify-center mt-3'>
                  <ActivityIndicator />
                  <Text className='text-gray-400 mt-2'>Loading...</Text>
                </View>
              ) : (
                <>
                  {tab === 'Fav' && <Fav />}
                  {tab === 'Popular' && <Popular />}

                  {!['Fav', 'Popular'].includes(tab) && (
                    <>
                      {(() => {
                        const category = categories?.find((c) => c.name === tab)

                        if (!category) {
                          return (
                            <Text className='text-neutral-600'>
                              No data for {tab}.
                            </Text>
                          )
                        }

                        return <AssetListTab categoryCode={category.code} />
                      })()}
                    </>
                  )}
                </>
              )}
            </View>
          )
        }}
        initialNumToRender={1}
        windowSize={3}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: SCREEN_W,
          offset: SCREEN_W * index,
          index,
        })}
      />

      <AppBottomSheetModal
        ref={sheetRef}
        // snapPoints={['60%']}
        animationDuration={250}>
        <TabSelectionContent
          tabs={tabs}
          activeTab={activeTab}
          onTabSelect={(tab) => {
            handleTabChange(tab)
            sheetRef.current?.close()
          }}
          onClose={() => sheetRef.current?.close()}
        />
      </AppBottomSheetModal>
    </View>
  )
}
const TabSelectionContent = React.memo(
  ({
    tabs,
    activeTab,
    onTabSelect,
    onClose,
  }: {
    tabs: string[]
    activeTab: string
    onTabSelect: (tab: string) => void
    onClose: () => void
  }) => {
    const { colors } = useTheme()
    return (
      <View className='pt-2'>
        <Text className='text-xl px-4 font-bold pb-4 border-b border-neutral-200'>
          Manage Groups
        </Text>

        <View className='-mx-2 mt-4 pb-4 px-4'>
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => onTabSelect(tab)}
              className='w-full mb-3'>
              <View
                className={`p-4 py-2 flex-row items-center justify-between rounded-xl `}>
                <Text
                  className={`text-center font-medium ${
                    activeTab === tab ? 'text-primary-500' : 'text-neutral-900'
                  }`}>
                  {tab}
                </Text>
                {activeTab === tab && (
                  <Check size={18} color={colors.primary500} />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    )
  },
)
