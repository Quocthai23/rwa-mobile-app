import { Info, Eye } from 'lucide-react-native'
import { View, Text } from 'react-native'

import { Button } from '@/components/atoms/Button/Button'
import { Paths } from '@/navigation/paths'
import { useTheme } from '@/theme'
import { useAppNavigation } from '@/hooks'
import { useWithdraw } from '@/hooks/payment/useWithdraw'
import { useState } from 'react'
import { CHAINS_NAME, TOKEN_NAME } from '@/constants/chain'
import { formatPriceDecimal } from '@/utils/currency'

type WithdrawData = {
  accountId: string
  address: string
  amount: string
  chainId: string
}

const WithdrawConfirmNew = ({
  onClose,
  withdrawData,
}: {
  onClose: () => void
  withdrawData: WithdrawData
}) => {
  const navigation = useAppNavigation()
  const { colors } = useTheme()
  const { mutateAsync: withdraw, isPending } = useWithdraw()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      const result = await withdraw({
        accountId: withdrawData.accountId,
        address: withdrawData.address,
        amount: withdrawData.amount,
        chainId: withdrawData.chainId,
      })
      console.log('🚀 ~ handleConfirm ~ result:', result)

      onClose()
      setTimeout(() => {
        navigation.navigate(Paths.WithdrawSuccess, {
          withdrawData: result,
        })
      }, 300)
    } catch (error) {
      onClose()
      setTimeout(() => {
        navigation.navigate(Paths.WithdrawFailed)
      }, 300)
    } finally {
      setIsProcessing(false)
    }
  }

  const amountReceived = Math.max(0, parseFloat(withdrawData.amount) - 0.1)
  const network = Number(withdrawData.chainId)
  return (
    <View className='flex-1 bg-white'>
      {/* Header */}
      <View
        className='px-3 pt-4 pb-4  border-b'
        style={{ borderColor: colors.neutral200 }}>
        <Text
          className='text-[18px] font-semibold'
          style={{ color: colors.neutral900 }}>
          Withdrawal confirmation
        </Text>
      </View>

      {/* Content */}
      <View className='px-4 py-6'>
        {/* Info Banner */}
        <View className='flex-row items-center gap-1 bg-gray-50 px-2 py-3 rounded mb-5'>
          <Info color={colors.neutral700} size={16} />
          <Text
            className='flex-1 text-[14px]'
            style={{ color: colors.neutral900 }}>
            Please make sure all information below is correct
          </Text>
        </View>

        {/* Details */}
        <View className='gap-3 mb-6'>
          <View className='flex-row justify-between items-center'>
            <Text className='text-[14px]' style={{ color: colors.neutral500 }}>
              Network
            </Text>
            <Text
              className='text-[16px] font-medium'
              style={{ color: colors.neutral900 }}>
              {CHAINS_NAME?.[network ?? '']} ({TOKEN_NAME?.[network ?? '']})
            </Text>
          </View>

          <View className='flex-row justify-between items-center'>
            <Text className='text-[14px]' style={{ color: colors.neutral500 }}>
              Withdrawal amount
            </Text>
            <Text
              className='text-[16px] font-medium'
              style={{ color: colors.neutral900 }}>
              {withdrawData.amount} USD
            </Text>
          </View>

          <View className='flex-row justify-between items-center'>
            <Text className='text-[14px]' style={{ color: colors.neutral500 }}>
              Network fee
            </Text>
            <Text
              className='text-[16px] font-medium'
              style={{ color: colors.neutral900 }}>
              0.1 USDT
            </Text>
          </View>

          <View className='flex-row justify-between items-center'>
            <Text className='text-[14px]' style={{ color: colors.neutral500 }}>
              Amount received
            </Text>
            <Text
              className='text-[16px] font-medium'
              style={{ color: colors.neutral900 }}>
              {formatPriceDecimal(amountReceived)} USDT
            </Text>
          </View>
        </View>

        {/* Button */}
        <Button
          disabled={isPending || isProcessing}
          // leftIcon={<Eye color='white' size={24} />}
          label={isPending || isProcessing ? 'Processing...' : 'Confirm'}
          style={{ borderRadius: 4 }}
          onPress={handleConfirm}
        />
      </View>
    </View>
  )
}

export default WithdrawConfirmNew
