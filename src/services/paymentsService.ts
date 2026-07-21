import { type DepositDemoResponse } from '@/types/payment'

import { apiClient } from './ApiClient'

export const paymentApi = {
  paymentDepositDemo: async (
    accountId: string,
  ): Promise<DepositDemoResponse> => {
    return apiClient.post<DepositDemoResponse>('payment/deposit-demo', {
      accountId,
    })
  },
}
