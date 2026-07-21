import { ChevronLeft } from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Pressable, TouchableOpacity, View } from 'react-native'

import { storage } from '@/App'
import { PINKeyboard } from '@/components/atoms'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { SafeScreen } from '@/components/templates'
import { PIN_STORAGE_KEY } from '@/constants/pin'
import { useToast } from '@/hooks/useToast'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'

const OTP_LENGTH = 6

type Step = 'verify' | 'create' | 'confirm'

const STEP_CONFIG: Record<Step, { title: string; subtitle?: string }> = {
  verify: {
    title: 'Enter your current PIN to continue',
  },
  create: {
    title: 'Create a new PIN',
    subtitle: 'Use a PIN to secure your account on all your devices',
  },
  confirm: {
    title: 'Re-enter your new PIN to confirm',
    subtitle:
      'Your PIN will be used to secure this account on all your devices',
  },
}

function ChangePINCode({ navigation }: RootScreenProps<Paths.ChangePINCode>) {
  const { showSuccess } = useToast()
  const [step, setStep] = useState<Step>('verify')
  const [pin, setPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [error, setError] = useState('')

  const config = STEP_CONFIG[step]

  const displayValues = useMemo(() => {
    return Array.from({ length: OTP_LENGTH }).map((_, index) => {
      if (index >= pin.length) return ''
      return '•'
    })
  }, [pin])

  const activeIndex = pin.length < OTP_LENGTH ? pin.length : OTP_LENGTH - 1
  const isCodeComplete = pin.length === OTP_LENGTH

  const handlePinChange = (value: string) => {
    if (error) setError('')
    setPin(value.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH))
  }

  const handleBack = () => {
    if (step === 'verify') {
      navigation.goBack()
    } else if (step === 'create') {
      setStep('verify')
      setPin('')
      setError('')
    } else {
      setStep('create')
      setPin('')
      setError('')
    }
  }

  const handleContinue = () => {
    if (pin.length < OTP_LENGTH) {
      setError('Please enter the complete PIN')
      return
    }

    if (step === 'verify') {
      const savedPin = storage.getString(PIN_STORAGE_KEY)
      if (!savedPin || pin !== savedPin) {
        setError('Incorrect PIN. Please try again')
        setPin('')
        return
      }
      setStep('create')
      setPin('')
      setError('')
    } else if (step === 'create') {
      setNewPin(pin)
      setStep('confirm')
      setPin('')
      setError('')
    } else {
      if (pin !== newPin) {
        setError('PINs do not match. Please try again')
        setPin('')
        return
      }
      storage.set(PIN_STORAGE_KEY, pin)
      showSuccess('Success', 'Your PIN has been changed successfully')

      navigation.goBack()
    }
  }

  return (
    <SafeScreen>
      <View className='flex-1 bg-white px-4'>
        {/* Header */}
        <View className='flex-row items-center mb-6 mt-4 relative'>
          <Pressable
            onPress={handleBack}
            style={{ position: 'absolute', left: 0, zIndex: 1 }}>
            <ChevronLeft size={24} className='text-neutral-700' />
          </Pressable>
          <View className='flex-1 items-center'>
            <Text className='text-h2-semibold text-neutral-900 text-center'>
              Reset PIN
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className='flex-1 flex flex-col justify-center'>
          {/* Title */}
          <Text className='text-body-large-semibold text-neutral-900 text-center mb-8'>
            {config.title}
          </Text>

          {/* PIN boxes */}
          <View className='flex-row justify-center mb-4 items-center gap-3'>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <View
                key={`${step}-${index}-${displayValues[index]}`}
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

          {/* Subtitle */}
          {config.subtitle ? (
            <Text className='text-body-small-regular text-neutral-500 text-center mt-2'>
              {config.subtitle}
            </Text>
          ) : null}

          {/* Error */}
          {error ? (
            <View className='border border-red-500 rounded-md py-3 px-4 mt-4'>
              <Text className='text-body-medium-regular text-red-500 text-center'>
                {error}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Keyboard */}
        <View className='justify-end pb-5'>
          <PINKeyboard
            length={OTP_LENGTH}
            onChange={handlePinChange}
            value={pin}
          />
        </View>

        {/* Continue button */}
        <TouchableOpacity
          className='py-4 rounded-[4px] mb-5 bg-primary-500'
          disabled={!isCodeComplete}
          style={{ opacity: isCodeComplete ? 1 : 0.6 }}
          onPress={handleContinue}>
          <Text className='text-white text-center font-semibold text-base'>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  )
}

export default ChangePINCode
