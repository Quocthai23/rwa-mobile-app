import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { ChevronLeft } from 'lucide-react-native'
import { useCallback, useRef, useState } from 'react'
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

function RegisterInput({ navigation }: RootScreenProps<Paths.RegisterInput>) {
  const isFocused = useIsFocused()
  const allowSubmitRef = useRef(true)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string }>({})
  const { showError } = useToast()
  const EMAIL_REGEX =
    /^(?!\.)(?!.*\.\.)[A-Za-z0-9_'+\-\.]*[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/
  const handleEmailChange = (text: string) => {
    setEmail(text)
    if (errors.email) {
      setErrors({})
    }
  }

  useFocusEffect(
    useCallback(() => {
      allowSubmitRef.current = true
      setIsLoading(false)
      return () => {
        allowSubmitRef.current = false
      }
    }, []),
  )

  const onSubmit = async () => {
    console.log(
      '🚀 ~ onSubmit ~ allowSubmitRef.current:',
      allowSubmitRef.current,
    )
    if (!allowSubmitRef.current) {
      return
    }
    allowSubmitRef.current = false
    setIsLoading(true)
    try {
      if (!EMAIL_REGEX.test(email.trim())) {
        setErrors({ email: 'Invalid email format' })
        return
      }
      const response = await authApi.checkEmail(email.trim())
      if (!isFocused) {
        return
      }
      if (response.exists) {
        showError(
          'Email already exists',
          'An account is already registered with this email. Please log in to continue.',
        )
        return
      }

      try {
        await authApi.sendOTP(email.trim(), 'register')
      } catch {}

      if (!isFocused) {
        return
      }

      navigation.navigate(Paths.RegisterVerifyOTP, {
        email: email.trim(),
      })
    } finally {
      allowSubmitRef.current = true
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
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps='handled'>
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
                Sign up
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
            disabled={isLoading}
            label='Continue'
            onPress={onSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}

export default RegisterInput
