import { useQuery } from '@tanstack/react-query'
import { getCommission } from '@/services/referralService'

/**
 * Hook to fetch referral commission data
 */
export const useCommission = (fromDate?: string, toDate?: string) => {
  return useQuery({
    queryFn: () => getCommission(fromDate, toDate),
    queryKey: ['commission', fromDate, toDate],
  })
}
