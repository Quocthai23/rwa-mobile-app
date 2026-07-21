import { Headphones, Eye, EyeOff } from 'lucide-react-native'
import { useState } from 'react'
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
import { Header, SafeScreen } from '@/components/templates'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import colors from '@/theme/colors'

const FUND_PASSWORD_LENGTH = 6

function SetFundPassword({
  navigation,
}: RootScreenProps<Paths.SetFundPassword>) {
  const [fundPassword, setFundPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showFundPassword, setShowFundPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContinue = async () => {
    if (fundPassword.length !== FUND_PASSWORD_LENGTH) {
      Alert.alert('Error', 'Fund password must be 6 digits')
      return
    }
    if (!/^\d+$/.test(fundPassword)) {
      Alert.alert('Error', 'Fund password must contain only digits')
      return
    }
    if (fundPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: call API to set fund password
      Alert.alert('Success', 'Fund password has been set successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ])
    } catch {
      Alert.alert('Error', 'Failed to set fund password')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    fundPassword.length === FUND_PASSWORD_LENGTH &&
    /^\d+$/.test(fundPassword) &&
    fundPassword === confirmPassword

  return (
    <SafeScreen className='bg-white'>
      <Header
        label='Set Fund Password'
        RightItem={
          <Pressable hitSlop={10}>
            <Headphones color={colors.iconColors.default} size={22} />
          </Pressable>
        }
      />

      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          <View className='mt-6 gap-5'>
            <Input
              label='Fund Password'
              placeholder='Enter 6 digits'
              secureTextEntry={!showFundPassword}
              value={fundPassword}
              onChangeText={(text) =>
                setFundPassword(text.replace(/\D/g, '').slice(0, 6))
              }
              keyboardType='number-pad'
              maxLength={FUND_PASSWORD_LENGTH}
              rightAccessory={
                <Pressable
                  hitSlop={8}
                  onPress={() => setShowFundPassword((v) => !v)}
                  accessibilityLabel={
                    showFundPassword ? 'Hide password' : 'Show password'
                  }
                  accessibilityRole='button'>
                  {showFundPassword ? (
                    <EyeOff color={colors.iconColors.subtle} size={20} />
                  ) : (
                    <Eye color={colors.iconColors.subtle} size={20} />
                  )}
                </Pressable>
              }
            />

            <Input
              label='Confirm Password'
              placeholder='Enter 6 digits'
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) =>
                setConfirmPassword(text.replace(/\D/g, '').slice(0, 6))
              }
              keyboardType='number-pad'
              maxLength={FUND_PASSWORD_LENGTH}
              rightAccessory={
                <Pressable
                  hitSlop={8}
                  onPress={() => setShowConfirmPassword((v) => !v)}
                  accessibilityLabel={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                  accessibilityRole='button'>
                  {showConfirmPassword ? (
                    <EyeOff color={colors.iconColors.subtle} size={20} />
                  ) : (
                    <Eye color={colors.iconColors.subtle} size={20} />
                  )}
                </Pressable>
              }
            />
          </View>

          <View className='flex-1' />

          <View className='pt-5 pb-5'>
            <Button
              label='Continue'
              loading={isSubmitting}
              disabled={!isFormValid}
              onPress={handleContinue}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}

export default SetFundPassword
