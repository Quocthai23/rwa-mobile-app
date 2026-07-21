import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
} from 'react-native'

import { Header, SafeScreen } from '@/components/templates'
import useTheme from '@/theme/hooks/useTheme'

const DESCRIPTION =
  "You're not invited. Please enter the referrer's referral code or UID to accept the invitation. Each user can only accept one invitation."

const PLACEHOLDER = 'Please enter the referral code or UID'

export default function MyReferrer() {
  const [value, setValue] = useState('')
  const { colors } = useTheme()

  return (
    <SafeScreen bottomOnly>
      <Header label='Accept Invitation' />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className='flex-1'>
        <ScrollView
          className='flex-1 bg-white'
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24 }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}>
          {/* 1. Title in header — Accept Invitation: #111827 semibold (already in Header) */}

          {/* 2. Description: #6B7280 regular, base */}
          <Text className='text-body-regular text-neutral-500 mb-4'>
            {DESCRIPTION}
          </Text>

          {/* 3. Input: placeholder #9CA3AF regular base */}
          <TextInput
            className='border border-neutral-200 px-4 text-base'
            placeholder={PLACEHOLDER}
            placeholderTextColor={colors.neutral400}
            style={{
              borderRadius: 8,
              color: colors.neutral900,
              paddingVertical: 16,
            }}
            value={value}
            onChangeText={setValue}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}
