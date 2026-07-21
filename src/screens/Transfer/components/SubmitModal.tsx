import { Text, View } from 'react-native'
import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import { Button } from '@/components/atoms/Button/Button'
import { useTheme } from '@/theme'
import type { RefObject } from 'react'
import type { Account } from '@/types/account'
import FaceIdIcon from '@/components/icons/FaceIdIcon'

interface SubmitModalProps {
  modalRef: RefObject<AppBottomSheetModalHandle | null>
  amount: string
  fromAccount?: Account
  recipientAccount?: string
  recipientEmail: string
  reason: string
  isYourAccount: boolean
  isPending: boolean
  onConfirm: () => void
}

export const SubmitModal = ({
  modalRef,
  amount,
  fromAccount,
  recipientAccount,
  recipientEmail,
  reason,
  isYourAccount,
  isPending,
  onConfirm,
}: SubmitModalProps) => {
  const { colors } = useTheme()

  return (
    <AppBottomSheetModal ref={modalRef} snapPoints={['50%']}>
      <View className=''>
        <Text className='text-h3-semibold p-4'>Review</Text>

        <View
          className='p-4 gap-3 px-4 pt-6'
          style={{
            borderBottomWidth: 1,
            borderColor: colors.neutral200,
            borderTopWidth: 1,
          }}>
          <View className='flex-row justify-between'>
            <Text
              className='text-body-small-regular'
              style={{ color: colors.neutral500 }}>
              From
            </Text>
            <Text
              className='text-body-medium'
              style={{ color: colors.neutral900 }}>
              {fromAccount?.name || 'N/A'}
            </Text>
          </View>
          <View className='flex-row justify-between'>
            <Text
              className='text-body-small-regular'
              style={{ color: colors.neutral500 }}>
              Send to
            </Text>
            <Text
              className='text-body-medium'
              style={{ color: colors.neutral900 }}>
              {recipientAccount || ''}
            </Text>
          </View>
          {!isYourAccount && (
            <View className='flex-row justify-between'>
              <Text
                className='text-body-small-regular'
                style={{ color: colors.neutral500 }}>
                Email address
              </Text>
              <Text
                className='text-body-medium'
                style={{ color: colors.neutral900 }}>
                {recipientEmail || 'N/A'}
              </Text>
            </View>
          )}
          {/* {!isYourAccount && (
            <View className='flex-row justify-between'>
              <Text
                className='text-body-small-regular'
                style={{ color: colors.neutral500 }}>
                Reason
              </Text>
              <Text
                className='text-body-medium'
                style={{ color: colors.neutral900 }}>
                {reason || 'N/A'}
              </Text>
            </View>
          )} */}
        </View>

        <View className='flex-row justify-between px-4 mt-3'>
          <Text
            className='text-body-semibold'
            style={{ color: colors.neutral900 }}>
            Total
          </Text>
          <Text
            className='text-body-semibold'
            style={{ color: colors.neutral900 }}>
            ${amount} USD
          </Text>
        </View>
        <View className='p-4 pb-8 gap-3'>
          <Button
            disabled={isPending}
            leftIcon={
              <View className='mr-2'>
                <FaceIdIcon />
              </View>
            }
            label={isPending ? 'Processing...' : 'Confirm And Send'}
            onPress={onConfirm}
          />
          {/* <Button
            label='Demo Error'
            variant='outline'
            onPress={() => {
              modalRef.current?.close()

              navigation.navigate(Paths.TransferFailure, {
                errorCode: 'TRF_001',
                errorMessage: 'Insufficient funds in your account',
              })
            }}
          /> */}
        </View>
      </View>
    </AppBottomSheetModal>
  )
}
