import { ArrowDown, ArrowUp, Check } from 'lucide-react-native'
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'

import useTheme from '@/theme/hooks/useTheme'

export type SortDirection = 'asc' | 'desc' | null

export interface SortOption {
  label: string
  value: string | null
}

export interface SortModalProps {
  visible: boolean
  onClose: () => void
  options: SortOption[]
  selectedSort: string | null
  selectedDirection: SortDirection
  onSort: (field: string | null, direction: SortDirection) => void
  title?: string
}

function SortModal({
  visible,
  onClose,
  options,
  selectedSort,
  selectedDirection,
  onSort,
  title = 'Sort by',
}: SortModalProps) {
  const { colors } = useTheme()

  const handleOptionPress = (option: SortOption) => {
    // Default option (value is null) - reset sort
    if (option.value === null) {
      onSort(null, null)
      return
    }

    // Same field pressed again - toggle direction
    if (selectedSort === option.value) {
      const newDirection = selectedDirection === 'desc' ? 'asc' : 'desc'
      onSort(option.value, newDirection)
    } else {
      // New field pressed - start with descending
      onSort(option.value, 'desc')
    }
  }

  const renderDirectionIcon = (option: SortOption) => {
    // Show checkmark for Default option when no sort is active
    if (option.value === null) {
      if (selectedSort === null && selectedDirection === null) {
        return <Check color={colors.primary500} size={20} />
      }
      return null
    }

    if (selectedSort !== option.value) return null

    if (selectedDirection === 'desc') {
      return <ArrowDown color={colors.primary500} size={20} />
    } else if (selectedDirection === 'asc') {
      return <ArrowUp color={colors.primary500} size={20} />
    } else {
      return <Check color={colors.primary500} size={20} />
    }
  }

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}>
      <Pressable className='flex-1 justify-end bg-black/50' onPress={onClose}>
        <Pressable
          onPress={(e) => {
            e.stopPropagation()
          }}>
          <View className='bg-white rounded-t-2xl'>
            <View className='p-4 border-b border-neutral-200'>
              <Text className='text-h3-semibold text-neutral-900'>{title}</Text>
            </View>
            <View className='py-2'>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className='flex-row items-center justify-between px-4 py-3'
                  onPress={() => handleOptionPress(option)}>
                  <Text
                    className={`text-body-large-regular text-${
                      selectedSort === option.value ||
                      (option.value === null &&
                        selectedSort === null &&
                        selectedDirection === null)
                        ? 'primary-500'
                        : 'neutral-900'
                    }`}>
                    {option.label}
                  </Text>
                  {renderDirectionIcon(option)}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export default SortModal
