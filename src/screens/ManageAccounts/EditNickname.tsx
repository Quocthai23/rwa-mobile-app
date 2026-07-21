import { useState } from 'react'
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { Button } from '@/components/atoms'
import { Header, SafeScreen } from '@/components/templates'
import { type Paths } from '@/navigation/paths'
import { type RootScreenProps } from '@/navigation/types'
import { authApi } from '@/services/auth'
import { useAuthStore } from '@/store/authStore'
import useTheme from '@/theme/hooks/useTheme'

function EditNickname({
  navigation,
  route,
}: RootScreenProps<Paths.EditNickname>) {
  const { account: _account, initialNickname = '' } = route.params
  const updateUser = useAuthStore((state) => state.updateUser)
  const [value, setValue] = useState(initialNickname)
  const [isPending, setIsPending] = useState(false)
  const { colors } = useTheme()

  const handleSave = async () => {
    const trimmed = value.trim()
    if (!trimmed) return

    setIsPending(true)
    try {
      await authApi.updateProfile({ username: trimmed })
      updateUser({ username: trimmed })

      Toast.show({
        text1: 'Nickname updated',
        type: 'success',
      })

      navigation.goBack()
    } catch {
      Toast.show({
        text1: 'Failed to update nickname',
        type: 'error',
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <SafeScreen className='bg-white'>
      <Header label='Nickname' />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'>
        <View className='flex-1 px-4 pt-4'>
          <TextInput
            autoFocus
            className='border border-neutral-300 rounded-xl px-4 py-3 text-base text-neutral-900'
            placeholder='Nickname'
            placeholderTextColor={colors.neutral400}
            value={value}
            onChangeText={setValue}
          />
        </View>
        <View className='px-4 pb-8'>
          <Button
            disabled={!value.trim()}
            label='Save'
            loading={isPending}
            size={49}
            onPress={handleSave}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}

export default EditNickname
