export const REWARD_ICONS = {
  gold: require('@/assets/images/rewards/gold.png'),
  'flag-eu': require('@/assets/images/rewards/flag-eu.png'),
  'flag-gb': require('@/assets/images/rewards/flag-gb.png'),
  'flag-jp': require('@/assets/images/rewards/flag-jp.png'),
  'flag-us': require('@/assets/images/rewards/flag-us.png'),
} as const

/** Map pair symbol to icon key(s). XAU uses gold icon; forex pairs use two flags (base, quote). */
export const PAIR_ICON_MAP: Record<
  string,
  | { type: 'gold' }
  | {
      type: 'flags'
      base: keyof typeof REWARD_ICONS
      quote: keyof typeof REWARD_ICONS
    }
> = {
  'XAU/USD': { type: 'gold' },
  'EUR/USD': { type: 'flags', base: 'flag-eu', quote: 'flag-us' },
  'GBP/USD': { type: 'flags', base: 'flag-gb', quote: 'flag-us' },
  'USD/JPY': { type: 'flags', base: 'flag-us', quote: 'flag-jp' },
}

export const COMPONENT_SIZE = 40
export const FLAG_SIZE = 28

export const SUCCESS_GREEN = '#12B76A'
