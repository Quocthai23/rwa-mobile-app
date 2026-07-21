import useTheme from '@/theme/hooks/useTheme'
import { useNavigation } from '@react-navigation/native'
import { ChevronLeftIcon } from 'lucide-react-native'
import { Text, TouchableOpacity, View } from 'react-native'

export function Header({
  label,
  RightItem,
}: {
  readonly label?: string
  readonly RightItem?: React.ReactNode
}) {
  const navigation = useNavigation()
  const { colors } = useTheme()
  return (
    <View className='flex-row items-center px-4 h-12 bg-white justify-between'>
      <TouchableOpacity
        hitSlop={10}
        onPress={() => {
          navigation.goBack()
        }}>
        <ChevronLeftIcon color={colors.neutral900} size={24} />
      </TouchableOpacity>
      <View
        style={{ flex: 1 }}
        className='absolute left-0 right-0 items-center justify-center flex-row h-12 pointer-events-none'>
        {!!label && (
          <Text className='text-lg font-semibold text-gray-900'>{label}</Text>
        )}
      </View>
      {!!RightItem ? (
        <View>{RightItem}</View>
      ) : (
        // This keeps space on the right matching the ChevronLeftIcon size
        <View style={{ width: 24 }} />
      )}
    </View>
  )
}
