// hooks/useCreateOrder.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type ApiError } from '@/services/ApiClient'
import { createOrderAPI } from '@/services/oderService'
import {
  type CreateOrderPayload,
  type CreateOrderResponse,
} from '@/types/orders'

import { useToast } from '../useToast'

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  const { showError, showSuccess } = useToast()

  return useMutation<CreateOrderResponse, ApiError, CreateOrderPayload>({
    mutationFn: createOrderAPI,

    onError: (error) => {
      // toast.error(error.message);
      //   if (error instanceof ApiError) {
      //     showError('Create order failed', error.code);
      //   }
      showError('Create order failed', error.code)

      return
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['orders'],
      })

      queryClient.invalidateQueries({
        queryKey: ['positions', variables.accountId],
      })

      //   queryClient.invalidateQueries({
      //     queryKey: ['balance', variables.accountId],
      //   });

      // optional: toast success
      showSuccess('Order created successfully', `Order ID: ${data.orderId}`)
    },
  })
}
