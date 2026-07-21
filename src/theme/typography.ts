/**
 * Unified Typography Configuration
 * This is the single source of truth for all font-related styles in the app.
 */

import { Platform } from 'react-native'

// =============================================================================
// FONT FAMILIES
// =============================================================================
export const fontFamily = {
  // Primary font - System default with custom fallbacks
  primary: 'Inter',

  // Monospace font for code/numbers
  mono: Platform.select({
    android: 'monospace',
    default: 'monospace',
    ios: 'Menlo',
  }),
} as const

// =============================================================================
// FONT WEIGHTS
// =============================================================================
export const fontWeight = {
  black: '900' as const,
  bold: '700' as const,
  extraBold: '800' as const,
  extraLight: '200' as const,
  light: '300' as const,
  medium: '500' as const,
  regular: '400' as const,
  semiBold: '600' as const,
  thin: '100' as const,
} as const

// =============================================================================
// FONT SIZES
// =============================================================================
export const fontSize = {
  '10xl': 96,
  '2xl': 24,
  '2xs': 10,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 56,
  '7xl': 64,
  '8xl': 72,
  '9xl': 80,
  base: 16,
  lg: 18,
  md: 16,
  sm: 14,
  xl: 20,
  xs: 12,
} as const

// =============================================================================
// LINE HEIGHTS
// =============================================================================
export const lineHeight = {
  '10xl': 88,
  '2xl': 36,
  '2xs': 14,
  '3xl': 40,
  '4xl': 44,
  '5xl': 48,
  '6xl': 56,
  '7xl': 64,
  '8xl': 72,
  '9xl': 80,
  lg: 28,
  md: 24,
  sm: 20,
  xl: 32,
  xs: 16,
} as const

// =============================================================================
// LETTER SPACING
// =============================================================================
export const letterSpacing = {
  normal: 0,
  tight: -0.4,
  tighter: -0.8,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const
// =============================================================================
// TEXT STYLES (Pre-composed styles for common use cases)
// =============================================================================
export const textStyles = {
  'h1-bold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight['2xl'],
  },
  'h1-medium': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight['2xl'],
  },
  'h1-regular': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight['2xl'],
  },
  'h1-semibold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight['2xl'],
  },
  'h2-bold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.xl,
  },
  'h2-medium': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.xl,
  },
  'h2-regular': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.xl,
  },
  'h2-semibold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.xl,
  },
  'h3-bold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.lg,
  },
  'h3-medium': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.lg,
  },
  'h3-regular': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.lg,
  },
  'h3-semibold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.lg,
  },
  'h4-bold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.md,
  },
  'h4-medium': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.md,
  },
  'h4-regular': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.md,
  },
  'h4-semibold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.md,
  },

  // Body text with weight variants
  'body-bold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.md,
  },
  'body-large-bold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.lg,
  },
  'body-large-medium': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.lg,
  },
  'body-large-regular': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.lg,
  },
  'body-large-semibold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.lg,
  },
  'body-medium': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.md,
  },
  'body-regular': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.md,
  },
  'body-semibold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.md,
  },

  'body-small-bold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.sm,
  },
  'body-small-medium': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.sm,
  },
  'body-small-regular': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.sm,
  },
  'body-small-semibold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.sm,
  },

  // Labels & captions with weight variants
  'caption-medium': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.xs,
  },
  'caption-regular': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.xs,
  },
  'caption-semibold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.xs,
  },
  'label-medium': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.sm,
  },
  'label-regular': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.sm,
  },
  'label-semibold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.sm,
  },

  // Button text with weight variants
  'button-bold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.md,
  },
  'button-large-bold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.md,
  },
  'button-large-medium': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.md,
  },
  'button-large-regular': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.md,
  },
  'button-large-semibold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.md,
  },
  'button-medium': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.md,
  },
  'button-regular': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.md,
  },
  'button-semibold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.md,
  },
  'button-small-bold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.sm,
  },
  'button-small-medium': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.sm,
  },
  'button-small-regular': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.sm,
  },
  'button-small-semibold': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight.sm,
  },
  'display-lg': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.semiBold,
    lineHeight: lineHeight['4xl'],
  },
  'display-sm': {
    fontFamily: fontFamily.primary,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight['3xl'],
  },
} as const

// =============================================================================
// TYPE EXPORTS
// =============================================================================
export type FontSize = keyof typeof fontSize
export type FontWeight = keyof typeof fontWeight
export type TextStyle = keyof typeof textStyles

// Default export with all typography settings
const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  textStyles,
} as const

export default typography
