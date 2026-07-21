import { ChevronLeft } from 'lucide-react-native'
import React from 'react'
import { Image, Platform, Pressable, ScrollView, View } from 'react-native'

import { SocialButton } from '@/components/atoms/Button/SocialButton'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { SafeScreen } from '@/components/templates'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'

function Register({ navigation }: RootScreenProps<Paths.Register>) {
  return (
    <SafeScreen style={{ backgroundColor: 'white' }}>
      <ScrollView
        className='flex-1 bg-white'
        contentContainerStyle={{ flexGrow: 1 }}>
        <View className='flex-1 justify-between mt-4'>
          {/* Header */}
          <View className='mb-10 flex-row items-center justify-between'>
            <Pressable
              className='p-2'
              hitSlop={10}
              onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} />
            </Pressable>
            <Text className='text-h2-semibold text-neutral-900 text-center flex-1'>
              Sign Up
            </Text>
            <Pressable
              className='p-2'
              hitSlop={10}
              onPress={() => navigation.navigate(Paths.Login)}>
              <Text className='text-primary-500 text-button-large-medium mr-2'>
                Log In
              </Text>
            </Pressable>
          </View>

          <View className='flex-1 justify-center items-center px-4'>
            {/* Social Sign Up Buttons */}
            <View className='gap-4 mb-8 w-full'>
              <SocialButton
                icon={
                  <Image
                    resizeMode='contain'
                    source={require('@/theme/assets/images/google.png')}
                    style={{ height: 20, width: 20 }}
                  />
                }
                text='Sign up with Google'
              />
              {Platform.OS === 'ios' && (
                <SocialButton
                  icon={
                    <Image
                      resizeMode='contain'
                      source={require('@/theme/assets/images/apple.png')}
                      style={{ height: 20, width: 20 }}
                    />
                  }
                  text='Sign up with Apple'
                />
              )}
            </View>

            {/* Divider */}
            <View className='flex-row items-center mb-8 w-full'>
              <View className='flex-1 h-px bg-gray-200' />
              <Text className='mx-4 text-secondary-500 text-body-small-semibold'>
                Or
              </Text>
              <View className='flex-1 h-px bg-gray-200' />
            </View>

            <View className='w-full'>
              <SocialButton
                className='mb-6'
                icon={undefined}
                text='Sign up with Email'
                onPress={() => {
                  navigation.navigate(Paths.RegisterInput)
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}

export default Register
