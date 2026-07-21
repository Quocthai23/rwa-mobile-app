import { Check } from 'lucide-react-native'
import { Text, TouchableOpacity, View } from 'react-native'
import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import { useTheme } from '@/theme'
import type { RefObject } from 'react'

interface ReasonModalProps {
  modalRef: RefObject<AppBottomSheetModalHandle | null>
  selectedReason: string
  onSelect: (reason: string) => void
  options: string[]
}

export const ReasonModal = ({
  modalRef,
  selectedReason,
  onSelect,
  options,
}: ReasonModalProps) => {
  const { colors } = useTheme()

  return (
    <AppBottomSheetModal ref={modalRef} snapPoints={['50%']}>
      <Text className='text-h3-semibold text-neutral-900  px-4 border-b border-gray-100 pb-4'>
        Reason
      </Text>
      <View className='px-5 pb-10'>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            className='flex-row items-center justify-between py-4'
            onPress={() => {
              onSelect(option)
              modalRef.current?.close()
            }}>
            <Text
              className={`text-body-semibold ${
                selectedReason === option
                  ? 'text-primary-500 font-semibold'
                  : 'text-neutral-900'
              }`}>
              {option}
            </Text>
            {selectedReason === option && (
              <Check color={colors.primary500} size={20} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </AppBottomSheetModal>
  )
}
