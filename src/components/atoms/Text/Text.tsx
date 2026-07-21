import React from 'react'
import {
  Text as RNText,
  TextInput as RNTextInput,
  type TextProps,
  type TextInputProps,
} from 'react-native'
import { fontFamily } from '@/theme/typography'

/**
 * Text component with Inter font applied by default
 */
export const Text: React.FC<TextProps> = ({ style, ...props }) => {
  return (
    <RNText style={[{ fontFamily: fontFamily.primary }, style]} {...props} />
  )
}

/**
 * TextInput component with Inter font applied by default
 */
export const TextInput: React.FC<TextInputProps> = ({ style, ...props }) => {
  return (
    <RNTextInput
      style={[{ fontFamily: fontFamily.primary }, style]}
      {...props}
    />
  )
}

// Export types for convenience
export type { TextProps, TextInputProps }
