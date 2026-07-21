import { Text, View } from 'react-native'

interface StatCardProps {
  className?: string
  horizontal?: boolean
  label: string
  value: string | number
}

export const StatCard = ({
  label,
  value,
  className,
  horizontal,
}: StatCardProps) => {
  return (
    <View
      className={`bg-white border border-[#E5E7EB] ${
        horizontal
          ? 'flex-row items-center justify-between px-4 py-3 rounded-md'
          : 'p-4 rounded-md'
      } ${className}`}>
      <Text className='text-body-small-regular text-neutral-500'>{label}</Text>
      <Text
        className={`${
          horizontal ? 'text-h4-semibold' : 'text-h4-bold'
        } text-neutral-900 ${horizontal ? '' : 'mt-1'}`}>
        {value}
      </Text>
    </View>
  )
}
