import { useCallback } from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import {
  Ban,
  Bell,
  FileText,
  Settings,
  Trash2,
  X,
} from '@/components/atoms/Icon'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { gray, iconColors, semantic } from '@/theme/colors'
import useTheme from '@/theme/hooks/useTheme'

type ChatSettingsMenuProps = {
  readonly isVisible: boolean
  readonly onBlockUser?: () => void
  readonly onClearChat?: () => void
  readonly onClose: () => void
  readonly onNotifications?: () => void
  readonly onReportIssue?: () => void
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

type MenuItemProps = {
  readonly danger?: boolean
  readonly hasBorder?: boolean
  readonly icon: React.ReactNode
  readonly index: number
  readonly label: string
  readonly onPress?: () => void
}

export function ChatSettingsMenu({
  isVisible,
  onBlockUser,
  onClearChat,
  onClose,
  onNotifications,
  onReportIssue,
}: ChatSettingsMenuProps) {
  if (!isVisible) return null
  const { colors } = useTheme()
  return (
    <AnimatedPressable
      className='absolute inset-0 z-50'
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onPress={onClose}>
      <Animated.View
        className='absolute right-4 top-16 bg-white rounded-2xl overflow-hidden'
        entering={SlideInRight.springify().damping(18).stiffness(200)}
        exiting={SlideOutRight.duration(150)}
        style={{
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          width: 260,
        }}>
        {/* Header */}
        <View
          className='flex-row items-center justify-between px-4 py-3 border-b'
          style={{ borderBottomColor: gray[100] }}>
          <View className='flex-row items-center'>
            <Settings color={iconColors.default} size={18} />
            <Text
              className='text-base font-bold ml-2'
              style={{ color: gray[800] }}>
              Chat Settings
            </Text>
          </View>
          <Pressable
            className='p-1 rounded-full'
            style={{ backgroundColor: gray[100] }}
            onPress={onClose}>
            <X color={colors.gray500} size={16} />
          </Pressable>
        </View>

        {/* Menu Items */}
        <View>
          <MenuItem
            icon={<Bell color={iconColors.default} size={20} />}
            index={0}
            label='Notifications'
            onPress={onNotifications}
          />
          <MenuItem
            icon={<Ban color={iconColors.default} size={20} />}
            index={1}
            label='Block User'
            onPress={onBlockUser}
          />
          <MenuItem
            icon={<FileText color={iconColors.default} size={20} />}
            index={2}
            label='Report Issue'
            onPress={onReportIssue}
          />
          <MenuItem
            danger
            hasBorder
            icon={<Trash2 color={semantic.error.main} size={20} />}
            index={3}
            label='Clear Chat'
            onPress={onClearChat}
          />
        </View>
      </Animated.View>
    </AnimatedPressable>
  )
}

function MenuItem({
  danger,
  hasBorder,
  icon,
  index,
  label,
  onPress,
}: MenuItemProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 })
  }, [scale])

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 })
  }, [scale])

  return (
    <AnimatedPressable
      entering={FadeIn.delay(index * 50).duration(200)}
      style={animatedStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View
        className={`flex-row items-center px-4 py-3 ${hasBorder ? 'border-t' : ''}`}
        style={hasBorder ? { borderTopColor: gray[100] } : undefined}>
        <View className='mr-3'>{icon}</View>
        <Text
          className='text-base'
          style={{ color: danger ? semantic.error.main : gray[700] }}>
          {label}
        </Text>
      </View>
    </AnimatedPressable>
  )
}
