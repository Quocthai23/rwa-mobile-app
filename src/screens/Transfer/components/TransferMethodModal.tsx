import { Check, User } from 'lucide-react-native'
import { Text, TouchableOpacity, View } from 'react-native'
import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import { useTheme } from '@/theme'
import type { RefObject } from 'react'

interface TransferMethodModalProps {
  modalRef: RefObject<AppBottomSheetModalHandle | null>
  selectedMethod: 'your_account' | 'other_account'
  onSelect: (method: 'your_account' | 'other_account') => void
  options: Array<{ label: string; value: 'your_account' | 'other_account' }>
}

export const TransferMethodModal = ({
  modalRef,
  selectedMethod,
  onSelect,
  options,
}: TransferMethodModalProps) => {
  const { colors } = useTheme()

  return (
    <AppBottomSheetModal ref={modalRef} snapPoints={['40%']}>
      <Text className='text-h3-semibold text-neutral-900  px-4 border-b border-gray-100 pb-4'>
        Transfer method
      </Text>
      <View className='px-5 pb-10'>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            className='py-3 flex-row items-center justify-between '
            onPress={() => {
              onSelect(option.value)
              modalRef.current?.close()
            }}>
            <View className='flex-row items-center'>
              <User
                color={
                  selectedMethod === option.value
                    ? colors.primary500
                    : colors.neutral600
                }
                size={20}
              />
              <Text
                className={`text-body-semibold ml-3 ${
                  selectedMethod === option.value
                    ? 'text-primary-500'
                    : 'text-neutral-900'
                }`}>
                {option.label}
              </Text>
            </View>
            {selectedMethod === option.value && (
              <Check color={colors.primary500} size={20} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </AppBottomSheetModal>
  )
}
