import { ChevronLeft } from 'lucide-react-native'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native'

import { Button, Input } from '@/components/atoms'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { SafeScreen } from '@/components/templates'
import { useToast } from '@/hooks/useToast'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { authApi } from '@/services/auth'

function ForgotPasswordSendOTP({
  navigation,
}: RootScreenProps<Paths.ForgotPasswordSendOTP>) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string }>({})
  const { showError } = useToast()

  const handleEmailChange = (text: string) => {
    setEmail(text)
    if (errors.email) {
      setErrors({})
    }
  }
  const EMAIL_REGEX =
    /^(?!\.)(?!.*\.\.)[A-Za-z0-9_'+\-\.]*[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setErrors({ email: 'Email is required' })
      return false
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      setErrors({ email: 'Invalid email format' })
      return false
    }
    return true
  }
  const onSubmit = async () => {
    try {
      setIsLoading(true)
      if (!validateEmail(email)) {
        return
      }
      const response = await authApi.checkEmail(email.trim())

      if (!response.exists) {
        setErrors({ email: 'Email not found' })
      } else {
        const otpResponse = await authApi.sendOTP(
          email.trim(),
          'reset_password',
        )

        if (otpResponse.success) {
          navigation.navigate(Paths.ForgotPasswordVerifyOTP, {
            email: email.trim(),
          })
        } else {
          showError('Failed to send OTP', 'Please try again')
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'An unexpected error occurred'

      showError('Error', message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'>
        <ScrollView
          className='flex-1 bg-white'
          contentContainerStyle={{ flexGrow: 1 }}>
          <View className='flex-1'>
            {/* Header */}
            <View className='mb-10 mt-4 flex-row items-center justify-between'>
              <Pressable
                className='p-2'
                hitSlop={10}
                onPress={() => navigation.goBack()}>
                <ChevronLeft size={24} />
              </Pressable>
              <Text className='text-h2-semibold text-neutral-900 text-center flex-1'>
                Enter your email
              </Text>
              <View />
            </View>
            <View className='px-4'>
              <View>
                <Text className='text-body-large-semibold text-neutral-900 mb-1'>
                  Email Address
                </Text>
              </View>
              <Input
                autoCapitalize='none'
                autoComplete='email'
                error={errors.email}
                keyboardType='email-address'
                placeholder='Email'
                rounded='lg'
                size='lg'
                value={email}
                onChangeText={handleEmailChange}
              />
            </View>
          </View>
        </ScrollView>

        {/* Button fixed at bottom */}
        <View className='px-4 pb-5 bg-white border-t border-neutral-100'>
          <Button
            className='shadow-sm shadow-primary/50'
            disabled={isLoading || !email.trim()}
            label='Continue'
            onPress={onSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}

export default ForgotPasswordSendOTP
