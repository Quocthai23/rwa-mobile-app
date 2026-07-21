/**
 * Unified Color Configuration
 * This is the single source of truth for all colors in the app.
 * Import from this file instead of hardcoding hex values.
 */

// =============================================================================
// PRIMARY COLORS - Main brand/action colors (Green theme - matches global.css)
// =============================================================================
export const primary = {
  100: '#E6EEFF',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#8AB2FF',
  50: '#eff6ff',
  500: '#0158FF', // Main primary color (Blue)
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
} as const

// =============================================================================
// SECONDARY COLORS - Legacy brand color (Purple)
// =============================================================================
export const secondary = {
  500: '#6B7280',
} as const

// =============================================================================
// SUCCESS COLORS - Green palette for success states
// =============================================================================
export const success = {
  100: '#B6E9D1',
  200: '#92DEBA',
  300: '#60CF9B',
  400: '#41C588',
  50: '#E6FFEC',
  500: '#12B76A',
  600: '#10A760',
  700: '#0D824B',
  800: '#0A653A',
  900: '#084D2D',
} as const

// =============================================================================
// ERROR COLORS - Red palette for error states
// =============================================================================
export const error = {
  100: '#FAC5C1',
  200: '#F8A9A3',
  300: '#F5827A',
  400: '#F36960',
  50: '#FEECEB',
  500: '#F04438',
  600: '#DA3E33',
  700: '#AA3028',
  800: '#84251F',
  900: '#651D18',
} as const

// =============================================================================
// WARNING COLORS - Yellow palette for warning states
// =============================================================================
export const warning = {
  100: '#FFEFB0',
  200: '#FFE88A',
  300: '#FFDD54',
  400: '#FFD633',
  50: '#FDF7E6',
  500: '#EAB308',
  600: '#E8BA00',
  700: '#B59100',
  800: '#8C7000',
  900: '#6B5600',
} as const

// =============================================================================
// INFORMATION COLORS - Blue palette for informational states
// =============================================================================
export const information = {
  100: '#BBCFF9',
  200: '#9BB7F6',
  300: '#6D96F2',
  400: '#5182EF',
  50: '#E9EFFD',
  500: '#2563EB',
  600: '#225AD6',
  700: '#1A46A7',
  800: '#143681',
  900: '#102A63',
} as const

// =============================================================================
// NEUTRAL COLORS - Gray scale for text, backgrounds, borders
// =============================================================================
export const neutral = {
  0: '#FFFFFF',
  100: '#F3F4F6',
  1000: '#030712',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  50: '#F9FAFB',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
} as const

// Legacy gray export (kept for backward compatibility)
export const gray = {
  100: neutral[100],
  200: neutral[200],
  300: neutral[300],
  400: neutral[400],
  50: neutral[50],
  500: neutral[500],
  600: neutral[600],
  700: neutral[700],
  800: neutral[800],
  900: neutral[900],
} as const

// =============================================================================
// SEMANTIC COLORS - Status and feedback colors
// =============================================================================
export const semantic = {
  // Success
  success: {
    dark: '#15803d',
    light: '#86efac',
    main: '#22c55e',
  },
  // Warning
  warning: {
    dark: '#ca8a04',
    light: '#fde047',
    main: '#eab308',
  },
  // Error/Danger
  error: {
    dark: '#dc2626',
    light: '#fca5a5',
    main: '#ef4444',
  },
  // Info
  info: {
    dark: '#2563eb',
    light: '#93c5fd',
    main: '#3b82f6',
  },
} as const

// =============================================================================
// ORDER STATUS COLORS - Specific colors for order statuses
// =============================================================================
export const orderStatus = {
  cancelled: '#F44336',
  delivered: '#4CAF50',
  pending: '#FFA500',
  processing: '#2196F3',
  shipped: '#9C27B0',
} as const

// =============================================================================
// ICON COLORS - Pre-defined colors for icons
// =============================================================================
export const iconColors = {
  // Common icon colors
  default: neutral[700], // #374151 - Default dark icon
  light: '#ffffff', // White icon (on dark backgrounds)
  muted: gray[300], // #9ca3af - Muted/disabled icon
  subtle: gray[500], // #6b7280 - Subtle icon

  // Semantic icon colors
  error: semantic.error.main, // #ef4444 - Error/delete icon
  primary: primary[500], // #f97316 - Primary action icon
  secondary: secondary[500], // #44427D - Secondary icon
  success: semantic.success.main, // #22c55e - Success icon
  warning: semantic.warning.main, // #eab308 - Warning/star icon
} as const

// =============================================================================
// BACKGROUND COLORS
// =============================================================================
export const backgrounds = {
  dark: gray[700], // #303030
  overlay: 'rgba(0,0,0,0.4)',
  overlayLight: 'rgba(0,0,0,0.2)',
  primary: '#ffffff',
  secondary: gray[50], // #EFEFEF
  tertiary: gray[100], // #DFDFDF
} as const

// =============================================================================
// DARK MODE COLORS
// =============================================================================
export const darkMode = {
  background: '#1B1A23',
  gray: {
    100: '#000000',
    200: '#BABABA',
    400: '#969696',
    50: '#EFEFEF',
    800: '#E0E0E0',
  },
  primary: '#A6A4F0',
  skeleton: '#303030',
  surface: '#252732',
  text: {
    muted: '#969696',
    primary: '#E0E0E0',
    secondary: '#BABABA',
  },
} as const

// =============================================================================
// LIGHT MODE COLORS (default)
// =============================================================================
export const lightMode = {
  background: gray[50],
  skeleton: gray[200],
  surface: '#ffffff',
  text: {
    muted: gray[400],
    primary: gray[800],
    secondary: gray[600],
  },
} as const

// =============================================================================
// TAILWIND-COMPATIBLE EXPORT
// For use in tailwind.config.js
// =============================================================================
export const tailwindColors = {
  gray,
  green: {
    500: semantic.success.main,
  },
  orange: primary, // Alias for backward compatibility
  primary,
  red: {
    500: semantic.error.main,
  },
  secondary,
  yellow: {
    500: semantic.warning.main,
  },
} as const

// =============================================================================
// TYPE EXPORTS
// =============================================================================
export type GrayColor = keyof typeof gray
export type IconColor = keyof typeof iconColors
export type PrimaryColor = keyof typeof primary
export type SecondaryColor = keyof typeof secondary

// Default export with all colors
const colors = {
  backgrounds,
  darkMode,
  gray,
  iconColors,
  lightMode,
  orderStatus,
  primary,
  secondary,
  semantic,
  tailwindColors,
} as const

export default colors
