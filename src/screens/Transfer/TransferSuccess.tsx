import { CommonActions } from '@react-navigation/native'
import { CheckCircle } from 'lucide-react-native'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/atoms/Button/Button'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'

function TransferSuccess({
  navigation,
  route,
}: RootScreenProps<Paths.TransferSuccess>) {
  const { colors } = useTheme()
  const { amount, fromAccountId, recipientEmail, toAccountId } = route.params

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'bottom']}>
      <View className='flex-1 items-center justify-center px-6'>
        {/* Success Icon */}
        <View
          className='w-24 h-24 rounded-full items-center justify-center mb-6'
          style={{ backgroundColor: colors.success50 }}>
          <CheckCircle color={colors.success500} size={64} />
        </View>

        {/* Title */}
        <Text
          className='text-2xl font-bold text-center mb-2'
          style={{ color: colors.neutral900 }}>
          Transfer Successful!
        </Text>

        {/* Subtitle */}
        <Text
          className='text-base text-center mb-8'
          style={{ color: colors.neutral500 }}>
          Your transfer has been completed successfully
        </Text>

        {/* Details Card */}
        <View
          className='w-full rounded-xl p-4 mb-8'
          style={{ backgroundColor: colors.neutral50 }}>
          <View className='flex-row justify-between mb-3'>
            <Text className='text-sm' style={{ color: colors.neutral500 }}>
              Transfer Amount
            </Text>
            <Text
              className='text-base font-semibold'
              style={{ color: colors.success500 }}>
              ${amount} USD
            </Text>
          </View>

          <View className='flex-row justify-between mb-3'>
            <Text className='text-sm' style={{ color: colors.neutral500 }}>
              From Account
            </Text>
            <Text
              className='text-base font-semibold'
              style={{ color: colors.neutral900 }}>
              {fromAccountId}
            </Text>
          </View>

          <View className='flex-row justify-between mb-3'>
            <Text className='text-sm' style={{ color: colors.neutral500 }}>
              To Account
            </Text>
            <Text
              className='text-base font-semibold'
              style={{ color: colors.neutral900 }}>
              {toAccountId}
            </Text>
          </View>

          {recipientEmail ? (
            <View className='flex-row justify-between'>
              <Text className='text-sm' style={{ color: colors.neutral500 }}>
                Recipient Email
              </Text>
              <Text
                className='text-base font-semibold'
                style={{ color: colors.neutral900 }}>
                {recipientEmail}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Info Text */}
        <Text
          className='text-sm text-center mb-8'
          style={{ color: colors.neutral500 }}>
          The funds have been transferred and will be available in the recipient
          account immediately.
        </Text>

        {/* Actions */}
        <View className='w-full gap-3'>
          <Button
            label='Done'
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: Paths.Main }],
                }),
              )
            }}
          />
          <Button
            label='Make Another Transfer'
            variant='outline'
            onPress={() => {
              navigation.goBack()
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default TransferSuccess
