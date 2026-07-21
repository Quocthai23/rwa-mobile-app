import { CommonActions } from '@react-navigation/native'
import { XCircle } from 'lucide-react-native'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/atoms/Button/Button'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'

function TransferFailure({
  navigation,
  route,
}: RootScreenProps<Paths.TransferFailure>) {
  const { colors } = useTheme()
  const { errorCode, errorMessage } = route.params

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'bottom']}>
      <View className='flex-1 items-center justify-center px-6'>
        {/* Error Icon */}
        <View
          className='w-24 h-24 rounded-full items-center justify-center mb-6'
          style={{ backgroundColor: colors.error50 }}>
          <XCircle color={colors.error500} size={64} />
        </View>

        {/* Title */}
        <Text
          className='text-2xl font-bold text-center mb-2'
          style={{ color: colors.neutral900 }}>
          Transfer Failed
        </Text>

        {/* Subtitle */}
        <Text
          className='text-base text-center mb-8'
          style={{ color: colors.neutral500 }}>
          We couldn't process your transfer
        </Text>

        {/* Error Details Card */}
        <View
          className='w-full rounded-xl p-4 mb-8'
          style={{ backgroundColor: colors.error50 }}>
          <Text
            className='text-sm font-semibold mb-2'
            style={{ color: colors.error700 }}>
            Error Details
          </Text>
          <Text className='text-sm mb-3' style={{ color: colors.error600 }}>
            {errorMessage}
          </Text>
          {errorCode ? (
            <Text className='text-xs' style={{ color: colors.error500 }}>
              Error Code: {errorCode}
            </Text>
          ) : null}
        </View>

        {/* Suggestions */}
        <View
          className='w-full rounded-xl p-4 mb-8'
          style={{ backgroundColor: colors.neutral50 }}>
          <Text
            className='text-sm font-semibold mb-2'
            style={{ color: colors.neutral900 }}>
            What you can do:
          </Text>
          <View className='gap-2'>
            <Text className='text-sm' style={{ color: colors.neutral700 }}>
              • Check your account balance
            </Text>
            <Text className='text-sm' style={{ color: colors.neutral700 }}>
              • Verify recipient account details
            </Text>
            <Text className='text-sm' style={{ color: colors.neutral700 }}>
              • Try again in a few minutes
            </Text>
            <Text className='text-sm' style={{ color: colors.neutral700 }}>
              • Contact support if issue persists
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className='w-full gap-3'>
          <Button
            label='Try Again'
            onPress={() => {
              navigation.goBack()
            }}
          />
          <Button
            label='Back to Home'
            variant='outline'
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: Paths.Main }],
                }),
              )
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default TransferFailure
