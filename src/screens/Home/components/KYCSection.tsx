import { memo, useEffect, useState } from 'react'
import { Text, View } from 'react-native'

import { Button } from '@/components/atoms'

const CountdownTimer = memo(() => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const hours = currentTime.getHours().toString().padStart(2, '0')
  const minutes = currentTime.getMinutes().toString().padStart(2, '0')
  const seconds = currentTime.getSeconds().toString().padStart(2, '0')
  const milliseconds = Math.floor(currentTime.getMilliseconds() / 10)
    .toString()
    .padStart(2, '0')

  return (
    <View className='flex-row items-center justify-center gap-4 mb-6'>
      <View className='items-center justify-center py-2 px-3 rounded-md bg-neutral-100'>
        <Text
          className='text-body-large-medium text-neutral-900'
          style={{ fontVariant: ['tabular-nums'] }}>
          {hours}
        </Text>
      </View>
      <Text className='text-body-large-semibold text-neutral-900'>:</Text>

      <View className='items-center justify-center py-2 px-3 rounded-md bg-neutral-100'>
        <Text
          className='text-body-large-medium text-neutral-900'
          style={{ fontVariant: ['tabular-nums'] }}>
          {minutes}
        </Text>
      </View>
      <Text className='text-body-large-semibold text-neutral-900'>:</Text>

      <View className='items-center justify-center py-2 px-3 rounded-md bg-neutral-100'>
        <Text
          className='text-body-large-medium text-neutral-900'
          style={{ fontVariant: ['tabular-nums'] }}>
          {seconds}
        </Text>
      </View>
      <Text className='text-body-large-semibold text-neutral-900'>:</Text>

      <View className='items-center justify-center py-2 px-3 rounded-md bg-neutral-100'>
        <Text
          className='text-body-large-medium text-neutral-900'
          style={{ fontVariant: ['tabular-nums'] }}>
          {milliseconds}
        </Text>
      </View>
    </View>
  )
})

CountdownTimer.displayName = 'CountdownTimer'

const KYCSection = memo(() => {
  const [progress, setProgress] = useState(50)

  return (
    <View className='p-4'>
      <View className='flex-col justify-center items-center gap-1'>
        <Text className='typo-h3-regular text-neutral-900'>
          KYC & Earn up to
        </Text>
        <Text className='typo-h1-semibold text-primary-500'>500 USDT</Text>

        <View className='w-full mt-4'>
          <View className='mb-2'>
            <View className='w-full h-2 rounded-full bg-primary-50'>
              <View
                className='h-2 rounded-full bg-primary-500'
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>

          <View className='flex-row items-center justify-between mb-5'>
            <View className='items-start'>
              <Text className='typo-body-small-medium text-neutral-900'>
                Sign up
              </Text>
            </View>

            <View className='items-center'>
              <Text className='typo-body-small-medium text-neutral-900'>
                Identity Verification
              </Text>
            </View>

            <View className='items-end'>
              <Text className='typo-body-small-regular text-neutral-500'>
                Deposit
              </Text>
            </View>
          </View>

          <CountdownTimer />

          <Button label='Verify now' />
        </View>
      </View>
    </View>
  )
})

KYCSection.displayName = 'KYCSection'

export default KYCSection
