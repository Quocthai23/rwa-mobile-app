import { ChevronLeft, HelpCircle } from 'lucide-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import FilterIcon from '@/components/icons/FilterIcon'
import { type Paths } from '@/navigation/paths'
import { type RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'
import { Button } from '@/components/atoms'
import { type AppBottomSheetModalHandle } from '@/components/atoms/AppBottomSheetModal'
import { useAccountStore } from '@/store/useAccountStore'
import { useGetPaymentHistory } from '@/hooks/payment/useGetPaymentHistory'
import { toStartOfDayISO, toEndOfDayISO } from '@/utils/dateUtils'
import FilterTransaction from './components/FilterTransaction'
import DateRangePicker from './components/DateRangePicker'
import TransactionHistoryCard from './components/TransactionHistoryCard'
import TransactionHistoryCardSkeleton from './components/TransactionHistoryCardSkeleton'
import TransactionCardDetails from './components/TransactionCardDetails'
import { useAccounts } from '@/hooks/useAccount'
import ButtonCustom from '@/components/atoms/Button/ButtonCustom'
import type { PaymentHistoryItem } from '@/types/payment'
import SearchCloseIcon from '@/components/icons/SearchCloseIcon'

type Props = RootScreenProps<Paths.TransactionHistory>

function TransactionHistory({ navigation }: Props) {
  const { colors } = useTheme()
  const selectedAccount = useAccountStore((state) => state.selectedAccount)
  const { data: accounts = [] } = useAccounts()
  const filterRef = useRef<AppBottomSheetModalHandle>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<
    PaymentHistoryItem | undefined
  >(undefined)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    selectedAccount?.id || '',
  )

  const [pagination, setPagination] = useState({ take: 20, skip: 0 })
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [dateRange, setDateRange] = useState<{
    startDate?: string
    endDate?: string
  }>(() => {
    const today = new Date()
    const weekAgo = new Date()
    weekAgo.setDate(today.getDate() - 7)

    return {
      startDate: toStartOfDayISO(weekAgo),
      endDate: toEndOfDayISO(today),
    }
  })
  const [filters, setFilters] = useState<{
    type?: number[]
    status?: number[]
  }>({
    type: [], // Empty means all
    status: [], // Empty means all
  })

  const { data, isFetching } = useGetPaymentHistory({
    accountId: selectedAccountId || '',
    // accountId: '1470823613144764428',
    take: pagination.take,
    skip: pagination.skip,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    type: filters.type,
    status: filters.status,
  })

  const hasTransactions = (data?.data?.length ?? 0) > 0
  const hasMore = (data?.data?.length ?? 0) < (data?.total ?? 0)

  // Calculate active filters count
  const activeFiltersCount =
    (filters.type?.length || 0) + (filters.status?.length || 0)
  const hasActiveFilters = activeFiltersCount > 0

  // Reset isLoadingMore when fetching completes
  useEffect(() => {
    if (!isFetching) {
      setIsLoadingMore(false)
    }
  }, [isFetching])

  // Update selected account when store changes
  useEffect(() => {
    if (selectedAccount?.id && !selectedAccountId) {
      setSelectedAccountId(selectedAccount.id)
    }
  }, [selectedAccount, selectedAccountId])

  console.log('data', data)

  return (
    <>
      <SafeAreaView className='flex-1 bg-neutral-0' edges={['top']}>
        {/* Header */}
        <View className='flex-row items-center justify-between px-4 py-3'>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack()
            }}>
            <ChevronLeft color={colors.neutral900} size={24} />
          </TouchableOpacity>
          <Text className='text-h3-semibold'>Transaction History</Text>
          <TouchableOpacity onPress={() => {}}>
            <HelpCircle color={colors.neutral700} size={24} />
          </TouchableOpacity>
        </View>

        {/* Filter Buttons */}
        <View className='flex-row gap-2 px-4 py-3'>
          <DateRangePicker
            onSelect={(dates) => {
              setDateRange({
                startDate: dates.startDate,
                endDate: dates.endDate,
              })
              setPagination({ take: 20, skip: 0 })
              setIsLoadingMore(false)
            }}
          />

          <TouchableOpacity
            className='flex-row items-center gap-2 px-3 py-2 rounded'
            style={{
              backgroundColor: hasActiveFilters
                ? colors.primary100
                : colors.neutral100,
            }}
            onPress={() => filterRef.current?.open()}>
            <FilterIcon
              color={colors.neutral0}
              size={16}
              strokeColor={
                hasActiveFilters ? colors.primary500 : colors.neutral900
              }
            />
            {!hasActiveFilters && (
              <Text
                className='text-button-small-medium'
                style={{
                  color: hasActiveFilters ? colors.neutral0 : colors.neutral900,
                }}>
                Filter
              </Text>
            )}

            {hasActiveFilters && (
              <Text
                className='text-button-small-medium'
                style={{ color: colors.primary500 }}>
                {activeFiltersCount}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Filter Modal */}
        <FilterTransaction
          ref={filterRef}
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onApply={(newFilters) => {
            setFilters({
              type: newFilters.type.length === 0 ? undefined : newFilters.type,
              status:
                newFilters.status.length === 0 ? undefined : newFilters.status,
            })
            setSelectedAccountId(newFilters.accountId)
            setPagination({ take: 20, skip: 0 })
            setIsLoadingMore(false)
          }}
        />

        {/* Content */}
        <ScrollView className='flex-1'>
          {isFetching && !isLoadingMore ? (
            <View className='px-4 py-2'>
              {[...Array(5)].map((_, index) => (
                <TransactionHistoryCardSkeleton key={index} />
              ))}
            </View>
          ) : !hasTransactions ? (
            // Empty State
            <View className='flex-1 items-center justify-center px-4 py-20'>
              <View className='items-center gap-4'>
                {/* <FileText color={colors.neutral400} size={60} /> */}
                <SearchCloseIcon />
                <View className='items-center gap-2'>
                  <Text className='text-body-large-medium text-neutral-900 text-center'>
                    No transaction matches your filters
                  </Text>
                  <Text className='text-body-small-regular text-neutral-500 text-center'>
                    Try changing your search terms
                  </Text>
                </View>
                <Button
                  label='Reset filters'
                  size={40}
                  className='px-4'
                  onPress={() => {
                    const today = new Date()
                    const weekAgo = new Date()
                    weekAgo.setDate(today.getDate() - 7)
                    setDateRange({
                      startDate: toStartOfDayISO(weekAgo),
                      endDate: toEndOfDayISO(today),
                    })
                    setFilters({ type: [], status: [] })
                    setPagination({ take: 20, skip: 0 })
                    setIsLoadingMore(false)
                  }}
                />
              </View>
            </View>
          ) : (
            // Transaction List
            <View className='px-4 py-2'>
              {data?.data.map((transaction) => (
                <TransactionHistoryCard
                  key={transaction.id}
                  transaction={transaction}
                  onPress={() => {
                    setSelectedTransaction(transaction)
                    setIsModalVisible(true)
                  }}
                />
              ))}

              {/* Loading More Skeleton */}
              {isLoadingMore && (
                <View>
                  {[...Array(3)].map((_, index) => (
                    <TransactionHistoryCardSkeleton key={`loading-${index}`} />
                  ))}
                </View>
              )}

              {/* View More Button */}
              {hasMore && !isLoadingMore && (
                <ButtonCustom
                  onPress={() => {
                    setIsLoadingMore(true)
                    setPagination((prev) => ({
                      ...prev,
                      take: prev.take + 20,
                    }))
                  }}
                  type='CANCEL'
                  title='View more'
                  className='h-[40px]'
                />
              )}

              {/* All Loaded Message */}
              {!hasMore && hasTransactions && !isLoadingMore && (
                <View className='items-center py-4'>
                  <Text
                    className='text-body-small-regular'
                    style={{ color: colors.neutral500 }}>
                    All transactions loaded ({data?.total ?? 0})
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Transaction Details Modal */}
      {isModalVisible && (
        <TransactionCardDetails
          transaction={selectedTransaction}
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </>
  )
}

export default TransactionHistory
