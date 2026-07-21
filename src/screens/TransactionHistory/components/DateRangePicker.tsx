import { Calendar, Check, ChevronRight } from 'lucide-react-native'
import React, { useMemo, useRef, useState } from 'react'
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { toStartOfDayISO, toEndOfDayISO } from '@/utils/dateUtils'
import CustomDatePicker, {
  type CustomDatePickerHandle,
} from './CustomDatePicker'

type Props = {
  onSelect?: (dates: { startDate: string; endDate: string }) => void
  selectedValue?: string
}

const dateRangeOptions = [
  { label: 'Last 3 days', value: 'last_3_days' },
  { label: 'Last 7 days', value: 'last_7_days' },
  { label: 'Last 30 days', value: 'last_30_days' },
  { label: 'Last 3 months', value: 'last_3_months' },
  { label: 'Custom date', value: 'custom', hasChevron: true },
]

type AnchorLayout = { y: number; height: number }

const GAP = 8
const SCREEN_PADDING = 16

const DateRangePicker = ({
  onSelect,
  selectedValue = 'last_7_days',
}: Props) => {
  const { colors } = useTheme()

  const btnRef = useRef<View | null>(null)
  const customDatePickerRef = useRef<CustomDatePickerHandle>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(selectedValue)
  const [anchor, setAnchor] = useState<AnchorLayout | null>(null)
  const [customDateRange, setCustomDateRange] = useState<{
    start: Date
    end: Date
  } | null>(null)

  const selectedLabel = useMemo(() => {
    if (selected === 'custom' && customDateRange) {
      const startStr = customDateRange.start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
      const endStr = customDateRange.end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
      return `${startStr} - ${endStr}`
    }
    return (
      dateRangeOptions.find((opt) => opt.value === selected)?.label ||
      'Last 7 days'
    )
  }, [selected, customDateRange])

  const handleSelect = (value: string) => {
    if (value === 'custom') {
      setIsOpen(false)
      setTimeout(() => {
        customDatePickerRef.current?.open()
      }, 200)
    } else {
      setSelected(value)
      setCustomDateRange(null)
      setIsOpen(false)

      // Calculate date range based on selection
      const today = new Date()
      const startDate = new Date()

      switch (value) {
        case 'last_3_days':
          startDate.setDate(today.getDate() - 3)
          break
        case 'last_7_days':
          startDate.setDate(today.getDate() - 7)
          break
        case 'last_30_days':
          startDate.setDate(today.getDate() - 30)
          break
        case 'last_3_months':
          startDate.setMonth(today.getMonth() - 3)
          break
      }

      onSelect?.({
        startDate: toStartOfDayISO(startDate),
        endDate: toEndOfDayISO(today),
      })
    }
  }

  const handleCustomDateApply = (start: Date, end: Date) => {
    setCustomDateRange({ start, end })
    setSelected('custom')
    onSelect?.({
      startDate: toStartOfDayISO(start),
      endDate: toEndOfDayISO(end),
    })
  }

  const open = () => {
    btnRef.current?.measureInWindow((_x, y, _w, h) => {
      setAnchor({ y, height: h })
      setIsOpen(true)
    })
  }

  const popupPos = useMemo(() => {
    if (!anchor) return null

    const top = anchor.y + anchor.height + GAP

    return { top }
  }, [anchor])

  return (
    <>
      <TouchableOpacity
        ref={btnRef}
        className='flex-row items-center gap-2 px-3 py-2 rounded'
        style={{
          backgroundColor:
            selected === 'custom' ? colors.primary100 : colors.neutral100,
        }}
        onPress={open}>
        <Calendar
          color={selected === 'custom' ? colors.primary500 : colors.neutral900}
          size={16}
        />
        <Text
          className={`text-button-small-medium ${selected === 'custom' ? 'text-primary-500' : 'text-neutral-900'}`}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType='fade'
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}>
        <Pressable className='flex-1' onPress={() => setIsOpen(false)}>
          <View className='flex-1'>
            {popupPos && (
              <Pressable
                onPress={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: popupPos.top,

                  left: SCREEN_PADDING,
                  right: SCREEN_PADDING,

                  backgroundColor: colors.neutral0,
                  borderColor: colors.neutral200,
                  borderWidth: 1,
                  borderRadius: 4,

                  shadowColor: colors.neutral900,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 4,
                }}>
                {dateRangeOptions.map((option) => {
                  const isSelected = selected === option.value
                  return (
                    <TouchableOpacity
                      key={option.value}
                      className='flex-row items-center justify-between px-4 py-3'
                      onPress={() => handleSelect(option.value)}>
                      <Text
                        className={`flex-1 ${
                          isSelected
                            ? 'text-body-large-medium'
                            : 'text-body-large-regular'
                        }`}
                        style={{
                          color: isSelected
                            ? colors.primary500
                            : colors.neutral900,
                        }}>
                        {option.label}
                      </Text>

                      {isSelected && !option.hasChevron && (
                        <Check color={colors.primary500} size={24} />
                      )}
                      {option.hasChevron && (
                        <ChevronRight color={colors.neutral700} size={24} />
                      )}
                    </TouchableOpacity>
                  )
                })}
              </Pressable>
            )}
          </View>
        </Pressable>
      </Modal>

      <CustomDatePicker
        ref={customDatePickerRef}
        buttonRef={btnRef}
        onApply={handleCustomDateApply}
      />
    </>
  )
}

export default DateRangePicker
