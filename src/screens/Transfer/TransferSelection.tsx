import { useNavigation } from '@react-navigation/native'
import { type StackNavigationProp } from '@react-navigation/stack'
import React, { forwardRef } from 'react'
import { Pressable, Text, View } from 'react-native'

import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import { IconCustom } from '@/components/icons/IconCustom'
import { Paths } from '@/navigation/paths'
import { type RootStackParamList } from '@/navigation/types'
import { useTheme } from '@/theme'

type Props = {}

type TransferOption = {
  icon: React.ReactNode
  id: 'other_account' | 'your_account'
  limit: string
  process: string
  title: string
}

const TransferSelection = forwardRef<AppBottomSheetModalHandle, Props>(
  (props, reference) => {
    const { colors } = useTheme()
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

    const options: TransferOption[] = [
      {
        icon: (
          <IconCustom color={colors.neutral700} name='account1' size={24} />
        ),
        id: 'your_account',
        limit: '1 - 1M USD',
        process: 'Instant - 1 days',
        title: 'Between your accounts',
      },
      {
        icon: (
          <IconCustom color={colors.neutral700} name='account2' size={24} />
        ),
        id: 'other_account',
        limit: '1 - 1M USD',
        process: 'Instant - 1 days',
        title: 'To another user',
      },
    ]

    const handleSelectOption = (optionId: 'other_account' | 'your_account') => {
      //   Close modal first
      if (reference && typeof reference !== 'function' && reference.current) {
        reference.current.close()
      }

      // Wait for modal close animation, then navigate
      setTimeout(() => {
        navigation.navigate(Paths.Transfer, {
          transferType: optionId,
        })
      }, 200)
    }

    return (
      <AppBottomSheetModal ref={reference} snapPoints={['60%']}>
        <View className='p-4 pb-20'>
          <Text className='text-xl font-bold mb-6'>Transfer</Text>

          <View className='gap-4'>
            {options.map((option) => (
              <Pressable
                key={option.id}
                className='p-4 rounded-md border flex-row justify-between'
                style={{ borderColor: colors.neutral200 }}
                onPress={() => {
                  handleSelectOption(option.id)
                }}>
                <View className='flex-row flex-1'>
                  <View
                    className='w-[40px] h-[40px] rounded-full items-center justify-center mr-4'
                    style={{ backgroundColor: colors.neutral100 }}>
                    {option.icon}
                  </View>
                  <View className='flex-1'>
                    <Text className='text-base font-semibold mb-1'>
                      {option.title}
                    </Text>
                    <Text
                      className='text-sm'
                      style={{ color: colors.neutral500 }}>
                      Processing time:{' '}
                      <Text
                        className='font-semibold'
                        style={{ color: colors.neutral900 }}>
                        {option.process}
                      </Text>
                    </Text>
                    <Text
                      className='text-sm mt-1'
                      style={{ color: colors.neutral500 }}>
                      Limits:{' '}
                      <Text
                        className='font-semibold'
                        style={{ color: colors.neutral900 }}>
                        {option.limit}
                      </Text>
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </AppBottomSheetModal>
    )
  },
)

TransferSelection.displayName = 'TransferSelection'

export default TransferSelection
