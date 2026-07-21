import { create } from 'zustand'

import type { IndicatorType } from '@/screens/SymbolDetail/types/types'

type IndicatorState = {
  indicator: IndicatorType
  setIndicator: (indicator: IndicatorType) => void
}

export const useIndicatorStore = create<IndicatorState>((set) => ({
  indicator: 'none',
  setIndicator: (indicator) => {
    set({ indicator })
  },
}))
