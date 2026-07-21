import { Eye, EyeOff, Headphones } from 'lucide-react-native'
import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native'

import { Button } from '@/components/atoms'
import Input from '@/components/atoms/Input/Input'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { Header, SafeScreen } from '@/components/templates'
import { type Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { authApi } from '@/services/auth'
import { useAuthStore } from '@/store/authStore'
import colors from '@/theme/colors'

function maskEmail(email: string) {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email

  const visible = local.slice(0, 2)

  return `${visible}***@${domain}`
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60

  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function ChangePassword({ navigation }: RootScreenProps<Paths.ChangePassword>) {
  const user = useAuthStore((s) => s.user)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const email = user?.email ?? ''
  const maskedEmail = maskEmail(email)

  // Clear countdown timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const handleGetCode = async () => {
    if (!email || countdown > 0 || isSendingCode) return
    setIsSendingCode(true)
    try {
      await authApi.sendOTP(email, 'reset_password')
      setCodeSent(true)
      setCountdown(60)
      if (timerRef.current) clearInterval(timerRef.current)

      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }

            return 0
          }

          return prev - 1
        })
      }, 1000)
    } catch {
      Alert.alert('Error', 'Failed to send verification code')
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleConfirm = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password')

      return
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters')

      return
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')

      return
    }

    const otp = emailCode.trim()
    if (!otp) {
      Alert.alert('Error', 'Please enter the verification code')

      return
    }

    setIsSubmitting(true)
    try {
      const { token } = await authApi.verifyOTP(email, otp, 'reset_password')
      try {
        await authApi.resetPassword(token, newPassword)

        Alert.alert('Success', 'Password has been changed successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ])
      } catch {
        Alert.alert('Error', 'Failed to reset password. Please try again.')
      }
    } catch {
      Alert.alert(
        'Error',
        'Invalid verification code. Please check and try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    newPassword.length >= 8 &&
    newPassword === confirmPassword &&
    emailCode.trim().length > 0

  return (
    <SafeScreen className='bg-white'>
      <Header
        RightItem={
          <Pressable hitSlop={10}>
            <Headphones color={colors.iconColors.default} size={22} />
          </Pressable>
        }
        label='Reset Login Password'
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
        keyboardVerticalOffset={0}>
        <ScrollView
          className='flex-1'
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}>
          {/* Warning Banner - design: padding 12/8, bg primary-50, radius 4px */}
          <View className='bg-primary-100 rounded px-3 py-2'>
            <Text className='text-body-small-medium text-information-500'>
              After the resetting, Crypto Gift, withdrawals, and P2P selling
              will be disabled for 24 hours to safeguard your assets.
            </Text>
          </View>

          {/* Form: gap 24px with banner, 20px between fields */}
          <View className='mt-6 gap-5'>
            {/* New Password - hide/show password */}
            <Input
              label='New Password'
              placeholder='New password'
              rightAccessory={
                <Pressable
                  accessibilityLabel={
                    showNewPassword ? 'Hide password' : 'Show password'
                  }
                  accessibilityRole='button'
                  hitSlop={8}
                  onPress={() => setShowNewPassword((v) => !v)}>
                  {showNewPassword ? (
                    <EyeOff color={colors.iconColors.subtle} size={20} />
                  ) : (
                    <Eye color={colors.iconColors.subtle} size={20} />
                  )}
                </Pressable>
              }
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />

            {/* Confirm Password - hide/show password */}
            <Input
              label='Confirm Password'
              placeholder='Confirm password'
              rightAccessory={
                <Pressable
                  accessibilityLabel={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                  accessibilityRole='button'
                  hitSlop={8}
                  onPress={() => setShowConfirmPassword((v) => !v)}>
                  {showConfirmPassword ? (
                    <EyeOff color={colors.iconColors.subtle} size={20} />
                  ) : (
                    <Eye color={colors.iconColors.subtle} size={20} />
                  )}
                </Pressable>
              }
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {/* Email Verification - OTP flow: Get Code → countdown MM:SS → Resend */}
            <Input
              keyboardType='number-pad'
              label={`Email Verification (${maskedEmail})`}
              placeholder='Email Verification'
              rightAccessory={
                <Pressable
                  accessibilityLabel={
                    countdown > 0
                      ? `Resend available in ${countdown} seconds`
                      : codeSent
                        ? 'Resend verification code'
                        : 'Get verification code'
                  }
                  accessibilityRole='button'
                  disabled={isSendingCode || countdown > 0}
                  hitSlop={8}
                  onPress={handleGetCode}>
                  <Text
                    className={`text-body-large-medium text-primary-500 ${isSendingCode ? 'opacity-70' : ''}`}>
                    {isSendingCode
                      ? '...'
                      : countdown > 0
                        ? formatCountdown(countdown)
                        : codeSent
                          ? 'Resend'
                          : 'Get Code'}
                  </Text>
                </Pressable>
              }
              value={emailCode}
              onChangeText={setEmailCode}
            />
          </View>

          {/* Spacer */}
          <View className='flex-1' />

          {/* Footer - design: padding 16 horizontal, 20 vertical */}
          <View className='pt-5 pb-5'>
            <Button
              disabled={!isFormValid}
              label='Continue'
              loading={isSubmitting}
              onPress={handleConfirm}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}

export default ChangePassword
