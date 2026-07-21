import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type ApiError } from '@/services/ApiClient'
import { createWalletAPI } from '@/services/paymentService'
import {
  type CreateWalletPayload,
  type CreateWalletResponse,
} from '@/types/payment'

import { useToast } from '../useToast'

export const useCreateWallet = () => {
  const queryClient = useQueryClient()
  const { showError, showSuccess } = useToast()

  return useMutation<CreateWalletResponse, ApiError, CreateWalletPayload>({
    mutationFn: createWalletAPI,

    onError: (error) => {
      showError('Wallet creation failed', error.message || error.code)
    },

    onSuccess: (data, variables) => {
      // Invalidate wallet queries
      queryClient.invalidateQueries({
        queryKey: ['wallet', variables.accountId],
      })

      showSuccess(
        'Wallet created successfully',
        `Address: ${data.wallet.address}`,
      )
    },
  })
}
