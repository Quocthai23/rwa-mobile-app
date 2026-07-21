import { ChevronLeft } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Pressable, TouchableOpacity, View } from 'react-native'

import { storage } from '@/App'
import { PINKeyboard } from '@/components/atoms'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { SafeScreen } from '@/components/templates'
import { PIN_STORAGE_KEY } from '@/constants/pin'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'

const OTP_LENGTH = 6

function ConfirmPINCode({
  navigation,
  route,
}: RootScreenProps<Paths.ConfirmPINCode>) {
  const { pin: originalPin } = route.params
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const displayValues = useMemo(() => {
    return Array.from({ length: OTP_LENGTH }).map((_, index) => {
      if (index >= pin.length) {
        return ''
      }

      return '•'
    })
  }, [pin])

  const handlePinChange = (value: string) => {
    if (error) {
      setError('')
    }

    setPin(value.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH))
  }

  const handleSubmit = () => {
    if (pin.length < OTP_LENGTH) {
      setError('Please enter the complete PIN')

      return
    }

    if (pin !== originalPin) {
      setError('PIN do not match. Please try again')
      setPin('')

      return
    }

    storage.set(PIN_STORAGE_KEY, pin)
    navigation.navigate(Paths.FinishCreatePIN)
  }

  const isCodeComplete = pin.length === OTP_LENGTH
  const activeIndex = pin.length < OTP_LENGTH ? pin.length : OTP_LENGTH - 1

  return (
    <SafeScreen>
      <View className='flex-1 bg-white px-4 h-full'>
        <View>
          <View className='flex-row items-center mb-6 mt-4 relative'>
            <Pressable
              style={{ position: 'absolute', left: 0, zIndex: 1 }}
              onPress={() => navigation.goBack()}>
              <ChevronLeft className='text-neutral-700' size={24} />
            </Pressable>
            <View className='flex-1 items-center'>
              <Text className='text-h2-semibold text-neutral-900 text-center'>
                Confirm your PIN
              </Text>
            </View>
          </View>
        </View>
        <View className='flex-1 flex flex-col justify-center'>
          <Text className='text-body-large-semibold text-neutral-900 text-center mb-5'>
            Confirm your PIN
          </Text>

          <View className='flex-row justify-center mb-4 items-center gap-3'>
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

        <TouchableOpacity
          className='py-4 rounded-[4px] mb-5 bg-primary-500'
          disabled={!isCodeComplete}
          style={{ opacity: isCodeComplete ? 1 : 0.6 }}
          onPress={handleSubmit}>
          <Text className='text-white text-center font-semibold text-base'>
            Confirm PIN
          </Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  )
}

export default ConfirmPINCode
