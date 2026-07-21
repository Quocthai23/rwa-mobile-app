import { useCallback, useMemo, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import { Clock, Search, Settings, X } from '@/components/atoms/Icon'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { gray, lightMode, semantic } from '@/theme/colors'
import { fontSize, fontWeight } from '@/theme/typography'
import { getStickerPacks, type Sticker } from '@/utils/stickerLoader'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const STICKER_SIZE = (SCREEN_WIDTH - 48) / 4

// Sticker types are imported from stickerLoader

type StickerPickerProps = {
  readonly onClose: () => void
  readonly onSelectSticker: (sticker: Sticker) => void
}

// Load sticker packs from local assets
const STICKER_PACKS = getStickerPacks()

// Simple mock data for recently used and most used
const getRecentlyUsedStickers = (): Sticker[] => {
  if (STICKER_PACKS.length === 0) return []

  return [
    STICKER_PACKS[0]?.stickers[0],
    STICKER_PACKS[1]?.stickers[2],
    STICKER_PACKS[2]?.stickers[1],
    STICKER_PACKS[0]?.stickers[3],
    STICKER_PACKS[3]?.stickers[0],
    STICKER_PACKS[0]?.stickers[5],
  ].filter((sticker): sticker is Sticker => sticker !== undefined)
}

const getMostUsedStickers = (): Sticker[] => {
  if (STICKER_PACKS.length === 0) return []

  return [
    STICKER_PACKS[0]?.stickers[0],
    STICKER_PACKS[0]?.stickers[2],
    STICKER_PACKS[1]?.stickers[0],
    STICKER_PACKS[2]?.stickers[3],
    STICKER_PACKS[3]?.stickers[2],
  ].filter((sticker): sticker is Sticker => sticker !== undefined)
}

type TabType = 'emoji' | 'gifs' | 'stickers'

const TABS: TabType[] = ['emoji', 'stickers', 'gifs']

// Theme colors & typography from app config (light mode for chat UI)
const theme = {
  accent: semantic.info.main,
  background: lightMode.background,
  border: gray[200],
  surface: lightMode.surface,
  text: {
    muted: lightMode.text.muted,
    primary: lightMode.text.primary,
    secondary: lightMode.text.secondary,
  },
}

// Animated Tab Indicator
function TabIndicator({ activeIndex }: { readonly activeIndex: number }) {
  const tabWidth = SCREEN_WIDTH / 3
  const translateX = useSharedValue(activeIndex * tabWidth)

  const animatedStyle = useAnimatedStyle(() => {
    translateX.value = withSpring(activeIndex * tabWidth, {
      damping: 20,
      stiffness: 200,
    })

    return {
      transform: [{ translateX: translateX.value }],
    }
  }, [activeIndex])

  return (
    <Animated.View
      className='absolute bottom-0 h-0.5'
      style={[
        animatedStyle,
        { backgroundColor: theme.accent, width: tabWidth },
      ]}
    />
  )
}

// Animated Sticker Item with scale effect
export function StickerPicker({
  onClose,
  onSelectSticker,
}: StickerPickerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('stickers')
  const [selectedPackId, setSelectedPackId] = useState<null | string>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const previousTabIndex = useRef(TABS.indexOf('stickers'))

  const recentlyUsed = useMemo(() => getRecentlyUsedStickers(), [])
  const mostUsed = useMemo(() => getMostUsedStickers(), [])
  const activeTabIndex = TABS.indexOf(activeTab)

  const handleTabChange = useCallback(
    (tab: TabType) => {
      previousTabIndex.current = TABS.indexOf(activeTab)
      setActiveTab(tab)
    },
    [activeTab],
  )

  const handleSelectSticker = useCallback(
    (sticker: Sticker) => {
      onSelectSticker(sticker)
    },
    [onSelectSticker],
  )

  // Determine slide direction based on tab change
  const getSlideDirection = () => {
    return activeTabIndex > previousTabIndex.current
      ? SlideInRight
      : SlideInLeft
  }

  const renderStickerItem = useCallback(
    ({ item }: { readonly item: Sticker }) => (
      <AnimatedStickerItem
        sticker={item}
        onPress={() => {
          handleSelectSticker(item)
        }}
      />
    ),
    [handleSelectSticker],
  )

  const renderPackContent = () => {
    if (selectedPackId === null) {
      return (
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          {/* Recently Used Section */}
          <Animated.View className='px-4 pt-4' entering={FadeIn.duration(300)}>
            <Text
              className='text-sm font-semibold mb-3'
              style={{ color: theme.text.primary }}>
              Recently used
            </Text>
            <View className='flex-row flex-wrap'>
              {recentlyUsed.slice(0, 8).map((sticker, index) => (
                <Animated.View
                  key={`recent-${sticker.id}`}
                  entering={FadeIn.delay(index * 30).duration(200)}>
                  <AnimatedStickerItem
                    sticker={sticker}
                    onPress={() => {
                      handleSelectSticker(sticker)
                    }}
                  />
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Most Used Section */}
          <Animated.View
            className='px-4 pt-4'
            entering={FadeIn.delay(100).duration(300)}>
            <Text
              className='text-sm font-semibold mb-3'
              style={{ color: theme.text.primary }}>
              Most used
            </Text>
            <View className='flex-row flex-wrap'>
              {mostUsed.slice(0, 8).map((sticker, index) => (
                <Animated.View
                  key={`most-${sticker.id}`}
                  entering={FadeIn.delay(50 + index * 30).duration(200)}>
                  <AnimatedStickerItem
                    sticker={sticker}
                    onPress={() => {
                      handleSelectSticker(sticker)
                    }}
                  />
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* All Sticker Packs */}
          {STICKER_PACKS.map((pack, packIndex) => (
            <Animated.View
              key={pack.id}
              className='px-4 pt-4'
              entering={FadeIn.delay(150 + packIndex * 50).duration(300)}>
              <View className='flex-row items-center justify-between mb-3'>
                <Text
                  className='text-sm font-semibold'
                  style={{ color: theme.text.primary }}>
                  {pack.name}
                </Text>
                <Pressable
                  onPress={() => {
                    setSelectedPackId(pack.id)
                  }}>
                  <X color={theme.text.muted} size={16} />
                </Pressable>
              </View>
              <View className='flex-row flex-wrap'>
                {pack.stickers.slice(0, 4).map((sticker) => (
                  <AnimatedStickerItem
                    key={sticker.id}
                    sticker={sticker}
                    onPress={() => {
                      handleSelectSticker(sticker)
                    }}
                  />
                ))}
              </View>
            </Animated.View>
          ))}
          <View className='h-4' />
        </ScrollView>
      )
    }

    const pack = STICKER_PACKS.find((p) => p.id === selectedPackId)
    if (!pack) return null

    return (
      <Animated.View className='flex-1' entering={SlideInRight.duration(200)}>
        <View className='flex-row items-center justify-between px-4 py-3'>
          <Text
            className='text-base font-semibold'
            style={{ color: theme.text.primary }}>
            {pack.name}
          </Text>
          <Pressable
            onPress={() => {
              setSelectedPackId(null)
            }}>
            <X color={theme.text.muted} size={18} />
          </Pressable>
        </View>
        <FlatList
          contentContainerStyle={{ padding: 8 }}
          data={pack.stickers}
          keyExtractor={(item) => item.id}
          numColumns={4}
          renderItem={renderStickerItem}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    )
  }

  const SlideAnimation = getSlideDirection()

  return (
    <Animated.View
      className='rounded-t-3xl'
      entering={FadeIn.duration(200)}
      style={{ backgroundColor: theme.background, height: 400 }}>
      {/* Tabs with animated indicator */}
      <View
        className='relative'
        style={{ borderBottomColor: theme.border, borderBottomWidth: 1 }}>
        <View className='flex-row'>
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              className='flex-1 py-3 items-center'
              onPress={() => {
                handleTabChange(tab)
              }}>
              <Text
                className='capitalize'
                style={{
                  color: activeTab === tab ? theme.accent : theme.text.muted,
                  fontSize: fontSize.md,
                  fontWeight:
                    activeTab === tab
                      ? fontWeight.semiBold
                      : fontWeight.regular,
                }}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>
        <TabIndicator activeIndex={activeTabIndex} />
      </View>

      {/* Search Bar */}
      <Animated.View
        className='px-4 py-2'
        entering={FadeIn.delay(100).duration(200)}>
        <View
          className='flex-row items-center rounded-full px-3 py-2'
          style={{ backgroundColor: theme.surface }}>
          <Search color={theme.text.muted} size={18} />
          <TextInput
            className='flex-1 ml-2'
            placeholder='Search'
            placeholderTextColor={theme.text.muted}
            style={{
              color: theme.text.primary,
              fontSize: fontSize.sm,
              fontWeight: fontWeight.regular,
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <ScrollView
            horizontal
            className='ml-2'
            showsHorizontalScrollIndicator={false}>
            <View className='flex-row gap-2'>
              <Text className='text-lg'>❤️</Text>
              <Text className='text-lg'>👍</Text>
              <Text className='text-lg'>👎</Text>
              <Text className='text-lg'>🎉</Text>
              <Text className='text-lg'>👋</Text>
              <Text className='text-lg'>😊</Text>
            </View>
          </ScrollView>
        </View>
      </Animated.View>

      {/* Content with slide animation */}
      <View className='flex-1'>
        {activeTab === 'stickers' && (
          <Animated.View
            key='stickers'
            className='flex-1'
            entering={SlideAnimation.duration(250)}
            exiting={FadeOut.duration(100)}>
            {renderPackContent()}
          </Animated.View>
        )}
        {activeTab === 'emoji' && (
          <Animated.View
            key='emoji'
            className='flex-1 items-center justify-center'
            entering={SlideAnimation.duration(250)}
            exiting={FadeOut.duration(100)}>
            <Text
              style={{
                color: theme.text.muted,
                fontSize: fontSize.sm,
                fontWeight: fontWeight.regular,
              }}>
              Emoji picker coming soon
            </Text>
          </Animated.View>
        )}
        {activeTab === 'gifs' && (
          <Animated.View
            key='gifs'
            className='flex-1 items-center justify-center'
            entering={SlideAnimation.duration(250)}
            exiting={FadeOut.duration(100)}>
            <Text
              style={{
                color: theme.text.muted,
                fontSize: fontSize.sm,
                fontWeight: fontWeight.regular,
              }}>
              GIF picker coming soon
            </Text>
          </Animated.View>
        )}
      </View>

      {/* Bottom Pack Selector */}
      <Animated.View
        className='flex-row items-center px-2 py-2'
        entering={FadeIn.delay(150).duration(200)}
        style={{
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          borderTopWidth: 1,
        }}>
        <Pressable className='p-2'>
          <Settings color={theme.text.muted} size={20} />
        </Pressable>
        <Pressable
          className='p-2 rounded-lg'
          style={
            selectedPackId === null
              ? { backgroundColor: theme.surface }
              : undefined
          }
          onPress={() => {
            setSelectedPackId(null)
          }}>
          <Clock
            color={
              selectedPackId === null ? theme.text.primary : theme.text.muted
            }
            size={20}
          />
        </Pressable>
        <ScrollView
          horizontal
          className='flex-1 ml-1'
          showsHorizontalScrollIndicator={false}>
          <View className='flex-row gap-1'>
            {STICKER_PACKS.map((pack) => (
              <Pressable
                key={pack.id}
                className='w-10 h-10 items-center justify-center rounded-lg overflow-hidden'
                style={
                  selectedPackId === pack.id
                    ? { backgroundColor: theme.surface }
                    : undefined
                }
                onPress={() => {
                  setSelectedPackId(pack.id)
                }}>
                {pack.thumbnail ? (
                  <Image
                    className='w-full h-full'
                    resizeMode='cover'
                    source={
                      typeof pack.thumbnail === 'string'
                        ? { uri: pack.thumbnail }
                        : (pack.thumbnail as { uri?: string })
                    }
                  />
                ) : (
                  <Text className='text-xl'>{pack.icon}</Text>
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  )
}

function AnimatedStickerItem({
  onPress,
  sticker,
}: {
  readonly onPress: () => void
  readonly sticker: Sticker
}) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 })
  }, [scale])

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 })
  }, [scale])

  return (
    <Pressable
      style={{ height: STICKER_SIZE, padding: 4, width: STICKER_SIZE }}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        className='flex-1 items-center justify-center'
        style={animatedStyle}>
        <Image
          className='w-full h-full'
          resizeMode='contain'
          source={
            typeof sticker.uri === 'string' && sticker.uri.startsWith('http')
              ? { uri: sticker.uri }
              : (sticker.uri as { uri?: string } | number)
          }
        />
      </Animated.View>
    </Pressable>
  )
}
