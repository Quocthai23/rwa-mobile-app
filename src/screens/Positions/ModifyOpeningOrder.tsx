import { useNavigation, useRoute } from '@react-navigation/native'
import { Check, ChevronDown, ChevronLeft, Minus } from 'lucide-react-native'
import { useState } from 'react'
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useSymbols } from '@/hooks/market/useSymbols'
import { Paths } from '@/navigation/paths'
import type { MainTabScreenProps } from '@/navigation/types'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import useTheme from '@/theme/hooks/useTheme'
import type { Position } from '@/types/position'

import MT5PriceText from '../Market/components/MT5PriceText'

interface ModifyOpeningOrderParams {
  position: Position
}

export function ModifyOpeningOrder() {
  const navigation = useNavigation<MainTabScreenProps['navigation']>()
  const route = useRoute()
  const insets = useSafeAreaInsets()
  const { position } = (route.params as ModifyOpeningOrderParams) || {}
  const { colors } = useTheme()

  const [takeProfit, setTakeProfit] = useState<number | null>(null)
  const [stopLoss, setStopLoss] = useState<number | null>(null)
  const [limitStopPrice, setLimitStopPrice] = useState<number | null>(null)
  const [orderType, setOrderType] = useState('Market Execution')
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [triggerType, setTriggerType] = useState('Price')
  const [showTriggerDropdown, setShowTriggerDropdown] = useState(false)
  const [editingField, setEditingField] = useState<
    'takeProfit' | 'stopLoss' | 'limitStopPrice' | null
  >(null)
  const [inputValue, setInputValue] = useState('')
  const ask =
    useMarketSocketStore((s) => s.rtBySymbol?.[position.symbol]?.ask) ?? 0
  const bid =
    useMarketSocketStore((s) => s.rtBySymbol?.[position.symbol]?.bid) ?? 0
  // Get asset data

  // Subscribe to symbol prices
  useSymbols([position.symbol], true)
  const rtBySymbol = useMarketSocketStore((s) => s.rtBySymbol)

  const isBuy = position.side === 0
  const positionType = isBuy ? 'Buy' : 'Sell'
  const openPrice = parseFloat(position.openPrice)

  // Get real-time price
  const rt = rtBySymbol?.[position.symbol]
  const realtimePrice = isBuy ? rt?.bid : rt?.ask
  const currentPrice = realtimePrice || openPrice

  const handleModify = async () => {
    try {
      // TODO: Call API to modify position
      // await modifyPosition({
      //   positionId: position.id,
      //   takeProfit,
      //   stopLoss
      // })

      Alert.alert('Success', 'Position modified successfully')
      navigation.goBack()
    } catch (error) {
      console.error('Error modifying position:', error)
      Alert.alert('Error', 'Failed to modify position. Please try again.')
    }
  }

  const handleTakeProfitPlus = () => {
    const newValue = (takeProfit ?? currentPrice) + 0.0001
    setTakeProfit(parseFloat(newValue.toFixed(4)))
  }

  const handleTakeProfitMinus = () => {
    const newValue = (takeProfit ?? currentPrice) - 0.0001
    setTakeProfit(parseFloat(newValue.toFixed(4)))
  }

  const handleStopLossMinus = () => {
    const newValue = (stopLoss ?? currentPrice) - 0.0001
    setStopLoss(parseFloat(newValue.toFixed(4)))
  }

  const handleStopLossPlus = () => {
    const newValue = (stopLoss ?? currentPrice) + 0.0001
    setStopLoss(parseFloat(newValue.toFixed(4)))
  }

  const handleLimitStopPriceMinus = () => {
    const newValue = (limitStopPrice ?? currentPrice) - 0.0001
    setLimitStopPrice(parseFloat(newValue.toFixed(4)))
  }

  const handleLimitStopPricePlus = () => {
    const newValue = (limitStopPrice ?? currentPrice) + 0.0001
    setLimitStopPrice(parseFloat(newValue.toFixed(4)))
  }

  const openFieldEditor = (
    field: 'takeProfit' | 'stopLoss' | 'limitStopPrice',
  ) => {
    setEditingField(field)
    if (field === 'takeProfit') {
      setInputValue(takeProfit ? takeProfit.toString() : '')
    } else if (field === 'stopLoss') {
      setInputValue(stopLoss ? stopLoss.toString() : '')
    } else if (field === 'limitStopPrice') {
      setInputValue(limitStopPrice ? limitStopPrice.toString() : '')
    }
  }

  const closeFieldEditor = () => {
    setEditingField(null)
    setInputValue('')
  }

  const saveFieldValue = () => {
    const value = parseFloat(inputValue)
    if (!isNaN(value)) {
      if (editingField === 'takeProfit') {
        setTakeProfit(parseFloat(value.toFixed(4)))
      } else if (editingField === 'stopLoss') {
        setStopLoss(parseFloat(value.toFixed(4)))
      } else if (editingField === 'limitStopPrice') {
        setLimitStopPrice(parseFloat(value.toFixed(4)))
      }
    }
    closeFieldEditor()
  }

  return (
    <View className='flex-1 bg-white'>
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className=' flex-row items-center justify-between gap-3 px-2 mt-4 py-3'>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.neutral900} size={24} />
        </TouchableOpacity>
        <Text className='text-h3-semibold text-neutral-900'>
          Modify Opening Order
        </Text>
        <View className='w-6' />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        <View className='px-4 py-6'>
          {/* Position Info */}
          <View className='mb-6'>
            <View className='flex-row items-center gap-3 mb-2'>
              <Text className='text-h2-semibold text-neutral-900'>
                {position.symbol}
              </Text>
              <View
                className={`rounded-md ${isBuy ? 'bg-success-50' : 'bg-error-50'}`}>
                <Text
                  className={`py-1.5 px-2.5 text-caption-medium ${isBuy ? 'text-success-500' : 'text-error-500'}`}>
                  {positionType} {position.quantity}
                </Text>
              </View>
              <View className='bg-primary-50 rounded-md'>
                <Text className='py-1.5 px-2.5 text-caption-medium text-primary-500'>
                  {position.leverage}x
                </Text>
              </View>
            </View>
            <Text className='text-body-small-regular text-neutral-500'>
              {(position as any).name || 'Unknown Asset'}
            </Text>
          </View>

          {/* Price Display */}
          <View className='mb-4 pb-5 border-b border-neutral-200'>
            <View className='flex-row items-center justify-center gap-4'>
              <View className='items-center flex-1'>
                <MT5PriceText style={{ color: colors.error500 }} value={bid} />
              </View>
              <View className='w-px h-8 bg-neutral-500' />
              <View className='items-center flex-1'>
                <MT5PriceText
                  style={{ color: colors.success500 }}
                  value={ask}
                />
              </View>
            </View>
          </View>

          {/* Order Type */}
          <View className='mb-3'>
            <View className='flex-row items-center justify-between px-4 py-4 rounded-[4px] bg-neutral-100'>
              <Text className='text-button-large-medium text-neutral-500'>
                Type
              </Text>
              <TouchableOpacity
                className='flex-row items-center gap-2'
                onPress={() =>
                  navigation.navigate(Paths.OpeningOrder, {
                    position,
                    tab: 'open_position',
                  })
                }>
                <Text className='text-button-large-medium text-neutral-900'>
                  {orderType}
                </Text>
                <ChevronDown
                  color={colors.neutral700}
                  size={20}
                  style={{
                    transform: [
                      { rotate: showTypeDropdown ? '180deg' : '0deg' },
                    ],
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Trigger Type */}
          <View className='mb-6'>
            <View className='flex-row items-center justify-between px-4 py-4 rounded-[4px] bg-neutral-100'>
              <Text className='text-button-large-medium text-neutral-500'>
                Trigger
              </Text>
              <TouchableOpacity
                className='flex-row items-center gap-2'
                onPress={() => setShowTriggerDropdown(!showTriggerDropdown)}>
                <Text className='text-button-large-medium text-neutral-900'>
                  {triggerType}
                </Text>
                <ChevronDown
                  color={colors.neutral700}
                  size={20}
                  style={{
                    transform: [
                      { rotate: showTriggerDropdown ? '180deg' : '0deg' },
                    ],
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Order Type Dropdown Modal */}
          <Modal
            transparent
            animationType='slide'
            visible={showTypeDropdown}
            onRequestClose={() => setShowTypeDropdown(false)}>
            <Pressable
              className='flex-1 justify-end bg-black/50'
              onPress={() => setShowTypeDropdown(false)}>
              <Pressable
                onPress={(e) => e.stopPropagation()}
                className='bg-white rounded-t-[8px]'>
                <View className='px-4 pb-3 pt-6 border-b border-neutral-200'>
                  <Text className='text-h2-semibold text-neutral-900 text-center'>
                    Order Type
                  </Text>
                </View>
                <ScrollView className='' showsVerticalScrollIndicator={false}>
                  {[
                    {
                      label: 'Market Execution',
                      description: 'Buy or sell at the latest price.',
                    },
                    {
                      label: 'Limit',
                      description: 'Buy or sell at a specific price or better.',
                    },
                    {
                      label: 'Stop',
                      description:
                        'Buy or sell once the price reaches a fixed target.',
                    },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.label}
                      className='px-4 py-4 '
                      onPress={() => {
                        setOrderType(option.label)
                        setShowTypeDropdown(false)
                      }}>
                      <View className='flex-row items-start justify-between gap-3'>
                        <View className='flex-1'>
                          <Text
                            className={`text-body-large-semibold mb-1 ${
                              orderType === option.label
                                ? 'text-primary-500'
                                : 'text-neutral-900'
                            }`}>
                            {option.label}
                          </Text>
                          <Text className='text-body-small-regular text-neutral-500'>
                            {option.description}
                          </Text>
                        </View>
                        {orderType === option.label && (
                          <View>
                            <Check size={24} color={colors.primary500} />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={{ paddingBottom: insets.bottom || 16 }} />
              </Pressable>
            </Pressable>
          </Modal>

          {/* Trigger Dropdown Modal */}
          <Modal
            transparent
            animationType='slide'
            visible={showTriggerDropdown}
            onRequestClose={() => setShowTriggerDropdown(false)}>
            <Pressable
              className='flex-1 justify-end bg-black/50'
              onPress={() => setShowTriggerDropdown(false)}>
              <Pressable
                onPress={(e) => e.stopPropagation()}
                className='bg-white rounded-t-[8px]'>
                <View className='px-4 pb-3 pt-6 border-b border-neutral-200'>
                  <Text className='text-h2-semibold text-neutral-900 text-center'>
                    TP/SL Triggers
                  </Text>
                </View>
                <ScrollView className='' showsVerticalScrollIndicator={false}>
                  {[
                    {
                      label: 'Price',
                      description:
                        'Set a specific price level to automatically execute your Take Profit or Stop Loss orders.',
                    },
                    {
                      label: 'Pips',
                      description:
                        'Set a specific number of pips from your entry price to trigger a Take Profit or Stop Loss.',
                    },
                    {
                      label: 'Change(%)',
                      description:
                        'Set a percentage-based price movement from your entry point to trigger your orders.',
                    },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.label}
                      className='px-4 py-4 '
                      onPress={() => {
                        setTriggerType(option.label)
                        setShowTriggerDropdown(false)
                      }}>
                      <View className='flex-row items-start justify-between gap-3'>
                        <View className='flex-1'>
                          <Text
                            className={`text-body-large-semibold mb-1 ${
                              triggerType === option.label
                                ? 'text-primary-500'
                                : 'text-neutral-900'
                            }`}>
                            {option.label}
                          </Text>
                          <Text className='text-body-small-regular text-neutral-500'>
                            {option.description}
                          </Text>
                        </View>
                        {triggerType === option.label && (
                          <View className='pt-1'>
                            <View className='w-6 h-6 rounded-full items-center justify-center'>
                              <Text className='text-primary-500 text-lg'>
                                ✓
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={{ paddingBottom: insets.bottom || 16 }} />
              </Pressable>
            </Pressable>
          </Modal>

          {/* Take Profit */}
          <View className='mb-6'>
            <View className='flex-row items-center gap-3'>
              <Text className='text-body-large-medium text-neutral-900 mr-[60px] w-[80px]'>
                Take Profit
              </Text>
              <TouchableOpacity
                className='bg-neutral-100 rounded-lg py-2.5 px-3 items-center justify-center'
                onPress={handleTakeProfitMinus}>
                <View>
                  <Minus size={14} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className='flex-1 bg-neutral-50 rounded-lg py-2.5 px-3 items-center'
                onPress={() => openFieldEditor('takeProfit')}>
                <Text className='text-body-small-regular text-neutral-400'>
                  {takeProfit ? takeProfit.toFixed(4) : 'not set'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className='bg-neutral-100 rounded-lg py-2.5 px-3 items-center justify-center'
                onPress={handleTakeProfitPlus}>
                <Text className='text-body-medium text-neutral-500'>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stop Loss */}
          <View className='mb-8'>
            <View className='flex-row items-center gap-3'>
              <Text className='text-body-large-medium text-neutral-900 mr-[60px] w-[80px]'>
                Stop Loss
              </Text>
              <TouchableOpacity
                className='bg-neutral-100 rounded-lg py-2.5 px-3 items-center justify-center'
                onPress={handleStopLossMinus}>
                <Minus size={14} />{' '}
              </TouchableOpacity>

              <TouchableOpacity
                className='flex-1 bg-neutral-50 rounded-lg py-2.5 px-3 items-center'
                onPress={() => openFieldEditor('stopLoss')}>
                <Text className='text-body-small-regular text-neutral-400'>
                  {stopLoss ? stopLoss.toFixed(4) : 'not set'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className='bg-neutral-100 rounded-lg py-2.5 px-3 items-center justify-center'
                onPress={handleStopLossPlus}>
                <Text className='text-body-medium text-neutral-500'>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Limit/Stop Price - Show when Limit or Stop order type */}
          {(orderType === 'Limit' || orderType === 'Stop') && (
            <View className='mb-8'>
              <View className='flex-row items-center gap-3'>
                <Text className='text-body-large-medium text-neutral-900 mr-[60px] w-[80px]'>
                  Price
                </Text>
                <TouchableOpacity
                  className='bg-neutral-100 rounded-lg py-2.5 px-3 items-center justify-center'
                  onPress={handleLimitStopPriceMinus}>
                  <View>
                    <Minus size={14} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className='flex-1 bg-neutral-50 rounded-lg py-2.5 px-3 items-center'
                  onPress={() => openFieldEditor('limitStopPrice')}>
                  <Text className='text-body-small-regular text-neutral-400'>
                    {limitStopPrice ? limitStopPrice.toFixed(4) : 'not set'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className='bg-neutral-100 rounded-lg py-2.5 px-3 items-center justify-center'
                  onPress={handleLimitStopPricePlus}>
                  <Text className='text-body-medium text-neutral-500'>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modify Button */}
      <View className='flex-row gap-2 mb-10 px-4'>
        <TouchableOpacity
          className='flex-1 bg-primary-500 rounded-[4px] py-3 items-center'
          onPress={handleModify}>
          <Text className='text-button-large-medium text-white'>Modify</Text>
        </TouchableOpacity>
      </View>

      {/* Field Editor Modal */}
      <Modal
        transparent
        animationType='slide'
        visible={editingField !== null}
        onRequestClose={closeFieldEditor}>
        <Pressable
          className='flex-1 justify-end bg-black/50'
          onPress={closeFieldEditor}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className='bg-white rounded-t-[8px]'>
            <View className='px-4 pb-3 pt-6 border-b border-neutral-200'>
              <Text className='text-h2-semibold text-neutral-900 text-center'>
                Enter Value
              </Text>
            </View>
            <View className='p-4'>
              <TextInput
                placeholder='0.0000'
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType='decimal-pad'
                className='border border-neutral-300 rounded-lg px-3 py-2.5 text-body-large-medium text-neutral-900'
                placeholderTextColor={colors.neutral400}
                autoFocus
              />
              <View className='flex-row gap-3 mt-4'>
                <TouchableOpacity
                  className='flex-1 py-2.5 px-3 rounded-lg bg-neutral-100 items-center'
                  onPress={closeFieldEditor}>
                  <Text className='text-body-large-medium text-neutral-900'>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className='flex-1 py-2.5 px-3 rounded-lg bg-primary-500 items-center'
                  onPress={saveFieldValue}>
                  <Text className='text-body-large-medium text-white'>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ paddingBottom: insets.bottom || 16 }} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}
