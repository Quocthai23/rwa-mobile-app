import { DarkTheme, DefaultTheme } from '@react-navigation/native'

import type { ThemeConfiguration } from '@/theme/types/config'

import {
  darkMode,
  error,
  gray,
  information,
  lightMode,
  neutral,
  primary,
  secondary,
  success,
  warning,
} from './colors'
import { textStyles } from './typography'

export const enum Variant {
  DARK = 'dark',
}

// Light mode colors - derived from centralized colors.ts
const colorsLight = {
  // Error colors
  error100: error[100],
  error200: error[200],
  error300: error[300],
  error400: error[400],
  error50: error[50],
  error500: error[500],
  error600: error[600],
  error700: error[700],
  error800: error[800],
  error900: error[900],
  // Legacy gray colors
  gray100: gray[100],
  gray200: gray[200],
  gray500: gray[500],
  gray50: gray[50],
  gray800: gray[700],
  // Information colors
  information100: information[100],
  information200: information[200],
  information300: information[300],
  information400: information[400],
  information50: information[50],
  information500: information[500],
  information600: information[600],
  information700: information[700],
  information800: information[800],
  information900: information[900],
  // Neutral colors
  neutral0: neutral[0],
  neutral100: neutral[100],
  neutral1000: neutral[1000],
  neutral200: neutral[200],
  neutral300: neutral[300],
  neutral400: neutral[400],
  neutral50: neutral[50],
  neutral500: neutral[500],
  neutral600: neutral[600],
  neutral700: neutral[700],
  neutral800: neutral[800],
  neutral900: neutral[900],
  // Primary colors
  primary100: primary[100],
  primary200: primary[200],
  primary300: primary[300],
  primary400: primary[400],
  primary50: primary[50],
  primary500: primary[500],
  primary600: primary[600],
  primary700: primary[700],
  primary800: primary[800],
  primary900: primary[900],
  // Legacy purple colors (secondary)
  purple50: darkMode.background,
  purple500: secondary[500],
  red500: '#C13333',
  // Secondary colors

  secondary500: secondary[500],

  skeleton: lightMode.skeleton,
  // Success colors
  success100: success[100],
  success200: success[200],
  success300: success[300],
  success400: success[400],
  success50: success[50],
  success500: success[500],
  success600: success[600],
  success700: success[700],
  success800: success[800],
  success900: success[900],
  // Warning colors
  warning100: warning[100],
  warning200: warning[200],
  warning300: warning[300],
  warning400: warning[400],
  warning50: warning[50],
  warning500: warning[500],
  warning600: warning[600],
  warning700: warning[700],
  warning800: warning[800],
  warning900: warning[900],
} as const

// Dark mode colors - derived from centralized colors.ts
const colorsDark = {
  // Error colors (same for dark mode)
  error100: error[100],
  error200: error[200],
  error300: error[300],
  error400: error[400],
  error50: error[50],
  error500: error[500],
  error600: error[600],
  error700: error[700],
  error800: error[800],
  error900: error[900],
  // Legacy gray colors
  gray100: darkMode.gray[100],
  gray200: darkMode.gray[200],
  gray400: darkMode.gray[400],
  gray50: darkMode.gray[50],
  gray800: darkMode.gray[800],
  // Information colors (same for dark mode)
  information100: information[100],
  information200: information[200],
  information300: information[300],
  information400: information[400],
  information50: information[50],
  information500: information[500],
  information600: information[600],
  information700: information[700],
  information800: information[800],
  information900: information[900],
  // Neutral colors (same for dark mode)
  neutral0: neutral[0],
  neutral100: neutral[100],
  neutral1000: neutral[1000],
  neutral200: neutral[200],
  neutral300: neutral[300],
  neutral400: neutral[400],
  neutral50: neutral[50],
  neutral500: neutral[500],
  neutral600: neutral[600],
  neutral700: neutral[700],
  neutral800: neutral[800],
  neutral900: neutral[900],
  // Primary colors (same for dark mode)
  primary100: primary[100],
  primary200: primary[200],
  primary300: primary[300],
  primary400: primary[400],
  primary50: primary[50],
  primary500: primary[500],
  primary600: primary[600],
  primary700: primary[700],
  primary800: primary[800],
  primary900: primary[900],
  // Legacy purple colors
  purple100: darkMode.surface,
  purple50: darkMode.background,
  purple500: darkMode.primary,
  red500: '#C13333',
  // Secondary colors (same for dark mode)
  secondary500: secondary[500],

  skeleton: darkMode.skeleton,
  // Success colors (same for dark mode)
  success100: success[100],
  success200: success[200],
  success300: success[300],
  success400: success[400],
  success50: success[50],
  success500: success[500],
  success600: success[600],
  success700: success[700],
  success800: success[800],
  success900: success[900],
  // Warning colors (same for dark mode)
  warning100: warning[100],
  warning200: warning[200],
  warning300: warning[300],
  warning400: warning[400],
  warning50: warning[50],
  warning500: warning[500],
  warning600: warning[600],
  warning700: warning[700],
  warning800: warning[800],
  warning900: warning[900],
} as const

const sizes = [12, 16, 24, 32, 40, 80] as const

export const config = {
  backgrounds: colorsLight,
  borders: {
    colors: colorsLight,
    radius: [4, 16],
    widths: [1, 2],
  },
  colors: colorsLight,
  fonts: {
    colors: colorsLight,
    sizes,
  },
  gutters: sizes,
  navigationColors: {
    ...DefaultTheme.colors,
    background: colorsLight.gray50,
    card: colorsLight.gray50,
  },
  typography: textStyles,
  variants: {
    dark: {
      backgrounds: colorsDark,
      borders: {
        colors: colorsDark,
      },
      colors: colorsDark,
      fonts: {
        colors: colorsDark,
      },
      navigationColors: {
        ...DarkTheme.colors,
        background: colorsDark.purple50,
        card: colorsDark.purple50,
      },
    },
  },
} as const satisfies ThemeConfiguration
