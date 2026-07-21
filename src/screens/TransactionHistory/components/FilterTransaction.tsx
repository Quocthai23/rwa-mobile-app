import React, { forwardRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import { useTheme } from '@/theme'
import ButtonCustom from '@/components/atoms/Button/ButtonCustom'
import {
  STATUS_HISTORY_ID,
  STATUS_HISTORY_NAME,
  TYPE_HISTORY_ID,
  TYPE_HISTORY_NAME,
} from '@/constants/payment'
import type { Account } from '@/types/account'
import { ACCOUNT_TYPES_ID } from '@/constants/account'

type Props = {
  onApply?: (filters: FilterState) => void
  accounts: Account[]
  selectedAccountId: string
}

type FilterState = {
  type: number[]
  status: number[]
  accountId: string
}

const transactionTypes: Array<{ id: number | 'all'; name: string }> = [
  { id: 'all', name: 'All' },
  { id: TYPE_HISTORY_ID.DEPOSIT, name: TYPE_HISTORY_NAME[0] },
  { id: TYPE_HISTORY_ID.WITHDRAWAL, name: TYPE_HISTORY_NAME[1] },
]

const statuses: Array<{ id: number | 'all'; name: string }> = [
  { id: 'all', name: 'All' },
  { id: STATUS_HISTORY_ID.PENDING, name: STATUS_HISTORY_NAME[0] },
  { id: STATUS_HISTORY_ID.APPROVED, name: STATUS_HISTORY_NAME[1] },
  { id: STATUS_HISTORY_ID.PROCESSING, name: STATUS_HISTORY_NAME[2] },
  { id: STATUS_HISTORY_ID.COMPLETED, name: STATUS_HISTORY_NAME[3] },
  { id: STATUS_HISTORY_ID.FAILED, name: STATUS_HISTORY_NAME[4] },
  { id: STATUS_HISTORY_ID.REJECTED, name: STATUS_HISTORY_NAME[5] },
  { id: STATUS_HISTORY_ID.CANCELLED, name: STATUS_HISTORY_NAME[6] },
]

const FilterTransaction = forwardRef<AppBottomSheetModalHandle, Props>(
  ({ onApply, accounts, selectedAccountId }, reference) => {
    const { colors } = useTheme()
    const [selectedTypes, setSelectedTypes] = useState<(number | 'all')[]>([
      'all',
    ])
    const [selectedStatuses, setSelectedStatuses] = useState<
      (number | 'all')[]
    >(['all'])
    const [selectedAccount, setSelectedAccount] =
      useState<string>(selectedAccountId)

    const handleSelectType = (typeId: number | 'all') => {
      if (typeId === 'all') {
        setSelectedTypes(['all'])
      } else {
        const newTypes = selectedTypes.includes(typeId)
          ? selectedTypes.filter((t) => t !== typeId)
          : [...selectedTypes.filter((t) => t !== 'all'), typeId]
        setSelectedTypes(newTypes.length === 0 ? ['all'] : newTypes)
      }
    }

    const handleSelectStatus = (statusId: number | 'all') => {
      if (statusId === 'all') {
        setSelectedStatuses(['all'])
      } else {
        const newStatuses = selectedStatuses.includes(statusId)
          ? selectedStatuses.filter((s) => s !== statusId)
          : [...selectedStatuses.filter((s) => s !== 'all'), statusId]
        setSelectedStatuses(newStatuses.length === 0 ? ['all'] : newStatuses)
      }
    }

    const handleReset = () => {
      setSelectedTypes(['all'])
      setSelectedStatuses(['all'])
      setSelectedAccount(selectedAccountId)
      if (reference && typeof reference !== 'function' && reference.current) {
        reference.current.close()
      }
    }

    const handleApply = () => {
      // Convert selections to API format
      const typeFilter = selectedTypes.includes('all')
        ? [] // Empty array means all
        : (selectedTypes.filter((t) => t !== 'all') as number[])
      const statusFilter = selectedStatuses.includes('all')
        ? [] // Empty array means all
        : (selectedStatuses.filter((s) => s !== 'all') as number[])

      onApply?.({
        type: typeFilter,
        status: statusFilter,
        accountId: selectedAccount,
      })
      if (reference && typeof reference !== 'function' && reference.current) {
        reference.current.close()
      }
    }

    return (
      <AppBottomSheetModal ref={reference} snapPoints={['80%']}>
        <View className='flex-1'>
          {/* Header */}
          <View
            className='px-4 py-3 border-b'
            style={{ borderColor: colors.neutral200 }}>
            <Text className='text-h3-semibold'>Filter</Text>
          </View>

          {/* Content */}
          <ScrollView className='flex-1 px-4 py-4'>
            {/* Transaction Types */}
            <View className='mb-6'>
              <Text className='text-button-large-semibold mb-3'>
                Transaction types
              </Text>
              <View className='flex-row flex-wrap gap-2'>
                {transactionTypes.map((type) => {
                  const isSelected = selectedTypes.includes(type.id)
                  return (
                    <TouchableOpacity
                      key={`${type.id}`}
                      className='px-4 py-2 rounded'
                      style={{
                        backgroundColor: isSelected
                          ? colors.primary50
                          : colors.neutral100,
                      }}
                      onPress={() => {
                        handleSelectType(type.id)
                      }}>
                      <Text
                        className='text-body-large-regular'
                        style={{
                          color: isSelected
                            ? colors.primary500
                            : colors.neutral500,
                          fontWeight: isSelected ? '500' : '400',
                        }}>
                        {type.name}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            {/* Status */}
            <View className='mb-6'>
              <Text className='text-button-large-semibold mb-3'>Status</Text>
              <View className='flex-row flex-wrap gap-2'>
                {statuses.map((status) => {
                  const isSelected = selectedStatuses.includes(status.id)
                  return (
                    <TouchableOpacity
                      key={`${status.id}`}
                      className='px-4 py-2 rounded'
                      style={{
                        backgroundColor: isSelected
                          ? colors.primary50
                          : colors.neutral100,
                      }}
                      onPress={() => {
                        handleSelectStatus(status.id)
                      }}>
                      <Text
                        className='text-body-large-regular'
                        style={{
                          color: isSelected
                            ? colors.primary500
                            : colors.neutral500,
                          fontWeight: isSelected ? '500' : '400',
                        }}>
                        {status.name}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            {/* Account Selection */}
            <View className='mb-6'>
              <Text className='text-button-large-semibold mb-3'>Account</Text>
              <View className='flex-row flex-wrap gap-2'>
                {accounts
                  .filter(
                    (account) =>
                      account.accountTypeId !== ACCOUNT_TYPES_ID.DEMO,
                  )
                  .map((account) => {
                    const isSelected = selectedAccount === account.id
                    return (
                      <TouchableOpacity
                        key={account.id}
                        className='px-4 py-2 rounded'
                        style={{
                          backgroundColor: isSelected
                            ? colors.primary50
                            : colors.neutral100,
                        }}
                        onPress={() => setSelectedAccount(account.id)}>
                        <Text
                          className='text-body-large-regular'
                          style={{
                            color: isSelected
                              ? colors.primary500
                              : colors.neutral500,
                            fontWeight: isSelected ? '500' : '400',
                          }}>
                          {account.name}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View
            className='flex-row gap-2 px-4 pb-8'
            style={{ borderColor: colors.neutral200 }}>
            <ButtonCustom type={'CANCEL'} title='Reset' onPress={handleReset} />
            <ButtonCustom type={'APPLY'} onPress={handleApply} />
          </View>
        </View>
      </AppBottomSheetModal>
    )
  },
)

FilterTransaction.displayName = 'FilterTransaction'

export default FilterTransaction
