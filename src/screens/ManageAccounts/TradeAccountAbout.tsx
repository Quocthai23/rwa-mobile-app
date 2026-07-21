import { BottomSheetView } from '@gorhom/bottom-sheet'
import { ChevronRightIcon, CopyIcon } from 'lucide-react-native'
import { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { Button } from '@/components/atoms'
import { Modal, ModalFooter, useModal } from '@/components/atoms/Modal'
import { Header, SafeScreen } from '@/components/templates'
import { useAccounts } from '@/hooks/useAccount'
import { Paths } from '@/navigation/paths'
import { type RootScreenProps } from '@/navigation/types'
import colors from '@/theme/colors'

import { SelectAvatarModal } from './components/SelectAvatarModal'

function TradeAccountAbout({
  navigation,
  route,
}: RootScreenProps<Paths.TradeAccountAbout>) {
  const modal = useModal()
  const avatarModal = useModal()
  const { data: accounts } = useAccounts()
  const accountFromParameters = route.params.account
  const account =
    accounts?.find((a) => a.id === accountFromParameters.id) ??
    accountFromParameters
  const [avatarUri, setAvatarUri] = useState<null | string>(null)

  return (
    <SafeScreen className='bg-white'>
      <Header label='About account' />
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
              className='absolute bottom-0 right-0 rounded-full bg-white items-center justify-center'
              style={{ height: 32, width: 32 }}>
              <Image
                source={require('@/assets/images/EditIcon.png')}
                resizeMode='contain'
                style={{ height: 20, width: 20 }}
              />
            </View>
          </View>
        </TouchableOpacity>
        <View className='flex-row gap-2 items-center justify-center mt-3 mb-5'>
          <Text className='text-neutral-500'>UID</Text>
          <Text className='font-semibold text-neutral-900'>{account.id}</Text>
          <TouchableOpacity
            hitSlop={10}
            onPress={() => {
              Toast.show({
                text1: 'Copied to clipboard',
                type: 'success',
              })
            }}>
            <CopyIcon color={colors.iconColors.subtle} size={24} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className='items-center flex-row justify-between mx-4 py-3'
          onPress={() => {
            navigation.navigate(Paths.EditNickname, {
              account,
              initialNickname: account.name ?? '',
            })
          }}>
          <Text className='text-neutral-500'>Nickname</Text>
          <View className='items-center gap-2 flex-row'>
            <Text className='text-neutral-900 font-semibold'>
              {account.name || 'Not set'}
            </Text>
            <ChevronRightIcon color={colors.iconColors.subtle} size={20} />
          </View>
        </TouchableOpacity>
      </View>
      <Button
        className='bg-error-500 border-0 shadow-none mx-4'
        label='Delete account'
        onPress={() => {
          modal.present()
        }}
      />
      <Modal ref={modal.ref} enableDynamicSizing title='Delete Account?'>
        <BottomSheetView>
          <Text className='text-neutral-500 mx-5 mb-5'>
            This action is permanent and cannot be undone. Please withdraw your
            funds before continuing.
          </Text>
          <Button
            className='bg-error-500 border-0 shadow-none mx-4 mb-3'
            label='Confirm'
            onPress={() => {
              modal.dismiss()
              navigation.navigate(Paths.ConfirmDeleteTradeAccount, { account })
            }}
          />
          <Button
            className='shadow-none mx-4'
            label='Cancel'
            variant='secondary'
            onPress={() => {
              modal.dismiss()
            }}
          />
          <ModalFooter />
        </BottomSheetView>
      </Modal>
      <SelectAvatarModal
        ref={avatarModal.ref}
        onDismiss={avatarModal.dismiss}
        onSelect={setAvatarUri}
      />
    </SafeScreen>
  )
}

export default TradeAccountAbout
