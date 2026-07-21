import type { Position } from '@/types'

import { apiClient } from './ApiClient'

export type GetPositionsParams = {
  accountId: string
  take?: number
  skip?: number
  symbol?: string
  side?: number
  orderType?: number
  sortBy?:
    | 'openedAt'
    | 'closedAt'
    | 'quantity'
    | 'symbol'
    | 'side'
    | 'realizedPnl'
  sortDir?: 'desc' | 'asc'
}
export const getPositions = async (
  params: GetPositionsParams,
): Promise<Position[]> => {
  return await apiClient.get('positions', params)
}

export const closePositions = async (
  positionId: string,
  accountId: string,
  quantity: string,
): Promise<void> => {
  await apiClient.post(`positions/${positionId}/close`, {
    accountId: accountId.toString(),
    quantity,
  })
}

export const closeAllPositions = async (
  accountId: string,
  positions: Position[],
): Promise<void> => {
  const positionIds = positions.map((position) => position.id.toString())

  await apiClient.post('positions/bulk-close', {
    accountId: accountId.toString(),
    positionIds: positionIds,
  })
}
