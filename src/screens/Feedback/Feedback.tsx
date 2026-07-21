import { ChevronDown, Headphones, Plus, X } from 'lucide-react-native'
import { memo, useCallback, useRef, useState } from 'react'
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  type ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker'
import Toast from 'react-native-toast-message'

import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import { Input } from '@/components/atoms/Input/Input'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { Header, SafeScreen } from '@/components/templates'
import { type Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { feedbackApi, FeedbackType } from '@/services/feedbackService'
import { imageApi } from '@/services/imageService'
import useTheme from '@/theme/hooks/useTheme'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024 // 2MB
const MAX_VIDEO_BYTES = 30 * 1024 * 1024 // 30MB
const IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png']
const VIDEO_MIMES = ['video/mp4', 'video/quicktime'] // quicktime = .mov

type MediaItem = {
  fileName?: string
  fileSize?: number
  fileType?: string
  id: string
  thumbnailUri?: string
  type: 'image' | 'video'
  uri: string
}

type PickedAsset = {
  fileSize?: number
  type?: string
  uri?: string
}

function validateAsset(asset: PickedAsset): {
  error?: string
  valid: boolean
} {
  const mime = (asset.type ?? '').toLowerCase()
  const fileSize = asset.fileSize ?? 0

  if (mime.startsWith('image/')) {
    if (!IMAGE_MIMES.includes(mime)) {
      return { valid: false, error: 'Images must be JPG or PNG' }
    }
    // Check file size - if not available (0), reject it
    if (fileSize === 0) {
      return { valid: false, error: 'Unable to determine image size' }
    }
    if (fileSize > MAX_IMAGE_BYTES) {
      return { valid: false, error: 'Image must be 2MB or less' }
    }

    return { valid: true }
  }

  if (mime.startsWith('video/')) {
    if (!VIDEO_MIMES.includes(mime)) {
      return { valid: false, error: 'Videos must be MP4 or MOV' }
    }
    // Check file size - if not available (0), reject it
    if (fileSize === 0) {
      return { valid: false, error: 'Unable to determine video size' }
    }
    if (fileSize > MAX_VIDEO_BYTES) {
      return { valid: false, error: 'Video must be 30MB or less' }
    }

    return { valid: true }
  }

  return { valid: false, error: 'Unsupported file type' }
}

// Helper function to extract error message from any error type
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object') {
    // Try to extract message from error object
    const errorObj = error as any
    if (errorObj.message) return String(errorObj.message)
    if (
      errorObj.errors &&
      Array.isArray(errorObj.errors) &&
      errorObj.errors[0]
    ) {
      return String(errorObj.errors[0])
    }
    if (errorObj.error) return String(errorObj.error)
    // Last resort: stringify the object
    try {
      return JSON.stringify(error, null, 2)
    } catch {
      return 'Unknown error occurred'
    }
  }

  return 'Unknown error occurred'
}

const BUSINESS_TYPE_OPTIONS = [
  { label: 'API', value: FeedbackType.API },
  { label: 'Deposit', value: FeedbackType.Deposit },
  { label: 'Others', value: FeedbackType.Others },
  { label: 'Events', value: FeedbackType.Events },
  { label: 'Copy Trading', value: FeedbackType.CopyTrading },
  { label: 'Partnership', value: FeedbackType.Partnership },
]

const MAX_MEDIA = 6
const OPTION_HEIGHT = 56

function BusinessTypeHandle() {
  const { colors } = useTheme()

  return (
    <View className='items-center pt-3 pb-2'>
      <View
        className='rounded-full'
        style={{
          width: 36,
          height: 4,
          backgroundColor: colors.neutral300,
        }}
      />
    </View>
  )
}

type BusinessTypeSheetContentProps = {
  readonly onSelect: (value: string | number) => void
  readonly value: string | number
}

function BusinessTypeSheetContent({
  onSelect,
  value,
}: BusinessTypeSheetContentProps) {
  const { colors } = useTheme()

  return (
    <View className='bg-white'>
      <View className='px-4'>
        <Text className='text-h3-semibold text-neutral-900'>Business Type</Text>
      </View>
      <View className='bg-neutral-200' style={{ height: 1, marginTop: 16 }} />
      <View>
        {BUSINESS_TYPE_OPTIONS.map((option) => {
          const isSelected = option.value === value

          return (
            <Pressable
              key={option.value}
              className='justify-center px-4'
              style={[
                { height: OPTION_HEIGHT },
                isSelected && { backgroundColor: colors.primary50 },
              ]}
              onPress={() => onSelect(option.value)}>
              <Text
                className='text-body-semibold text-neutral-900'
                style={isSelected ? { color: colors.primary500 } : undefined}>
                {option.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

function FeedbackScreen(_: RootScreenProps<Paths.Feedback>) {
  const { colors } = useTheme()
  const businessTypeSheetRef = useRef<AppBottomSheetModalHandle>(null)
  const [businessType, setBusinessType] = useState<string | number>(
    FeedbackType.API,
  )
  const [feedbackText, setFeedbackText] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedLabel =
    BUSINESS_TYPE_OPTIONS.find((o) => o.value === businessType)?.label ??
    'Business Type'

  const handleLiveChatPress = useCallback(() => {
    void Linking.openURL('https://example.com/live-chat')
  }, [])

  const handleAddMedia = useCallback(async () => {
    if (media.length >= MAX_MEDIA) return

    const result: ImagePickerResponse = await launchImageLibrary({
      includeBase64: false,
      mediaType: 'mixed',
      selectionLimit: MAX_MEDIA - media.length,
      videoQuality: 'medium',
      formatAsMp4: true,
    })

    if (result.didCancel || !result.assets?.length) return

    if (result.errorCode) {
      Toast.show({
        text1: result.errorMessage ?? 'Failed to pick media',
        type: 'error',
      })

      return
    }

    const toAdd: MediaItem[] = []

    for (const asset of result.assets) {
      if (!asset.uri) continue

      const validation = validateAsset(asset)
      if (!validation.valid) {
        Toast.show({ text1: validation.error, type: 'error' })
        continue
      }

      const isVideo = (asset.type ?? '').toLowerCase().startsWith('video/')
      let thumbnailUri: string | undefined

      if (isVideo) {
        try {
          const { createThumbnail } =
            await import('react-native-create-thumbnail')
          if (typeof createThumbnail === 'function') {
            const thumb = await createThumbnail({
              timeStamp: 0,
              url: asset.uri,
            })
            thumbnailUri = thumb?.path
          }
        } catch {
          // Thumbnail failed; placeholder will show
        }
      }

      toAdd.push({
        fileName: asset.fileName,
        fileSize: asset.fileSize,
        fileType: asset.type,
        id: `${asset.uri}-${Date.now()}-${Math.random()}`,
        thumbnailUri,
        type: isVideo ? 'video' : 'image',
        uri: asset.uri,
      })
    }

    if (toAdd.length > 0) {
      setMedia((prev) => [...prev, ...toAdd].slice(0, MAX_MEDIA))
    }
  }, [media.length])

  const handleRemoveMedia = useCallback((id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const handleBusinessTypeSelect = useCallback((value: string | number) => {
    setBusinessType(value)
    businessTypeSheetRef.current?.close()
  }, [])

  const handleOpenBusinessTypeSheet = useCallback(() => {
    businessTypeSheetRef.current?.open()
  }, [])

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!feedbackText.trim()) {
      Toast.show({
        text1: 'Please enter your feedback',
        type: 'error',
      })

      return
    }

    if (typeof businessType !== 'number') {
      Toast.show({
        text1: 'Please select a business type',
        type: 'error',
      })

      return
    }

    setIsSubmitting(true)

    try {
      // Upload media files if any
      let uploadedImageUrls: string[] = []

      if (media.length > 0) {
        const filesToUpload = media.map((item) => ({
          uri: item.uri,
          fileName: item.fileName,
          type: item.fileType,
        }))

        console.log(
          'Files to upload:',
          filesToUpload.map((f) => ({
            fileName: f.fileName,
            type: f.type,
            uri: f.uri.substring(0, 50) + '...',
          })),
        )

        console.log(
          'Media items:',
          media.map((m) => ({
            fileName: m.fileName,
            type: m.type, // 'image' or 'video'
            fileType: m.fileType, // MIME type
            hasVideoUri: !!m.uri,
            hasThumbnailUri: !!m.thumbnailUri,
          })),
        )

        try {
          uploadedImageUrls =
            await imageApi.uploadMultipleImagesToPresignedUrl(filesToUpload)

          console.log('Upload successful:', uploadedImageUrls.length)
        } catch (uploadError) {
          Toast.show({
            text1: 'Failed to upload media',
            type: 'error',
          })
        }
      }

      // Submit feedback
      await feedbackApi.submitFeedback({
        type: businessType as FeedbackType,
        feedback: feedbackText.trim(),
        images: uploadedImageUrls,
      })

      Toast.show({
        text1: 'Feedback submitted successfully',
        type: 'success',
      })

      // Reset form
      setFeedbackText('')
      setMedia([])
      setBusinessType(FeedbackType.API)
    } catch (error) {
      console.error('Failed to submit feedback:', error)

      const errorMessage = getErrorMessage(error)

      Toast.show({
        text1: 'Failed to submit feedback',
        text2: errorMessage,
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [businessType, feedbackText, media])

  return (
    <SafeScreen bottomOnly>
      <Header
        RightItem={
          <TouchableOpacity hitSlop={10} onPress={handleLiveChatPress}>
            <Headphones color={colors.neutral900} size={24} />
          </TouchableOpacity>
        }
        label='Feedback'
      />
      <ScrollView
        className='flex-1 bg-white'
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 40,
          paddingHorizontal: 20,
        }}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 16 }}>
          <Text
            className='text-md font-semibold mr-2 mb-3'
            style={{ color: colors.neutral900 }}>
            Business Type
          </Text>
          <Pressable onPress={handleOpenBusinessTypeSheet}>
            <View pointerEvents='none'>
              <Input
                editable={false}
                rightAccessory={
                  <ChevronDown color={colors.gray400} size={20} />
                }
                style={{ borderColor: colors.neutral200 }}
                value={selectedLabel}
                variant='select'
              />
            </View>
          </Pressable>
        </View>

        <Input
          containerStyle={{ marginTop: 20 }}
          inputStyle={{
            fontSize: 16,
            fontWeight: '400',
            color: colors.neutral900,
          }}
          label='Feedback/Suggestion'
          placeholder='Enter your feedback or suggestion'
          placeholderTextColor={colors.neutral400}
          style={{ minHeight: 100, textAlignVertical: 'top' }}
          value={feedbackText}
          variant='textarea'
          onChangeText={setFeedbackText}
        />

        <View style={{ marginTop: 24 }}>
          <View className='flex-row items-center justify-between mb-2'>
            <Text
              className='text-body-large-semibold'
              style={{ color: colors.neutral900 }}>
              Image & Video
            </Text>
            <Text
              style={{
                color: colors.neutral500,
                fontSize: 16,
                fontWeight: '400',
              }}>
              {media.length}/{MAX_MEDIA}
            </Text>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{
              alignItems: 'center',
              minHeight: 88,
              paddingHorizontal: 12,
              paddingVertical: 16,
            }}
            showsHorizontalScrollIndicator={false}
            style={{
              borderColor: colors.neutral200,
              borderRadius: 4,
              borderWidth: 1,
              flexGrow: 0,
            }}>
            {media.map((item) => (
              <View
                key={item.id}
                style={{
                  marginRight: 12,
                  position: 'relative',
                  height: 88,
                  width: 88,
                }}>
                {item.type === 'image' ? (
                  <Image
                    resizeMode='cover'
                    source={{ uri: item.uri }}
                    style={{
                      borderRadius: 4,
                      height: 88,
                      width: 88,
                    }}
                  />
                ) : item.thumbnailUri ? (
                  <Image
                    resizeMode='cover'
                    source={{ uri: item.thumbnailUri }}
                    style={{
                      borderRadius: 4,
                      height: 88,
                      width: 88,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      backgroundColor: colors.neutral200,
                      borderRadius: 4,
                      height: 88,
                      justifyContent: 'center',
                      width: 88,
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{ color: colors.neutral500, fontSize: 12 }}>
                      Video
                    </Text>
                  </View>
                )}
                <Pressable
                  hitSlop={8}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 12,
                    padding: 2,
                  }}
                  onPress={() => handleRemoveMedia(item.id)}>
                  <X color='#fff' size={16} />
                </Pressable>
              </View>
            ))}
            {media.length < MAX_MEDIA ? (
              <Pressable
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.neutral100,
                  borderRadius: 4,
                  height: 88,
                  justifyContent: 'center',
                  width: 88,
                }}
                onPress={handleAddMedia}>
                <Plus color={colors.neutral500} size={32} />
              </Pressable>
            ) : null}
          </ScrollView>
          <Text
            className='mt-2'
            style={{
              color: colors.neutral500,
              fontSize: 14,
              fontWeight: '400',
            }}>
            Maximum 2MB for JPG/PNG and 30MB for MP4/MOV
          </Text>
        </View>

        <View style={{ paddingHorizontal: 8 }}>
          <View
            style={{
              alignItems: 'center',
              marginTop: 24,
            }}>
            <Text
              className='text-body-small-regular'
              style={{
                color: colors.neutral700,
                fontSize: 14,
                lineHeight: 22,
                textAlign: 'center',
              }}>
              If you are reporting urgent issues, you can contact our customer
              service via{' '}
              <Text
                style={{
                  color: colors.primary500,
                  fontSize: 14,
                  fontWeight: '600',
                }}
                onPress={handleLiveChatPress}>
                Live Chat
              </Text>
            </Text>
          </View>
        </View>

        <Pressable
          disabled={isSubmitting}
          style={{
            alignItems: 'center',
            backgroundColor: isSubmitting
              ? colors.neutral300
              : colors.primary500,
            borderRadius: 8,
            justifyContent: 'center',
            marginBottom: 20,
            marginTop: 'auto',
            paddingVertical: 14,
          }}
          onPress={handleSubmit}>
          <Text
            className='text-body-large-semibold'
            style={{ color: colors.neutral0 }}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Text>
        </Pressable>
      </ScrollView>

      <AppBottomSheetModal
        ref={businessTypeSheetRef}
        modalProps={{ handleComponent: BusinessTypeHandle, index: 0 }}
        snapPoints={['50%', '90%']}>
        <BusinessTypeSheetContent
          value={businessType}
          onSelect={handleBusinessTypeSelect}
        />
      </AppBottomSheetModal>
    </SafeScreen>
  )
}

export default memo(FeedbackScreen)
