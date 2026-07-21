import { CheckCircle } from 'lucide-react-native'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/atoms/Button/Button'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'

function DepositSuccess({
  navigation,
  route,
}: RootScreenProps<Paths.DepositSuccess>) {
  const { colors } = useTheme()
  const { accountId, amount, availableBalance, balance } = route.params

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
          className='text-h1-semibold text-center mb-2'
          style={{ color: colors.neutral900 }}>
          Deposit Successful!
        </Text>

        {/* Subtitle */}
        <Text
          className='text-body-regular text-center mb-8'
          style={{ color: colors.neutral500 }}>
          Your account has been credited successfully
        </Text>

        {/* Details Card */}
        <View
          className='w-full rounded-xl p-4 mb-8'
          style={{ backgroundColor: colors.neutral50 }}>
          <View className='flex-row justify-between mb-3'>
            <Text
              className='text-body-small-regular'
              style={{ color: colors.neutral500 }}>
              Deposit Amount
            </Text>
            <Text
              className='text-body-semibold'
              style={{ color: colors.success500 }}>
              +${amount}
            </Text>
          </View>

          <View className='flex-row justify-between mb-3'>
            <Text
              className='text-body-regular'
              style={{ color: colors.neutral500 }}>
              Account ID
            </Text>
            <Text
              className='text-body-semibold'
              style={{ color: colors.neutral900 }}>
              {accountId}
            </Text>
          </View>

          <View
            className='border-t pt-3 mt-3'
            style={{ borderColor: colors.neutral200 }}>
            <View className='flex-row justify-between mb-3'>
              <Text
                className='text-body-small-regular'
                style={{ color: colors.neutral500 }}>
                New Balance
              </Text>
              <Text
                className='text-h3-semibold'
                style={{ color: colors.neutral900 }}>
                ${balance}
              </Text>
            </View>

            <View className='flex-row justify-between'>
              <Text
                className='text-body-small-regular'
                style={{ color: colors.neutral500 }}>
                Available Balance
              </Text>
              <Text
                className='text-body-semibold'
                style={{ color: colors.neutral900 }}>
                ${availableBalance}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className='w-full gap-3'>
          <Button
            label='Back to Home'
            onPress={() => {
              // navigation.dispatch(
              //   CommonActions.reset({
              //     index: 0,
              //     routes: [{ name: Paths.Main }],
              //   }),
              // )
              navigation.navigate(Paths.Main)
            }}
          />
          {/* <Button
            label="View Transactions"
            variant="outline"
            // onPress={() => navigation.navigate(Paths.Positions)}
          /> */}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default DepositSuccess
