import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import { CameraIcon, ImageIcon, SmileIcon } from 'lucide-react-native'
import React from 'react'
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  type ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker'

import { Modal, ModalFooter } from '@/components/atoms/Modal'
import colors from '@/theme/colors'

const SYSTEM_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/png?seed=1',
  'https://api.dicebear.com/7.x/avataaars/png?seed=2',
  'https://api.dicebear.com/7.x/avataaars/png?seed=3',
  'https://api.dicebear.com/7.x/avataaars/png?seed=4',
  'https://api.dicebear.com/7.x/avataaars/png?seed=5',
  'https://api.dicebear.com/7.x/avataaars/png?seed=6',
]

type SelectAvatarModalProps = {
  readonly onDismiss?: () => void
  readonly onSelect: (uri: string) => void
}

async function requestCameraPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  )

  return granted === PermissionsAndroid.RESULTS.GRANTED
}

export const SelectAvatarModal = React.forwardRef<
  BottomSheetModal,
  SelectAvatarModalProps
>((props, reference) => {
  const handleCamera = async () => {
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
      Alert.alert(
        'Permission required',
        'Camera permission is required to take photos.',
      )

      return
    }

    const result: ImagePickerResponse = await launchCamera({
      mediaType: 'photo',
      saveToPhotos: false,
    })

    if (result.didCancel) return
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage ?? 'Failed to take photo')

      return
    }

    const uri = result.assets?.[0]?.uri
    if (uri) {
      props.onSelect(uri)
      props.onDismiss?.()
    }
  }

  const handleSelectFromAlbum = async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    })

    if (result.didCancel) return
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage ?? 'Failed to select photo')

      return
    }

    const uri = result.assets?.[0]?.uri
    if (uri) {
      props.onSelect(uri)
      props.onDismiss?.()
    }
  }

  const handleSelectSystemAvatar = (uri: string) => {
    props.onSelect(uri)
    props.onDismiss?.()
  }

  return (
    <Modal ref={reference} enableDynamicSizing title='Select Avatar'>
      <BottomSheetView className='gap-0'>
        <TouchableOpacity
          className='gap-4 items-center flex-row mx-5 py-4 border-b border-neutral-200'
          onPress={handleCamera}>
          <CameraIcon color={colors.iconColors.default} size={20} />
          <Text className='text-neutral-900 text-base font-semibold flex-1'>
            Camera
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className='gap-4 items-center flex-row mx-5 py-4 border-b border-neutral-200'
          onPress={handleSelectFromAlbum}>
          <ImageIcon color={colors.iconColors.default} size={20} />
          <Text className='text-neutral-900 text-base font-semibold flex-1'>
            Select from Album
          </Text>
        </TouchableOpacity>
        <View className='mx-5 py-4'>
          <View className='gap-4 items-center flex-row mb-3'>
            <SmileIcon color={colors.iconColors.default} size={20} />
            <Text className='text-neutral-900 text-base font-semibold flex-1'>
              Select System Avatars
            </Text>
          </View>
          <ScrollView
            horizontal
            className='mt-2'
            showsHorizontalScrollIndicator={false}>
            {SYSTEM_AVATARS.map((avatarUri) => (
              <TouchableOpacity
                key={avatarUri}
                className='rounded-full overflow-hidden mr-3'
                style={{ height: 48, width: 48 }}
                onPress={() => {
                  handleSelectSystemAvatar(avatarUri)
                }}>
                <Image
                  source={{ uri: avatarUri }}
                  style={{ height: 48, width: 48 }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <ModalFooter />
      </BottomSheetView>
    </Modal>
  )
})
