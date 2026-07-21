import { ChevronLeft } from 'lucide-react-native'
import { useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Input } from '@/components/atoms'
import type { AppBottomSheetModalHandle } from '@/components/atoms/AppBottomSheetModal'
import { Button } from '@/components/atoms/Button/Button'
import { useTransfer } from '@/hooks/payment/useTransfer'
import { useToast } from '@/hooks/useToast'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useAccountStore } from '@/store/useAccountStore'
import { useTheme } from '@/theme'
import type { TransferPayload } from '@/types/payment'
import { formatPriceDecimal } from '@/utils/currency'
import { generateUUID } from '@/utils/uuid'

import { FormField } from './components/FormField'
import { ReasonModal } from './components/ReasonModal'
import { SubmitModal } from './components/SubmitModal'
import { TransferMethodModal } from './components/TransferMethodModal'

// Options for selects
const transferMethodOptions = [
  {
    label: 'Between your accounts',
    value: 'your_account' as const,
  },
  {
    label: 'To another user',
    value: 'other_account' as const,
  },
]

const reasonOptions = [
  'Internal transfer',
  'Margin support',
  'Balance adjustment',
  'Fee or rebate',
  'Bonus or promotion',
  'Compensation',
]

/**
 * Format API errors for display
 * Handles both string errors and array of error objects
 */
function formatApiError(errors: any): string {
  if (!errors) {
    return 'An error occurred'
  }

  // If errors is a string, return it directly
  if (typeof errors === 'string') {
    return errors
  }

  // If errors is an array of error objects with message field
  if (Array.isArray(errors)) {
    const messages = errors
      .map((error) => error.message || error.summary)
      .filter(Boolean)
    return messages.length > 0 ? messages.join(', ') : 'An error occurred'
  }

  // If errors is an object with a message
  if (typeof errors === 'object' && errors.message) {
    return errors.message
  }

  return 'An error occurred'
}

function Transfer({ navigation, route }: RootScreenProps<Paths.Transfer>) {
  const { colors } = useTheme()
  const { transferType } = route.params
  const { showError } = useToast()
  const transferMutation = useTransfer()

  // Refs for bottom sheets
  const transferMethodReference = useRef<AppBottomSheetModalHandle>(null)
  const transferReasonReference = useRef<AppBottomSheetModalHandle>(null)
  const submitReference = useRef<AppBottomSheetModalHandle>(null)

  // State for form fields
  const [selectedMethod, setSelectedMethod] = useState(transferType)
  const selectedAccount =
    useAccountStore((state) => state.selectedAccount) ?? undefined
  const fromAccountId = selectedAccount?.id || ''
  const balanceNum = Number(selectedAccount?.balance)
  const displayBalance = Number.isFinite(balanceNum) ? balanceNum : 0
  const [recipientAccountId, setRecipientAccountId] = useState<string>('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [reason, setReason] = useState(reasonOptions[0])
  const [amount, setAmount] = useState('100')
  const isYourAccount = selectedMethod === 'your_account'

  const handleConfirmTransfer = async () => {
    if (!selectedAccount?.id || !recipientAccountId) {
      return
    }

    const payload: TransferPayload = {
      amount,
      chainId: 'USDT',
      fromAccountId: selectedAccount.id,
      idempotencyKey: generateUUID(),
      reason,
      toAccountId: recipientAccountId,
      toUserEmail: recipientEmail,
    }

    try {
      await transferMutation.mutateAsync(payload)
      submitReference.current?.close()
      navigation.navigate(Paths.TransferSuccess, {
        amount: amount,
        fromAccountId: selectedAccount.id,
        recipientEmail: recipientEmail,
        toAccountId: recipientAccountId,
      })
    } catch (error: any) {
      submitReference.current?.close()

      const errorMessage = formatApiError(error)

      navigation.navigate(Paths.TransferFailure, {
        errorCode: error?.code || 'TRF_001',
        errorMessage: errorMessage,
      })
    }
  }

  const handleContinue = () => {
    // Validation
    if (!selectedMethod) {
      showError('Please select a transfer method')

      return
    }

    if (!fromAccountId) {
      showError('Please select from account')

      return
    }

    if (!recipientAccountId) {
      showError('Please select recipient account')

      return
    }

    if (!isYourAccount && !recipientEmail.trim()) {
      showError('Please enter recipient email')

      return
    }

    if (!isYourAccount && !reason) {
      showError('Please select transfer reason')

      return
    }

    const transferAmount = Number.parseFloat(amount)
    if (isNaN(transferAmount) || transferAmount <= 0) {
      showError('Please enter a valid amount')

      return
    }

    // if (transferAmount < 100 || transferAmount > 100_000_000) {
    //   showError('Amount must be between 100 and 100,000,000 USD')

    //   return
    // }

    // Success - navigate or show success
    submitReference.current?.open()
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* Header */}
      <View className='h-[60px] px-4 flex-row relative items-center justify-center border-b border-gray-100'>
        <TouchableOpacity
          className='absolute left-4'
          onPress={() => {
            navigation.goBack()
          }}>
          <ChevronLeft color={colors.neutral900} size={24} />
        </TouchableOpacity>
        <Text className='text-h3-semibold text-center'>Transfer</Text>
      </View>

      <ScrollView className='flex-1'>
        <View className='p-4 gap-6'>
          {/* From Account */}
          <View className=''>
            <Text
              className='text-body-semibold mr-2'
              style={{ color: colors.neutral900 }}>
              From account
            </Text>
            <Input
              readOnly
              containerStyle={{ marginBottom: 0 }}
              keyboardType='numeric'
              placeholder='Enter amount'
              rightAccessory={
                <Text
                  className='font-semibold'
                  style={{ color: colors.neutral900 }}>
                  {formatPriceDecimal(displayBalance)} USDT
                </Text>
              }
              value={selectedAccount?.name || ''}
            />
          </View>

          {/* Recipient Account ID */}
          <View className=''>
            <Text
              className='text-body-semibold mr-2'
              style={{ color: colors.neutral900 }}>
              Recipient account ID
            </Text>
            <Input
              containerStyle={{ marginBottom: 0 }}
              keyboardType='numeric'
              placeholder='Account address'
              value={recipientAccountId}
              onChangeText={setRecipientAccountId}
            />
          </View>

          {/* Recipient Email (only for other_account) */}
          {/* {!isYourAccount && ( */}
          <View className=''>
            <Text
              className='text-body-semibold mr-2 mb-2'
              style={{ color: colors.neutral900 }}>
              Recipient email (for verification)
            </Text>
            <Input
              containerStyle={{ marginBottom: 0 }}
              keyboardType='email-address'
              placeholder='Enter recipient email'
              value={recipientEmail}
              onChangeText={setRecipientEmail}
            />
          </View>
          {/* )} */}

          {/* Transfer Reason (only for other_account) */}
          {!isYourAccount && (
            <View>
              <FormField
                label='Transfer reason'
                value={reason}
                onPress={() => transferReasonReference.current?.open()}
              />
              <Text className='text-neutral-500 text-body-small-regular mt-1'>
                We’ll verify it matches the recipient’s account before
                processing the transfer.
              </Text>
            </View>
          )}

          {/* Amount */}
          <View className=''>
            <Text
              className='text-body-semibold mr-2'
              style={{ color: colors.neutral900 }}>
              Amount
            </Text>
            <Input
              containerStyle={{ marginBottom: 0 }}
              keyboardType='numeric'
              placeholder='Enter amount'
              rightAccessory={
                <Text
                  className='font-semibold'
                  style={{ color: colors.neutral900 }}>
                  USD
                </Text>
              }
              value={amount}
              onChangeText={setAmount}
            />
            <Text className='text-sm mt-2' style={{ color: colors.primary500 }}>
              100 - 100,000,000 USD
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className='bg-white p-4 border-t border-gray-100'>
        <Button disabled={!amount} label='Continue' onPress={handleContinue} />
      </View>

      {/* Modals */}
      <TransferMethodModal
        modalRef={transferMethodReference}
        options={transferMethodOptions}
        selectedMethod={selectedMethod}
        onSelect={setSelectedMethod}
      />
      <ReasonModal
        modalRef={transferReasonReference}
        options={reasonOptions}
        selectedReason={reason}
        onSelect={setReason}
      />

      <SubmitModal
        amount={amount}
        fromAccount={selectedAccount}
        isYourAccount={isYourAccount}
        isPending={transferMutation.isPending}
        modalRef={submitReference}
        reason={reason}
        recipientAccount={recipientAccountId}
        recipientEmail={recipientEmail}
        onConfirm={handleConfirmTransfer}
      />
    </SafeAreaView>
  )
}

export default Transfer
