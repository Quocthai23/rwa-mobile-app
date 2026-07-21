import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Check } from 'lucide-react-native'
import { useTheme } from '@/theme'

interface CustomCheckboxProps {
  value: boolean
  onValueChange: (value: boolean) => void
  activeColor?: string
  inactiveColor?: string
  checkColor?: string
  size?: number
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  value,
  onValueChange,
  activeColor,
  inactiveColor,
  checkColor,
  size = 20,
}) => {
  const { colors } = useTheme()

  // Set defaults from theme if not provided
  const activeColorResolved = activeColor ?? colors.primary500
  const inactiveColorResolved = inactiveColor ?? colors.neutral300
  const checkColorResolved = checkColor ?? colors.neutral0

  const handlePress = () => {
    onValueChange(!value)
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View
        className='rounded border-2 items-center justify-center'
        style={{
          width: size,
          height: size,
          borderColor: value ? activeColorResolved : inactiveColorResolved,
          backgroundColor: value ? activeColorResolved : colors.neutral0,
        }}>
        {value && (
          <Check color={checkColorResolved} size={size * 0.7} strokeWidth={3} />
        )}
      </View>
    </TouchableOpacity>
  )
}
