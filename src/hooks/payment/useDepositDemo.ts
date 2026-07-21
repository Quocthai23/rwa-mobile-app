import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type ApiError } from '@/services/ApiClient'
import { paymentApi } from '@/services/paymentsService'
import {
  type DepositDemoPayload,
  type DepositDemoResponse,
} from '@/types/payment'

import { useToast } from '../useToast'

export const useDepositDemo = () => {
  const queryClient = useQueryClient()
  const { showError, showSuccess } = useToast()

  return useMutation<DepositDemoResponse, ApiError, DepositDemoPayload>({
    mutationFn: async (variables) => {
      return paymentApi.paymentDepositDemo(variables.accountId)
    },

    onError: (error) => {
      showError('Deposit failed', error.code)
    },

    onSuccess: (data, variables) => {
      // Invalidate balance queries
      queryClient.invalidateQueries({
        queryKey: ['balance', variables.accountId],
      })

      // Invalidate account queries if needed
      queryClient.invalidateQueries({
        queryKey: ['account', variables.accountId],
      })

      showSuccess(
        'Deposit successful',
        `Amount: $${data.amount} - Balance: $${Number(data.availableBalance) + Number(data.blockedBalance)}`,
      )
    },
  })
}
