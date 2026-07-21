import type { RootScreenProps } from '@/navigation/types'

import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'

import { Paths } from '@/navigation/paths'
import { Input } from '@/components/atoms'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { SafeScreen } from '@/components/templates'
import { Pressable } from 'react-native'
import { authApi } from '@/services/auth'
import { SuccessToast } from 'react-native-toast-message'
import { useAuthStore } from '@/store/authStore'
import { ChevronLeft } from 'lucide-react-native'
import { useToast } from '@/hooks/useToast'

function RegisterReferralCode({
  navigation,
  route,
}: RootScreenProps<Paths.RegisterReferralCode>) {
  const { password, registerToken } = route.params || {}
  const { login } = useAuthStore()
  const [referralCode, setReferralCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { showError } = useToast()
  const handleReferralCodeChange = (text: string) => {
    setReferralCode(text)
  }

  const handleSignUp = async () => {
    setIsLoading(true)
    try {
      let validatedReferralCode: string | undefined = ''

      if (referralCode.trim()) {
        const res = await authApi.checkReferenceCode(referralCode)

        if (res.exists && res.isValid) {
          validatedReferralCode = referralCode.trim()
          const response = await authApi.register({
            password: password || '',
            registerToken: registerToken || '',
            referenceCode: validatedReferralCode,
          })
          if (response.accessToken) {
            login(response.user)

            navigation.reset({
              index: 0,
              routes: [{ name: Paths.Main }],
            })

            SuccessToast({
              text1: 'Success',
              text2: 'Register successfully',
            })
          }
        } else {
          showError('Invalid Code', 'The referral code is invalid or expired.')
        }
      } else {
        const response = await authApi.register({
          password: password || '',
          registerToken: registerToken || '',
        })
        if (response.accessToken) {
          login(response.user)

          navigation.reset({
            index: 0,
            routes: [{ name: Paths.Main }],
          })

          SuccessToast({
            text1: 'Success',
            text2: 'Register successfully',
          })
        }
      }
    } catch (error: any) {
      showError('Registration Failed', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = async () => {
    // Skip referral code and navigate to next screen
    setIsLoading(true)
    try {
      console.log(
        'Skipping referral code, proceeding with registration:',
        registerToken,
        password,
      )
      const response = await authApi.register({
        password: password || '',
        registerToken: registerToken || '',
      })
      if (response.accessToken) {
        login(response.user)

        navigation.reset({
          index: 0,
          routes: [{ name: Paths.Main }],
        })

        SuccessToast({
          text1: 'Success',
          text2: 'Register successfully',
        })
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred during registration. Please try again.'
      showError('Registration Failed', errorMessage)
      console.error('Error skipping referral code:', error)
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
          <View className='flex-1 justify-start'>
            {/* Header */}
            <View className='mb-8 mt-4 flex flex-row items-center justify-between'>
              <Pressable
                className='p-2'
                hitSlop={10}
                onPress={() => navigation.goBack()}>
                <ChevronLeft size={24} />
              </Pressable>
              <Text className='text-h2-semibold text-neutral-900'>
                Have a Referral Code?
              </Text>
              <View />
            </View>

            {/* Input Field */}
            <View className='mb-6 px-4'>
              <Text className='text-body-large-semibold text-neutral-900 mb-2'>
                Referral Code or UID (Optional)
              </Text>

              <Input
                value={referralCode}
                onChangeText={handleReferralCodeChange}
                autoCapitalize='none'
                autoComplete='off'
                placeholder='Enter referral code or UID'
                size='lg'
                rounded='md'
              />
              <Text className='text-body-large-regular text-neutral-400'>
                Enter a valid referral code to receive your bonus.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Button fixed at bottom */}
        <View className='px-4 pb-6 bg-white border-t border-neutral-100'>
          <Pressable
            className='py-3 rounded-[4px] items-center bg-primary-500 mb-3'
            onPress={handleSignUp}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.6 : 1 }}>
            <Text className='text-button-large-medium text-white'>Sign up</Text>
          </Pressable>
          <Pressable
            className='py-3 rounded-[4px] items-center bg-primary-100'
            onPress={handleSkip}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.6 : 1 }}>
            <Text className='text-button-large-medium text-primary-500'>
              Skip
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}

export default RegisterReferralCode
