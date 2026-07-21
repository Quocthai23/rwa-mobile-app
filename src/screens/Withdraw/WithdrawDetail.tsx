import { ChevronLeft, Info } from 'lucide-react-native'
import { useState } from 'react'
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/components/atoms/Button/Button'
import { Input } from '@/components/atoms/Input/Input'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'
import { useGlobalModal } from '@/hooks/useGlobalModal'
import WithdrawRiskConfirm from './WithdrawRiskConfirm'
import { useAccountStore } from '@/store/useAccountStore'

function WithdrawDetail({
  navigation,
  route,
}: RootScreenProps<Paths.WithdrawDetail>) {
  // const { data: accounts = [] } = useAccounts()
  const { colors } = useTheme()
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const selectedAccount = useAccountStore((state) => state.selectedAccount)

  const chainId = route.params?.chainId || ''

  const availableBalance = parseFloat(selectedAccount?.balance || '0')

  const { showModal, closeModal } = useGlobalModal()

  const handleAmountChange = (text: string) => {
    // Only allow numbers and one decimal point
    const validText = text.replace(/[^0-9.]/g, '')

    // Prevent multiple decimal points
    const parts = validText.split('.')
    if (parts.length > 2) {
      return
    }

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return
    }

    setAmount(validText)
  }

  const handleShowWithdrawRisk = () => {
    showModal({
      content: (
        <WithdrawRiskConfirm
          closeModal={closeModal}
          withdrawData={{
            accountId: selectedAccount?.id || '',
            address,
            amount,
            chainId,
          }}
        />
      ),
      snapPoints: ['65%'],
      initialSnapIndex: 0,
      backdropOpacity: 0.7,
    })
  }
  return (
    <SafeAreaView className='flex-1' edges={['top', 'bottom']}>
      {/* header */}
      <View className='h-[60px] px-4 gap-3 flex-row relative items-center justify-center'>
        <TouchableOpacity
          className='absolute left-4'
          onPress={() => {
            navigation.goBack()
          }}>
          <ChevronLeft size={24} />
        </TouchableOpacity>
        <Image
          source={require('@/assets/images/tether.png')}
          style={{ height: 30, width: 30 }}
        />
        <Text className='text-lg font-bold text-center'>Withdraw</Text>
      </View>
      <View className='flex-1 p-4 pb-8'>
        {/* USDT address */}
        <View className='flex-row items-center mb-3'>
          <Text
            className='text-md font-semibold mr-2'
            style={{ color: colors.neutral900 }}>
            USDT address
          </Text>
          <Info color={colors.neutral400} size={14} />
        </View>
        <View className='mb-4'>
          <Input
            rightAccessory={
              <Pressable
                className='flex-row items-center justify-center'
                style={{
                  backgroundColor: colors.neutral100,
                  height: 36,
                  paddingHorizontal: 12,
                }}>
                <Text className='text-sm font-medium'>Paste</Text>
              </Pressable>
            }
            style={{
              borderColor: colors.neutral200,
            }}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Withdrawal amount */}
        <Text
          className='text-md font-semibold mr-2 mb-3'
          style={{ color: colors.neutral900 }}>
          Withdrawal amount
        </Text>
        <View className='mb-4'>
          <Input
            placeholder='0'
            keyboardType='decimal-pad'
            rightAccessory={
              <View className='flex-row items-center'>
                <Text className='text-gray-500 font-medium '>USD</Text>
                <View
                  className='mx-3'
                  style={{
                    backgroundColor: colors.neutral300,
                    height: 24,
                    width: 1,
                  }}
                />
                <Pressable
                  onPress={() => {
                    const maxAmount = availableBalance.toFixed(2)
                    setAmount(maxAmount)
                  }}>
                  <Text className='text-primary-500 font-bold'>Max</Text>
                </Pressable>
              </View>
            }
            value={amount}
            onChangeText={handleAmountChange}
          />
        </View>

        {/* Account Select */}
        {/* <Select
          containerStyle={{ marginBottom: 4 }}
          label='Select withdrawal account'
          options={accountOptions}
          placeholder='Select account'
          value={selectedAccount}
          onSelect={setSelectedAccount}
        /> */}

        <Text className='text-md' style={{ color: colors.neutral500 }}>
          Available balance:{' '}
          <Text className='font-bold' style={{ color: colors.neutral900 }}>
            {availableBalance} USD
          </Text>
        </Text>

        {/* Footer Info */}
        <View className='mt-auto'>
          <View className='flex-row justify-between mb-2'>
            <Text style={{ color: colors.neutral500 }}>Network fee</Text>
            <Text
              className='font-semibold'
              style={{ color: colors.neutral900 }}>
              0.1 USD
            </Text>
          </View>
          <View className='flex-row justify-between mb-6'>
            <Text style={{ color: colors.neutral500 }}>Amount received</Text>
            <Text
              className='font-semibold'
              style={{ color: colors.neutral900 }}>
              0.1 USDT
            </Text>
          </View>

          <Button
            disabled={
              !address ||
              !amount ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > availableBalance
            }
            label='Submit'
            onPress={() => {
              handleShowWithdrawRisk()
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default WithdrawDetail
