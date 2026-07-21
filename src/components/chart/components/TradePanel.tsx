import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Check, CircleAlert } from 'lucide-react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  FlatList,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import ButtonCustom from '@/components/atoms/Button/ButtonCustom'
import { ORDER_SIDES, ORDER_TYPE_CODES } from '@/constants/order'
import { useCreateOrder } from '@/hooks/orders/useCreateOrder'
import { useToast } from '@/hooks/useToast'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useTheme } from '@/theme'
import { type CreateOrderPayload } from '@/types/orders'
import { formatPriceDecimal2 } from '@/utils/currency'
import { useAccountStore } from '@/store/useAccountStore'
import ChartCommon from '../ChartCommon'

const TABS = [
  'Market Execution',
  'Buy Limit',
  'Sell Limit',
  'Buy Stop',
  'Sell Stop',
]

const marginOptions = [
  { label: '1x', leverage: 1 },
  { label: '2x', leverage: 2 },
  { label: '5x', leverage: 5 },
  { label: '10x', leverage: 10 },
  { label: '50x', leverage: 50 },
  { label: '100x', leverage: 100 },
]

const INFO_TABS = ['Price', 'Pips', '% Change']

function TradePanel({
  descSymbol,
  symbol,
  tradePanelRef,
  limitPrice,
  setLimitPrice,
}: {
  readonly limitPrice: string
  readonly setLimitPrice: (value: string) => void
  readonly descSymbol: string
  readonly symbol: string
  readonly tradePanelRef: React.RefObject<AppBottomSheetModalHandle | null>
}) {
  const { colors } = useTheme()
  const rt = useMarketSocketStore((s) => s.rtBySymbol?.[symbol])
  const colorActiveMap: Record<number, string> = {
    0: colors.primary500, // green for Market
    1: colors.primary500, // orange for Limit
  }

  const { showError } = useToast()
  const { isPending: isCreatingOrder, mutate: createOrder } = useCreateOrder()

  const flatListReference = useRef<FlatList>(null)
  const marginReference = useRef<AppBottomSheetModalHandle>(null)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const [currentSnapIndex, setCurrentSnapIndex] = useState(-1)
  const [snapPoints, setSnapPoints] = useState<(string | number)[]>([])

  // Implement AppBottomSheetModalHandle interface
  useEffect(() => {
    if (tradePanelRef) {
      // Create wrapper object that implements the interface
      const handle: AppBottomSheetModalHandle = {
        open: (param?: string) => {
          if (param === 'orderLimit') {
            // Only when open is called with "ItemLimit" do we use the 17.5% snap point
            setSnapPoints(['22'])
            setCurrentSnapIndex(0)
            setActiveTab(TABS[1])
            bottomSheetModalRef.current?.present()
          } else if (param === 'buySell') {
            // For buy/sell we show full screen (index 1) with gray backdrop
            setSnapPoints([])
            setCurrentSnapIndex(1)
            bottomSheetModalRef.current?.present()
          } else {
            // When open is called without param (or with a different param), snapPoints is empty
            setSnapPoints([])
            setCurrentSnapIndex(-1)
          }
        },
        close: () => {
          bottomSheetModalRef.current?.dismiss()
        },
        isOpen: () => {
          return currentSnapIndex >= 0
        },
      }
      // Assign to ref
      if (tradePanelRef.current === null) {
        ;(tradePanelRef as any).current = handle
      } else {
        Object.assign(tradePanelRef.current, handle)
      }
    }
  }, [tradePanelRef, currentSnapIndex])

  // Dynamic backdrop based on snap point
  const renderBackdrop = useCallback(
    (props: any) => {
      // At index 0 (17.5%): transparent, no interaction blocking
      // At index 1 (100%): semi-transparent, blocks interaction
      const opacity = currentSnapIndex === 1 ? 0.5 : 0
      const pressBehavior = currentSnapIndex === 1 ? 'close' : 'none'

      return (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={1}
          disappearsOnIndex={0}
          opacity={opacity}
          pressBehavior={pressBehavior}
        />
      )
    },
    [currentSnapIndex],
  )

  const [transactionType, setTransactionType] = useState<'buy' | 'sell'>('buy')
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [infoActiveTabIndex, setInfoActiveTabIndex] = useState(0)
  const [quantity, setQuantity] = useState('0.01')
  const [leverage, setLeverage] = useState(100)
  const [showTakeProfitStopLoss, setShowTakeProfitStopLoss] = useState(false)
  const [takeProfitValue, setTakeProfitValue] = useState('')
  const [stopLossValue, setStopLossValue] = useState('')
  const [isStopLossSelected, setIsStopLossSelected] = useState(false)
  const [isTakeProfitSelected, setIsTakeProfitSelected] = useState(false)
  const selectedAccount = useAccountStore((s) => s.selectedAccount)
  const sellPrice = formatPriceDecimal2(rt?.bid ?? 0)
  const buyPrice = formatPriceDecimal2(rt?.ask ?? 0)
  const freeMargin = '19,375.84'

  const calculateMarginRequired = (): number => {
    const qty = Number.parseFloat(quantity) || 0
    const price =
      Number.parseFloat(transactionType === 'sell' ? sellPrice : buyPrice) || 0
    const contractSize = 100

    return (qty * contractSize * price) / leverage
  }

  const handleIncrement = (
    setter: (value: string) => void,
    value: string,
    step = 0.01,
  ) => {
    const numberValue = Number.parseFloat(value) || 0
    setter((numberValue + step).toFixed(2))
  }

  const handleDecrement = (
    setter: (value: string) => void,
    value: string,
    step = 0.01,
  ) => {
    const numberValue = Number.parseFloat(value) || 0
    if (numberValue > step) {
      setter((numberValue - step).toFixed(2))
    }
  }

  const handleTextChange = (setter: (value: string) => void, text: string) => {
    const cleaned = text.replaceAll(/[^\d.]/g, '')
    const parts = cleaned.split('.')
    if (parts.length > 2) {
      setter(parts[0] + '.' + parts.slice(1).join(''))
    } else {
      setter(cleaned)
    }
  }

  const formatNumber = (value: string): string => {
    const number_ = Number.parseFloat(value)

    return isNaN(number_) ? '0.00' : number_.toFixed(2)
  }

  const handleBlur = (setter: (value: string) => void, value: string) => {
    setter(formatNumber(value))
  }

  const handleTabPress = (item: string, index: number) => {
    setActiveTab(item)

    flatListReference.current?.scrollToIndex({
      animated: true,
      index,
      viewPosition: 0.5,
    })
  }

  // Set default limit price when switching to Buy Limit
  useEffect(() => {
    if (activeTab === 'Buy Limit' && !limitPrice) {
      const currentPrice = transactionType === 'sell' ? sellPrice : buyPrice
      setLimitPrice(currentPrice)
    }
  }, [activeTab])

  // Set default TP/SL values when enabled
  useEffect(() => {
    if (showTakeProfitStopLoss) {
      const currentPrice = Number.parseFloat(
        transactionType === 'sell' ? sellPrice : buyPrice,
      )
      if (!takeProfitValue || takeProfitValue === '0.00') {
        // TP is higher for buy, lower for sell
        const tpOffset = transactionType === 'buy' ? 50 : -50
        setTakeProfitValue((currentPrice + tpOffset).toFixed(2))
      }
      if (!stopLossValue || stopLossValue === '0.00') {
        // SL is lower for buy, higher for sell
        const slOffset = transactionType === 'buy' ? -50 : 50
        setStopLossValue((currentPrice + slOffset).toFixed(2))
      }
    }
  }, [showTakeProfitStopLoss])

  const handleSubmitOrder = () => {
    if (isCreatingOrder) return

    const qty = Number.parseFloat(quantity)
    if (!qty || qty <= 0) {
      showError('Please enter valid quantity')

      return
    }

    const isMarket = activeTab === 'Market Execution'
    const side = transactionType === 'sell' ? ORDER_SIDES.SELL : ORDER_SIDES.BUY
    const orderTypeCode = isMarket
      ? ORDER_TYPE_CODES.MARKET
      : ORDER_TYPE_CODES.LIMIT

    const payload: CreateOrderPayload = {
      accountId: selectedAccount?.id || '',
      leverage,
      orderType: orderTypeCode,
      quantity: qty,
      side,
      symbol: symbol,
      type: isMarket ? 'MARKET' : 'LIMIT',
    }

    if (isMarket) {
      if (takeProfitValue && takeProfitValue !== '0.00') {
        payload.takeProfitPrice = Number.parseFloat(takeProfitValue)
      }
      if (stopLossValue && stopLossValue !== '0.00') {
        payload.stopLossPrice = Number.parseFloat(stopLossValue)
      }
    } else {
      if (!limitPrice) {
        showError('Please enter limit price')

        return
      }
      payload.price = Number.parseFloat(limitPrice)

      if (takeProfitValue && takeProfitValue !== '0.00') {
        payload.takeProfitPrice = Number.parseFloat(takeProfitValue)
      }
      if (stopLossValue && stopLossValue !== '0.00') {
        payload.stopLossPrice = Number.parseFloat(stopLossValue)
      }
    }

    createOrder(payload, {
      onSuccess: () => {
        tradePanelRef.current?.close()
      },
    })
  }

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={(index) => {
          setCurrentSnapIndex(index)
        }}
        onDismiss={() => {
          setCurrentSnapIndex(-1)
        }}>
        <BottomSheetView style={{ flex: 1 }}>
          <ScrollView className='flex-1 py-10'>
            {/* Header */}
            <View className='flex-row items-center justify-between mb-2 px-4'>
              <View>
                <Text className='text-h3-semibold'>{symbol}</Text>
                <Text className='text-secondary-500 text-body-small-regular'>
                  {descSymbol}
                </Text>
              </View>
              <View className='flex-row gap-3'>
                <TouchableOpacity
                  className={`px-4 py-3 rounded items-center justify-center ${
                    isStopLossSelected
                      ? 'bg-error-500 border border-error-500'
                      : 'border border-error-500'
                  }`}
                  onPress={() => {
                    setIsStopLossSelected(!isStopLossSelected)
                  }}>
                  <Text
                    className={`text-body-large-medium ${
                      isStopLossSelected ? 'text-white' : 'text-error-500'
                    }`}>
                    SL
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`px-4 py-3 rounded items-center justify-center ${
                    isTakeProfitSelected
                      ? 'bg-success-500 border border-success-500'
                      : 'border border-success-500'
                  }`}
                  onPress={() => {
                    setIsTakeProfitSelected(!isTakeProfitSelected)
                  }}>
                  <Text
                    className={`text-body-large-medium ${
                      isTakeProfitSelected ? 'text-white' : 'text-success-500'
                    }`}>
                    TP
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Order Type Tabs */}
            <View className='mb-4 px-4'>
              <FlatList
                ref={flatListReference}
                horizontal
                // contentContainerStyle={{ paddingHorizontal: 4 }}
                data={TABS}
                keyExtractor={(item) => item}
                renderItem={({ index, item }) => (
                  <TouchableOpacity
                    style={{
                      // borderBottomColor:
                      //   activeTab === item
                      //     ? colorActiveMap[index]
                      //     : 'transparent',
                      // borderBottomWidth: 2,
                      marginRight: 12,
                      // paddingBottom: 8,
                    }}
                    onPress={() => {
                      handleTabPress(item, index)
                    }}>
                    <Text
                      className={`text-button-large-medium ${activeTab === item ? 'text-primary-500' : 'text-secondary-500'}`}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
                onScrollToIndexFailed={(info) => {
                  const wait = new Promise((resolve) =>
                    setTimeout(resolve, 500),
                  )

                  wait.then(() => {
                    flatListReference.current?.scrollToIndex({
                      animated: true,
                      index: info.index,
                    })
                  })
                }}
              />
            </View>

            {/* Quantity Input */}
            <View className='mb-4 px-4'>
              <View className='flex-row items-center gap-1'>
                <Text className='text-body-large-medium'>Quantity (Lot)</Text>
                <CircleAlert color={colors.secondary500} size={20} />
              </View>
              <View className='flex-row items-center justify-between'>
                <TextInput
                  className='text-3xl font-medium flex-1'
                  keyboardType='decimal-pad'
                  value={quantity}
                  onBlur={() => {
                    handleBlur(setQuantity, quantity)
                  }}
                  onChangeText={(text) => {
                    handleTextChange(setQuantity, text)
                  }}
                />
                <View className='flex-row gap-6'>
                  <TouchableOpacity
                    className='w-[40px] h-[40px] bg-neutral-100 dark:bg-gray-700 items-center justify-center rounded'
                    onPress={() => {
                      handleIncrement(setQuantity, quantity)
                    }}>
                    <Text className='text-2xl'>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className='w-[40px] h-[40px] bg-neutral-100 dark:bg-gray-700 items-center justify-center rounded'
                    onPress={() => {
                      handleDecrement(setQuantity, quantity)
                    }}>
                    <Text className='text-2xl'>−</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Margin Info */}
            <View className='flex-row justify-between px-4'>
              <View>
                <View className='flex-row items-center gap-1'>
                  <Text className='text-secondary-500 text-body-small-regular mb-1'>
                    Margin Required
                  </Text>
                  <CircleAlert color={colors.secondary500} size={16} />
                </View>
                <Text className='text-body-large-medium text-neutral-900'>
                  {calculateMarginRequired().toFixed(2)}
                </Text>
              </View>
              <View className='items-end'>
                <View>
                  <Text className='text-secondary-500 text-body-small-regular mb-1'>
                    Free
                  </Text>
                </View>
                <Text className='text-body-large-medium text-neutral-900'>
                  {freeMargin}
                </Text>
              </View>
            </View>

            <View className='border-b border-neutral-200 my-4 mx-4' />

            {/* 3 Tabs Section */}
            <View className='px-4'>
              <View className='flex-row mb-2 bg-neutral-100 rounded'>
                {INFO_TABS.map((tabLabel, index) => {
                  const isActive = infoActiveTabIndex === index

                  return (
                    <TouchableOpacity
                      key={tabLabel}
                      className={`flex-1 items-center py-2 ${
                        isActive ? ' bg-primary-100 rounded' : ''
                      }`}
                      onPress={() => {
                        setInfoActiveTabIndex(index)
                      }}>
                      <Text
                        className={` text-body-small-regular ${
                          isActive ? 'text-primary-500' : 'text-secondary-500'
                        }`}>
                        {tabLabel}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>

              {/* Content dưới list tab */}
              {infoActiveTabIndex === 0 && (
                <View className='flex-row gap-2'>
                  {/* Take Profit Input */}
                  <View className='flex-1 flex-row items-center justify-between border-neutral-200 border rounded-lg px-4'>
                    <Text className='text-body-small-regular text-neutral-500 dark:text-gray-400'>
                      T/P
                    </Text>
                    <TextInput
                      className='text-body-large-medium text-right flex-1 ml-2'
                      keyboardType='decimal-pad'
                      placeholder='0.00'
                      placeholderTextColor={colors.neutral400}
                      value={takeProfitValue}
                      onBlur={() => {
                        handleBlur(setTakeProfitValue, takeProfitValue)
                      }}
                      onChangeText={(text) => {
                        handleTextChange(setTakeProfitValue, text)
                      }}
                    />
                  </View>

                  {/* Stop Loss Input */}
                  <View className='flex-1 flex-row items-center justify-between border-neutral-200 border rounded-lg px-4'>
                    <Text className='text-body-small-regular text-neutral-500 dark:text-gray-400'>
                      S/L
                    </Text>
                    <TextInput
                      className='text-body-large-medium text-right flex-1 ml-2'
                      keyboardType='decimal-pad'
                      placeholder='0.00'
                      placeholderTextColor={colors.neutral400}
                      value={stopLossValue}
                      onBlur={() => {
                        handleBlur(setStopLossValue, stopLossValue)
                      }}
                      onChangeText={(text) => {
                        handleTextChange(setStopLossValue, text)
                      }}
                    />
                  </View>
                </View>
              )}
              {infoActiveTabIndex === 1 && (
                <View>
                  <Text className='text-body-medium text-neutral-700'>
                    Nội dung Tab 2
                  </Text>
                </View>
              )}
              {infoActiveTabIndex === 2 && (
                <View>
                  <Text className='text-body-medium text-neutral-700'>
                    Nội dung Tab 3
                  </Text>
                </View>
              )}

              {/* Limit Price - Only for Buy Limit */}
              {activeTab === 'Buy Limit' && (
                <View className='mt-4 mb-4'>
                  <View className='flex-row items-center mb-2'>
                    <Text className='text-body-medium'>Limit Price</Text>
                    <Text className='text-gray-400 ml-1'>ⓘ</Text>
                  </View>
                  <View className='flex-row items-center justify-between'>
                    <TextInput
                      className='text-3xl font-medium flex-1'
                      keyboardType='decimal-pad'
                      placeholder={
                        transactionType === 'sell' ? sellPrice : buyPrice
                      }
                      value={limitPrice}
                      onBlur={() => {
                        handleBlur(setLimitPrice, limitPrice)
                      }}
                      onChangeText={(text) => {
                        handleTextChange(setLimitPrice, text)
                      }}
                    />
                    <View className='flex-row gap-6'>
                      <TouchableOpacity
                        className='w-[40px] h-[40px] bg-neutral-100 dark:bg-gray-700 items-center justify-center rounded'
                        onPress={() => {
                          handleIncrement(setLimitPrice, limitPrice, 0.1)
                        }}>
                        <Text className='text-2xl'>+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className='w-[40px] h-[40px] bg-neutral-100 dark:bg-gray-700 items-center justify-center rounded'
                        onPress={() => {
                          handleDecrement(setLimitPrice, limitPrice, 0.1)
                        }}>
                        <Text className='text-2xl'>−</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Chart Mini */}

            <View className='h-[200px] border-t border-neutral-200 mt-4'>
              <ChartCommon symbol={symbol} isChartMini={true} />
            </View>

            {/* Sell/Buy Buttons */}
            <View className='flex-row gap-3 mt-5 px-4'>
              <ButtonCustom
                disabled={isCreatingOrder}
                type='SELL'
                onPress={() => {
                  setTransactionType('sell')
                  handleSubmitOrder()
                }}>
                <Text className='text-lg font-semibold text-white'>Sell</Text>
              </ButtonCustom>

              <ButtonCustom
                disabled={isCreatingOrder}
                type='BUY'
                onPress={() => {
                  setTransactionType('buy')
                  handleSubmitOrder()
                }}>
                <Text className='text-md font-semibold text-white'>Buy</Text>
              </ButtonCustom>
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Leverage Modal */}
      <AppBottomSheetModal ref={marginReference} snapPoints={['100%']}>
        <View className='px-5 pb-10'>
          <Text className='text-xl font-semibold  mb-5 text-center'>
            Select Leverage
          </Text>
          {marginOptions.map((option) => {
            const qty = Number.parseFloat(quantity) || 0
            const price = Number.parseFloat(
              transactionType === 'sell' ? sellPrice : buyPrice || '0',
            )
            const contractSize = 100
            const marginRequired = (
              (qty * contractSize * price) /
              option.leverage
            ).toFixed(2)

            return (
              <TouchableOpacity
                key={option.leverage}
                className='py-4 border-b border-gray-100 flex-row items-center justify-between'
                onPress={() => {
                  setLeverage(option.leverage)
                  marginReference.current?.close()
                }}>
                <View>
                  <Text
                    className={`text-lg font-semibold ${
                      leverage === option.leverage ? 'text-primary-500' : ''
                    }`}>
                    {option.label}
                  </Text>
                  <Text className='text-sm text-gray-500 mt-1'>
                    Margin: ${marginRequired}
                  </Text>
                </View>
                {leverage === option.leverage && (
                  <Check color={colors.primary500} size={18} />
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </AppBottomSheetModal>
    </>
  )
}

export default TradePanel
