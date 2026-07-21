import { Info, ScanFace } from 'lucide-react-native'
import { Text, View } from 'react-native'

import { Button } from '@/components/atoms/Button/Button'
import { SlideUpPanel } from '@/components/templates/SlideUpPanel/SlideUpPanel'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'

function WithdrawConfirm({
  navigation,
}: RootScreenProps<Paths.WithdrawConfirm>) {
  const { colors } = useTheme()

  return (
    <SlideUpPanel title='Withdrawal confirmation'>
      <View className='flex-1 bg-white px-4 pt-4 pb-8'>
        <View className='bg-gray-50 p-4 rounded-xl mb-6 flex-row items-center'>
          <Info color={colors.gray800} size={20} style={{ marginRight: 8 }} />
          <Text className='text-gray-600 flex-1 text-sm'>
            Please make sure all information below is correct
          </Text>
        </View>

        {/* Using separate Views with margin instead of gap for compat */}
        <View className='mb-4 flex-row justify-between'>
          <Text className='text-gray-500 text-base'>Network</Text>
          <Text className='font-bold text-gray-900 text-base'>USDT</Text>
        </View>
        <View className='mb-4 flex-row justify-between'>
          <Text className='text-gray-500 text-base'>Withdrawal amount</Text>
          <Text className='font-bold text-gray-900 text-base'>10 USD</Text>
        </View>
        <View className='mb-4 flex-row justify-between'>
          <Text className='text-gray-500 text-base'>Network fee</Text>
          <Text className='font-bold text-gray-900 text-base'>0.1 USDT</Text>
        </View>
        <View className='mb-4 flex-row justify-between'>
          <Text className='text-gray-500 text-base'>Amount received</Text>
          <Text className='font-bold text-gray-900 text-lg'>0.0001 USDT</Text>
        </View>

        <View className='mt-auto'>
          <Button
            leftIcon={<ScanFace color='white' size={20} />}
            label='Confirm'
            onPress={() => {
              navigation.navigate(Paths.WithdrawSuccess)
            }}
          />
        </View>
      </View>
    </SlideUpPanel>
  )
}

export default WithdrawConfirm
