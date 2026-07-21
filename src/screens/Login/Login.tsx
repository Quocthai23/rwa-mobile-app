import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { ChevronLeft } from 'lucide-react-native'
import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native'

import { Input } from '@/components/atoms'
import { ButtonNew } from '@/components/atoms/Button/ButtonNew'
import { SocialButton } from '@/components/atoms/Button/SocialButton'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { SafeScreen } from '@/components/templates'
import { useAuth } from '@/hooks/auth'
import { useToast } from '@/hooks/useToast'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useAuthStore } from '@/store/authStore'

function Login({ navigation, route }: RootScreenProps<Paths.Login>) {
  const fromDiscover = route.params?.fromDiscover
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const login = useAuthStore((state) => state.login)
  const { loginMutation, loginSocialMutation } = useAuth()
  const { showError } = useToast()

  const EMAIL_REGEX =
    /^(?!\.)(?!.*\.\.)[A-Za-z0-9_'+\-\.]*[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/

  const getLoginErrorMessage = useCallback((error: unknown): string => {
    const msg =
      typeof (error as Error)?.message === 'string'
        ? (error as Error).message
        : ''
    const lower = msg.toLowerCase()
    const isNetworkError =
      (error as Error)?.name === 'TypeError' ||
      /network|fetch|connection|internet|timeout|econnrefused|enotfound|econnreset/i.test(
        msg,
      )
    if (isNetworkError) {
      if (
        /no internet|offline|cannot reach|unable to connect|not connected/i.test(
          lower,
        )
      ) {
        return 'No Internet Connection'
      }

      return 'Connection is unstable. Please check your network and try again.'
    }

    return msg || 'An unexpected error occurred'
  }, [])

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setEmailError('Email is required')

      return false
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      setEmailError('Invalid email format')

      return false
    }
    setEmailError('')

    return true
  }

  useEffect(() => {
    if (!fromDiscover) {
      return
    }
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault()
        navigation.navigate(Paths.Main, { screen: Paths.Discover })
      }
    })
    return unsubscribe
  }, [fromDiscover, navigation])

  useEffect(() => {
    const configureGoogleSignIn = async () => {
      try {
        GoogleSignin.configure({
          webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
          iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
          offlineAccess: true,
          forceCodeForRefreshToken: true,
        })

        console.log('✅ Google Sign-In configured successfully')
      } catch (error) {
        console.error('❌ Error configuring Google Sign-In:', error)
      }
    }

    configureGoogleSignIn()
  }, [])

  const handleLogin = () => {
    if (!validateEmail(email)) {
      return
    }

    const payload = {
      email: email.trim(),
      password,
    }

    loginMutation.mutate(payload, {
      onError: (error: unknown) => {
        const message = getLoginErrorMessage(error)
        const isNoInternet = message === 'No Internet Connection'
        const isUnstable =
          message ===
          'Connection is unstable. Please check your network and try again.'
        if (isNoInternet) {
          showError('No Internet Connection')
        } else if (isUnstable) {
          showError(
            'Connection is unstable.',
            'Please check your network and try again.',
          )
        } else {
          showError('Login Failed', message)
        }
      },
      onSuccess: (response: { user: any }) => {
        console.log('🚀 ~ handleLogin ~ response:', response)
        login(response.user)
        navigation.navigate(Paths.SetUpPIN)
      },
    })
  }

  const handleGoogleSignIn = async () => {
    console.log('🔵 Google Sign-In button pressed')

    try {
      setIsGoogleLoading(true)
      console.log('🔵 Starting Google Sign-In process...')

      // Check if Google Play Services are available
      console.log('🔵 Checking Play Services...')
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      console.log('✅ Play Services available')

      // Sign in with Google
      console.log('🔵 Attempting to sign in...')

      const userInfo = await GoogleSignin.signIn()
      console.log('✅ Sign in successful:', JSON.stringify(userInfo, null, 2))

      // Get the ID token
      const idToken = userInfo.data?.idToken
      console.log('🔵 ID Token:', idToken ? 'Present ✅' : 'Missing ❌')

      if (!idToken) {
        console.error('❌ No ID token received')

        Alert.alert(
          'Google Sign-In Failed',
          'Unable to get authentication token',
        )

        return
      }

      // Login with backend
      console.log('🔵 Sending to backend...')

      loginSocialMutation.mutate(
        { provider: 'google', idToken },
        {
          onError: (error: Error) => {
            console.error('❌ Backend login error:', error)

            Alert.alert(
              'Login Failed',
              error.message || 'Unable to login with Google. Please try again.',
            )
          },
          onSuccess: (response: { user: any }) => {
            console.log('✅ Backend login successful')
            login(response.user)

            navigation.reset({
              index: 0,
              routes: [{ name: Paths.Main }],
            })
          },
        },
      )
    } catch (error: any) {
      console.error('❌ Google Sign-In Error:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('ℹ️ User cancelled Google Sign-In')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('ℹ️ Google Sign-In is already in progress')
        Alert.alert('Please wait', 'Sign-in is already in progress')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error('❌ Play Services not available')
        Alert.alert('Error', 'Google Play Services not available or outdated')
      } else {
        // DEVELOPER_ERROR or other errors
        console.error('❌ Unexpected error:', error)

        Alert.alert(
          'Google Sign-In Failed',
          `${error.message || 'An unexpected error occurred'}\n\nPlease check:\n1. SHA-1 fingerprint in Google Console\n2. Web Client ID is correct\n3. App is properly configured`,
        )
      }
    } finally {
      setIsGoogleLoading(false)
      console.log('🔵 Google Sign-In process ended')
    }
  }

  const isSubmitting = loginMutation.isPending

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text)
    setEmailError((prev) => (prev ? '' : prev))
  }, [])

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className='flex-1'
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={{ flex: 1 }}>
        <ScrollView
          className='flex-1 bg-white'
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
          <View className='flex-1 pt-4'>
            <View className='mb-10 flex-row items-center justify-between relative'>
              <Pressable
                className='p-2 absolute left-0'
                hitSlop={10}
                onPress={() => {
                  if (fromDiscover) {
                    navigation.navigate(Paths.Main, {
                      screen: Paths.Discover,
                    })
                  } else {
                    navigation.goBack()
                  }
                }}>
                <ChevronLeft size={24} />
              </Pressable>
              <Text className='text-h1-bold text-neutral-900 text-center flex-1'>
                Log In
              </Text>
              <Pressable
                className='p-2 absolute right-0'
                hitSlop={10}
                onPress={() => navigation.navigate(Paths.Register)}>
                <Text className='text-primary-500 text-button-large-medium mr-2'>
                  Sign Up
                </Text>
              </Pressable>
            </View>
            {/* Form */}
            <View className='mb-6 gap-2 px-4'>
              <Input
                autoCapitalize='none'
                autoComplete='email'
                autoCorrect={false}
                error={emailError}
                keyboardAppearance='light'
                keyboardType='email-address'
                label='Email Address'
                placeholder='Please enter your email address'
                rounded='sm'
                size='lg'
                textContentType='emailAddress'
                value={email}
                onChangeText={handleEmailChange}
              />

              <Input
                autoCapitalize='none'
                autoComplete='password'
                autoCorrect={false}
                keyboardAppearance='light'
                label='Password'
                placeholder='Please enter your password'
                textContentType='password'
                rightAccessory={
                  <Pressable
                    onPress={() => {
                      setIsPasswordVisible(!isPasswordVisible)
                    }}>
                    <Image
                      resizeMode='contain'
                      source={
                        isPasswordVisible
                          ? require('@/theme/assets/images/eye.png')
                          : require('@/theme/assets/images/eye-off.png')
                      }
                      style={{ height: 20, width: 20 }}
                    />
                  </Pressable>
                }
                rounded='sm'
                secureTextEntry={!isPasswordVisible}
                size='lg'
                value={password}
                onChangeText={setPassword}
              />

              <Pressable
                className='self-end mb-6'
                onPress={() => {
                  navigation.navigate(Paths.ForgotPasswordSendOTP)
                }}>
                <Text className='text-center justify-start text-primary-500 text-button-small-medium'>
                  Forgot Password ?
                </Text>
              </Pressable>

              <ButtonNew
                bg='bg-primary-500'
                border='border-primary-500'
                color='primary'
                disabled={isSubmitting || !email || !password}
                loading={isSubmitting}
                name='Log In'
                rounded='md'
                size='lg'
                textColor='text-white'
                type='button'
                variant='solid'
                onPress={handleLogin}
              />
              <View className='flex flex-row items-center mt-8 mb-8'>
                <View className='flex-1 h-px bg-gray-200' />
                <View>
                  <Text className='mx-4 text-body-small-semibold text-secondary-500'>
                    Or login with
                  </Text>
                </View>
                <View className='flex-1 h-px bg-gray-200' />
              </View>
              <SocialButton
                icon={
                  <Image
                    resizeMode='contain'
                    source={require('@/theme/assets/images/google.png')}
                    style={{ width: 24, height: 24 }}
                  />
                }
                loading={isGoogleLoading}
                text='Continue with Google'
                onPress={handleGoogleSignIn}
              />
              {Platform.OS === 'ios' && (
                <SocialButton
                  icon={
                    <Image
                      resizeMode='contain'
                      source={require('@/theme/assets/images/apple.png')}
                      style={{ height: 24, width: 24 }}
                    />
                  }
                  text='Continue with Apple'
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}

export default Login
