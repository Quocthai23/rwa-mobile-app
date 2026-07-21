/** @type {import('tailwindcss').Config} */

// Import colors from centralized theme config (CommonJS for jiti/Metro)
const colors = require('./src/theme/colors')
const tailwindConfig = require('./src/styles/tailwindcss')

// Manually define typography values to avoid Platform.select() issues
const fontWeight = {
  black: 900,
  bold: 700,
  extraBold: 800,
  extraLight: 200,
  light: 300,
  medium: 500,
  regular: 400,
  semiBold: 600,
  thin: 100,
}

// =============================================================================
// FONT SIZES
// =============================================================================
const fontSize = {
  '2xs': 10,
  xs: 12,
  sm: 14,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 56,
  '7xl': 64,
  '8xl': 72,
  '9xl': 80,
  '10xl': 96,
}

// =============================================================================
// LINE HEIGHTS
// =============================================================================
const lineHeight = {
  '2xs': 14,
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 36,
  '3xl': 40,
  '4xl': 44,
  '5xl': 48,
  '6xl': 56,
  '7xl': 64,
  '8xl': 72,
  '9xl': 80,
  '10xl': 88,
}

// =============================================================================
// LETTER SPACING
// =============================================================================
const letterSpacing = {
  normal: 0,
  tight: -0.4,
  tighter: -0.8,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
}

// Text styles mapping for easy use with className
const textStyles = {
  // Headings
  'h1-regular': [
    `${fontSize['2xl']}px`,
    { lineHeight: `${lineHeight['2xl']}px`, fontWeight: fontWeight.regular },
  ],
  'h1-medium': [
    `${fontSize['2xl']}px`,
    { lineHeight: `${lineHeight['2xl']}px`, fontWeight: fontWeight.medium },
  ],
  'h1-semibold': [
    `${fontSize['2xl']}px`,
    { lineHeight: `${lineHeight['2xl']}px`, fontWeight: fontWeight.semiBold },
  ],
  'h1-bold': [
    `${fontSize['2xl']}px`,
    { lineHeight: `${lineHeight['2xl']}px`, fontWeight: fontWeight.bold },
  ],

  'h2-regular': [
    `${fontSize.xl}px`,
    { lineHeight: `${lineHeight['xl']}px`, fontWeight: fontWeight.regular },
  ],
  'h2-medium': [
    `${fontSize.xl}px`,
    { lineHeight: `${lineHeight['xl']}px`, fontWeight: fontWeight.medium },
  ],
  'h2-semibold': [
    `${fontSize.xl}px`,
    { lineHeight: `${lineHeight['xl']}px`, fontWeight: fontWeight.semiBold },
  ],
  'h2-bold': [
    `${fontSize.xl}px`,
    { lineHeight: `${lineHeight['xl']}px`, fontWeight: fontWeight.bold },
  ],

  'h3-regular': [
    `${fontSize.lg}px`,
    { lineHeight: `${lineHeight.lg}px`, fontWeight: fontWeight.regular },
  ],
  'h3-medium': [
    `${fontSize.lg}px`,
    { lineHeight: `${lineHeight.lg}px`, fontWeight: fontWeight.medium },
  ],
  'h3-semibold': [
    `${fontSize.lg}px`,
    { lineHeight: `${lineHeight.lg}px`, fontWeight: fontWeight.semiBold },
  ],
  'h3-bold': [
    `${fontSize.lg}px`,
    { lineHeight: `${lineHeight.lg}px`, fontWeight: fontWeight.bold },
  ],

  'h4-regular': [
    `${fontSize.md}px`,
    { lineHeight: `${lineHeight.md}px`, fontWeight: fontWeight.regular },
  ],
  'h4-medium': [
    `${fontSize.md}px`,
    { lineHeight: `${lineHeight.md}px`, fontWeight: fontWeight.medium },
  ],
  'h4-semibold': [
    `${fontSize.md}px`,
    { lineHeight: `${lineHeight.md}px`, fontWeight: fontWeight.semiBold },
  ],
  'h4-bold': [
    `${fontSize.md}px`,
    { lineHeight: `${lineHeight.md}px`, fontWeight: fontWeight.bold },
  ],

  // Body text
  'body-regular': [
    `${fontSize.base}px`,
    { lineHeight: `${lineHeight.md}px`, fontWeight: fontWeight.regular },
  ],
  'body-medium': [
    `${fontSize.base}px`,
    { lineHeight: `${lineHeight.md}px`, fontWeight: fontWeight.medium },
  ],
  'body-semibold': [
    `${fontSize.base}px`,
    { lineHeight: `${lineHeight.md}px`, fontWeight: fontWeight.semiBold },
  ],
  'body-bold': [
    `${fontSize.base}px`,
    { lineHeight: `${lineHeight.md}px`, fontWeight: fontWeight.bold },
  ],

  'body-small-regular': [
    `${fontSize.sm}px`,
    { lineHeight: `${lineHeight.sm}px`, fontWeight: fontWeight.regular },
  ],
  'body-small-medium': [
    `${fontSize.sm}px`,
    { lineHeight: `${lineHeight.sm}px`, fontWeight: fontWeight.medium },
  ],
  'body-small-semibold': [
    `${fontSize.sm}px`,
    { lineHeight: `${lineHeight.sm}px`, fontWeight: fontWeight.semiBold },
  ],
  'body-small-bold': [
    `${fontSize.sm}px`,
    { lineHeight: `${lineHeight.sm}px`, fontWeight: fontWeight.bold },
  ],

  'body-large-regular': [
    `${fontSize.base}px`,
    { lineHeight: `${lineHeight.lg}px`, fontWeight: fontWeight.regular },
  ],
  'body-large-medium': [
    `${fontSize.base}px`,
    { lineHeight: `${lineHeight.lg}px`, fontWeight: fontWeight.medium },
  ],
  'body-large-semibold': [
    `${fontSize.base}px`,
    { lineHeight: `${lineHeight.lg}px`, fontWeight: fontWeight.semiBold },
  ],
  'body-large-bold': [
    `${fontSize.base}px`,
    { lineHeight: `${lineHeight.lg}px`, fontWeight: fontWeight.bold },
  ],

  // Captions & Labels
  'caption-regular': [
    `${fontSize.xs}px`,
    { lineHeight: `${lineHeight.xs}px`, fontWeight: fontWeight.regular },
  ],
  'caption-medium': [
    `${fontSize.xs}px`,
    { lineHeight: `${lineHeight.xs}px`, fontWeight: fontWeight.medium },
  ],
  'caption-semibold': [
    `${fontSize.xs}px`,
    { lineHeight: `${lineHeight.xs}px`, fontWeight: fontWeight.semiBold },
  ],

  'label-regular': [
    `${fontSize.sm}px`,
    { lineHeight: `${lineHeight.sm}px`, fontWeight: fontWeight.regular },
  ],
  'label-medium': [
    `${fontSize.sm}px`,
    { lineHeight: `${lineHeight.sm}px`, fontWeight: fontWeight.medium },
  ],
  'label-semibold': [
    `${fontSize.sm}px`,
    { lineHeight: `${lineHeight.sm}px`, fontWeight: fontWeight.semiBold },
  ],

  // Buttons
  'button-regular': [
    `${fontSize.md}px`,
    { lineHeight: `${lineHeight.md}px`, fontWeight: fontWeight.regular },
  ],
  'button-medium': [
    `${fontSize.md}px`,
    { lineHeight: `${lineHeight.md}px`, fontWeight: fontWeight.medium },
  ],
  'button-semibold': [
    `${fontSize.md}px`,
    { lineHeight: `${lineHeight.md}px`, fontWeight: fontWeight.semiBold },
  ],
  'button-bold': [
    `${fontSize.md}px`,
    { lineHeight: `${lineHeight.md}px`, fontWeight: fontWeight.bold },
  ],

  'button-small-regular': [
    `${fontSize.sm}px`,
    { lineHeight: `${lineHeight.sm}px`, fontWeight: fontWeight.regular },
  ],
  'button-small-medium': [
    `${fontSize.sm}px`,
    { lineHeight: `${lineHeight.sm}px`, fontWeight: fontWeight.medium },
  ],
  'button-small-semibold': [
    `${fontSize.sm}px`,
    { lineHeight: `${lineHeight.sm}px`, fontWeight: fontWeight.semiBold },
  ],
  'button-small-bold': [
    `${fontSize.sm}px`,
    { lineHeight: `${lineHeight.sm}px`, fontWeight: fontWeight.bold },
  ],

  'button-large-regular': [
    `${fontSize.lg}px`,
    { lineHeight: `${lineHeight.lg}px`, fontWeight: fontWeight.regular },
  ],
  'button-large-medium': [
    `${fontSize.lg}px`,
    { lineHeight: `${lineHeight.lg}px`, fontWeight: fontWeight.medium },
  ],
  'button-large-semibold': [
    `${fontSize.lg}px`,
    { lineHeight: `${lineHeight.lg}px`, fontWeight: fontWeight.semiBold },
  ],
  'button-large-bold': [
    `${fontSize.lg}px`,
    { lineHeight: `${lineHeight.lg}px`, fontWeight: fontWeight.bold },
  ],

  // Display
  'display-lg': [
    `${fontSize['4xl']}px`,
    { lineHeight: `${lineHeight['4xl']}px`, fontWeight: fontWeight.semiBold },
  ],
  'display-sm': [
    `${fontSize['3xl']}px`,
    { lineHeight: `${lineHeight['3xl']}px`, fontWeight: fontWeight.semiBold },
  ],
}

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary colors (Orange theme)
        primary: '#0158FF',
        // Neutral grays
        gray: colors.gray,
        // neutral: {
        //   secondary: '#6B7280',
        //   0: '#FFFFFF',
        //   50: '#F9FAFB',
        //   100: '#F3F4F6',
        //   200: '#E5E7EB',
        //   300: '#D1D5DB',
        //   400: '#9CA3AF',
        //   500: '#6B7280',
        //   600: '#4B5563',
        //   700: '#374151',
        //   800: '#1F2937',
        //   900: '#111827',
        //   1000: '#030712',
        // },
        // Semantic colors
        error: '#F04438',
        // Main color palettes - now you can use bg-error-500, text-primary-500-600, etc.
        primary: colors.primary, // bg-primary-50, bg-primary-500, text-primary-500-700, etc.
        secondary: colors.secondary, // bg-secondary-50, bg-secondary-500, etc.
        error: colors.error, // bg-error-50, bg-error-500, border-error-600, etc.
        success: colors.success, // bg-success-50, bg-success-500, text-success-700, etc.
        warning: colors.warning, // bg-warning-50, bg-warning-500, etc.
        information: colors.information, // bg-information-50, bg-information-500, etc.
        neutral: colors.neutral, // bg-neutral-50, bg-neutral-500, text-neutral-900, etc.
        gray: colors.gray, // bg-gray-50, bg-gray-500, etc. (backward compatibility)

        // Semantic colors (for quick access)
        semantic: {
          success: colors.semantic.success,
          warning: colors.semantic.warning,
          error: colors.semantic.error,
          info: colors.semantic.info,
        },

        // Backwards compatibility aliases
        green: {
          500: colors.semantic.success.main,
        },
        red: {
          500: colors.semantic.error.main,
        },
        yellow: {
          500: colors.semantic.warning.main,
        },
        orange: colors.primary, // Legacy alias
        subTitle: '#F3F4F6',
      },

      // Add fontSize with typography styles mapped
      // Usage: text-h1-bold, text-body-regular, text-caption-medium, etc.
      fontSize: {
        ...fontSize,
        ...textStyles,
      },
      fontWeight: fontWeight,
      lineHeight: lineHeight,
      letterSpacing: letterSpacing,
      fontFamily: {
        primary: ['Inter'],
        mono: ['monospace'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ...tailwindConfig.typoClasses,
      }
      addUtilities(newUtilities, ['responsive', 'hover']) // Thêm responsive và hover nếu cần
    },
  ],
}
