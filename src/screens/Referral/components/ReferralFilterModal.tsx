import dayjs from 'dayjs'
import { Calendar } from 'lucide-react-native'
import React from 'react'
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'

import { toISODateString } from '@/utils/dateUtils'
import CalendarModal from '../../Home/components/CalendarModal'

interface ReferralFilterModalProps {
  visible: boolean
  onClose: () => void
  onApply: (fromDate: string, toDate: string, period: string) => void
  selectedPeriod: string
  fromDate?: string
  toDate?: string
}

const periods = [
  '1 week',
  '1 month',
  '3 months',
  '6 months',
  '1 year',
  'Custom',
]

export const ReferralFilterModal = ({
  visible,
  onClose,
  onApply,
  selectedPeriod: initialPeriod,
  fromDate: initialFromDate,
  toDate: initialToDate,
}: ReferralFilterModalProps) => {
  const [tempPeriod, setTempPeriod] = React.useState(initialPeriod)
  const [customFromDate, setCustomFromDate] = React.useState(
    initialFromDate || toISODateString(new Date()),
  )
  const [customToDate, setCustomToDate] = React.useState(
    initialToDate || toISODateString(new Date()),
  )

  const [pickerVisible, setPickerVisible] = React.useState(false)
  const [activePicker, setActivePicker] = React.useState<'from' | 'to'>('from')
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const openPicker = (type: 'from' | 'to') => {
    setActivePicker(type)
    setPickerVisible(true)
    const dateToUse = type === 'from' ? customFromDate : customToDate
    setCurrentMonth(dayjs(dateToUse).toDate())
  }

  const handleDateSelect = (date: string) => {
    if (activePicker === 'from') {
      setCustomFromDate(date)
    } else {
      setCustomToDate(date)
    }
    setPickerVisible(false)
  }

  const handleMonthChange = (direction: 'next' | 'prev') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  React.useEffect(() => {
    if (visible) {
      setTempPeriod(initialPeriod)
      if (initialFromDate) setCustomFromDate(initialFromDate)
      if (initialToDate) setCustomToDate(initialToDate)
    }
  }, [visible, initialPeriod, initialFromDate, initialToDate])

  const handleApply = () => {
    let fromDate = customFromDate
    let toDate = customToDate

    if (tempPeriod !== 'Custom') {
      const now = dayjs()
      toDate = now.format('YYYY-MM-DD')

      switch (tempPeriod) {
        case '1 week':
          fromDate = now.subtract(1, 'week').format('YYYY-MM-DD')
          break
        case '1 month':
          fromDate = now.subtract(1, 'month').format('YYYY-MM-DD')
          break
        case '3 months':
          fromDate = now.subtract(3, 'month').format('YYYY-MM-DD')
          break
        case '6 months':
          fromDate = now.subtract(6, 'month').format('YYYY-MM-DD')
          break
        case '1 year':
          fromDate = now.subtract(1, 'year').format('YYYY-MM-DD')
          break
      }
    }

    onApply(fromDate, toDate, tempPeriod)
  }

  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}>
      <Pressable className='flex-1 justify-end bg-black/50' onPress={onClose}>
        <Pressable
          className='bg-white rounded-t-[12px] overflow-hidden'
          onPress={(e) => e.stopPropagation()}>
          {/* Handle bar */}
          <View className='items-center pt-3'>
            <View className='w-10 h-1 bg-neutral-200 rounded-full' />
          </View>

          <View className='p-6'>
            <Text className='text-h3-semibold text-neutral-900 mb-6'>
              Filter
            </Text>

            <Text className='text-body-semibold text-neutral-900 mb-4'>
              Period
            </Text>

            <View className='flex-row flex-wrap justify-between'>
              {periods.map((period) => {
                const isSelected = tempPeriod === period
                return (
                  <TouchableOpacity
                    key={period}
                    onPress={() => setTempPeriod(period)}
                    className={`w-[48%] h-12 items-center justify-center rounded-xl mb-3 ${
                      isSelected
                        ? 'bg-primary-50 border border-primary-100'
                        : 'bg-neutral-50 border border-neutral-50'
                    }`}>
                    <Text
                      className={`text-body-medium-semibold ${
                        isSelected ? 'text-primary-500' : 'text-neutral-400'
                      }`}>
                      {period}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            {tempPeriod === 'Custom' && (
              <View className='mt-4 space-y-3'>
                <Text className='text-body-semibold text-neutral-900 mb-2'>
                  Select Date
                </Text>

                <View className='flex-row items-center justify-between gap-3'>
                  <TouchableOpacity
                    className='flex-1 h-12 bg-neutral-50 border border-neutral-100 rounded-xl px-4 flex-row items-center justify-between'
                    onPress={() => openPicker('from')}>
                    <View>
                      <Text className='text-[10px] text-neutral-400'>From</Text>
                      <Text className='text-body-medium-semibold text-neutral-900'>
                        {customFromDate}
                      </Text>
                    </View>
                    <Calendar size={16} color='#9CA3AF' />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className='flex-1 h-12 bg-neutral-50 border border-neutral-100 rounded-xl px-4 flex-row items-center justify-between'
                    onPress={() => openPicker('to')}>
                    <View>
                      <Text className='text-[10px] text-neutral-400'>To</Text>
                      <Text className='text-body-medium-semibold text-neutral-900'>
                        {customToDate}
                      </Text>
                    </View>
                    <Calendar size={16} color='#9CA3AF' />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View className='flex-row items-center justify-between mt-8'>
              <TouchableOpacity
                onPress={onClose}
                className='flex-1 h-14 bg-neutral-50 items-center justify-center rounded-2xl mr-3'>
                <Text className='text-h4-semibold text-neutral-900'>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                className='flex-1 h-14 bg-primary-500 items-center justify-center rounded-2xl'>
                <Text className='text-h4-semibold text-white'>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>

      <CalendarModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        selectedDate={activePicker === 'from' ? customFromDate : customToDate}
        onDateSelect={handleDateSelect}
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
      />
    </Modal>
  )
}
