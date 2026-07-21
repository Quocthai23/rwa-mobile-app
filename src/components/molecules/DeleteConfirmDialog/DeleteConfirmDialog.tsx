import { Modal, Pressable, View } from 'react-native'

import { Text } from '@/components/atoms/TranslatedText/TranslatedText'

type DeleteConfirmDialogProps = {
  readonly cancelText?: string
  readonly confirmText?: string
  readonly isVisible: boolean
  readonly message: string
  readonly onCancel: () => void
  readonly onConfirm: () => void
  readonly title?: string
}

export function DeleteConfirmDialog({
  cancelText = 'Không',
  confirmText = 'Xoá',
  isVisible,
  message,
  onCancel,
  onConfirm,
  title = 'Xoá sản phẩm',
}: DeleteConfirmDialogProps) {
  return (
    <Modal
      transparent
      animationType='fade'
      visible={isVisible}
      onRequestClose={onCancel}>
      <View className='flex-1 items-center justify-center bg-black/50'>
        <View className='bg-white rounded-xl p-6 mx-4 w-[85%] max-w-sm'>
          {/* Header */}
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-lg font-bold text-gray-900' text={title} />
            <Pressable onPress={onCancel}>
              <Text className='text-gray-400 text-xl'>×</Text>
            </Pressable>
          </View>

          {/* Message */}
          <Text className='text-base text-gray-700 mb-6' text={message} />

          {/* Actions */}
          <View className='flex-row gap-3'>
            <Pressable
              className='flex-1 bg-gray-100 rounded-lg py-3 items-center'
              onPress={onCancel}>
              <Text
                className='text-base text-gray-700 font-semibold'
                text={cancelText}
              />
            </Pressable>
            <Pressable
              className='flex-1 bg-red-500 rounded-lg py-3 items-center'
              onPress={onConfirm}>
              <Text
                className='text-base text-white font-semibold'
                text={confirmText}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
