import { useEffect, useState } from 'react'
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
import { ChevronLeft } from 'lucide-react-native'

function ForgotPasswordVerifyOTP({
  navigation,
  route,
}: RootScreenProps<Paths.ForgotPasswordVerifyOTP>) {
  const { email } = route.params || {}
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendCountdown, setResendCountdown] = useState(0)
  const [canResend, setCanResend] = useState(true)
  const { showError, showSuccess } = useToast()

  // Format seconds to MM:SS format
  const formatCountdown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1)
      }, 1000)
    } else if (resendCountdown === 0 && !canResend) {
      setCanResend(true)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [resendCountdown, canResend])

  const onSubmit = async () => {
    // Validate OTP length
    if (otp.length !== 6) {
      setOtpError('Please enter 6 digits')

      return
    }

    if (!email) {
      showError('Error', 'Email is missing')
      navigation.goBack()
      return
    }

    try {
      setIsLoading(true)
      setOtpError('')
      const response = await authApi.verifyOTP(email, otp, 'reset_password')
      navigation.navigate(Paths.ForgotPasswordCreateNewPassword, {
        email: email,
        resetPasswordToken: response.token,
      })
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : typeof err === 'string'
            ? err
            : 'Invalid verification code. Please check and try again.'
      setOtpError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!canResend || !email) return

    try {
      setCanResend(false)
      setResendCountdown(60)

      const response = await authApi.sendOTP(email, 'reset_password')

      if (response.success) {
        showSuccess('Code Sent', 'A new verification code has been sent')
      } else {
        showError('Failed to send OTP', 'Please try again')
        // Reset countdown if failed
        setCanResend(true)
        setResendCountdown(0)
      }
    } catch (error: any) {
      showError('Error', error)
      // Reset countdown if error
      setCanResend(true)
      setResendCountdown(0)
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
          <View className='flex-1 gap-8'>
            {/* Header */}
            <View className='mb-10 mt-4 flex-row items-center justify-between'>
              <Pressable
                className='p-2'
                hitSlop={10}
                onPress={() => navigation.goBack()}>
                <ChevronLeft size={24} />
              </Pressable>
              <Text className='text-h2-semibold text-neutral-900 text-center flex-1'>
                Enter your email code
              </Text>
              <View className='w-10' />
            </View>
            <View className='items-center gap-2'>
              <Text className='text-body-large-regular text-secondary-500'>
                We've sent the code to
              </Text>
              <Text className='text-body-large-semibold text-neutral-900'>
                {email}
              </Text>
            </View>
            <View className='px-4'>
              <Input
                autoCapitalize='none'
                error={otpError}
                keyboardType='number-pad'
                maxLength={6}
                placeholder='XXXXXX'
                rounded='sm'
                size='md'
                value={otp}
                onChangeText={(text) => {
                  const numericText = text.replaceAll(/\D/g, '').slice(0, 6)
                  setOtp(numericText)
                  if (otpError && numericText.length > 0) {
                    setOtpError('')
                  }
                }}
              />
            </View>

            <Pressable disabled={!canResend} onPress={handleResendCode}>
              <View className='flex-row items-center justify-center'>
                {canResend ? (
                  <Text className='text-button-large-medium text-primary-500'>
                    Resend code
                  </Text>
                ) : (
                  <>
                    <Text className='text-button-large-medium text-neutral-400'>
                      Resend code in{' '}
                    </Text>
                    <Text className='text-button-large-medium text-primary-500'>
                      {formatCountdown(resendCountdown)}
                    </Text>
                  </>
                )}
              </View>
            </Pressable>
          </View>
        </ScrollView>

        {/* Button fixed at bottom */}
        <View className='px-4 pb-5 bg-white border-t border-neutral-100'>
          <Button
            className='shadow-sm shadow-primary/50'
            disabled={isLoading || otp.length !== 6}
            label='Continue'
            onPress={onSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}

export default ForgotPasswordVerifyOTP
