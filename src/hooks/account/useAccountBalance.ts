/**
 * Account Balance React Query Hook
 * Custom hook for fetching account balance data
 */

import { useQuery } from '@tanstack/react-query'

import type { AccountBalanceResponse } from '@/services/accountService'
import { getAccountBalance } from '@/services/accountService'

export const accountBalanceQueryKeys = {
  all: ['account-balance'] as const,
  detail: (accountId: string, period: number) =>
    [...accountBalanceQueryKeys.all, accountId, period] as const,
}

export function useAccountBalance(accountId: string, period: number) {
  return useQuery<AccountBalanceResponse>({
    enabled: !!accountId,
    queryFn: () => getAccountBalance(accountId, period),
    queryKey: accountBalanceQueryKeys.detail(accountId, period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
