import React, { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Check, ChevronLeft } from 'lucide-react-native'

import { Button } from '@/components/atoms/Button/Button'
import { useAccounts } from '@/hooks/useAccount'
import { useDepositDemo } from '@/hooks/payment/useDepositDemo'
import { useCreateWallet } from '@/hooks/payment/useCreateWallet'
import { ACCOUNT_TYPES_ID } from '@/constants/account'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'
import type { Account } from '@/types/account'
import { formatPriceDecimal } from '@/utils/currency'

function DepositTo({ navigation, route }: RootScreenProps<Paths.DepositTo>) {
  const { colors } = useTheme()
  const { chainId } = route.params
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

  const { data: accounts, isLoading } = useAccounts()
  const { isPending: isDemoDepositing, mutate: depositDemo } = useDepositDemo()
  const { isPending: isCreatingWallet, mutate: createWallet } =
    useCreateWallet()

  const isPending = isDemoDepositing || isCreatingWallet

  const handleDepositDemo = () => {
    if (!selectedAccount) return

    depositDemo(
      {
        accountId: String(selectedAccount.id),
      },
      {
        onError: (error) => {
          navigation.navigate(Paths.DepositFailure, {
            errorCode: error.code,
            errorMessage: error.message || 'Failed to process deposit',
          })
        },
        onSuccess: (data) => {
          navigation.navigate(Paths.DepositSuccess, {
            accountId: data.accountId,
            amount: data.amount,
            availableBalance: data.availableBalance,
            balance: data.balance,
          })
        },
      },
    )
  }

  const handleCreateWallet = () => {
    if (!selectedAccount) return

    createWallet(
      {
        accountId: String(selectedAccount.id),
        chainId: String(chainId),
        type: 'EVM',
      },
      {
        onError: (error) => {
          navigation.navigate(Paths.DepositFailure, {
            errorCode: error.code,
            errorMessage: error.message || 'Failed to create wallet',
          })
        },
        onSuccess: (data) => {
          navigation.navigate(Paths.DepositQR, {
            address: data.wallet.address,
            amount: '0',
            currency: 'USDT',
            network: data.wallet.chainId,
          })
        },
      },
    )
  }

  const handleContinue = () => {
    if (!selectedAccount) return

    if (selectedAccount.accountTypeId == ACCOUNT_TYPES_ID.STANDARD) {
      handleCreateWallet()
    } else if (
      selectedAccount.accountTypeId == ACCOUNT_TYPES_ID.DEMO ||
      !selectedAccount
    ) {
      handleDepositDemo()
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'bottom']}>
      <View className='flex-1'>
        {/* Nav Bar */}
        <View className='h-[58px] px-4 flex-row items-center justify-center gap-2'>
          <Pressable
            className='absolute left-4'
            onPress={() => navigation.goBack()}>
            <ChevronLeft color={colors.neutral700} size={24} />
          </Pressable>
          <Image
            className='w-[30px] aspect-square'
            source={require('@/assets/images/tether.png')}
          />
          <Text
            className='text-h3-semibold'
            style={{ color: colors.neutral900 }}>
            Deposit To
          </Text>
        </View>

        {/* Account List */}
        <ScrollView className='flex-1'>
          {isLoading ? (
            <View className='items-center justify-center py-8'>
              <ActivityIndicator color={colors.primary500} size='large' />
            </View>
          ) : (
            <View>
              {accounts?.map((account) => {
                const isSelected = selectedAccount?.id === account.id
                const isDemo = account.accountTypeId === ACCOUNT_TYPES_ID.DEMO
                return (
                  <Pressable
                    key={account.id}
                    className='flex-row items-center justify-between px-4 py-4 relative '
                    disabled={isPending}
                    style={{
                      backgroundColor: isSelected
                        ? colors.primary100
                        : colors.neutral0,
                      borderLeftColor: isSelected
                        ? colors.primary500
                        : 'transparent',
                      borderLeftWidth: 3,
                    }}
                    onPress={() => setSelectedAccount(account)}>
                    {/* {isSelected && (
                        <View
                          className='w-5 h-5 rounded-full items-center justify-center ml-2'
                          style={{ backgroundColor: colors.primary500 }}>
                          <Check color={colors.neutral0} size={14} />
                        </View>
                      )} */}
                    <View className='flex-row items-center gap-3'>
                      <Text
                        className='text-[15px] font-semibold'
                        style={{ color: colors.neutral900 }}>
                        {account.name}
                      </Text>
                      {isDemo && (
                        <View className='px-[10px] h-[28px] items-center justify-center rounded border border-primary-500'>
                          <Text className='text-primary-500 text-caption-medium'>
                            Demo
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className='flex-row items-center gap-1'>
                      <Text
                        className='text-[15px] font-semibold'
                        style={{ color: colors.neutral900 }}>
                        {formatPriceDecimal(Number(account.balance))} USD
                      </Text>
                    </View>
                  </Pressable>
                )
              })}

              {!isLoading && (!accounts || accounts.length === 0) && (
                <View className='items-center justify-center py-8'>
                  <Text
                    className='text-body-regular'
                    style={{ color: colors.neutral500 }}>
                    No accounts available
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View className='px-4 py-6 gap-5'>
          <View className='flex-row items-center justify-between'>
            <Text className='text-[14px]' style={{ color: colors.neutral500 }}>
              Average processing time
            </Text>
            <Text
              className='text-[15px] font-semibold'
              style={{ color: colors.neutral900 }}>
              Instant
            </Text>
          </View>
          <Button
            disabled={!selectedAccount || isPending}
            label='Continue'
            loading={isPending}
            style={{ borderRadius: 4 }}
            onPress={handleContinue}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default DepositTo
