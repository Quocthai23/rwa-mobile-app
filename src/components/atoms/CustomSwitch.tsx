import React, { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'

interface CustomSwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  activeColor?: string
  inactiveColor?: string
  thumbColor?: string
  width?: number
  height?: number
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  value,
  onValueChange,
  activeColor,
  inactiveColor,
  thumbColor,
  width = 51,
  height = 31,
}) => {
  const { colors } = useTheme()

  // Set defaults from theme if not provided
  const activeColorResolved = activeColor ?? colors.primary500
  const inactiveColorResolved = inactiveColor ?? colors.neutral200
  const thumbColorResolved = thumbColor ?? colors.neutral0

  const translateX = useRef(new Animated.Value(value ? 1 : 0)).current
  const backgroundColor = useRef(new Animated.Value(value ? 1 : 0)).current

  const thumbSize = height - 4
  const thumbOffset = width - thumbSize - 4

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: value ? 1 : 0,
        useNativeDriver: true,
        bounciness: 10,
        speed: 14,
      }),
      Animated.timing(backgroundColor, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start()
  }, [value, translateX, backgroundColor, thumbOffset])

  const interpolatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColorResolved, activeColorResolved],
  })

  const thumbTranslateX = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [2, thumbOffset],
  })

  const handlePress = () => {
    onValueChange(!value)
  }

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.container,
          {
            width,
            height,
            backgroundColor: interpolatedBackgroundColor,
          },
        ]}>
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              backgroundColor: thumbColorResolved,
              transform: [{ translateX: thumbTranslateX }],
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    justifyContent: 'center',
  },
  thumb: {
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4,
  },
})
