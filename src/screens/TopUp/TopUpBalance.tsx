import { ChevronLeft } from 'lucide-react-native'
import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import TopUpSvg from '@/assets/images/topup.svg'
import SafeScreen from '@/components/templates/SafeScreen/SafeScreen'
import { ACCOUNT_TYPES_ID } from '@/constants/account'
import { useDepositDemo } from '@/hooks/payment/useDepositDemo'
import { useAccounts } from '@/hooks/useAccount'
import { useToast } from '@/hooks/useToast'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useAccountStore } from '@/store/useAccountStore'
import { useTheme } from '@/theme'

function TopUpBalanceScreen({ navigation }: RootScreenProps<Paths.TopUp>) {
  const { colors } = useTheme()
  const selectedAccount = useAccountStore((s) => s.selectedAccount)
  const [isLoading, setIsLoading] = useState(false)
  const { mutate: depositDemo } = useDepositDemo()
  const { showError, showSuccess } = useToast()
  const { refetch: refetchAccounts } = useAccounts()
  const isDemoAccount = selectedAccount?.accountTypeId === ACCOUNT_TYPES_ID.DEMO
  const handleTopUp = () => {
    if (isDemoAccount) {
      setIsLoading(true)

      depositDemo(
        {
          accountId: String(selectedAccount?.id || ''),
        },
        {
          onError: (error: any) => {
            setIsLoading(false)
            showError('Failed', error || 'Failed to top up demo account')
            // Optionally show error toast
          },
          onSuccess: (data) => {
            setIsLoading(false)
            showSuccess('Success', 'Demo account topped up successfully')
            // Optionally invalidate queries to refresh balance
            refetchAccounts()
            navigation.navigate(Paths.Main, { screen: Paths.Positions })
          },
        },
      )
    } else {
      // Navigate to deposit for live accounts - not needed as they should go to Deposit screen
      navigation.goBack()
    }
  }

  const handleClose = () => {
    navigation.goBack()
  }

  return (
    <SafeScreen className='flex-1 bg-white'>
      {/* Header */}
      <View className='flex-row items-center justify-between p-4'>
        <TouchableOpacity onPress={handleClose}>
          <ChevronLeft color={colors.neutral900} size={24} />
        </TouchableOpacity>
        <Text className='text-h3-semibold text-neutral-900 flex-1 ml-2'>
          Top up Balance
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView
        className='flex-1 px-4'
        contentContainerClassName='flex-grow justify-center items-center'>
        <View className='items-center gap-8 py-16'>
          {/* Loading/Success Icon */}

          <TopUpSvg height={200} width={200} />
          {/* Message */}
          <View className='items-center gap-3'>
            <Text className='text-h3-semibold text-neutral-900 text-center'>
              Top up your Demo Account for risk-free practice. Balance updates
              instantly.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View className='px-4 gap-3 mb-5'>
        <TouchableOpacity
          className={`rounded-md py-3 ${
            isLoading ? 'bg-neutral-300' : 'bg-primary-500'
          }`}
          disabled={isLoading}
          onPress={handleTopUp}>
          <Text className='text-button-large-medium text-white text-center'>
            Top up now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  )
}

export default TopUpBalanceScreen
