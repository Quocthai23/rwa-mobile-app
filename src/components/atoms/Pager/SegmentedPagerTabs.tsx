// SegmentedPagerTabs.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'
import PagerView from 'react-native-pager-view'
import { useTheme } from '@/theme'

export type SegmentedTabItem = {
  badge?: number
  disabled?: boolean
  key: string
  render: () => React.ReactNode
  title: string
}

type Props = {
  readonly initialIndex?: number
  readonly tabs: SegmentedTabItem[]

  readonly swipeEnabled?: boolean

  readonly onIndexChange?: (index: number) => void

  // style
  readonly containerStyle?: ViewStyle
  readonly contentStyle?: ViewStyle
  readonly indicatorStyle?: ViewStyle
  readonly tabBarStyle?: ViewStyle
  readonly tabTextActiveStyle?: TextStyle
  readonly tabTextStyle?: TextStyle

  // màu nhanh
  readonly activeBgColor?: string
  readonly activeTextColor?: string
  readonly borderColor?: string
  readonly inactiveTextColor?: string
}

export default function SegmentedPagerTabs({
  activeBgColor,
  activeTextColor,
  borderColor,
  containerStyle,

  contentStyle,
  inactiveTextColor,
  indicatorStyle,
  initialIndex = 0,
  onIndexChange,
  swipeEnabled = false,

  tabBarStyle,
  tabs,
  tabTextActiveStyle,
  tabTextStyle,
}: Props) {
  const { colors } = useTheme()
  const activeBgColorResolved = activeBgColor ?? colors.primary500
  const activeTextColorResolved = activeTextColor ?? colors.neutral0
  const borderColorResolved = borderColor ?? colors.neutral200
  const inactiveTextColorResolved = inactiveTextColor ?? colors.neutral700
  const pagerReference = useRef<PagerView>(null)

  const [activeIndex, setActiveIndex] = useState(() =>
    clamp(initialIndex, 0, Math.max(0, tabs.length - 1)),
  )

  const [barWidth, setBarWidth] = useState(0)

  // indicator animation
  const translateX = useRef(new Animated.Value(0)).current

  const itemWidth = useMemo(() => {
    if (!barWidth || tabs.length === 0) return 0

    return barWidth / tabs.length
  }, [barWidth, tabs.length])

  // sync indicator when activeIndex changes
  useEffect(() => {
    if (!itemWidth) return

    Animated.spring(translateX, {
      friction: 12,
      tension: 90,
      toValue: activeIndex * itemWidth,
      useNativeDriver: true,
    }).start()
  }, [activeIndex, itemWidth, translateX])

  // jump pager on activeIndex change
  useEffect(() => {
    pagerReference.current?.setPage(activeIndex)
  }, [activeIndex])

  const onLayoutBar = (e: LayoutChangeEvent) => {
    setBarWidth(e.nativeEvent.layout.width)
  }

  const setIndex = (index: number) => {
    const next = clamp(index, 0, tabs.length - 1)
    if (tabs[next]?.disabled) return
    setActiveIndex(next)
    onIndexChange?.(next)
  }

  const onPageSelected = (e: any) => {
    const index = e.nativeEvent.position as number

    if (index !== activeIndex) {
      setActiveIndex(index)
      onIndexChange?.(index)
    }
  }

  if (!tabs?.length) return null

  return (
    <View style={[styles.container, containerStyle]}>
      {/* TAB BAR */}
      <View
        style={[
          styles.tabBar,
          { borderColor: borderColorResolved },
          tabBarStyle,
        ]}
        onLayout={onLayoutBar}>
        {}
        <Animated.View
          pointerEvents='none'
          style={[
            styles.indicator,
            {
              backgroundColor: activeBgColorResolved,
              transform: [{ translateX }],
              width: itemWidth,
            },
            indicatorStyle,
          ]}
        />

        {tabs.map((t, index) => {
          const isActive = index === activeIndex

          return (
            <Pressable
              key={t.key}
              disabled={t.disabled}
              style={styles.tabBtn}
              onPress={() => {
                setIndex(index)
              }}>
              <View style={styles.tabInner}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabText,
                    {
                      color: isActive
                        ? activeTextColorResolved
                        : inactiveTextColorResolved,
                    },
                    tabTextStyle,
                    isActive && tabTextActiveStyle,
                    t.disabled && styles.disabledText,
                  ]}>
                  {t.title}
                </Text>

                {typeof t.badge === 'number' && t.badge > 0 && (
                  <View style={[styles.badge, isActive && styles.badgeActive]}>
                    <Text
                      style={[
                        styles.badgeText,
                        isActive && styles.badgeTextActive,
                      ]}>
                      {t.badge > 99 ? '99+' : String(t.badge)}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          )
        })}
      </View>

      {/* CONTENT */}
      <View style={[styles.content, contentStyle]}>
        <PagerView
          ref={pagerReference}
          initialPage={activeIndex}
          scrollEnabled={swipeEnabled}
          style={{ flex: 1 }}
          onPageSelected={onPageSelected}>
          {tabs.map((t) => (
            <View key={t.key}>{t.render()}</View>
          ))}
        </PagerView>
      </View>
    </View>
  )
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 9,
    height: 18,
    justifyContent: 'center',
    minWidth: 18,
    paddingHorizontal: 6,
  },

  badgeActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  badgeText: { color: '#111827', fontSize: 11, fontWeight: '700' },

  badgeTextActive: { color: '#fff' },
  container: { flex: 1 },
  content: { flex: 1, marginTop: 10 },

  disabledText: { opacity: 0.4 },
  indicator: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  tabBar: {
    backgroundColor: '#F9FAFB', // gray-50
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 44,
    overflow: 'hidden',
  },
  tabBtn: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  tabInner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 8,
  },

  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
})
