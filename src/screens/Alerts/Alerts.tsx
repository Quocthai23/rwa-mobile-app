import {
  Bell,
  ChevronLeft,
  FileText,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react-native'
import React, { useRef, useState } from 'react'
import {
  FlatList,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import ReusableTabsPager, {
  type TabItem,
} from '@/components/atoms/Pager/ReusableTabsPager'
import { type Paths } from '@/navigation/paths'
import { type RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'
import { Button } from '@/components/atoms'

type Props = RootScreenProps<Paths.Alerts>

function Alerts({ navigation }: Props) {
  const { colors } = useTheme()
  const alertListReference = useRef<AppBottomSheetModalHandle>(null)

  const tabs: TabItem[] = [
    {
      key: 'ticker',
      label: 'Ticker Alert',
      render: <TickerAlertTab />,
    },
    {
      key: 'price',
      label: 'Price Alert',
      render: <PriceAlertTab />,
    },
  ]

  return (
    <SafeAreaView className='flex-1' edges={['top']}>
      {/* Header */}
      <View className='flex-row items-center justify-between px-4 py-2'>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}>
          <ChevronLeft color={colors.neutral900} size={28} />
        </TouchableOpacity>
        <Text className='text-h3-semibold'>Alert</Text>
        <TouchableOpacity onPress={() => alertListReference.current?.open()}>
          <FileText color={colors.neutral900} size={24} />
        </TouchableOpacity>
      </View>

      {/* Symbol Info */}
      <View className='px-4 py-4 flex-row justify-between items-center'>
        <View>
          <Text className='text-h3-semibold mb-1'>Silver</Text>
          <Text className='text-body-small-regular text-neutral-500 mb-3'>
            XAG/USD
          </Text>
        </View>
        <View className='items-baseline w-[35%] pr-4'>
          <Text className='text-h1-semibold whitespace-nowrap mr-3'>
            75,296
          </Text>
          <View className='flex-row items-center gap-3'>
            <Text className='text-error-500 mr-2'>-9,979</Text>
            <Text className='text-error-500'>-11,73%</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <ReusableTabsPager
        activeColor={colors.primary500}
        defaultIndex={0}
        headerBorderColor='transparent'
        inactiveColor={colors.neutral500}
        tabs={tabs}
        underlineColor={colors.primary500}
        equalWidth
      />

      <AlertList alertListRef={alertListReference} />
    </SafeAreaView>
  )
}

export default Alerts

// Ticker Alert Tab Component
function TickerAlertTab() {
  const [tickerAlert, setTickerAlert] = useState(false)
  const [priceSurge, setPriceSurge] = useState(false)
  const [volumeSurge, setVolumeSurge] = useState(false)
  const [move24h, setMove24h] = useState(false)
  const [quickSurgeDive, setQuickSurgeDive] = useState(false)
  const [recentHighLow, setRecentHighLow] = useState(false)

  return (
    <ScrollView className='flex-1 px-4'>
      <AlertItem
        description='Quick-follow your favorite coins with one tap for easier tracking.'
        title='Ticker Alert'
        value={tickerAlert}
        onValueChange={setTickerAlert}
      />
      <AlertItem
        description='Notifies you of fast 1% price moves within 5 minutes.'
        title='Price Surge'
        value={priceSurge}
        onValueChange={setPriceSurge}
      />
      <AlertItem
        description='Alerts you when price moves 1% with high volume, signaling "whale" activity.'
        title='Volume Surge'
        value={volumeSurge}
        onValueChange={setVolumeSurge}
      />
      <AlertItem
        description='Alerts at 10% daily gains, then updates for every additional 5% rise.'
        title='24H Move'
        value={move24h}
        onValueChange={setMove24h}
      />
      <AlertItem
        description="Flags extreme 5% moves in 5 minutes relative to yesterday's close."
        title='Quick Surge/Dive'
        value={quickSurgeDive}
        onValueChange={setQuickSurgeDive}
      />
      <AlertItem
        description='Notifies you when price hits a new 48-hour peak or floor.'
        title='Recent High/Low'
        value={recentHighLow}
        onValueChange={setRecentHighLow}
      />
    </ScrollView>
  )
}

// Price Alert Tab Component
function PriceAlertTab() {
  const [alertType, setAlertType] = useState<'buy' | 'sell'>('sell')
  const [price, setPrice] = useState(26_072)
  const [priceText, setPriceText] = useState('26072,00')
  const [frequency, setFrequency] = useState<'once' | 'repeatedly'>('once')

  const incrementPrice = () => {
    const newPrice = price + 0.01
    setPrice(newPrice)
    setPriceText(newPrice.toFixed(2).replace('.', ','))
  }

  const decrementPrice = () => {
    const newPrice = Math.max(0, price - 0.01)
    setPrice(newPrice)
    setPriceText(newPrice.toFixed(2).replace('.', ','))
  }

  const handlePriceChange = (text: string) => {
    setPriceText(text)

    // Convert comma to dot for parsing
    const numericValue = Number.parseFloat(text.replace(',', '.'))
    if (!isNaN(numericValue)) {
      setPrice(numericValue)
    }
  }

  const handleBlur = () => {
    // Format on blur
    setPriceText(price.toFixed(2).replace('.', ','))
  }

  return (
    <View className='flex-1 px-4 mt-4 pb-8'>
      <View className='flex-1'>
        <View className='border border-neutral-200 p-4 rounded-[6px]'>
          {/* Alert me when */}
          <View className='mb-6 '>
            <Text className='text-body-regular mb-3'>Alert me when</Text>
            <View className='flex-row gap-3'>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-md items-center ${
                  alertType === 'sell' ? 'bg-red-50' : 'bg-neutral-200'
                }`}
                onPress={() => {
                  setAlertType('sell')
                }}>
                <Text
                  className={`text-body-regular font-medium ${
                    alertType === 'sell' ? 'text-error-500' : 'text-neutral-500'
                  }`}>
                  Sell Price
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 rounded-md items-center ${
                  alertType === 'buy' ? 'bg-green-50' : 'bg-neutral-200'
                }`}
                onPress={() => {
                  setAlertType('buy')
                }}>
                <Text
                  className={`text-body-regular font-medium ${
                    alertType === 'buy'
                      ? 'text-success-500'
                      : 'text-neutral-500'
                  }`}>
                  Buy Price
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hits */}
          <View className=''>
            <Text className='text-body-regular mb-3'>hits</Text>
            <View className='flex-row items-center justify-between'>
              <TextInput
                className='text-3xl flex-1'
                keyboardType='decimal-pad'
                style={{ minWidth: 100 }}
                value={priceText}
                onBlur={handleBlur}
                onChangeText={handlePriceChange}
              />
              <View className='flex-row gap-3'>
                <TouchableOpacity
                  className='w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg items-center justify-center'
                  onPress={incrementPrice}>
                  <Text className='text-2xl'>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className='w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg items-center justify-center'
                  onPress={decrementPrice}>
                  <Text className='text-2xl'>−</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Frequency Setting */}
        <View className='mb-8 mt-4 border border-neutral-200 p-4 rounded-[6px]'>
          <Text className='text-body-regular  mb-3'>Frequency Setting</Text>
          <TouchableOpacity
            className='flex-row items-center mb-3'
            onPress={() => {
              setFrequency('once')
            }}>
            <View
              className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                frequency === 'once'
                  ? 'border-primary-500'
                  : 'border-neutral-200'
              }`}>
              {frequency === 'once' && (
                <View className='w-3 h-3 rounded-full bg-primary-500' />
              )}
            </View>
            <Text className='text-body-regular'>One time</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-row items-center'
            onPress={() => {
              setFrequency('repeatedly')
            }}>
            <View
              className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                frequency === 'repeatedly'
                  ? 'border-primary-500'
                  : 'border-neutral-200'
              }`}>
              {frequency === 'repeatedly' && (
                <View className='w-3 h-3 rounded-full bg-primary-500' />
              )}
            </View>
            <Text className='text-body-regular text-black dark:text-white'>
              Repeatedly
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Set Alert Button */}
      {/* <TouchableOpacity className='bg-primary-500 py-4 rounded-lg items-center mb-6'>
        <Text className='text-white text-body-regular font-semibold'>
          Set Alert
        </Text>
      </TouchableOpacity> */}
      <Button className='mb-6' label='Set Alert' />
    </View>
  )
}

// Alert Item Component
function AlertItem({
  description,
  onValueChange,
  title,
  value,
}: {
  readonly description: string
  readonly onValueChange: (value: boolean) => void
  readonly title: string
  readonly value: boolean
}) {
  const { colors } = useTheme()
  return (
    <View className='py-4'>
      <View className='flex-row justify-between items-start mb-1 pr-2'>
        <Text className='text-body-medium flex-1'>{title}</Text>
        <Switch
          style={{
            transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
          }}
          thumbColor={colors.neutral0}
          trackColor={{ false: colors.neutral100, true: colors.primary500 }}
          value={value}
          onValueChange={onValueChange}
        />
      </View>
      <Text className='text-body-small-regular text-neutral-500 pr-12'>
        {description}
      </Text>
    </View>
  )
}

// Alert List
function AlertList({
  alertListRef,
}: {
  readonly alertListRef: React.Ref<AppBottomSheetModalHandle>
}) {
  const [alerts, setAlerts] = useState([
    {
      enabled: true,
      frequency: 'once',
      id: '1',
      price: 0.85,
      type: 'sell',
    },
    {
      enabled: true,
      frequency: 'once',
      id: '2',
      price: 1.3203,
      type: 'buy',
    },
    {
      enabled: false,
      frequency: 'repeatedly',
      id: '3',
      price: 0.3,
      type: 'sell',
    },
  ])

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const handleToggle = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, enabled: !alert.enabled } : alert,
      ),
    )
  }

  return (
    <AppBottomSheetModal
      ref={alertListRef}
      animationDuration={250}
      snapPoints={['70%']}>
      <View className='flex-1 pt-2'>
        <Text className='text-h3-semibold text-center  pb-4 border-b border-neutral-200'>
          Alert list
        </Text>

        {/* Symbol */}
        <View className='py-4 border-b border-neutral-200 px-4'>
          <Text className='text-xl font-bold text-black dark:text-white'>
            USD/CAD
          </Text>
          <Text className='text-sm text-secondary'>USD/CAD</Text>
        </View>

        {/* Alerts List */}
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeableAlertItem
              item={item}
              onDelete={() => {
                handleDelete(item.id)
              }}
              onToggle={() => {
                handleToggle(item.id)
              }}
            />
          )}
        />
      </View>
    </AppBottomSheetModal>
  )
}

// Swipeable Alert Item Component
function SwipeableAlertItem({
  item,
  onDelete,
  onToggle,
}: {
  readonly item: any
  readonly onDelete: () => void
  readonly onToggle: () => void
}) {
  const translateX = useSharedValue(0)
  const startX = useSharedValue(0)
  const { colors } = useTheme()
  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value
    })
    .onUpdate((event) => {
      const newValue = startX.value + event.translationX
      // Only allow swipe left (negative values)
      if (newValue <= 0 && newValue >= -80) {
        translateX.value = newValue
      }
    })
    .onEnd(() => {
      if (translateX.value < -40) {
        // Open delete
        translateX.value = withSpring(-80, {
          damping: 20,
          stiffness: 90,
        })
      } else {
        // Close
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 90,
        })
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const handleDeletePress = () => {
    translateX.value = withTiming(-400, { duration: 300 }, () => {
      runOnJS(onDelete)()
    })
  }

  return (
    <View style={{ overflow: 'hidden' }}>
      {/* Delete Button - Behind */}
      <View
        style={{
          alignItems: 'center',
          backgroundColor: colors.error50,
          bottom: 0,
          justifyContent: 'center',
          position: 'absolute',
          right: 0,
          top: 0,
          width: 80,
        }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
            width: '100%',
          }}
          onPress={handleDeletePress}>
          <Trash2 color={colors.error500} size={24} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              backgroundColor: colors.neutral0,
            },
            animatedStyle,
          ]}>
          <View className='flex-row items-center px-4 py-4 pr-6'>
            {/* Icon */}
            <View className='mr-3'>
              {item.type === 'sell' ? (
                <View className='bg-error-50 rounded-full w-[40px] aspect-square items-center justify-center'>
                  <TrendingDown color={colors.error500} size={24} />
                </View>
              ) : (
                <View className='bg-success-50 rounded-full w-[40px] aspect-square items-center justify-center'>
                  <TrendingUp color={colors.success500} size={24} />
                </View>
              )}
            </View>

            {/* Content */}
            <View className='flex-1'>
              <Text className='text-body-regular text-black dark:text-white mb-1'>
                Price {item.type === 'sell' ? 'below' : 'is up'} {item.price}
              </Text>
              <View className='flex-row items-center'>
                <Bell color={colors.primary500} size={14} />
                <Text className='text-sm text-primary-500 ml-1'>
                  {item.frequency === 'once' ? 'One time' : 'Repeatedly'}
                </Text>
              </View>
            </View>

            {/* Toggle */}
            <Switch
              style={{
                transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
              }}
              thumbColor={colors.neutral0}
              trackColor={{ false: colors.neutral300, true: colors.primary500 }}
              value={item.enabled}
              onValueChange={onToggle}
            />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  )
}
