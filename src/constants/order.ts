export const ORDER_TYPES = {
  LIMIT: 'LIMIT',
  MARKET: 'MARKET',
  STOP: 'STOP',
} as const

export const ORDER_SIDES = {
  BUY: 0,
  SELL: 1,
} as const

export const ORDER_TYPE_CODES = {
  LIMIT: 1,
  MARKET: 0,
  STOP: 2,
} as const
export const ORDER_STATUS = {
  CANCELED: 'CANCELED',
  FILLED: 'FILLED',
  PENDING: 'PENDING',
} as const
