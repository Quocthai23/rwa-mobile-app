import { Check } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { Button } from '@/components/atoms/Button/Button'
import { IconCustom } from '@/components/icons/IconCustom'
import { SlideUpPanel } from '@/components/templates/SlideUpPanel/SlideUpPanel'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'

function WithdrawRisk({ navigation }: RootScreenProps<Paths.WithdrawRisk>) {
  const [acceptedRisk, setAcceptedRisk] = useState(false)
  const { colors } = useTheme()

  return (
    <SlideUpPanel title=''>
      <View className='flex-1 bg-white px-4 pt-4 pb-8 items-center'>
        <IconCustom fill={colors.neutral0} name='info' size={33} />

        <Text
          className='text-xl font-bold mt-6 mb-2 text-center'
          style={{ color: colors.neutral900 }}>
          Potential risk warning
        </Text>

        <Text className='text-center mb-8' style={{ color: colors.neutral500 }}>
          Please ensure you've selected the correct withdrawal address or
          account. Once the transaction is sent to the blockchain, we cannot
          reverse it.
        </Text>

        <View
          className='p-4 rounded-xl mb-8 w-full'
          style={{ backgroundColor: colors.neutral100 }}>
          <Text className='font-bold mb-2' style={{ color: colors.neutral900 }}>
            Be cautious of fraud
          </Text>
          <Text
            className='text-sm leading-5'
            style={{ color: colors.neutral500 }}>
            Please be careful for signs of fraud, such as low prices on prepaid
            virtual gift cards or requests to deposit funds to unknown
            platforms. Miroto will never ask you to withdraw funds to another
            address
          </Text>
        </View>

        <View className='mt-auto w-full'>
          <Pressable
            className='flex-row items-center mb-6'
            onPress={() => {
              setAcceptedRisk(!acceptedRisk)
            }}>
            <View
              className='w-6 h-6 rounded border mr-3 items-center justify-center'
              style={{
                backgroundColor: acceptedRisk
                  ? colors.primary500
                  : 'transparent',
                borderColor: acceptedRisk
                  ? colors.primary500
                  : colors.neutral200,
              }}>
              {acceptedRisk ? (
                <Check color={colors.neutral0} size={16} />
              ) : null}
            </View>
            <Text className='flex-1 ' style={{ color: colors.neutral700 }}>
              I understand all the risks and want to continue with my withdrawal
            </Text>
          </Pressable>

          <Button
            disabled={!acceptedRisk}
            label='Continue'
            onPress={() => {
              navigation.navigate(Paths.WithdrawConfirm)
            }}
          />
        </View>
      </View>
    </SlideUpPanel>
  )
}

export default WithdrawRisk
