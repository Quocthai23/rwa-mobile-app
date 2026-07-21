import { useState } from 'react'
import { FlatList, Modal, Pressable, View } from 'react-native'
import CountryFlag from 'react-native-country-flag'

import { Text } from '@/components/atoms/TranslatedText/TranslatedText'

export type Country = {
  code: string
  dialCode: string
  name: string
}

// Simplified list for demo/MVP - in a real app this would be a large JSON or library
const COUNTRIES: Country[] = [
  { code: 'VN', dialCode: '+84', name: 'Vietnam' },
  { code: 'US', dialCode: '+1', name: 'United States' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom' },
  { code: 'JP', dialCode: '+81', name: 'Japan' },
  { code: 'KR', dialCode: '+82', name: 'South Korea' },
  { code: 'CN', dialCode: '+86', name: 'China' },
  { code: 'SG', dialCode: '+65', name: 'Singapore' },
  { code: 'AU', dialCode: '+61', name: 'Australia' },
  { code: 'CA', dialCode: '+1', name: 'Canada' },
  { code: 'FR', dialCode: '+33', name: 'France' },
  { code: 'DE', dialCode: '+49', name: 'Germany' },
]

type CountryPickerProps = {
  readonly onSelect: (country: Country) => void
  readonly renderTrigger?: (props: {
    onPress: () => void
    selectedCountry: Country
  }) => React.ReactNode
  readonly selectedCountry: Country
}

export function CountryPicker({
  onSelect,
  renderTrigger,
  selectedCountry,
}: CountryPickerProps) {
  const [visible, setVisible] = useState(false)

  const openPicker = () => {
    setVisible(true)
  }

  return (
    <>
      {renderTrigger ? (
        renderTrigger({ onPress: openPicker, selectedCountry })
      ) : (
        <Pressable
          className='flex-row items-center mr-3 border-r border-gray-300 pr-3'
          onPress={openPicker}>
          <View className='w-6 h-6 rounded-full overflow-hidden mr-2 items-center justify-center border border-gray-100'>
            <CountryFlag
              isoCode={selectedCountry.code.toLowerCase()}
              size={24}
            />
          </View>
          <Text className='text-gray-900 font-medium'>
            {selectedCountry.dialCode}
          </Text>
          <Text className='text-gray-400 ml-1'>▼</Text>
        </Pressable>
      )}

      <Modal
        animationType='slide'
        presentationStyle='pageSheet'
        visible={visible}>
        <View className='flex-1 bg-white pt-4'>
          <View className='flex-row justify-between items-center px-4 pb-4 border-b border-gray-100'>
            <Text className='text-xl font-bold text-gray-900'>
              Select Country
            </Text>
            <Pressable
              className='p-2'
              onPress={() => {
                setVisible(false)
              }}>
              <Text className='text-blue-500 font-semibold text-base'>
                Close
              </Text>
            </Pressable>
          </View>
          <FlatList
            data={COUNTRIES}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <Pressable
                className='flex-row items-center p-4 border-b border-gray-100'
                onPress={() => {
                  onSelect(item)
                  setVisible(false)
                }}>
                <View className='w-8 h-6 mr-4 rounded bg-gray-100 overflow-hidden items-center justify-center'>
                  <CountryFlag isoCode={item.code.toLowerCase()} size={32} />
                </View>
                <Text className='text-lg text-gray-900 flex-1'>
                  {item.name}
                </Text>
                <Text className='text-lg text-gray-500 font-medium'>
                  {item.dialCode}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </>
  )
}

export default CountryPicker
