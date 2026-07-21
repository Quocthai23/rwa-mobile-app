import { useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'

import { Select } from '@/components/atoms'
import { Button } from '@/components/atoms/Button/Button'
import { SlideUpPanel } from '@/components/templates/SlideUpPanel/SlideUpPanel'
import { useDepositDemo } from '@/hooks/payment/useDepositDemo'
import { useAccounts } from '@/hooks/useAccount'
import { useToast } from '@/hooks/useToast'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'

function DepositDetail({
  navigation,
  route,
}: RootScreenProps<Paths.DepositDetail>) {
  const { colors } = useTheme()
  const { methodId } = route.params
  const { showError } = useToast()

  const { data: accounts } = useAccounts()
  const { isPending, mutate: depositDemo } = useDepositDemo()

  console.log('accounts', accounts)

  // Using string value for methodId to match Select option value type (string | number)
  const [selectedMethod, setSelectedMethod] = useState<number | string>(
    methodId,
  )
  const [selectedAccount, setSelectedAccount] = useState<number | string>(
    '159016549',
  )
  const [depositAmount] = useState<string>('1000') // Default deposit amount

  const methodOptions = [
    {
      icon: (
        <Image
          resizeMode='contain'
          source={require('@/assets/images/tether-1.png')}
          style={{ height: 24, width: 24 }}
        />
      ),
      isCommingSoon: false,
      label: 'Tether (USDT)',
      value: 'tether-1',
    },
    {
      icon: (
        <Image
          resizeMode='contain'
          source={require('@/assets/images/tether-2.png')}
          style={{ height: 24, width: 24 }}
        />
      ),
      isCommingSoon: false,
      label: 'Tether (USDT)',
      value: 'tether-2',
    },
    {
      icon: (
        <Image
          resizeMode='contain'
          source={require('@/assets/images/mastercard.png')}
          style={{ height: 24, width: 24 }}
        />
      ),
      isCommingSoon: true,
      label: 'Debit Card',
      value: 'card',
    },
  ]

  //   const accountOptions = [
  //     { label: '159016549', value: '0.00', amount: '0.00' },
  //     { label: '123', value: '0.001', amount: '0.00' },
  //   ];

  const accountOptions =
    accounts?.map((account) => ({
      amount: account.availableBalance,
      label: account.accountTypeId,
      value: account.id,
    })) || []

  useEffect(() => {
    if (accountOptions.length > 0) {
      setSelectedAccount(accountOptions[0].value)
    }
  }, [accountOptions])

  const handleContinue = () => {
    // Validation checks
    if (!selectedMethod) {
      showError('Please select a payment method')

      return
    }

    if (!selectedAccount) {
      showError('Please select an account')

      return
    }

    const amount = Number.parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      showError('Please enter a valid deposit amount')

      return
    }

    // Call deposit API
    depositDemo(
      {
        accountId: String(selectedAccount),
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

  return (
    <SlideUpPanel
      title='Deposit'
      //   headerLeft={
      //     <Pressable onPress={() => navigation.goBack()}>
      //       <View className="bg-gray-100 p-2 rounded-full">
      //         <ChevronLeft color={colors.gray800} size={24} />
      //       </View>
      //     </Pressable>
      //   }
    >
      <View className='flex-1'>
        <View className='p-4'>
          <Select
            label='Payment method'
            options={methodOptions}
            placeholder='Payment method'
            value={selectedMethod}
            onSelect={setSelectedMethod}
          />

          <Select
            containerStyle={{ marginTop: 16 }}
            label='Deposit To'
            options={accountOptions}
            placeholder='Deposit To '
            renderOption={(option, isSelected) => (
              <View
                className='flex-row items-center justify-between'
                style={{
                  backgroundColor: isSelected
                    ? colors.primary50
                    : 'transparent',
                  borderLeftColor: isSelected
                    ? colors.primary500
                    : 'transparent',
                  borderLeftWidth: 3,
                  padding: 16,
                }}>
                <Text
                  className='text-base font-semibold'
                  style={[{ color: colors.neutral900 }]}>
                  {option.label}
                </Text>
                <Text
                  className='text-base font-semibold'
                  style={[{ color: colors.neutral900 }]}>
                  {option.amount} USD
                </Text>
              </View>
            )}
            value={selectedAccount}
            onSelect={setSelectedAccount}
          />

          <Text
            className='text-sm mb-8 mt-2'
            style={{ color: colors.neutral500 }}>
            Funds will be credited to the selected account in the account's base
            currency.
          </Text>
        </View>

        {/* Footer */}
        <View className='mt-auto bg-white p-4 border-t border-gray-100'>
          <View className='flex-row justify-between mb-4'>
            <Text style={{ color: colors.neutral500 }}>
              Average processing time
            </Text>
            <Text
              className='font-semibold'
              style={{ color: colors.neutral900 }}>
              Instant
            </Text>
          </View>
          <Button
            disabled={isPending}
            label={isPending ? 'Processing...' : 'Continue'}
            onPress={handleContinue}
          />
        </View>
      </View>
    </SlideUpPanel>
  )
}

export default DepositDetail
