import { PencilIcon } from 'lucide-react-native'
import { useState } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'

import { Button } from '@/components/atoms'
import { useModal } from '@/components/atoms/Modal'
import { Header, SafeScreen } from '@/components/templates'
import { useAccountTypes, useCreateAccount } from '@/hooks/useAccount'
import { Paths } from '@/navigation/paths'
import { type RootScreenProps } from '@/navigation/types'

import { SelectAvatarModal } from './components/SelectAvatarModal'

import useTheme from '@/theme/hooks/useTheme'

function CreateAccountDetail({
  navigation,
  route,
}: RootScreenProps<Paths.CreateAccountDetail>) {
  const { accountType } = route.params
  const avatarModal = useModal()
  const createAccountMutation = useCreateAccount()
  const { data: accountTypes } = useAccountTypes()
  const { colors } = useTheme()

  const [avatarUri, setAvatarUri] = useState<null | string>(null)
  const [nickname, setNickname] = useState('')

  const accountTypeId = accountTypes?.find((type) => {
    const isDemo =
      type.name.toLowerCase().includes('demo') ||
      type.code.toLowerCase().includes('demo')

    return accountType === 'Demo' ? isDemo : !isDemo
  })?.id
  const handleSaveAccount = async () => {
    if (!nickname.trim()) {
      Toast.show({
        text1: 'Please enter a nickname',
        type: 'info',
      })

      return
    }
    if (!accountTypeId) {
      Toast.show({
        text1: 'Loading account types...',
        type: 'info',
      })

      return
    }

    try {
      const account = await createAccountMutation.mutateAsync({
        accountTypeId,
        name: nickname.trim(),
      })

      Toast.show({
        text1: 'Account created successfully',
        type: 'success',
      })

      navigation.navigate(Paths.TradeAccountAbout, { account })
    } catch {
      Toast.show({
        text1: 'Failed to create account',
        type: 'error',
      })
    }
  }

  return (
    <SafeScreen className='bg-white'>
      <Header label='Add Account' />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'>
        <View className='flex-1'>
          <TouchableOpacity
            className='self-center my-3'
            style={{ height: 120, width: 120 }}
            onPress={() => {
              avatarModal.present()
            }}>
            <View className='relative'>
              {avatarUri ? (
                <Image
                  className='rounded-full'
                  source={{ uri: avatarUri }}
                  style={{ height: 120, width: 120 }}
                />
              ) : (
                <View
                  className='rounded-full bg-gray-300'
                  style={{ height: 120, width: 120 }}
                />
              )}
              <View
                className='absolute bottom-0 right-0 rounded-full bg-primary-100 items-center justify-center'
                style={{ height: 32, width: 32 }}>
                <PencilIcon
                  color={colors.primary500}
                  size={16}
                  strokeWidth={3}
                />
              </View>
            </View>
          </TouchableOpacity>

          <View className='mx-4 mt-4'>
            <Text className='text-neutral-500 text-sm mb-2'>Nickname</Text>
            <TextInput
              className='border border-neutral-300 rounded-xl px-4 py-3 text-base text-neutral-900'
              placeholder='Enter account nickname'
              placeholderTextColor={colors.neutral400}
              value={nickname}
              onChangeText={setNickname}
            />
          </View>
        </View>

        <View className='px-4 pb-8'>
          <Button
            disabled={
              !nickname.trim() ||
              !accountTypeId ||
              createAccountMutation.isPending
            }
            label='Save Account'
            loading={createAccountMutation.isPending}
            size={49}
            onPress={handleSaveAccount}
          />
        </View>
      </KeyboardAvoidingView>

      <SelectAvatarModal
        ref={avatarModal.ref}
        onDismiss={avatarModal.dismiss}
        onSelect={setAvatarUri}
      />
    </SafeScreen>
  )
}

export default CreateAccountDetail
