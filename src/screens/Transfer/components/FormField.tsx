import { ChevronDown } from 'lucide-react-native'
import { Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  value: string
  onPress: () => void
  icon?: ReactNode
  rightContent?: ReactNode
}

export const FormField = ({
  label,
  value,
  onPress,
  icon,
  rightContent,
}: FormFieldProps) => {
  const { colors } = useTheme()

  return (
    <View className=''>
      <Text
        className='text-body-semibold mb-2'
        style={{ color: colors.neutral900 }}>
        {label}
      </Text>
      <TouchableOpacity
        className='flex-row items-center justify-between rounded-md px-4 h-[54px]'
        style={{
          backgroundColor: colors.neutral0,
          borderColor: colors.neutral200,
          borderWidth: 1,
        }}
        onPress={onPress}>
        <View className='flex-row items-center flex-1 gap-3'>
          {icon}
          <Text
            className='text-body-regular'
            style={{ color: colors.neutral900 }}>
            {value}
          </Text>
        </View>
        {rightContent || <ChevronDown color={colors.neutral500} size={20} />}
      </TouchableOpacity>
    </View>
  )
}
