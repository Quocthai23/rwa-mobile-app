import { ChevronDown } from 'lucide-react-native'
import { Pressable, View } from 'react-native'
import CountryFlag from 'react-native-country-flag'

import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import {
  type Country,
  CountryPicker,
} from '@/components/molecules/CountryPicker/CountryPicker'
import useTheme from '@/theme/hooks/useTheme'

type PhonePrefixSelectorProps = {
  readonly onSelect: (country: Country) => void
  readonly selectedCountry: Country
  readonly variant?: 'default' | 'ghost' // Added variant prop
}

export function PhonePrefixSelector({
  onSelect,
  selectedCountry,
  variant = 'default',
}: PhonePrefixSelectorProps) {
  const containerClasses =
    variant === 'default'
      ? 'bg-gray-50/10 border border-gray-100 rounded-xl px-4 py-3.5 mr-2 flex-row items-center'
      : 'flex-row items-center pr-2' // Ghost variant: minimal styling, just layout
  const { colors } = useTheme()
  return (
    <CountryPicker
      renderTrigger={({ onPress, selectedCountry }) => (
        <Pressable className={containerClasses} onPress={onPress}>
          <View className='mr-2 rounded-full overflow-hidden w-6 h-6 items-center justify-center'>
            <CountryFlag
              isoCode={selectedCountry.code.toLowerCase()}
              size={20}
            />
          </View>
          <Text className='text-base text-gray-900 mr-2'>
            {selectedCountry.dialCode}
          </Text>
          <ChevronDown color={colors.neutral500} size={16} />
        </Pressable>
      )}
      selectedCountry={selectedCountry}
      onSelect={onSelect}
    />
  )
}

export default PhonePrefixSelector
