import { X } from 'lucide-react-native'
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'

interface CalendarModalProps {
  visible: boolean
  onClose: () => void
  selectedDate: string // YYYY-MM-DD
  onDateSelect: (date: string) => void // receives YYYY-MM-DD
  currentMonth: Date
  onMonthChange: (direction: 'next' | 'prev') => void
}

function CalendarModal({
  visible,
  onClose,
  selectedDate,
  onDateSelect,
  currentMonth,
  onMonthChange,
}: CalendarModalProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const formatToISODate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateSelect = (day: number) => {
    const selectedFullDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    )
    onDateSelect(formatToISODate(selectedFullDate))
  }

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth)
    const days = []
    const monthName = currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    // Add empty cells for days before the first day of the month
    for (let index = 0; index < startingDayOfWeek; index++) {
      days.push(<View key={`empty-${index}`} className='w-[14.28%] p-2' />)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day,
      )
      const dateString = formatToISODate(dayDate)
      const isSelected = dateString === selectedDate

      days.push(
        <TouchableOpacity
          key={day}
          className='w-[14.28%] p-2 items-center justify-center'
          onPress={() => {
            handleDateSelect(day)
          }}>
          <View
            className={`w-10 h-10 rounded-full items-center justify-center bg-${isSelected ? 'primary-500' : 'transparent'}`}>
            <Text
              className={`text-body-large-regular text-${isSelected ? 'white' : 'neutral-900'}`}>
              {day}
            </Text>
          </View>
        </TouchableOpacity>,
      )
    }

    return (
      <View>
        {/* Month Header */}
        <View className='flex-row items-center justify-between mb-4 px-4'>
          <TouchableOpacity
            className='p-2'
            onPress={() => {
              onMonthChange('prev')
            }}>
            <Text className='text-h3-semibold text-neutral-900'>←</Text>
          </TouchableOpacity>
          <Text className='text-h3-semibold text-neutral-900'>{monthName}</Text>
          <TouchableOpacity
            className='p-2'
            onPress={() => {
              onMonthChange('next')
            }}>
            <Text className='text-h3-semibold text-neutral-900'>→</Text>
          </TouchableOpacity>
        </View>

        {/* Day Names */}
        <View className='flex-row mb-2'>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
            <View key={dayName} className='w-[14.28%] items-center'>
              <Text className='text-body-small-regular text-neutral-500'>
                {dayName}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View className='flex-row flex-wrap'>{days}</View>
      </View>
    )
  }

  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}>
      <View
        className='flex-1 justify-center items-center'
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View className='w-11/12 rounded-2xl p-4 bg-neutral-50 max-w-400'>
          {/* Modal Header */}
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-h3-semibold text-neutral-900'>
              Select Date
            </Text>
            <TouchableOpacity className='p-2' onPress={onClose}>
              <X className='text-neutral-700' size={24} />
            </TouchableOpacity>
          </View>

          {/* Calendar */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderCalendar()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default CalendarModal
