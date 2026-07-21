export const FontWeight = {
  thin: '100',
  ultraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
}

export const FontSize = {
  '2xs': '10px',
  xs: '12px',
  sm: '14px',
  base: '15px',
  md: '15px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
}

export const LineHeight = {
  '2xs': '14px',
  xs: '16px',
  sm: '20px',
  md: '24px',
  lg: '28px',
  xl: '32px',
  '2xl': '36px',
  '3xl': '40px',
  '4xl': '44px',
}

export const typoClasses = {
  // ============================================================================
  // HEADINGS (H1-H4)
  // ============================================================================
  '.typo-h1-regular': {
    fontSize: FontSize['2xl'],
    lineHeight: LineHeight['2xl'],
    fontWeight: FontWeight.regular,
  },
  '.typo-h1-medium': {
    fontSize: FontSize['2xl'],
    lineHeight: LineHeight['2xl'],
    fontWeight: FontWeight.medium,
  },
  '.typo-h1-semibold': {
    fontSize: FontSize['2xl'],
    lineHeight: LineHeight['2xl'],
    fontWeight: FontWeight.semibold,
  },
  '.typo-h1-bold': {
    fontSize: FontSize['2xl'],
    lineHeight: LineHeight['2xl'],
    fontWeight: FontWeight.bold,
  },

  '.typo-h2-regular': {
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
    fontWeight: FontWeight.regular,
  },
  '.typo-h2-medium': {
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
    fontWeight: FontWeight.medium,
  },
  '.typo-h2-semibold': {
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
    fontWeight: FontWeight.semibold,
  },
  '.typo-h2-bold': {
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
    fontWeight: FontWeight.bold,
  },

  '.typo-h3-regular': {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.regular,
  },
  '.typo-h3-medium': {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.medium,
  },
  '.typo-h3-semibold': {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.semibold,
  },
  '.typo-h3-bold': {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.bold,
  },

  '.typo-h4-regular': {
    fontSize: FontSize.base,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.regular,
  },
  '.typo-h4-medium': {
    fontSize: FontSize.base,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.medium,
  },
  '.typo-h4-semibold': {
    fontSize: FontSize.base,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.semibold,
  },
  '.typo-h4-bold': {
    fontSize: FontSize.base,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.bold,
  },

  // ============================================================================
  // BODY TEXT
  // ============================================================================
  '.typo-body-regular': {
    fontSize: FontSize.base,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.regular,
  },
  '.typo-body-medium': {
    fontSize: FontSize.base,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.medium,
  },
  '.typo-body-semibold': {
    fontSize: FontSize.base,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.semibold,
  },
  '.typo-body-bold': {
    fontSize: FontSize.base,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.bold,
  },

  '.typo-body-small-regular': {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.regular,
  },
  '.typo-body-small-medium': {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.medium,
  },
  '.typo-body-small-semibold': {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.semibold,
  },
  '.typo-body-small-bold': {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.bold,
  },

  '.typo-body-large-regular': {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.regular,
  },
  '.typo-body-large-medium': {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.medium,
  },
  '.typo-body-large-semibold': {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.semibold,
  },
  '.typo-body-large-bold': {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.bold,
  },

  // ============================================================================
  // CAPTIONS & LABELS
  // ============================================================================
  '.typo-caption-regular': {
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    fontWeight: FontWeight.regular,
  },
  '.typo-caption-medium': {
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    fontWeight: FontWeight.medium,
  },
  '.typo-caption-semibold': {
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    fontWeight: FontWeight.semibold,
  },
  '.typo-caption-bold': {
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    fontWeight: FontWeight.bold,
  },

  '.typo-label-regular': {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.regular,
  },
  '.typo-label-medium': {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.medium,
  },
  '.typo-label-semibold': {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.semibold,
  },

  // ============================================================================
  // BUTTONS
  // ============================================================================
  '.typo-button-regular': {
    fontSize: FontSize.base,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.regular,
  },
  '.typo-button-medium': {
    fontSize: FontSize.base,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.medium,
  },
  '.typo-button-semibold': {
    fontSize: FontSize.base,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.semibold,
  },
  '.typo-button-bold': {
    fontSize: FontSize.base,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.bold,
  },

  '.typo-button-small-regular': {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.regular,
  },
  '.typo-button-small-medium': {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.medium,
  },
  '.typo-button-small-semibold': {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.semibold,
  },
  '.typo-button-small-bold': {
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.bold,
  },

  '.typo-button-large-regular': {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.regular,
  },
  '.typo-button-large-medium': {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.medium,
  },
  '.typo-button-large-semibold': {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.semibold,
  },
  '.typo-button-large-bold': {
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.bold,
  },

  // ============================================================================
  // DISPLAY
  // ============================================================================
  '.typo-display-lg': {
    fontSize: FontSize['4xl'],
    lineHeight: LineHeight['4xl'],
    fontWeight: FontWeight.semibold,
  },
  '.typo-display-sm': {
    fontSize: FontSize['3xl'],
    lineHeight: LineHeight['3xl'],
    fontWeight: FontWeight.semibold,
  },
}
