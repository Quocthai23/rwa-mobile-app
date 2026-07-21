import { useState } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'

import SetupPinSvg from '@/assets/images/setuppin.svg'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { SafeScreen } from '@/components/templates'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'

function SetUpPIN({ navigation }: RootScreenProps<Paths.SetUpPIN>) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSetUpCode = () => {
    setIsLoading(true)
    try {
      navigation.navigate(Paths.CreatePINCode)
    } catch (error) {
      console.error('Error navigating to PIN setup:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    // Skip PIN setup and navigate to main screen
    navigation.reset({
      index: 0,
      routes: [{ name: Paths.Main }],
    })
  }

  return (
    <SafeScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'>
        <ScrollView
          className='flex-1 bg-white'
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='handled'>
          <Pressable
            className='flex-1 justify-center items-center px-4'
            onPress={Keyboard.dismiss}>
            {/* Icon */}
            <SetupPinSvg
              width={200}
              height={200}
              style={{ marginBottom: 32 }}
            />

            {/* Title */}
            <Text className='text-h2-semibold text-neutral-900 mb-3 text-center'>
              Set up a PIN
            </Text>

            {/* Description */}
            <Text className='text-button-small-medium text-neutral-600 text-center mb-12'>
              Choose a 6-digit code for a quick login option
            </Text>
          </Pressable>
        </ScrollView>

        {/* Buttons - Fixed at bottom */}
        <View className='px-4 pb-6 bg-white border-t border-neutral-100'>
          <TouchableOpacity
            className='py-3 rounded-[4px] items-center bg-primary-500 mb-3'
            onPress={handleSetUpCode}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.6 : 1 }}>
            <Text className='text-button-large-medium text-white'>
              Set up code
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='py-3 rounded-[4px] items-center bg-primary-100'
            onPress={handleSkip}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.6 : 1 }}>
            <Text className='text-button-large-medium text-primary-500'>
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}

export default SetUpPIN
