import { setString } from '@/utils/clipboard'
import { ChevronRight, Pencil } from 'lucide-react-native'
import { useCallback, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import {
  type ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker'
import Toast from 'react-native-toast-message'

import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import { Header, SafeScreen } from '@/components/templates'
import { useAppNavigation } from '@/hooks'
import { useAccounts } from '@/hooks/useAccount'
import { Paths } from '@/navigation/paths'
import { authApi } from '@/services/auth'
import { imageApi } from '@/services/imageService'
import { useAuthStore } from '@/store/authStore'
import useTheme from '@/theme/hooks/useTheme'

const PROFILE_PLACEHOLDER = require('@/assets/images/discover/profile-picture.png')
const COPY_ICON = require('@/assets/images/discover/copy-icon.png')

// Overlay: Color/overlay/overlay black #00000066 → opacity 0.4
const SELECT_AVATAR_BACKDROP_OPACITY = 0.4

// Single drag handle (neutral-200) — use as handleComponent to avoid duplicate bars
function SelectAvatarHandle() {
  const { colors } = useTheme()

  return (
    <View className='items-center pt-3 pb-2'>
      <View
        className='rounded-full'
        style={{
          width: 36,
          height: 4,
          backgroundColor: colors.neutral200,
        }}
      />
    </View>
  )
}

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email

  const [local, domain] = email.split('@')
  if (local.length <= 4) return `${local.slice(0, 2)}****@${domain}`

  return `${local.slice(0, 4)}****@${domain}`
}

type InfoRowProps = {
  readonly label: string
  readonly onPress?: () => void
  readonly value: string
}

function InfoRow({ label, onPress, value }: InfoRowProps) {
  const { colors } = useTheme()

  return (
    <Pressable
      className='flex-row items-center justify-between py-4'
      onPress={onPress}>
      <Text className='text-body-regular text-neutral-500'>{label}</Text>
      <View className='flex-row flex-1 items-center justify-end pl-4'>
        {value ? (
          <Text
            className='text-body-semibold text-neutral-900'
            numberOfLines={1}>
            {value}
          </Text>
        ) : null}
        <ChevronRight
          color={colors.neutral500}
          size={24}
          style={{ marginLeft: 4 }}
        />
      </View>
    </Pressable>
  )
}

type SelectAvatarSheetProps = {
  readonly onCamera: () => void
  readonly onSelectFromAlbum: () => void
  readonly onSelectSystemAvatars: () => void
}

const OPTION_HEIGHT = 56

function SelectAvatarSheetContent({
  onCamera,
  onSelectFromAlbum,
  onSelectSystemAvatars,
}: SelectAvatarSheetProps) {
  return (
    <View className='bg-white pb-6'>
      <View className='px-4'>
        <Text className='text-h3-semibold text-neutral-900'>Select Avatar</Text>
      </View>
      {/* 1px border full width, no space */}
      <View className='bg-neutral-200' style={{ height: 1, marginTop: 16 }} />
      <View className='px-4'>
        <Pressable
          className='justify-center'
          style={{ height: OPTION_HEIGHT }}
          onPress={onCamera}>
          <Text className='text-body-semibold text-neutral-900'>Camera</Text>
        </Pressable>
        <Pressable
          className='justify-center'
          style={{ height: OPTION_HEIGHT }}
          onPress={onSelectFromAlbum}>
          <Text className='text-body-semibold text-neutral-900'>
            Select from Album
          </Text>
        </Pressable>
        <Pressable
          className='justify-center'
          style={{ height: OPTION_HEIGHT }}
          onPress={onSelectSystemAvatars}>
          <Text className='text-body-semibold text-neutral-900'>
            Select System Avatars
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

type GenderOption = { display: string; value: 'MALE' | 'FEMALE' }

const GENDER_OPTIONS: GenderOption[] = [
  { display: 'Male', value: 'MALE' },
  { display: 'Female', value: 'FEMALE' },
]

function SelectGenderSheetContent({
  onSelect,
}: {
  readonly onSelect: (value: 'MALE' | 'FEMALE') => void
}) {
  return (
    <View className='bg-white pb-6'>
      <View className='px-4'>
        <Text className='text-h3-semibold text-neutral-900'>Select Gender</Text>
      </View>
      <View className='bg-neutral-200' style={{ height: 1, marginTop: 16 }} />
      <View className='px-4'>
        {GENDER_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            className='justify-center'
            style={{ height: OPTION_HEIGHT }}
            onPress={() => onSelect(opt.value)}>
            <Text className='text-body-semibold text-neutral-900'>
              {opt.display}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

async function requestCameraPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true

  const permission = PermissionsAndroid.PERMISSIONS.CAMERA
  const alreadyGranted = await PermissionsAndroid.check(permission)
  if (alreadyGranted) return true

  const granted = await PermissionsAndroid.request(permission, {
    title: 'Camera permission',
    message:
      'This app needs access to your camera to take photos for your profile.',
    buttonPositive: 'Allow',
    buttonNegative: 'Deny',
  })

  return granted === PermissionsAndroid.RESULTS.GRANTED
}

function showCameraPermissionDeniedAlert() {
  Alert.alert(
    'Permission required',
    'Camera permission is required to take photos. You can enable it in App settings.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
  )
}

export default function PersonalInfo() {
  const navigation = useAppNavigation()
  const user = useAuthStore((state) => state.user)
  const updateUser = useAuthStore((state) => state.updateUser)
  const { colors } = useTheme()
  const selectAvatarRef = useRef<AppBottomSheetModalHandle>(null)
  const selectGenderRef = useRef<AppBottomSheetModalHandle>(null)
  const { data: accounts = [] } = useAccounts()
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const uid = user?.id ?? ''
  const copyUid = useCallback(async () => {
    if (!uid) return
    await setString(uid)
    Toast.show({ text1: 'UID copied', type: 'success' })
  }, [uid])

  const nickname = user?.username?.trim() || 'Not set'
  const linkEmail = user?.email ? maskEmail(user.email) : '—'
  const referrer = '' // My Referrer - empty for now
  const genderDisplay =
    user?.gender === 'MALE'
      ? 'Male'
      : user?.gender === 'FEMALE'
        ? 'Female'
        : 'Unknown'

  const closeSelectAvatar = useCallback(() => {
    selectAvatarRef.current?.close()
  }, [])

  const handleCamera = useCallback(async () => {
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
      showCameraPermissionDeniedAlert()

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

    const asset = result.assets?.[0]
    const uri = asset?.uri
    if (uri) {
      closeSelectAvatar()
      setIsUploadingAvatar(true)
      try {
        const avatarUrl = await imageApi.uploadImageToPresignedUrl(uri, {
          type: asset.type ?? 'image/jpeg',
          fileName: asset.fileName ?? 'photo.jpg',
        })

        await authApi.updateProfile({
          avatar: avatarUrl,
          username: user?.username?.trim() ?? '',
        })

        updateUser({ avatarUrl })

        Toast.show({ text1: 'Photo captured', type: 'success' })
      } catch (e) {
        Toast.show({
          text1: 'Upload failed',
          text2: e instanceof Error ? e.message : 'Please try again',
          type: 'error',
        })
      } finally {
        setIsUploadingAvatar(false)
      }
    }
  }, [closeSelectAvatar, updateUser])

  const handleSelectFromAlbum = useCallback(async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    })
    if (result.didCancel) return
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage ?? 'Failed to select photo')

      return
    }

    const asset = result.assets?.[0]
    const uri = asset?.uri
    if (uri) {
      closeSelectAvatar()
      setIsUploadingAvatar(true)
      try {
        const avatarUrl = await imageApi.uploadImageToPresignedUrl(uri, {
          type: asset.type ?? 'image/jpeg',
          fileName: asset.fileName ?? 'photo.jpg',
        })

        await authApi.updateProfile({
          avatar: avatarUrl,
          username: user?.username?.trim() ?? '',
        })

        updateUser({ avatarUrl })

        Toast.show({ text1: 'Photo selected', type: 'success' })
      } catch (e) {
        Toast.show({
          text1: 'Upload failed',
          text2: e instanceof Error ? e.message : 'Please try again',
          type: 'error',
        })
      } finally {
        setIsUploadingAvatar(false)
      }
    }
  }, [closeSelectAvatar, updateUser])

  const handleSelectSystemAvatars = useCallback(() => {
    closeSelectAvatar()
    Toast.show({ text1: 'Select System Avatars', type: 'info' })
    // TODO: open system avatars list or sub-sheet
  }, [closeSelectAvatar])

  const closeSelectGender = useCallback(() => {
    selectGenderRef.current?.close()
  }, [])

  const handleSelectGender = useCallback(
    async (value: 'MALE' | 'FEMALE') => {
      closeSelectGender()

      const username = user?.username?.trim() ?? ''
      try {
        await authApi.updateProfile({ username, gender: value })
        updateUser({ gender: value })
        Toast.show({ text1: 'Gender updated', type: 'success' })
      } catch {
        Toast.show({
          text1: 'Failed to update gender',
          type: 'error',
        })
      }
    },
    [closeSelectGender, user?.username, updateUser],
  )

  return (
    <SafeScreen bottomOnly>
      <Header label='Personal Info' />
      <ScrollView
        className='flex-1 bg-white'
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Avatar + UID — 120x120, edit button bg primary-100, pencil icon primary-500 */}
        <View className='items-center pt-6 pb-8'>
          <View className='relative'>
            <View
              className='overflow-hidden rounded-full bg-primary-500'
              style={{ width: 120, height: 120 }}>
              {user?.avatarUrl ? (
                <Image
                  className='h-full w-full'
                  resizeMode='cover'
                  source={{ uri: user.avatarUrl }}
                />
              ) : (
                <Image
                  className='h-full w-full'
                  resizeMode='cover'
                  source={PROFILE_PLACEHOLDER}
                />
              )}
              {isUploadingAvatar && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator color='#fff' size='large' />
                  <Text style={{ color: '#fff', fontSize: 12, marginTop: 8 }}>
                    Uploading...
                  </Text>
                </View>
              )}
            </View>
            <Pressable
              className='absolute bottom-0 right-0 items-center justify-center rounded-full'
              disabled={isUploadingAvatar}
              style={{
                backgroundColor: colors.primary100,
                height: 32,
                width: 32,
                opacity: isUploadingAvatar ? 0.5 : 1,
              }}
              onPress={() => {
                selectAvatarRef.current?.open()
              }}>
              <Pencil color={colors.primary500} size={20} strokeWidth={2} />
            </Pressable>
          </View>
          <View className='mt-3 flex-row items-center'>
            <Text className='text-body-regular text-neutral-600'>UID </Text>
            <Text className='text-body-semibold text-neutral-900'>{uid}</Text>
            <Pressable className='ml-2 p-1' onPress={copyUid}>
              <Image
                resizeMode='contain'
                source={COPY_ICON}
                style={{ height: 20, width: 20 }}
              />
            </Pressable>
          </View>
        </View>

        {/* List */}
        <View>
          <InfoRow
            label='Nickname'
            value={nickname}
            onPress={() => {
              if (accounts.length > 0) {
                navigation.navigate(Paths.EditNickname, {
                  account: accounts[0],
                  initialNickname: user?.username ?? '',
                })
              } else {
                Toast.show({
                  text1: 'No trading account to edit',
                  type: 'info',
                })
              }
            }}
          />
          <InfoRow
            label='Gender'
            value={genderDisplay}
            onPress={() => selectGenderRef.current?.open()}
          />
          <InfoRow label='Link Email' value={linkEmail} />
          <InfoRow
            label='My Referrer'
            value={referrer}
            onPress={() => navigation.navigate(Paths.MyReferrer)}
          />
        </View>
      </ScrollView>

      {/* Select Avatar bottom sheet — overlay #00000066, single drag bar neutral-200 */}
      <AppBottomSheetModal
        ref={selectAvatarRef}
        backdropOpacity={SELECT_AVATAR_BACKDROP_OPACITY}
        modalProps={{ handleComponent: SelectAvatarHandle }}
        snapPoints={['35%']}>
        <SelectAvatarSheetContent
          onCamera={handleCamera}
          onSelectFromAlbum={handleSelectFromAlbum}
          onSelectSystemAvatars={handleSelectSystemAvatars}
        />
      </AppBottomSheetModal>

      <AppBottomSheetModal
        ref={selectGenderRef}
        backdropOpacity={SELECT_AVATAR_BACKDROP_OPACITY}
        modalProps={{ handleComponent: SelectAvatarHandle }}
        snapPoints={['35%']}>
        <SelectGenderSheetContent onSelect={handleSelectGender} />
      </AppBottomSheetModal>
    </SafeScreen>
  )
}
