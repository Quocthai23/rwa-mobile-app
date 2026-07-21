import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useTheme } from '@/theme'
import ButtonCustom from '@/components/atoms/Button/ButtonCustom'

type Props = {
  onApply?: (startDate: Date, endDate: Date) => void
  buttonRef: React.RefObject<View | null>
}

export type CustomDatePickerHandle = {
  close: () => void
  open: () => void
}

type AnchorLayout = { y: number; height: number }

const GAP = 8
const SCREEN_PADDING = 16

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sat', 'Su']
const QUICK_PERIODS = ['Weekly', 'Monthly', 'Annual']

const CustomDatePicker = forwardRef<CustomDatePickerHandle, Props>(
  ({ onApply, buttonRef }, reference) => {
    const { colors } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const [anchor, setAnchor] = useState<AnchorLayout | null>(null)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedStart, setSelectedStart] = useState<Date | null>(null)
    const [selectedEnd, setSelectedEnd] = useState<Date | null>(null)
    const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)

    useImperativeHandle(reference, () => ({
      close: () => setIsOpen(false),
      open: () => {
        buttonRef.current?.measureInWindow(
          (_x: number, y: number, _w: number, h: number) => {
            setAnchor({ y, height: h })
            setIsOpen(true)
          },
        )
      },
    }))

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const daysInMonth = lastDay.getDate()
      const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Monday = 0

      const days = []
      // Previous month days
      const prevMonthDays = new Date(year, month, 0).getDate()
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        days.push({
          date: new Date(year, month - 1, prevMonthDays - i),
          isCurrentMonth: false,
        })
      }
      // Current month days
      for (let i = 1; i <= daysInMonth; i++) {
        days.push({
          date: new Date(year, month, i),
          isCurrentMonth: true,
        })
      }
      // Next month days to fill the grid
      const remainingDays = 42 - days.length
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
        })
      }
      return days
    }

    const handleDateSelect = (date: Date) => {
      if (!selectedStart || (selectedStart && selectedEnd)) {
        setSelectedStart(date)
        setSelectedEnd(null)
      } else {
        if (date < selectedStart) {
          setSelectedEnd(selectedStart)
          setSelectedStart(date)
        } else {
          setSelectedEnd(date)
        }
      }
      setSelectedPeriod(null)
    }

    const handleQuickPeriod = (period: string) => {
      setSelectedPeriod(period)
      const today = new Date()
      let start = new Date()
      let end = today

      switch (period) {
        case 'Weekly':
          start.setDate(today.getDate() - 7)
          break
        case 'Monthly':
          start.setMonth(today.getMonth() - 1)
          break
        case 'Annual':
          start.setFullYear(today.getFullYear() - 1)
          break
      }
      setSelectedStart(start)
      setSelectedEnd(end)
    }

    const isDateInRange = (date: Date) => {
      if (!selectedStart || !selectedEnd) return false
      return date >= selectedStart && date <= selectedEnd
    }

    const isDateSelected = (date: Date) => {
      if (!selectedStart) return false
      if (selectedStart && !selectedEnd) {
        return date.toDateString() === selectedStart.toDateString()
      }
      return (
        date.toDateString() === selectedStart.toDateString() ||
        date.toDateString() === selectedEnd?.toDateString()
      )
    }

    const handleReset = () => {
      setSelectedStart(null)
      setSelectedEnd(null)
      setSelectedPeriod(null)
    }

    const handleApply = () => {
      if (selectedStart && selectedEnd) {
        onApply?.(selectedStart, selectedEnd)
        setIsOpen(false)
      }
    }

    const monthYear = currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    const days = getDaysInMonth(currentMonth)

    const popupPos = useMemo(() => {
      if (!anchor) return null
      return { top: anchor.y + anchor.height + GAP }
    }, [anchor])

    return (
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
                  borderRadius: 12,
                  shadowColor: colors.neutral900,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 4,
                }}>
                <ScrollView
                  className='px-4 py-4'
                  showsVerticalScrollIndicator={false}
                  style={{ maxHeight: 600 }}>
                  {/* Header */}
                  <View className='flex-row items-center justify-between mb-4'>
                    <TouchableOpacity
                      className='w-10 h-10 items-center justify-center rounded border'
                      style={{ borderColor: colors.neutral200 }}
                      onPress={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1,
                          ),
                        )
                      }>
                      <ChevronLeft color={colors.neutral700} size={20} />
                    </TouchableOpacity>

                    <Text className='text-body-large-medium'>{monthYear}</Text>

                    <TouchableOpacity
                      className='w-10 h-10 items-center justify-center rounded border'
                      style={{ borderColor: colors.neutral200 }}
                      onPress={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1,
                          ),
                        )
                      }>
                      <ChevronRight color={colors.neutral700} size={20} />
                    </TouchableOpacity>
                  </View>

                  {/* Quick Period Links */}
                  <View className='flex-row items-center gap-2 mb-4'>
                    {QUICK_PERIODS.map((period) => (
                      <TouchableOpacity
                        key={period}
                        className='px-3 py-1.5 rounded flex-1 flex-row items-center justify-center'
                        style={{
                          backgroundColor:
                            selectedPeriod === period
                              ? colors.primary100
                              : 'transparent',
                        }}
                        onPress={() => handleQuickPeriod(period)}>
                        <Text
                          className='text-body-small-semibold'
                          style={{
                            color:
                              selectedPeriod === period
                                ? colors.primary500
                                : colors.primary500,
                          }}>
                          {period}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Calendar Grid */}
                  <View>
                    {/* Day Headers */}
                    <View className='flex-row mb-2'>
                      {DAYS.map((day) => (
                        <View key={day} className='flex-1 items-center py-2'>
                          <Text
                            className='text-body-small-medium'
                            style={{ color: colors.neutral500 }}>
                            {day}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Date Grid */}
                    <View className='gap-1'>
                      {Array.from({ length: 6 }).map((_, weekIndex) => (
                        <View key={weekIndex} className='flex-row'>
                          {days
                            .slice(weekIndex * 7, (weekIndex + 1) * 7)
                            .map(({ date, isCurrentMonth }, dayIndex) => {
                              const inRange = isDateInRange(date)
                              const isSelected = isDateSelected(date)
                              const isStartDate =
                                selectedStart &&
                                date.toDateString() ===
                                  selectedStart.toDateString()
                              const isEndDate =
                                selectedEnd &&
                                date.toDateString() ===
                                  selectedEnd.toDateString()
                              const isFirstDayOfRow = dayIndex === 0
                              const isLastDayOfRow = dayIndex === 6

                              // Determine border radius for each corner
                              let topLeftRadius = 0
                              let bottomLeftRadius = 0
                              let topRightRadius = 0
                              let bottomRightRadius = 0

                              if (isStartDate && isEndDate) {
                                // Single day selected - full rounded
                                topLeftRadius = 6
                                bottomLeftRadius = 6
                                topRightRadius = 6
                                bottomRightRadius = 6
                              } else if (isStartDate) {
                                // Start date - full rounded
                                topLeftRadius = 6
                                bottomLeftRadius = 6
                                topRightRadius = 6
                                bottomRightRadius = 6
                              } else if (isEndDate) {
                                // End date - full rounded
                                topLeftRadius = 6
                                bottomLeftRadius = 6
                                topRightRadius = 6
                                bottomRightRadius = 6
                              } else if (inRange) {
                                // In range but not start/end
                                // Round left if first day of row
                                if (isFirstDayOfRow) {
                                  topLeftRadius = 6
                                  bottomLeftRadius = 6
                                }
                                // Round right if last day of row
                                if (isLastDayOfRow) {
                                  topRightRadius = 6
                                  bottomRightRadius = 6
                                }
                              }

                              return (
                                <TouchableOpacity
                                  key={dayIndex}
                                  className='flex-1 items-center justify-center'
                                  style={{
                                    aspectRatio: 1,
                                    backgroundColor: isSelected
                                      ? colors.primary500
                                      : inRange
                                        ? colors.primary100
                                        : 'transparent',
                                    borderTopLeftRadius: topLeftRadius,
                                    borderBottomLeftRadius: bottomLeftRadius,
                                    borderTopRightRadius: topRightRadius,
                                    borderBottomRightRadius: bottomRightRadius,
                                  }}
                                  onPress={() => handleDateSelect(date)}>
                                  <Text
                                    className='text-body-small-medium'
                                    style={{
                                      color: isSelected
                                        ? colors.neutral0
                                        : !isCurrentMonth
                                          ? colors.neutral300
                                          : colors.neutral900,
                                    }}>
                                    {date.getDate()}
                                  </Text>
                                </TouchableOpacity>
                              )
                            })}
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Footer */}
                  <View
                    className='flex-row gap-2 mt-4 pt-4 border-t'
                    style={{ borderColor: colors.neutral200 }}>
                    {/* <TouchableOpacity
                      className='flex-1 py-3 rounded items-center justify-center'
                      style={{ backgroundColor: colors.neutral100 }}
                      onPress={handleReset}>
                      <Text
                        className='text-button-large-medium'
                        style={{ color: colors.neutral900 }}>
                        Reset
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className='flex-1 py-3 rounded items-center justify-center'
                      style={{ backgroundColor: colors.primary500 }}
                      onPress={handleApply}>
                      <Text
                        className='text-button-large-medium'
                        style={{ color: colors.neutral0 }}>
                        Apply
                      </Text>
                    </TouchableOpacity> */}
                    <ButtonCustom type={'CANCEL'} onPress={handleReset} />
                    <ButtonCustom
                      type={'APPLY'}
                      title='Continue'
                      onPress={handleApply}
                    />
                  </View>
                </ScrollView>
              </Pressable>
            )}
          </View>
        </Pressable>
      </Modal>
    )
  },
)

CustomDatePicker.displayName = 'CustomDatePicker'

export default CustomDatePicker
