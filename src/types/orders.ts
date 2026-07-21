// types/order.ts
export type CreateOrderPayload = {
  accountId: string
  leverage: number
  orderType: 0 | 1 | 2 // Order type: 0 for market, 1 for limit, 2 for stop
  quantity: number
  side: 0 | 1 // 0 = BUY, 1 = SELL
  stopLossPrice?: number
  symbol: string // "XAUUSD"
  takeProfitPrice?: number
  price?: number // Required for limit orders
}

export type CreateOrderResponse = {
  orderId: string
  status: string
}

export type GetOrdersParams = {
  accountId: string // required

  orderType?: 0 | 1 | 2 | 3
  side?: 0 | 1

  skip?: number // default 0
  sortBy?: OrdersSortBy // default createdAt
  sortDir?: SortDir // default desc

  symbol?: string
  take?: number // default 20
}

export type GetOrdersResponse = {
  data: OrderItem[]
  total?: number
}

export type OrderItem = {
  //  "id": "string",
  //   "accountId": "string",
  //   "symbol": "string",
  //   "side": 0,
  //   "orderType": 0,
  //   "price": "string",
  //   "quantity": "string",
  //   "filledQuantity": "string",
  //   "remainingQuantity": "string",
  //   "leverage": 9007199254740991,
  //   "status": 0,
  //   "initialMargin": "string",
  //   "createdAt": "2026-02-07T03:11:50.888Z",
  //   "updatedAt": "2026-02-07T03:11:50.888Z"
  accountId: string
  createdAt: string
  filledQuantity: string
  id: string
  initialMargin: string
  leverage: number
  orderType: number
  price: string | null
  quantity: string
  remainingQuantity: string
  side: number
  status: number
  symbol: string
  updatedAt: string
  // Optional fields for UI
  currentPrice?: number
  realisedPL?: string
  stopLoss?: string
  takeProfit?: string
  trailingStop?: string
  value?: string
}

export type OrdersSortBy =
  | 'createdAt'
  | 'orderType'
  | 'quantity'
  | 'side'
  | 'symbol'

export type SortDir = 'asc' | 'desc'
