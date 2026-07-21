import {
  type CreateWalletPayload,
  type CreateWalletResponse,
  type DepositDemoPayload,
  type DepositDemoResponse,
  type WithdrawPayload,
  type WithdrawResponse,
  type GetPaymentHistoryParams,
  type GetPaymentHistoryResponse,
  TransferPayload,
} from '@/types/payment'

import { apiClient } from './ApiClient'
import { PAYMENT_ENDPOINTS } from '@/constants/api'

export const depositDemoAPI = async (payload: DepositDemoPayload) => {
  const response = await apiClient.post<DepositDemoResponse>(
    PAYMENT_ENDPOINTS.DEPOSIT_DEMO,
    payload,
    { skipAuth: true },
  )

  return response
}

export const createWalletAPI = (payload: CreateWalletPayload) => {
  return apiClient.post<CreateWalletResponse>(
    PAYMENT_ENDPOINTS.CREATE_WALLET,
    payload,
    { skipAuth: false },
  )
}

export const withdrawAPI = (payload: WithdrawPayload) => {
  return apiClient.post<WithdrawResponse>(PAYMENT_ENDPOINTS.WITHDRAW, payload, {
    skipAuth: false,
  })
}

export const transferAPI = (payload: TransferPayload) => {
  return apiClient.post<WithdrawResponse>(PAYMENT_ENDPOINTS.TRANSFER, payload, {
    skipAuth: false,
  })
}

function normalizePaymentHistoryParameters(
  parameters: GetPaymentHistoryParams,
) {
  const { take = 20, skip = 0, type, status, ...rest } = parameters

  return {
    skip,
    take,
    ...(type && type.length > 0 ? { type: type.join(',') } : {}),
    ...(status && status.length > 0 ? { status: status.join(',') } : {}),
    ...rest,
  }
}

export const getPaymentHistoryAPI = async (
  parameters: GetPaymentHistoryParams,
): Promise<GetPaymentHistoryResponse> => {
  const normalized = normalizePaymentHistoryParameters(parameters)

  const data = await apiClient.get<GetPaymentHistoryResponse>(
    PAYMENT_ENDPOINTS.HISTORY,
    normalized,
    {
      skipAuth: false,
    },
    true,
  )

  return data
}
