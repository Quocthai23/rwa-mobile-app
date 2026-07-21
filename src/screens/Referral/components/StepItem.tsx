import { Text, View } from 'react-native'

interface StepItemProps {
  description: string
  isLast?: boolean
  step: number
  title: string
}

export const StepItem = ({
  description,
  isLast,
  step,
  title,
}: StepItemProps) => {
  return (
    <View className={`flex-row items-start ${!isLast ? 'mb-6' : ''}`}>
      <View className='items-center mr-3 mt-0.5'>
        <View className='w-12 h-12 rounded-full bg-primary-100 items-center justify-center relative z-10'>
          <Text className='text-primary-500 text-body-semibold text-[18px]'>
            {step}
          </Text>
        </View>
        {!isLast && (
          <View
            className='absolute top-8 w-[1px] bg-neutral-200'
            style={{ height: '140%', bottom: -24 }}
          />
        )}
      </View>
      <View className='flex-1'>
        <Text className='text-body-semibold text-neutral-900'>{title}</Text>
        <Text className='text-body-regular text-neutral-500 mt-0.5'>
          {description}
        </Text>
      </View>
    </View>
  )
}
