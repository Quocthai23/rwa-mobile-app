/**
 * Global Text and TextInput font configuration
 *
 * This file automatically applies the Inter font family to ALL Text and TextInput
 * components throughout the app, even when imported directly from 'react-native'.
 *
 * IMPORTANT: This file MUST be imported at the very top of App.tsx
 * (after 'react-native-gesture-handler' but before any other component imports)
 *
 * How it works:
 * - Sets defaultProps on Text and TextInput to include Inter fontFamily
 * - This works for most cases where Text/TextInput are used without explicit fontFamily
 * - For best results, consider using custom Text/TextInput components from '@/components/atoms'
 */

import { Text, TextInput } from 'react-native'
import { fontFamily } from '@/theme/typography'

/**
 * Apply default fontFamily to Text component
 * Note: defaultProps is deprecated in React 18+ but still works in React Native
 */
// @ts-expect-error - defaultProps exists in React Native
if (!Text.defaultProps) Text.defaultProps = {}
// @ts-expect-error - Setting default style
Text.defaultProps.style = { fontFamily: fontFamily.primary }

/**
 * Apply default fontFamily to TextInput component
 */
// @ts-expect-error - defaultProps exists in React Native
if (!TextInput.defaultProps) TextInput.defaultProps = {}
// @ts-expect-error - Setting default style
TextInput.defaultProps.style = { fontFamily: fontFamily.primary }
