import { Search as SearchIcon, X } from 'lucide-react-native'
import { useEffect, useRef, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { type Paths } from '@/navigation/paths'
import { type MarketStackScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'
import { fontSize, fontWeight } from '@/theme/typography'

import TabAsset from './components/TabAsset'

type Props = MarketStackScreenProps<Paths.Search>

export default Search

function Search({ navigation }: Props) {
  const { colors } = useTheme()
  const [searchText, setSearchText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputReference = useRef<TextInput>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      inputReference.current?.focus()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-white dark:bg-background'>
      {/* Search Header */}
      <View className='flex-row items-center px-4 py-4 gap-3'>
        <View
          className={`flex-1 h-[46px] p-[3px] rounded-lg overflow-hidden ${isFocused ? 'bg-primary-100' : ''}`}>
          <TouchableOpacity
            activeOpacity={1}
            className='flex-1 flex-row items-center bg-neutral-100 rounded-md px-3 h-[40px]'
            style={{
              borderWidth: 1,
              borderColor: isFocused ? colors.primary500 : colors.neutral200,
              shadowColor: isFocused ? colors.primary500 : 'transparent',
              padding: isFocused ? 3 : 0,
              backgroundColor: colors.neutral0,
            }}
            onPress={() => inputReference.current?.focus()}>
            <SearchIcon color={colors.neutral500} size={20} />
            <TextInput
              ref={inputReference}
              autoFocus
              placeholder='Search'
              placeholderTextColor={colors.neutral500}
              returnKeyType='search'
              style={{
                color: colors.neutral900,
                flex: 1,
                marginLeft: 8,
                paddingVertical: 0,
                height: 44,
                fontSize: fontSize.md,
                fontWeight: fontWeight.medium,
              }}
              value={searchText}
              onBlur={() => setIsFocused(false)}
              onChangeText={setSearchText}
              onFocus={() => setIsFocused(true)}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchText('')
                }}>
                <X color={colors.neutral500} size={20} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}>
          <Text className='text-body-medium'>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View className='flex-1'>
        {!searchText && (
          <View className='px-4 my-4'>
            <Text className='text-body-large-semibold text-neutral-900'>
              Trending
            </Text>
            <Text className='mt-2 text-body-small-regular text-neutral-900'>
              # Gold breaks record: Trade in 7 days, claim $79
            </Text>
            <Text className='mt-2 text-body-small-regular text-neutral-900'>
              # Market developments in AUD, JPY, and Tesla.
            </Text>
            <Text className='mt-2 text-body-small-regular text-neutral-900'>
              # Silver rallies: Trade now, get $55 cashback
            </Text>
          </View>
        )}

        <TabAsset searchText={searchText} />
      </View>
    </SafeAreaView>
  )
}
