import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { Button, Input } from '@/components/atoms'
import { Header, SafeScreen } from '@/components/templates'
import { useDeleteAccount } from '@/hooks/useAccount'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'

function ConfirmDeleteTradeAccount({
  navigation,
  route,
}: RootScreenProps<Paths.ConfirmDeleteTradeAccount>) {
  const { account } = route.params
  const [confirmText, setConfirmText] = useState('')
  const deleteAccountMutation = useDeleteAccount()
  const isConfirmed = confirmText === 'DELETE'

  const handleDelete = async () => {
    if (!isConfirmed) return

    try {
      await deleteAccountMutation.mutateAsync(account.id)
      Toast.show({
        text1: 'Account deleted successfully',
        type: 'success',
      })
      navigation.navigate(Paths.ManageAccounts)
    } catch {
      Toast.show({
        text1: 'Failed to delete account. Please try again.',
        type: 'error',
      })
    }
  }

  return (
    <SafeScreen className='bg-white'>
      <Header label='Delete Account' />
      <ScrollView className='flex-1' contentContainerStyle={{ flexGrow: 1 }}>
        <View className='flex-1 px-4 gap-4'>
          <Text className='mt-10 text-lg font-semibold text-neutral-900'>
            Your account: {account.name}
          </Text>
          <Text className='text-neutral-900 leading-6 text-base'>
            {
              'Account closure\nYou are about to delete this trading account.\n\nBefore closing, please note:\n   - This action is irreversible.\n   - You will lose access to all your data and settings associated with this account.'
            }
          </Text>
          <Text className='text-base font-semibold text-neutral-900'>
            Please type "DELETE" in all caps below
          </Text>
          <Input
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder='Type DELETE to confirm'
            autoCapitalize='characters'
          />
        </View>
      </ScrollView>
      <View className='px-4 pb-8'>
        <Button
          className='bg-error-500 border-0'
          label='Delete account'
          disabled={!isConfirmed || deleteAccountMutation.isPending}
          loading={deleteAccountMutation.isPending}
          onPress={handleDelete}
        />
      </View>
    </SafeScreen>
  )
}

export default ConfirmDeleteTradeAccount
