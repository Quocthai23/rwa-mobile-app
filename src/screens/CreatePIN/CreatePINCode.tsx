import { ChevronLeft } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Alert, Pressable, TouchableOpacity, View } from 'react-native'

import { PINKeyboard } from '@/components/atoms'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { SafeScreen } from '@/components/templates'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'

const OTP_LENGTH = 6

function CreatePINCode({ navigation }: RootScreenProps<Paths.CreatePINCode>) {
  const [pin, setPin] = useState('')

  const displayValues = useMemo(() => {
    return Array.from({ length: OTP_LENGTH }).map((_, index) => {
      if (index >= pin.length) {
        return ''
      }

      return '•'
    })
  }, [pin])

  const handlePinChange = (value: string) => {
    setPin(value.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH))
  }

  const handleSubmit = () => {
    if (pin.length < OTP_LENGTH) {
      Alert.alert('Vui lòng nhập đủ PIN')
      return
    }
    navigation.navigate(Paths.ConfirmPINCode, { pin })
  }

  const isCodeComplete = pin.length === OTP_LENGTH
  const activeIndex = pin.length < OTP_LENGTH ? pin.length : OTP_LENGTH - 1

  return (
    <SafeScreen>
      <View className='flex-1 bg-white px-4 h-full'>
        <View>
          <View className='flex-row items-center mb-6 mt-4 relative'>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{ position: 'absolute', left: 0, zIndex: 1 }}>
              <ChevronLeft size={24} className='text-neutral-700' />
            </Pressable>
            <View className='flex-1 items-center'>
              <Text className='text-h2-semibold text-neutral-900 text-center'>
                Create a PIN
              </Text>
            </View>
          </View>
        </View>
        <View className='flex-1 flex flex-col justify-center'>
          <View className='mb-5'>
            <Text className='text-body-large-semibold text-neutral-900 text-center'>
              Set a PIN now to access your account
            </Text>
            <Text className='text-body-large-semibold text-neutral-900 text-center'>
              quickly and securely
            </Text>
          </View>
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
        </View>

        <View className='justify-end pb-5'>
          <PINKeyboard
            length={OTP_LENGTH}
            onChange={handlePinChange}
            value={pin}
          />
        </View>

        <TouchableOpacity
          className='py-4 rounded-[4px] mb-5 bg-primary-500'
          disabled={!isCodeComplete}
          style={{ opacity: isCodeComplete ? 1 : 0.6 }}
          onPress={handleSubmit}>
          <Text className='text-white text-center font-semibold text-base'>
            Create a PIN
          </Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  )
}

export default CreatePINCode
