import { useState } from 'react'
import {
  Platform,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewProps,
} from 'react-native'

import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { neutral } from '@/theme/colors'
import { fontFamily } from '@/theme/typography'

type InputProps = {
  readonly containerStyle?: ViewProps['style']
  readonly disabled?: boolean
  readonly error?: string
  readonly hint?: string
  readonly inputStyle?: TextStyle
  readonly label?: string
  readonly leftAccessory?: React.ReactNode
  readonly rightAccessory?: React.ReactNode
  readonly rounded?: 'lg' | 'md' | 'sm'
  readonly size?: 'lg' | 'md' | 'sm'
  readonly variant?: InputVariant
} & TextInputProps

type InputVariant = 'select' | 'text' | 'textarea'

export function Input({
  containerStyle,
  disabled,
  error,
  hint,
  inputStyle,
  label,
  leftAccessory,
  rightAccessory,
  rounded,
  size = 'md',
  style,
  variant = 'text',
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const hasError = !!error?.trim()

  const innerBorder = hasError
    ? 'border-red-500'
    : isFocused
      ? 'border-primary-500'
      : 'border-neutral-200'

  const outerBorder = hasError
    ? `border-red-100  rounded-md`
    : isFocused
      ? `border-primary-100  rounded-md`
      : 'border-transparent'

  const bgColor = disabled ? 'bg-neutral-100' : 'bg-white'
  const UI = {
    sm: { h: 36, fontSize: 13, lineHeight: 18 },
    md: { h: 44, fontSize: 15, lineHeight: 20 },
    lg: { h: 48, fontSize: 16, lineHeight: 20 },
  } as const

  const u = UI[size ?? 'md']

  const isTextarea = variant === 'textarea'

  // padding để baseline nằm giữa (iOS)
  const vPad = Math.max(0, Math.floor((u.h - u.lineHeight) / 2))

  return (
    <View style={containerStyle}>
      {label ? (
        <Text
          className={` text-neutral-900 ${
            size === 'sm'
              ? 'text-body-small-semibold'
              : size === 'md'
                ? 'text-body-large-semibold'
                : size === 'lg'
                  ? 'text-body-large-semibold'
                  : 'text-body-large-semibold'
          }`}>
          {label}
        </Text>
      ) : null}

      {/* OUTER BORDER */}
      <View className={`border-4 ${outerBorder} mx-[-4px]`}>
        {/* INNER BORDER */}
        <View
          className={`flex-row items-center 
    ${disabled ? 'opacity-50' : ''} 
    border 
    ${innerBorder} 
    rounded
    px-3 
    ${bgColor}`}>
          {leftAccessory ? (
            <View className='mr-3 justify-center shrink-0'>
              {leftAccessory}
            </View>
          ) : null}

          <TextInput
            {...props}
            keyboardAppearance={props.keyboardAppearance ?? 'light'}
            className={`flex-1 text-neutral-900 py-0 ${
              size === 'sm'
                ? 'text-body-small-medium placeholder:text-body-small-regular'
                : 'text-body-large-medium placeholder:text-body-large-regular'
            }`}
            placeholderTextColor={neutral[400]}
            multiline={isTextarea}
            style={[
              {
                fontFamily: fontFamily.primary,

                ...(Platform.OS === 'ios' && !isTextarea
                  ? {
                      height: u.h,
                      fontSize: u.fontSize,
                      lineHeight: u.lineHeight,
                      paddingTop: vPad,
                      paddingBottom: vPad,
                      paddingVertical: 0,
                    }
                  : {
                      height: u.h,
                      fontSize: u.fontSize,
                      lineHeight: u.lineHeight,
                      paddingTop: vPad,
                      paddingBottom: vPad,
                      paddingVertical: 0,
                    }),

                ...(Platform.OS === 'ios' && isTextarea
                  ? {
                      height: u.h,
                      fontSize: u.fontSize,
                      lineHeight: u.lineHeight,
                      paddingTop: vPad,
                      paddingBottom: vPad,
                      paddingVertical: 0,
                    }
                  : {
                      height: u.h,
                      fontSize: u.fontSize,
                      lineHeight: u.lineHeight,
                      paddingTop: vPad,
                      paddingBottom: vPad,
                      paddingVertical: 0,
                    }),
              },
              style,
              inputStyle,
            ]}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            onFocus={() => setIsFocused(true)}
            numberOfLines={isTextarea ? 4 : 1}
            // iOS ignore center, nhưng giữ cho android
            textAlignVertical={isTextarea ? 'top' : 'center'}
          />

          {rightAccessory ? (
            <View className='ml-3 shrink-0'>{rightAccessory}</View>
          ) : null}
        </View>
      </View>

      {hasError ? (
        <Text className='mt-1 text-red-500 text-body-small-regular'>
          {error}
        </Text>
      ) : null}

      {hint ? (
        <Text
          className={`mt-1 text-body-small-regular ${hasError ? 'text-red-400' : 'text-neutral-500'}`}>
          {hint}
        </Text>
      ) : null}
    </View>
  )
}

export default Input
