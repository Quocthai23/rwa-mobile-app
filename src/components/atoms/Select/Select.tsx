import { ChevronDown } from 'lucide-react-native'
import { useCallback, useMemo, useRef } from 'react'
import { Pressable, ScrollView, View, type ViewProps } from 'react-native'

import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { useTheme } from '@/theme'

import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '../AppBottomSheetModal'
import { Input } from '../Input/Input'

type SelectOption = {
  amount?: string
  icon?: React.ReactNode
  isCommingSoon?: boolean
  label: string
  labelStyle?: ViewProps['style'] // Style cho label text
  style?: ViewProps['style'] // Style cho item container
  value: number | string
}

type SelectProps = {
  readonly containerStyle?: ViewProps['style']
  readonly disabled?: boolean
  readonly error?: string
  readonly itemContainerStyle?: ViewProps['style']
  readonly itemLabelStyle?: ViewProps['style']
  readonly label?: string
  readonly onSelect: (value: number | string) => void
  readonly options: SelectOption[]
  readonly placeholder?: string
  readonly renderOption?: (
    option: SelectOption,
    isSelected: boolean,
  ) => React.ReactNode // Custom render option
  readonly styleItem?: ViewProps['style']
  readonly value?: number | string
}

export function Select({
  containerStyle,
  disabled = false,
  error,
  itemContainerStyle,
  itemLabelStyle,
  label,
  onSelect,
  options,
  placeholder = 'Select an option',
  renderOption,
  styleItem,
  value,
}: SelectProps) {
  const { colors } = useTheme()

  const bottomSheetModalReference = useRef<AppBottomSheetModalHandle>(null)
  const snapPoints = useMemo(() => ['50%', '90%'], [])

  const selectedOption = options.find((option) => option.value === value)
  const displayValue = selectedOption?.label || placeholder

  const handlePress = useCallback(() => {
    if (!disabled) {
      bottomSheetModalReference.current?.open()
    }
  }, [disabled])

  const handleSelect = useCallback(
    (value_: number | string) => {
      onSelect(value_)
      bottomSheetModalReference.current?.close()
    },
    [onSelect],
  )

  return (
    <View className='' style={containerStyle}>
      {label ? (
        <Text
          className='text-md font-semibold mr-2 mb-3'
          style={{ color: colors.neutral900 }}>
          {label}
        </Text>
      ) : null}

      <Pressable disabled={disabled} onPress={handlePress}>
        <View
          pointerEvents='none'
          // style={{ borderWidth: 1, borderColor: 'red' }}
        >
          <Input
            editable={false}
            inputStyle={{}}
            leftAccessory={selectedOption?.icon}
            rightAccessory={<ChevronDown color={colors.gray400} size={20} />}
            style={{
              borderColor: colors.neutral200,
              opacity: disabled ? 0.5 : 1,
            }}
            value={displayValue}
            variant='select'
          />
        </View>
      </Pressable>

      <AppBottomSheetModal
        ref={bottomSheetModalReference}
        enablePanDownToClose
        snapPoints={snapPoints}>
        <View className='flex-1 pb-8'>
          <Text
            className='text-lg font-semibold text-left mb-4 px-4'
            style={{ color: colors.neutral900 }}>
            {placeholder}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((option) => {
              const isSelected = option.value === value

              if (renderOption) {
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      if (!option.isCommingSoon) handleSelect(option.value)
                    }}>
                    {renderOption(option, isSelected)}
                  </Pressable>
                )
              }

              // Default render
              return (
                <Pressable
                  key={option.value}
                  className={`py-4 border-b border-gray-100 flex-row px-4 min-h-[64px] items-center justify-between ${isSelected ? 'bg-primary-50' : ''}`}
                  style={[
                    {
                      backgroundColor: isSelected
                        ? colors.primary50
                        : 'transparent',
                      borderLeftColor: isSelected
                        ? colors.primary500
                        : 'transparent',
                      borderLeftWidth: 3,
                    },
                    styleItem,
                    itemContainerStyle,
                    option.style,
                  ]}
                  onPress={() => {
                    if (!option.isCommingSoon) handleSelect(option.value)
                  }}>
                  <View className='flex-row items-center'>
                    {option.icon ? (
                      <View className='mr-3'>{option.icon}</View>
                    ) : null}
                    <Text
                      className='text-base font-semibold'
                      style={[
                        { color: colors.neutral900 },
                        itemLabelStyle,
                        option.labelStyle,
                      ]}>
                      {option.label}
                    </Text>

                    {option.isCommingSoon ? (
                      <Text
                        className='font-medium text-xs px-2 py-1 rounded'
                        style={{
                          backgroundColor: colors.primary50,
                          color: colors.primary500,
                          marginLeft: 8,
                        }}>
                        Coming Soon
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              )
            })}
          </ScrollView>
        </View>
      </AppBottomSheetModal>

      {error ? (
        <Text className='text-red-500 text-sm mt-1'>{error}</Text>
      ) : null}
    </View>
  )
}

export default Select
