import { Image, Pressable, Text, View } from 'react-native'

import { useTheme } from '@/theme'

type PINKeyboardProps = {
  readonly length?: number
  readonly onChange: (value: string) => void
  readonly value: string
}

const ROWS: (number | 'back' | null)[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [null, 0, 'back'],
]

function PINKeyboard({ length = 6, onChange, value }: PINKeyboardProps) {
  const { colors } = useTheme()

  const handlePress = (key: number | 'back') => {
    if (key === 'back') {
      onChange(value.slice(0, -1))
    } else if (value.length < length) {
      onChange(value + String(key))
    }
  }

  return (
    <View className='flex-row flex-wrap'>
      {ROWS.flatMap((row, rowIndex) =>
        row.map((key, colIndex) => {
          if (key === null) {
            return (
              <View
                key={`${rowIndex}-${colIndex}-empty`}
                className='w-1/3'
                style={{ height: 56 }}
              />
            )
          }
          if (key === 'back') {
            return (
              <Pressable
                key={`${rowIndex}-${colIndex}-back`}
                className='w-1/3 justify-center items-center'
                style={{ height: 56 }}
                onPress={() => handlePress('back')}>
                <View
                  className='items-center justify-center'
                  style={{ width: 48, height: 40 }}>
                  <Image
                    resizeMode='contain'
                    source={require('@/assets/images/DeleteButton.png')}
                    style={{ width: 32, height: 32 }}
                  />
                </View>
              </Pressable>
            )
          }
          return (
            <Pressable
              key={`${rowIndex}-${key}`}
              className='w-1/3 justify-center items-center'
              style={{ height: 56 }}
              onPress={() => handlePress(key)}>
              <Text
                className='text-2xl font-semibold'
                style={{ color: colors.neutral900 }}>
                {key}
              </Text>
            </Pressable>
          )
        }),
      )}
    </View>
  )
}

export default PINKeyboard
