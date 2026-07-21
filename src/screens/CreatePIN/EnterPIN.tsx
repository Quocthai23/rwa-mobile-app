import { useEffect, useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { storage } from '@/App'
import { PINKeyboard } from '@/components/atoms'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { SafeScreen } from '@/components/templates'
import {
  PIN_LAST_ACTIVE_KEY,
  PIN_SESSION_VERIFIED_KEY,
  PIN_STORAGE_KEY,
} from '@/constants/pin'
import { usePINGuard } from '@/hooks/usePINGuard'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useAuthStore } from '@/store/authStore'
import { useFavoriteAssetsStore } from '@/store/favoriteAssetsStore'

const OTP_LENGTH = 6

function EnterPIN({ navigation }: RootScreenProps<Paths.EnterPIN>) {
  const { updateLastActiveTime } = usePINGuard()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const logout = useAuthStore((state) => state.logout)
  const clearFavorites = useFavoriteAssetsStore((state) => state.clearFavorites)
  const savedPin = storage.getString(PIN_STORAGE_KEY)

  const displayValues = useMemo(() => {
    return Array.from({ length: OTP_LENGTH }).map((_, index) => {
      if (index >= pin.length) return ''
      return '•'
    })
  }, [pin])

  const handlePinChange = (value: string) => {
    if (error) setError('')
    setPin(value.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH))
  }

  useEffect(() => {
    if (pin.length !== OTP_LENGTH) {
      return
    }

    if (pin === savedPin) {
      updateLastActiveTime()
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.Main }],
      })
    } else {
      setError('Wrong credentials')
      setPin('')
    }
  }, [pin, savedPin, updateLastActiveTime, navigation])

  const handleForgotPIN = () => {
    storage.delete(PIN_LAST_ACTIVE_KEY)
    storage.delete(PIN_SESSION_VERIFIED_KEY)
    storage.delete(PIN_STORAGE_KEY)
    logout()
    clearFavorites()
    navigation.reset({
      index: 0,
      routes: [{ name: Paths.Login }],
    })
  }

  const handleContinue = () => {
    if (pin.length < OTP_LENGTH) {
      setError('Please enter the complete PIN')
      return
    }
    if (pin !== savedPin) {
      setError('Wrong credentials')
      setPin('')
      return
    }
    updateLastActiveTime()
    navigation.reset({
      index: 0,
      routes: [{ name: Paths.Main }],
    })
  }

  const isCodeComplete = pin.length === OTP_LENGTH
  const activeIndex = pin.length < OTP_LENGTH ? pin.length : OTP_LENGTH - 1

  return (
    <SafeScreen>
      <View className='flex-1 bg-white px-4'>
        <View className='flex-1 flex flex-col justify-center'>
          <View className='items-center mt-6'>
            <Text className='text-h2-semibold text-neutral-900'>Enter PIN</Text>
          </View>

          <Text className='text-body-large-semibold text-neutral-900 text-center mb-5 mt-2'>
            Enter PIN to proceed
          </Text>

          <View className='flex-row justify-center items-center gap-3 mb-4'>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <View
                key={`${index}-${displayValues[index]}`}
                className={`
                w-[13%] h-[50px]
                border rounded-md
                items-center justify-center
                ${index === activeIndex ? 'border-primary-500' : 'border-gray-300'}
              `}>
                {displayValues[index] ? (
                  <Text className='text-xl font-semibold text-neutral-900'>
                    {displayValues[index]}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>

          {error ? (
            <View className='border border-red-500 rounded-md py-3 px-4 mb-4'>
              <Text className='text-body-medium-regular text-red-500 text-center'>
                {error}
              </Text>
            </View>
          ) : null}
        </View>

        <View className='justify-end pb-5'>
          <PINKeyboard
            length={OTP_LENGTH}
            value={pin}
            onChange={handlePinChange}
          />
        </View>

        <View className='flex-row gap-2 mb-5'>
          <TouchableOpacity
            className='flex-1 py-4 rounded-[4px] bg-primary-100'
            onPress={handleForgotPIN}>
            <Text className='text-primary-500 text-center text-button-large-medium'>
              Forgot PIN ?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-1 py-4 rounded-[4px] bg-primary-500'
            disabled={!isCodeComplete}
            style={{ opacity: isCodeComplete ? 1 : 0.6 }}
            onPress={handleContinue}>
            <Text className='text-white text-center text-button-large-medium'>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  )
}

export default EnterPIN
