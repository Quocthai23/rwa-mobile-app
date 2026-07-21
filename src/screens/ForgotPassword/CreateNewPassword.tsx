import { Check, ChevronLeft, Eye, EyeOff } from 'lucide-react-native'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text as RNText,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { Input } from '@/components/atoms/Input/Input'
import { SafeScreen } from '@/components/templates'
import { useToast } from '@/hooks/useToast'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { authApi } from '@/services/auth'

function ForgotPasswordCreateNewPassword({
  route,
  navigation,
}: RootScreenProps<Paths.ForgotPasswordCreateNewPassword>) {
  const { resetPasswordToken } = route.params || {}
  const { showError, showSuccess } = useToast()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  // Password validation
  const hasMinLength = password.length >= 8
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  const hasUpperCaseOrDigit = /[\d!"#$%&()*,.:<>?@A-Z^{|}]/.test(password)
  const passwordsMatch = password === confirmPassword

  const handleContinue = async () => {
    if (!resetPasswordToken) {
      showError(
        'Error',
        'Session expired. Please start the reset process again.',
      )
      navigation.navigate(Paths.ForgotPasswordSendOTP)
      return
    }

    // Validate password requirements
    if (!hasMinLength || !hasSpecialChar || !hasUpperCaseOrDigit) {
      showError(
        'Error',
        'Password must be at least 8 characters and contain a special character and a number or uppercase letter',
      )
      return
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password')
      showError('Error', 'Please confirm your password')
      return
    }

    if (!passwordsMatch) {
      setConfirmPasswordError('Passwords do not match')
      showError('Error', 'Passwords do not match')
      return
    }

    // Clear error if validation passes
    setConfirmPasswordError('')

    // Navigate to next screen
    try {
      await authApi.resetPassword(resetPasswordToken, password)
      navigation.reset({
        index: 1,
        routes: [{ name: Paths.Main }, { name: Paths.Login }],
      })
      showSuccess(
        'Success',
        'Your password has been reset. Please log in with your new password.',
      )
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to reset password. Please try again.'
      showError('Error', message)
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
          <View>
            <View className='flex-row items-center mb-6 mt-4'>
              <Pressable
                onPress={() => navigation.goBack()}
                className='p-2'
                style={{ position: 'absolute', left: 0, zIndex: 1 }}>
                <ChevronLeft size={24} className='text-neutral-700' />
              </Pressable>
              <View className='flex-1 items-center'>
                <RNText className='text-h2-semibold text-neutral-900 text-center'>
                  Reset password
                </RNText>
              </View>
            </View>
          </View>
          <View className='flex-1 px-4 py-6'>
            {/* Password Input */}
            <Text className='text-h1-semibold text-neutral-900 mb-4'>
              New password
            </Text>

            <Input
              placeholder='New Password'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              containerStyle={{ marginBottom: 2 }}
              rounded='lg'
              size='lg'
              rightAccessory={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className='text-neutral-500' size={20} />
                  ) : (
                    <Eye className='text-neutral-500' size={20} />
                  )}
                </TouchableOpacity>
              }
            />
            <Input
              placeholder='Confirm new password'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text)
                // Clear error when user starts typing
                if (confirmPasswordError) {
                  setConfirmPasswordError('')
                }
              }}
              containerStyle={{ marginBottom: 20 }}
              rounded='lg'
              size='lg'
              error={
                confirmPasswordError ||
                (confirmPassword.length > 0 && !passwordsMatch
                  ? 'Passwords do not match'
                  : undefined)
              }
              rightAccessory={
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff className='text-neutral-500' size={20} />
                  ) : (
                    <Eye className='text-neutral-500' size={20} />
                  )}
                </TouchableOpacity>
              }
            />

            <View>
              <RNText className='text-button-small-semibold text-gray-900 mb-3'>
                Your password must contain:
              </RNText>

              <View className='gap-3'>
                {/* 8 characters requirement */}
                <View className='flex-row items-center'>
                  <View
                    className={`w-5 h-5 ${hasMinLength ? 'bg-success-500 rounded-full' : 'bg-neutral-300 rounded-full'} mr-3 items-center justify-center`}>
                    <Check size={13} color='white' strokeWidth={3} />
                  </View>
                  <RNText
                    className={`text-button-small-medium ${hasMinLength ? 'text-success-500' : 'text-secondary-500'}`}>
                    8 characters
                  </RNText>
                </View>

                {/* Special character requirement */}
                <View className='flex-row items-center'>
                  <View
                    className={`w-5 h-5 ${hasSpecialChar ? 'bg-success-500 rounded-full' : 'bg-neutral-300 rounded-full'} mr-3 items-center justify-center`}>
                    <Check size={13} color='white' strokeWidth={3} />
                  </View>
                  <RNText
                    className={`text-button-small-medium ${hasSpecialChar ? 'text-success-500' : 'text-secondary-500'}`}>
                    A special character (!@#$%^&*)
                  </RNText>
                </View>
                <View className='flex-row items-center'>
                  <View
                    className={`w-5 h-5 ${hasUpperCaseOrDigit ? 'bg-success-500 rounded-full' : 'bg-neutral-300 rounded-full'} mr-3 items-center justify-center`}>
                    <Check size={13} color='white' strokeWidth={3} />
                  </View>
                  <RNText
                    className={`text-button-small-medium ${hasUpperCaseOrDigit ? 'text-success-500' : 'text-secondary-500'}`}>
                    A number, symbol, or upper-case letter
                  </RNText>
                </View>
              </View>
            </View>
          </View>

          {/* Continue Button - Fixed at bottom */}
          <View className='px-4 pb-5'>
            <TouchableOpacity
              className={`rounded-[4px] py-4 items-center ${hasMinLength && hasSpecialChar && hasUpperCaseOrDigit && passwordsMatch ? 'bg-primary-500' : 'bg-primary-300'}`}
              disabled={
                !hasMinLength ||
                !hasSpecialChar ||
                !hasUpperCaseOrDigit ||
                !passwordsMatch
              }
              onPress={handleContinue}>
              <RNText className='text-white text-base font-semibold'>
                Reset password
              </RNText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}

export default ForgotPasswordCreateNewPassword
