import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Check,
  ChevronDown,
  ChevronLeft,
  Minus,
  Plus,
} from 'lucide-react-native'
import { useState, useRef } from 'react'
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
import { useAllAssetsList } from '@/hooks/assets/useAllAssetsList'
import { useCreateOrder } from '@/hooks/orders/useCreateOrder'
import { useSymbols } from '@/hooks/market/useSymbols'
import type { MainTabScreenProps } from '@/navigation/types'
import { Paths } from '@/navigation/paths'
import { ORDER_SIDES, ORDER_TYPE_CODES } from '@/constants/order'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import useTheme from '@/theme/hooks/useTheme'
import type { Position } from '@/types/position'
import type { CreateOrderPayload } from '@/types/orders'
import MT5PriceText from '../Market/components/MT5PriceText'
import { calculateUnrealizedPnL } from './position.calculations'
import { createOrderAPI } from '@/services/oderService'
import { closePositions } from '@/services/positionService'
import { useToast } from '@/hooks/useToast'
import { usePositions } from '@/hooks/usePosition'
import { useOrders } from '@/hooks/useOrder'

interface OpeningOrderParams {
  position: Position
  tab?: 'close_position' | 'open_position'
  orderTypeDefault?: string
}

export function OpeningOrder() {
  const navigation = useNavigation<MainTabScreenProps['navigation']>()
  const route = useRoute()
  const insets = useSafeAreaInsets()
  const { position, tab, orderTypeDefault } =
    (route.params as OpeningOrderParams) || {}
  const { colors } = useTheme()
  const { data: assetsData } = useAllAssetsList()
  const leverage =
    assetsData?.data.find((a) => a.symbol === position.symbol)?.maxLeverage || 0
  console.log('leverage:', leverage) // Debug log to check position data
  console.log('Assets List:', assetsData) // Debug log to check assets data
  const assetsList = assetsData?.data || []

  // Get current asset data for lot validation
  const currentAsset = assetsData?.data.find((a) => a.symbol === selectedSymbol)
  const [takeProfit, setTakeProfit] = useState<number | null>(null)
  const [stopLoss, setStopLoss] = useState<number | null>(null)
  const [limitStopPrice, setLimitStopPrice] = useState<number | null>(null)
  const [lot, setLot] = useState<number | null>(
    currentAsset ? parseFloat(currentAsset.minTradeSize) : 0.01,
  )
  const [lotText, setLotText] = useState(
    currentAsset ? currentAsset.minTradeSize : '0.01',
  )
  const [orderType, setOrderType] = useState(
    orderTypeDefault || 'Market Execution',
  )
  const { refetch: refetchPositions } = usePositions(position?.accountId || '')
  const { data: apiOrders, refetch: refetchOrders } = useOrders(
    position?.accountId || '',
  )
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [triggerType, setTriggerType] = useState('Price')
  const [showTriggerDropdown, setShowTriggerDropdown] = useState(false)
  const [showBuySell, setShowBuySell] = useState(false)
  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState(
    position?.symbol || 'XAUUSD',
  )
  const [editingField, setEditingField] = useState<
    'takeProfit' | 'stopLoss' | 'limitStopPrice' | null
  >(null)
  const [inputValue, setInputValue] = useState('')
  const lotInputRef = useRef<TextInput>(null)

  const ask =
    useMarketSocketStore((s) => s.rtBySymbol?.[selectedSymbol]?.ask) ?? 0
  const bid =
    useMarketSocketStore((s) => s.rtBySymbol?.[selectedSymbol]?.bid) ?? 0
  // Get asset data
  // const leverage =
  //     useMarketSocketStore((s) => s.rtBySymbol?.[selectedSymbol]?.leverage) ?? 0
  const isClosePositionTab = tab === 'close_position'
  // Get all available symbols

  const minTradeSize = currentAsset
    ? parseFloat(currentAsset.minTradeSize)
    : 0.01
  const maxTradeSize = currentAsset
    ? parseFloat(currentAsset.maxTradeSize)
    : 100
  const volumeStep = currentAsset?.volumeStep
    ? parseFloat(currentAsset.volumeStep)
    : 0.01

  // Get decimal places from volumeStep
  const getDecimalPlaces = (num: number) => {
    const str = num.toString()
    return str.includes('.') ? str.split('.')[1].length : 0
  }
  const lotDecimalPlaces = getDecimalPlaces(volumeStep)

  // Initialize lot with minTradeSize if not set
  const initialLot = lot === null ? minTradeSize : lot
  const isModifyPosition = orderType === 'Modify Position'
  // Subscribe to symbol prices
  useSymbols([selectedSymbol], true)
  const rtBySymbol = useMarketSocketStore((s) => s.rtBySymbol)
  console.log('Real-time data by symbol:', rtBySymbol)
  const isBuy = position.side === 0
  const positionType = isBuy ? 'Buy' : 'Sell'
  const openPrice = parseFloat(position.openPrice)

  // Get real-time price for selected symbol
  const rt = rtBySymbol?.[selectedSymbol]
  const realtimePrice = isBuy ? rt?.bid : rt?.ask
  const currentPrice = realtimePrice || openPrice

  // Handle symbol selection
  const handleSelectSymbol = (newSymbol: string) => {
    setSelectedSymbol(newSymbol)
    setShowSymbolDropdown(false)
    setLot(null)
    setLotText('')
  }
  const unrealizedPnL = calculateUnrealizedPnL(position, rtBySymbol)
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
  //   const { profit, loss } = calculatePositionFields(position, assetsBySymbol, rtBySymbol)
  const handleTakeProfitPlus = () => {
    const newValue = (takeProfit ?? currentPrice) + 0.0001
    setTakeProfit(parseFloat(newValue.toFixed(4)))
  }
  const { showError, showSuccess } = useToast()

  const handleTakeProfitMinus = () => {
    const newValue = (takeProfit ?? currentPrice) - 0.0001
    setTakeProfit(parseFloat(newValue.toFixed(4)))
  }
  const handleClosePosition = async (position: Position) => {
    if (!position) return

    try {
      await closePositions(position.id, position.accountId, position.quantity)
      // refetchPositions()

      navigation.goBack()
      showSuccess('Position closed', 'Position closed successfully.')
    } catch (error: any) {
      showError('Error closing position', error)
    } finally {
    }
  }

  const getSellLabel = () => {
    switch (orderType) {
      case 'Market Execution':
        return 'Sell'
      case 'Stop':
        return 'Sell Stop'
      case 'Limit':
        return 'Sell Limit'
      default:
        return 'Sell'
    }
  }
  const getBuyLabel = () => {
    switch (orderType) {
      case 'Market Execution':
        return 'Buy'
      case 'Stop':
        return 'Buy Stop'
      case 'Limit':
        return 'Buy Limit'
      default:
        return 'Buy'
    }
  }
  const orderTypeCode = () => {
    switch (orderType) {
      case 'Market Execution':
        return ORDER_TYPE_CODES.MARKET
      case 'Stop':
        return ORDER_TYPE_CODES.STOP
      case 'Limit':
        return ORDER_TYPE_CODES.LIMIT
      default:
        return ORDER_TYPE_CODES.MARKET
    }
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

  const isLimitStopPriceValid = (side: 0 | 1): boolean => {
    if (orderType === 'Market Execution') return true
    if (!limitStopPrice) return false

    const isBuySide = side === 0

    if (orderType === 'Limit') {
      // Buy Limit: price must be LOWER than ask
      if (isBuySide) return limitStopPrice < ask
      // Sell Limit: price must be HIGHER than bid
      return limitStopPrice > bid
    } else if (orderType === 'Stop') {
      // Buy Stop: price must be HIGHER than ask
      if (isBuySide) return limitStopPrice > ask
      // Sell Stop: price must be LOWER than bid
      return limitStopPrice < bid
    }

    return true
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
  const dynamicMaxLength = (() => {
    if (!lotText || !lotText.includes('.')) return 10

    const dotIndex = lotText.indexOf('.')
    return dotIndex + 1 + lotDecimalPlaces
  })()
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

  const { isPending: isCreatingOrder, mutate: createOrder } = useCreateOrder()

  const handlePlaceOrder = (side: 0 | 1) => {
    if (isCreatingOrder) return

    // Validate quantity - use lot value or minTradeSize as default
    const quantity = lot ?? minTradeSize
    console.log('lam', {
      accountId: position.accountId,
      leverage: leverage,
      quantity: quantity,
      side,
      symbol: selectedSymbol,
      orderType: orderTypeCode(),
      limitStopPrice: limitStopPrice,
    })
    if (
      !quantity ||
      quantity <= 0 ||
      quantity > maxTradeSize ||
      quantity < minTradeSize
    ) {
      Alert.alert(
        'Error',
        `Lot must be between ${minTradeSize} and ${maxTradeSize}`,
      )
      return
    }
    try {
      const respone = createOrderAPI({
        accountId: position.accountId,
        leverage: leverage,
        quantity: quantity,
        side,
        symbol: selectedSymbol,
        orderType: orderTypeCode(),
        price: limitStopPrice || undefined,
      })
      console.log('Order API response:', respone)
      if (orderType == 'Market Execution') {
        refetchPositions()
      } else {
        refetchOrders()
      }
      showSuccess('Order placed', 'Your order has been placed successfully.')
      navigation.goBack()
    } catch (error: any) {
      showError('Error placing order', error)
    }

    // const isMarket = orderType === 'Market Execution'
    // const orderTypeCode = isMarket
    //   ? ORDER_TYPE_CODES.MARKET
    //   : ORDER_TYPE_CODES.LIMIT

    // const payload: CreateOrderPayload = {
    //   accountId: position.accountId,
    //   leverage: leverage,
    //   orderType: orderTypeCode,
    //   quantity: quantity,
    //   side,
    //   symbol: selectedSymbol,
    //   type: isMarket ? 'MARKET' : 'LIMIT',
    // }

    // if (takeProfit) {
    //   payload.takeProfitPrice = takeProfit
    // }
    // if (stopLoss) {
    //   payload.stopLossPrice = stopLoss
    // }

    // if (!isMarket) {
    //   if (!limitStopPrice || limitStopPrice <= 0) {
    //     Alert.alert('Error', 'Please set a valid limit price')
    //     return
    //   }
    //   payload.price = limitStopPrice
    // }

    // createOrder(payload, {
    //   onSuccess: () => {
    //     navigation.goBack()
    //   },
    // })
  }

  return (
    <View className='flex-1 bg-white'>
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className=' flex-row items-center justify-between gap-3 px-2 mt-2 py-3'>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.neutral900} size={24} />
        </TouchableOpacity>
        <Text className='text-h3-semibold text-neutral-900'>Opening Order</Text>
        <View className='w-6' />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        <View className='px-4 py-3'>
          {/* Position Info */}
          <View className='mb-4 relative'>
            <View className='flex-row items-center gap-3 mb-2 relative'>
              <TouchableOpacity
                className='flex-row items-center gap-2'
                onPress={() => setShowSymbolDropdown(!showSymbolDropdown)}>
                <Text className='text-h2-semibold text-neutral-900'>
                  {selectedSymbol}
                </Text>
                <ChevronDown color={colors.neutral700} size={20} />
              </TouchableOpacity>
              {isClosePositionTab && (
                <View
                  className={`rounded-[4px] ${position?.side === 0 ? 'bg-success-50' : 'bg-error-50'}`}>
                  <Text
                    className={`py-1.5 px-2.5 text-caption-medium ${position?.side === 0 ? 'text-success-500' : 'text-error-500'}`}>
                    {position?.side === 0 ? 'Buy' : 'Sell'} {position?.quantity}
                  </Text>
                </View>
              )}

              <View className='bg-primary-50 rounded-md'>
                <Text className='py-1.5 px-2.5 text-caption-medium text-primary-500'>
                  {leverage}x
                </Text>
              </View>
              {showSymbolDropdown && (
                <>
                  {/* Overlay */}
                  <Pressable
                    style={{
                      position: 'absolute',
                      top: -2000,
                      left: -2000,
                      right: -2000,
                      bottom: -2000,
                      zIndex: 40,
                    }}
                    onPress={() => setShowSymbolDropdown(false)}
                  />

                  {/* Dropdown */}
                  <View
                    className='absolute left-0 mt-1 border border-neutral-200 rounded-[8px] bg-white overflow-hidden'
                    style={{
                      height: 400,
                      top: '100%',
                      zIndex: 50,
                    }}>
                    <ScrollView showsVerticalScrollIndicator>
                      {assetsList.map((asset) => (
                        <TouchableOpacity
                          key={asset.symbol}
                          className='px-4 py-3 border-b border-neutral-100'
                          onPress={() => handleSelectSymbol(asset.symbol)}>
                          <View className='flex-row items-center justify-between gap-3'>
                            <View className='flex-1'>
                              <Text
                                className={`text-body-medium-semibold ${
                                  selectedSymbol === asset.symbol
                                    ? 'text-primary-500'
                                    : 'text-neutral-900'
                                }`}>
                                {asset.symbol}
                              </Text>
                            </View>
                            {selectedSymbol === asset.symbol && (
                              <Check size={20} color={colors.primary500} />
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </>
              )}
            </View>
            <Text className='text-body-small-regular text-neutral-500'>
              {assetsList.find((a) => a.symbol === selectedSymbol)?.name ||
                'Unknown Asset'}
            </Text>

            {/* Symbol Dropdown - Absolute Position */}
          </View>

          {/* Price Display */}
          <View className='mb-2'>
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

          {isClosePositionTab && (
            <View>
              <View className='flex flex-row items-center justify-between'>
                <Text className='text-body-small-regular text-neutral-500'>
                  Position ID
                </Text>
                <Text className='text-body-large-semibold'>#{position.id}</Text>
              </View>
              <View className='flex flex-row items-center justify-between mb-4'>
                <Text className='text-body-small-regular text-neutral-500'>
                  Entry Price
                </Text>
                <Text className='text-body-large-semibold'>
                  {position.openPrice}
                </Text>
              </View>
            </View>
          )}

          {/* Order Type */}
          <View className='mb-3 relative'>
            <View className='flex-row items-center justify-between px-4 py-3 rounded-[4px] bg-neutral-100'>
              <Text className='text-button-large-medium text-neutral-500'>
                Type
              </Text>
              <TouchableOpacity
                className='flex-row items-center gap-2'
                onPress={() => setShowTypeDropdown(!showTypeDropdown)}>
                <Text className='text-button-large-medium text-neutral-900'>
                  {orderType}
                </Text>
                <ChevronDown color={colors.neutral700} size={20} />
              </TouchableOpacity>
            </View>
            {showTypeDropdown && (
              <>
                {/* Overlay */}
                <Pressable
                  style={{
                    position: 'absolute',
                    top: -2000,
                    left: -2000,
                    right: -2000,
                    bottom: -2000,
                    zIndex: 40,
                  }}
                  onPress={() => setShowTypeDropdown(false)}
                />
                {/* Dropdown */}
                <View
                  className='absolute left-0 mt-1 border py-2 border-neutral-200 rounded-[8px] bg-white overflow-hidden'
                  style={{
                    right: 0,
                    top: '100%',
                    zIndex: 50,
                    maxHeight: 300,
                  }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {[
                      {
                        label: 'Market Execution',
                      },
                      {
                        label: 'Limit',
                      },
                      {
                        label: 'Stop',
                      },
                      ...(isClosePositionTab
                        ? [{ label: 'Modify Position' }]
                        : []),
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.label}
                        className='px-4 py-2'
                        onPress={() => {
                          setOrderType(option.label)
                          setShowTypeDropdown(false)
                          if (option.label !== 'Modify Position') {
                            setShowBuySell(true)
                          }
                        }}>
                        <View className='flex-row items-start justify-between gap-1'>
                          <View className='flex-1'>
                            <Text
                              className={`text-body-large-semibold mb-1 ${
                                orderType === option.label
                                  ? 'text-primary-500'
                                  : 'text-neutral-900'
                              }`}>
                              {option.label}
                            </Text>
                          </View>
                          {orderType === option.label && (
                            <Check size={20} color={colors.primary500} />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}
          </View>

          {/* Trigger Type */}
          <View className='mb-2 relative'>
            <View className='flex-row items-center justify-between px-4 py-3 rounded-[4px] bg-neutral-100'>
              <Text className='text-button-large-medium text-neutral-500'>
                Trigger
              </Text>
              <TouchableOpacity
                className='flex-row items-center gap-2'
                onPress={() => setShowTriggerDropdown(!showTriggerDropdown)}>
                <Text className='text-button-large-medium text-neutral-900'>
                  {triggerType}
                </Text>
                <ChevronDown color={colors.neutral700} size={20} />
              </TouchableOpacity>
            </View>
            {showTriggerDropdown && (
              <>
                {/* Overlay */}
                <Pressable
                  style={{
                    position: 'absolute',
                    top: -2000,
                    left: -2000,
                    right: -2000,
                    bottom: -2000,
                    zIndex: 40,
                  }}
                  onPress={() => setShowTriggerDropdown(false)}
                />
                {/* Dropdown */}
                <View
                  className='absolute left-0 mt-1 py-2 border border-neutral-200 rounded-[8px] bg-white overflow-hidden'
                  style={{
                    right: 0,
                    top: '100%',
                    zIndex: 50,
                    maxHeight: 300,
                  }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {[
                      {
                        label: 'Price',
                      },
                      {
                        label: 'Pips',
                      },
                      {
                        label: 'Change(%)',
                      },
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.label}
                        className='px-4 py-2'
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
                          </View>
                          {triggerType === option.label && (
                            <View className='pt-1'>
                              <View className='w-6 h-6 rounded-full items-center justify-center'>
                                <Check size={20} color={colors.primary500} />
                              </View>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}
          </View>

          {/* Lot Size Input */}
          <View className='mb-1 mx-[-7px]'>
            <View className='flex-row items-center gap-2'>
              {/* Left buttons */}
              <View className='flex-1 flex-row gap-1 justify-between'>
                <TouchableOpacity
                  className='flex-1 rounded-lg py-2 items-center justify-center'
                  onPress={() => {
                    const currentLot = lot ?? minTradeSize
                    const newValue = Math.max(
                      minTradeSize,
                      currentLot - volumeStep * 5,
                    )
                    setLot(newValue)
                    setLotText(newValue.toFixed(lotDecimalPlaces))
                  }}>
                  <Text className='text-button-large-medium text-primary-500'>
                    -{(volumeStep * 5).toFixed(lotDecimalPlaces)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className='flex-1 rounded-lg py-2 items-center justify-center'
                  onPress={() => {
                    const currentLot = lot ?? minTradeSize
                    const newValue = Math.max(
                      minTradeSize,
                      currentLot - volumeStep,
                    )
                    setLot(newValue)
                    setLotText(newValue.toFixed(lotDecimalPlaces))
                  }}>
                  <Text className='text-button-large-medium text-primary-500'>
                    -{volumeStep.toFixed(lotDecimalPlaces)}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Center input */}
              <TextInput
                ref={lotInputRef}
                placeholder={minTradeSize.toFixed(lotDecimalPlaces)}
                value={lotText}
                maxLength={dynamicMaxLength}
                onChangeText={(text) => {
                  if (text === '') {
                    setLotText('')
                    setLot(null)
                    return
                  }
                  if (!/^\d*\.?\d*$/.test(text)) return
                  const parts = text.split('.')
                  if (parts[1] && parts[1].length > lotDecimalPlaces) return

                  setLotText(text)

                  const value = parseFloat(text)
                  if (
                    !isNaN(value) &&
                    value >= minTradeSize &&
                    value <= maxTradeSize
                  ) {
                    setLot(value)
                  } else {
                    setLot(null)
                  }
                }}
                keyboardType='decimal-pad'
                className='rounded-lg py-3 px-5 w-[100px] text-h3-semibold text-neutral-900 text-center'
                placeholderTextColor={colors.neutral400}
              />

              {/* Right buttons */}
              <View className='flex-1 flex-row gap-1 justify-between'>
                <TouchableOpacity
                  className='flex-1 rounded-lg py-2 items-center justify-center'
                  onPress={() => {
                    const currentLot = lot ?? minTradeSize
                    const newValue = Math.min(
                      maxTradeSize,
                      currentLot + volumeStep,
                    )
                    setLot(newValue)
                    setLotText(newValue.toFixed(lotDecimalPlaces))
                  }}>
                  <Text className='text-button-large-medium text-primary-500'>
                    +{volumeStep.toFixed(lotDecimalPlaces)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className='flex-1 rounded-lg py-2 items-center justify-center'
                  onPress={() => {
                    const currentLot = lot ?? minTradeSize
                    const newValue = Math.min(
                      maxTradeSize,
                      currentLot + volumeStep * 5,
                    )
                    setLot(newValue)
                    setLotText(newValue.toFixed(lotDecimalPlaces))
                  }}>
                  <Text className='text-button-large-medium text-primary-500'>
                    +{(volumeStep * 5).toFixed(lotDecimalPlaces)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Take Profit */}
          <View className='mb-6'>
            {(orderType === 'Limit' || orderType === 'Stop') && (
              <View className='mb-6'>
                <View className='flex-row items-center gap-3'>
                  <Text className='text-body-large-medium text-neutral-900 mr-[60px] w-[80px]'>
                    Price
                  </Text>
                  <TouchableOpacity
                    className='bg-neutral-100 rounded-lg py-2.5 px-3 items-center justify-center'
                    onPress={handleLimitStopPriceMinus}>
                    <View>
                      <Minus size={18} strokeWidth={2} />
                    </View>
                  </TouchableOpacity>

                  <TextInput
                    placeholder='Not set'
                    value={limitStopPrice ? limitStopPrice.toString() : ''}
                    onChangeText={(text) => {
                      if (text === '') {
                        setLimitStopPrice(null)
                        return
                      }
                      if (!/^\d*\.?\d*$/.test(text)) return
                      const value = parseFloat(text)
                      if (!isNaN(value)) {
                        setLimitStopPrice(value)
                      }
                    }}
                    keyboardType='decimal-pad'
                    className='flex-1  rounded-lg py-2.5 px-3 text-body-small-regular text-neutral-900'
                    placeholderTextColor={colors.neutral400}
                  />

                  <TouchableOpacity
                    className='bg-neutral-100 rounded-lg py-2.5 px-3 items-center justify-center'
                    onPress={handleLimitStopPricePlus}>
                    <Plus size={18} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View className='flex-row items-center gap-3'>
              <Text className='text-body-large-medium text-neutral-900 mr-[60px] w-[80px]'>
                Take Profit
              </Text>
              <TouchableOpacity
                className='bg-neutral-100 rounded-lg py-2.5 px-3 items-center justify-center'
                onPress={handleTakeProfitMinus}>
                <View>
                  <Minus size={18} strokeWidth={2} />
                </View>
              </TouchableOpacity>

              <TextInput
                placeholder='Not set'
                value={takeProfit ? takeProfit.toString() : ''}
                onChangeText={(text) => {
                  if (text === '') {
                    setTakeProfit(null)
                    return
                  }
                  if (!/^\d*\.?\d*$/.test(text)) return
                  const value = parseFloat(text)
                  if (!isNaN(value)) {
                    setTakeProfit(value)
                  }
                }}
                keyboardType='decimal-pad'
                className='flex-1  rounded-lg py-2.5 px-3 text-body-small-regular text-neutral-900'
                placeholderTextColor={colors.neutral400}
              />

              <TouchableOpacity
                className='bg-neutral-100 rounded-lg py-2.5 px-3 items-center justify-center'
                onPress={handleTakeProfitPlus}>
                <Plus size={18} strokeWidth={2} />
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
                <Minus size={18} strokeWidth={2} />
              </TouchableOpacity>

              <TextInput
                placeholder='Not set'
                value={stopLoss ? stopLoss.toString() : ''}
                onChangeText={(text) => {
                  if (text === '') {
                    setStopLoss(null)
                    return
                  }
                  if (!/^\d*\.?\d*$/.test(text)) return
                  const value = parseFloat(text)
                  if (!isNaN(value)) {
                    setStopLoss(value)
                  }
                }}
                keyboardType='decimal-pad'
                className='flex-1  rounded-lg py-2.5 px-3 text-body-small-regular text-neutral-900'
                placeholderTextColor={colors.neutral400}
              />

              <TouchableOpacity
                className='bg-neutral-100 rounded-lg py-2.5 px-3 items-center justify-center'
                onPress={handleStopLossPlus}>
                <Plus size={18} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Limit/Stop Price - Show when Limit or Stop order type */}
        </View>
      </ScrollView>

      {/* Modify Button - Show when orderType is Modify Position */}
      {isModifyPosition ? (
        <View className='px-4 py-4 mb-5'>
          <TouchableOpacity
            disabled={isCreatingOrder}
            className='w-full bg-primary-500 rounded-[4px] py-3 items-center disabled:opacity-50'
            onPress={() => {
              navigation.navigate(Paths.ModifyOpeningOrder, {
                position,
              })
            }}>
            <Text className='text-button-large-medium text-white'>
              {isCreatingOrder ? 'Processing...' : 'Modify'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : isClosePositionTab && orderType === 'Market Execution' ? (
        <View className='px-4 py-4 mb-5 gap-2'>
          {/* Buy/Sell/Close Buttons for Market Order on Close Position Tab */}
          <View>
            <Text className='text-body-small-regular text-neutral-900 text-center mb-2'>
              Close {positionType} position #{position?.id} of{' '}
              {position.initialQuantity} lots at market price with a realized{' '}
              {unrealizedPnL > 0 ? 'profit' : 'loss'} of{' '}
              {Math.abs(unrealizedPnL).toFixed(2)}.
            </Text>
          </View>

          <View className='flex-row gap-2'>
            <TouchableOpacity
              disabled={isCreatingOrder}
              className='flex-1 bg-error-500 rounded-[4px] py-3 items-center disabled:opacity-50'
              onPress={() => handlePlaceOrder(ORDER_SIDES.SELL)}>
              <Text className='text-button-large-medium text-white'>
                {getSellLabel()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isCreatingOrder}
              className='flex-1 bg-success-500 rounded-[4px] py-3 items-center disabled:opacity-50'
              onPress={() => handlePlaceOrder(ORDER_SIDES.BUY)}>
              <Text className='text-button-large-medium text-white'>
                {getBuyLabel()}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Close Button */}
          <TouchableOpacity
            disabled={isCreatingOrder}
            className='w-full bg-warning-500 rounded-[4px] py-3 items-center flex-row justify-center gap-2 disabled:opacity-50'
            onPress={() => handleClosePosition(position)}>
            <Text className='text-button-large-medium text-white'>
              Close {positionType} at: {unrealizedPnL.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className='px-4 py-4 mb-5'>
          <View className='flex-row gap-2'>
            <TouchableOpacity
              disabled={
                isCreatingOrder || !isLimitStopPriceValid(ORDER_SIDES.SELL)
              }
              className='flex-1 bg-error-500 rounded-[4px] py-3 items-center disabled:opacity-50'
              onPress={() => handlePlaceOrder(ORDER_SIDES.SELL)}>
              <Text className='text-button-large-medium text-white'>
                {getSellLabel()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={
                isCreatingOrder || !isLimitStopPriceValid(ORDER_SIDES.BUY)
              }
              className='flex-1 bg-success-500 rounded-[4px] py-3 items-center disabled:opacity-50'
              onPress={() => handlePlaceOrder(ORDER_SIDES.BUY)}>
              <Text className='text-button-large-medium text-white'>
                {getBuyLabel()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Field Editor Modal - Background */}
      <Modal
        transparent
        animationType='fade'
        visible={editingField !== null}
        onRequestClose={closeFieldEditor}>
        <Pressable className='flex-1 bg-black/50' onPress={closeFieldEditor} />
      </Modal>

      {/* Field Editor Modal - Content */}
      <Modal
        transparent
        animationType='fade'
        visible={editingField !== null}
        onRequestClose={closeFieldEditor}>
        <Pressable className='flex-1 justify-end' onPress={closeFieldEditor}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className='bg-white rounded-t-[8px]'>
            <View className='px-4 pb-3 pt-6 border-b border-neutral-200'>
              <Text className='text-h2-semibold text-neutral-900 text-center'>
                {editingField === 'takeProfit' && 'Take Profit'}
                {editingField === 'stopLoss' && 'Stop Loss'}
                {editingField === 'limitStopPrice' && 'Price'}
              </Text>
            </View>
            <View className='p-4'>
              <TextInput
                placeholder='0.0000'
                value={inputValue}
                onChangeText={(text) => {
                  setInputValue(text)
                }}
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

      {/* Lot Quick Input Modal */}
      {/* Removed - now using direct TextInput */}
    </View>
  )
}
