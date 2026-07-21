import { CommonActions } from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import { useEffect, useRef } from 'react'
import { Text, View } from 'react-native'

import { Button } from '@/components/atoms/Button/Button'
import { SlideUpPanel } from '@/components/templates/SlideUpPanel/SlideUpPanel'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'

function WithdrawFailed({ navigation }: RootScreenProps<Paths.WithdrawFailed>) {
  const reference = useRef<LottieView>(null)

  useEffect(() => {
    reference.current?.reset()
    reference.current?.play()
  }, [])

  return (
    <SlideUpPanel title=''>
      <View className='flex-1 bg-white px-4 pt-10 pb-8 items-center justify-center'>
        <View className='flex-1 items-center justify-center'>
          <LottieView
            ref={reference}
            autoPlay={false}
            loop={false}
            source={require('@/assets/lottie/error.json')}
            style={{ height: 120, width: 120 }}
          />
          <Text className='text-2xl font-bold text-gray-900 mb-4'>
            Withdrawal failed
          </Text>
          <Text className='text-center text-gray-500 px-8'>
            Something went wrong with your withdrawal request. Please try again.
          </Text>
        </View>

        <View className='w-full space-y-4'>
          <Button
            className='mb-4'
            label='Try again'
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
            label='Go back'
            variant='secondary'
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
    </SlideUpPanel>
  )
}

export default WithdrawFailed
