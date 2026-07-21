import { SCREEN_WIDTH } from '@gorhom/bottom-sheet'
import { Text, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

function PINInput({
  length = 6,
  value,
}: {
  readonly length?: number
  readonly value: string
}) {
  return (
    <View className='flex flex-row gap-3 justify-center'>
      {Array.from({ length })
        .fill(0)
        .map((_, index) => (
          <View
            key={`${index}`}
            className={twMerge(
              'border border-neutral-200 rounded-sm justify-center items-center',
              value.length === index ? 'border-primary-500' : '',
            )}
            style={{
              height: 64,
              width: (SCREEN_WIDTH - 16 * 2 - (length - 1) * 12) / length,
            }}>
            <Text className='text-4xl font-semibold pb-1'>
              {value[index] ? '•' : ''}
            </Text>
          </View>
        ))}
    </View>
  )
}

export default PINInput
