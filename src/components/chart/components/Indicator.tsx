import { Check } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import { useIndicatorStore } from '@/store/indicatorStore'

import { type IndicatorType } from '../types/types'
import { useTheme } from '@/theme'

const indicatorOptions: { id: IndicatorType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'MA', label: 'Moving Average (MA)' },
  { id: 'EMA', label: 'Exponential Moving Average (EMA)' },
  { id: 'BOLL', label: 'Bollinger Bands (BOLL)' },
  { id: 'MACD', label: 'MACD' },
  { id: 'RSI', label: 'RSI' },
  { id: 'KDJ', label: 'KDJ' },
  { id: 'ATR', label: 'ATR' },
]

function Indicator({
  indicatorRef,
}: {
  readonly indicatorRef: React.RefObject<AppBottomSheetModalHandle | null>
}) {
  const { indicator, setIndicator } = useIndicatorStore()
  const { colors } = useTheme()

  return (
    <AppBottomSheetModal
      ref={indicatorRef}
      animationDuration={250}
      snapPoints={['50%']}>
      <View className='pt-2'>
        <Text className='text-h3-semibold pb-4 px-4 border-b border-neutral-200'>
          Indicators
        </Text>

        <View className='-mx-2 mt-4 pb-6 px-4'>
          {indicatorOptions.map((option) => (
            <Pressable
              key={option.id}
              className='w-full px-2 mb-3'
              onPress={() => {
                setIndicator(option.id)
                indicatorRef.current?.close()
              }}>
              <View className='p-2 flex-row items-center justify-between rounded-xl'>
                <Text
                  className={`text-center font-medium ${
                    indicator === option.id
                      ? 'text-primary-500'
                      : 'text-neutral-900'
                  }`}>
                  {option.label}
                </Text>
                {indicator === option.id && (
                  <Check color={colors.primary500} size={18} />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </AppBottomSheetModal>
  )
}

export default Indicator
