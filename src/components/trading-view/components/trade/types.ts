export type TabId =
  | 'MARKET'
  | 'BUY_LIMIT'
  | 'SELL_LIMIT'
  | 'BUY_STOP'
  | 'SELL_STOP'

export type TriggerType = 'Price' | 'Pips' | 'Change(%)' | 'PNL'

export type TabInfo = {
  id: TabId
  label: string
  side?: number
  type: string
}

export type EstimateItem = {
  isPositive: boolean
  label: string
  prefix: string
}

export const TRIGGER_OPTIONS: { label: TriggerType }[] = [
  { label: 'Price' },
  { label: 'Pips' },
  { label: 'Change(%)' },
  { label: 'PNL' },
]

export const TRIGGER_UNIT: Record<TriggerType, string> = {
  'Change(%)': '%',
  PNL: 'USD',
  Pips: 'Pips',
  Price: 'USD',
}

export const TRIGGER_STEP: Record<TriggerType, number> = {
  'Change(%)': 0.1,
  PNL: 10,
  Pips: 10,
  Price: 0.01,
}
