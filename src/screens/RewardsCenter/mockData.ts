import type { RewardHistoryItemData } from './components/RewardHistoryItem'

export type RewardHistoryGroup = {
  date: string
  items: RewardHistoryItemData[]
}

/** Mock reward history based on Rewards center design (March 2, March 1). */
export const MOCK_REWARD_HISTORY: RewardHistoryGroup[] = [
  {
    date: 'March 2',
    items: [
      { pair: 'XAU/USD', lot: '1.00', amount: '4.20' },
      { pair: 'EUR/USD', lot: '0.50', amount: '1.50' },
    ],
  },
  {
    date: 'March 1',
    items: [
      { pair: 'GBP/USD', lot: '1.00', amount: '4.05' },
      { pair: 'XAU/USD', lot: '2.00', amount: '8.40' },
      { pair: 'USD/JPY', lot: '0.80', amount: '2.16' },
    ],
  },
]

export const MOCK_EARNINGS = {
  today: '1.80',
  thisMonth: '42.60',
  totalEarned: '318',
}
