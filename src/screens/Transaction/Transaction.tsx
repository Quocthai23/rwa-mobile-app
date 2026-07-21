import { Check, ChevronDown, ChevronLeft } from 'lucide-react-native'
import { useRef, useState } from 'react'
import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ToggleFavouriteAsset } from '@/components/atoms'
import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import ChartCommon from '@/components/chart/ChartCommon'
import ChartIcon from '@/components/icons/ChartIcon'
import { ORDER_SIDES, ORDER_TYPE_CODES } from '@/constants/order'
import { useCreateOrder } from '@/hooks/orders/useCreateOrder'
import { useToast } from '@/hooks/useToast'
import { type Paths } from '@/navigation/paths'
import { type RootScreenProps } from '@/navigation/types'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { type CreateOrderPayload } from '@/types/orders'
import { formatPriceDecimal2 } from '@/utils/currency'
import ButtonCustom from '@/components/atoms/Button/ButtonCustom'
import { useAccountStore } from '@/store/useAccountStore'
import useTheme from '@/theme/hooks/useTheme'

const ordersOptions = [
  {
    desc: 'Buy or sell at the latest price.',
    label: 'Market Execution',
  },
  {
    desc: 'Buy or sell at a specific price or better.',
    label: 'Limit Order',
  },
  {
    desc: 'Buy or sell once the price reaches the specified stop price.',
    label: 'Stop Limit Order',
  },
]

const triggerOptions = [
  {
    desc: 'Set a specific price level to automatically execute your Take Profit or Stop Loss orders.',
    label: 'Price',
  },
  {
    desc: 'Set a specific number of pips from your entry price to trigger a Take Profit or Stop Loss.',
    label: 'Pips',
  },
  {
    desc: 'Set a percentage-based price movement from your entry point to trigger your orders.',
    label: 'Change(%)',
  },
]

const marginOptions = [
  { label: '1x', leverage: 1 },
  { label: '2x', leverage: 2 },
  { label: '5x', leverage: 5 },
  { label: '10x', leverage: 10 },
  { label: '50x', leverage: 50 },
  { label: '100x', leverage: 100 },
]

type Props = RootScreenProps<Paths.Transaction>

function Transaction({ navigation, route }: Props) {
  const { assetId, symbol, type } = route.params
  const [transactionType, setTransactionType] = useState<string>(type)
  const rt = useMarketSocketStore((s) => s.rtBySymbol?.[symbol])
  const { showError } = useToast()
  const [isShowChart, setIsShowChart] = useState(false)

  //   const symbolTrade = useTransactionStore((state) => state.symbolTrade);

  const orderTypeReference = useRef<AppBottomSheetModalHandle>(null)
  const takeProfitTriggerReference = useRef<AppBottomSheetModalHandle>(null)
  const stopLossTriggerReference = useRef<AppBottomSheetModalHandle>(null)
  const marginReference = useRef<AppBottomSheetModalHandle>(null)

  const { isPending: isCreatingOrder, mutate: createOrder } = useCreateOrder()

  const [orderType, setOrderType] = useState('Market Execution')
  const [quantity, setQuantity] = useState('0.01')
  const [leverage, setLeverage] = useState(100)
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false)
  const [stopLossEnabled, setStopLossEnabled] = useState(false)
  const [trailingStopEnabled, setTrailingStopEnabled] = useState(false)

  const sellPrice = formatPriceDecimal2(rt?.bid ?? 0)
  const buyPrice = formatPriceDecimal2(rt?.ask ?? 0)
  const { colors } = useTheme()

  const calculateDefaultTP = (type: string): string => {
    const price =
      type === 'sell'
        ? Number.parseFloat(sellPrice)
        : Number.parseFloat(buyPrice)
    if (!price) return '0.00'

    // Buy: TP > giá mua, Sell: TP < giá bán
    const tpPrice = type === 'buy' ? price + 10 : price - 10

    return tpPrice.toFixed(2)
  }

  const calculateDefaultSL = (type: string): string => {
    const price =
      type === 'sell'
        ? Number.parseFloat(sellPrice)
        : Number.parseFloat(buyPrice)
    if (!price) return '0.00'

    // Buy: SL < giá mua, Sell: SL > giá bán
    const slPrice = type === 'buy' ? price - 10 : price + 10

    return slPrice.toFixed(2)
  }

  const [takeProfitTrigger, setTakeProfitTrigger] = useState('Price')
  const [takeProfitValue, setTakeProfitValue] = useState(() =>
    calculateDefaultTP(type),
  )
  const [stopLossTrigger, setStopLossTrigger] = useState('Price')
  const [stopLossValue, setStopLossValue] = useState(() =>
    calculateDefaultSL(type),
  )
  const [trailingStopValue, setTrailingStopValue] = useState('66')
  const selectedAccount = useAccountStore((s) => s.selectedAccount)
  const [limitPrice, setLimitPrice] = useState(() => {
    const currentPrice = transactionType === 'sell' ? rt?.bid : rt?.ask

    return currentPrice ? formatPriceDecimal2(currentPrice) : ''
  })
  const freeMargin = '19,375.84'

  const formatNumber = (value: string): string => {
    const number_ = Number.parseFloat(value)

    return isNaN(number_) ? '0.00' : number_.toFixed(2)
  }

  const calculateMarginRequired = (): number => {
    const qty = Number.parseFloat(quantity) || 0
    const price =
      Number.parseFloat(transactionType === 'sell' ? sellPrice : buyPrice) || 0
    const contractSize = 100 // Standard contract size (100 oz for gold, etc)

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
    // Allow only numbers and one decimal point
    const cleaned = text.replaceAll(/[^\d.]/g, '')
    const parts = cleaned.split('.')
    if (parts.length > 2) {
      setter(parts[0] + '.' + parts.slice(1).join(''))
    } else {
      setter(cleaned)
    }
  }

  const handleSubmitOrder = () => {
    if (isCreatingOrder) return

    const qty = Number.parseFloat(quantity)
    if (!qty || qty <= 0) {
      showError('Please enter valid quantity')

      return
    }

    const isMarket = orderType === 'Market Execution'
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
      symbol,
      type: isMarket ? 'MARKET' : 'LIMIT',
    }

    // Only add SL/TP for market orders or if enabled
    if (isMarket) {
      if (takeProfitEnabled && takeProfitValue) {
        payload.takeProfitPrice = Number.parseFloat(takeProfitValue)
      }
      if (stopLossEnabled && stopLossValue) {
        payload.stopLossPrice = Number.parseFloat(stopLossValue)
      }
    } else {
      // Limit order requires price
      if (!limitPrice) {
        showError('Please enter limit price')

        return
      }
      payload.price = Number.parseFloat(limitPrice)

      if (takeProfitEnabled && takeProfitValue) {
        payload.takeProfitPrice = Number.parseFloat(takeProfitValue)
      }
      if (stopLossEnabled && stopLossValue) {
        payload.stopLossPrice = Number.parseFloat(stopLossValue)
      }
    }

    createOrder(payload, {
      onSuccess: () => {
        navigation.goBack()
      },
    })
  }

  const handleBlur = (setter: (value: string) => void, value: string) => {
    setter(formatNumber(value))
  }

  return (
    <SafeAreaView className='flex-1 bg-neutral-0'>
      {/* Header - Fixed */}
      <View className='flex-row items-center justify-between px-4 py-3 border-b border-neutral-100'>
        <View className='flex-row items-center'>
          <TouchableOpacity
            className='p-1'
            onPress={() => {
              navigation.goBack()
            }}>
            <ChevronLeft color={colors.neutral900} size={28} />
          </TouchableOpacity>
          <View className='ml-3'>
            <Text className='text-h3-semibold'>{symbol}</Text>
            <Text className='text-body-small-regular text-neutral-500'>
              {symbol}
            </Text>
          </View>
        </View>

        <ToggleFavouriteAsset assetId={assetId || ''} size={18} />
      </View>

      <ScrollView className='flex-1'>
        {/* Price */}
        <View className='flex-row items-center justify-between p-4 pb-2'>
          <Text
            className={`text-h2-semibold ${rt.change > 0 ? 'text-success-500' : 'text-error-500'}`}>
            {transactionType === 'sell' ? sellPrice : buyPrice}{' '}
            <Text className='text-body-small-regular text-neutral-500'>
              {transactionType === 'sell' ? 'Sell Price' : 'Buy Price'}
            </Text>
          </Text>

          <TouchableOpacity
            onPress={() => {
              setIsShowChart((pre) => !pre)
            }}>
            <ChartIcon
              strokeColor={isShowChart ? colors.primary500 : colors.neutral700}
            />
          </TouchableOpacity>
        </View>

        {isShowChart ? (
          <View className='h-[300px]'>
            <ChartCommon
              assetId={assetId}
              isShowBuyCell={false}
              isShowSelectSymbol={false}
              symbol={symbol}
            />
          </View>
        ) : null}

        {/* Buy/Sell Toggle */}
        <View className='flex-row mx-4 mt-4 p-1 gap-2'>
          <TouchableOpacity
            className={`flex-1 h-[40px] flex-row justify-center items-center rounded-[4px]  ${
              transactionType === 'sell'
                ? 'bg-error-50 border-error-50'
                : 'bg-neutral-200'
            }`}
            onPress={() => {
              setTransactionType('sell')
              setTakeProfitValue(calculateDefaultTP('sell'))
              setStopLossValue(calculateDefaultSL('sell'))
            }}>
            <Text
              className={`text-body-medium ${
                transactionType === 'sell'
                  ? 'text-error-500'
                  : 'text-neutral-500'
              }`}>
              Sell
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 h-[40px] flex-row justify-center items-center rounded-[4px]  ${
              transactionType === 'buy' ? 'bg-success-50' : 'bg-neutral-200'
            }`}
            onPress={() => {
              setTransactionType('buy')
              setTakeProfitValue(calculateDefaultTP('buy'))
              setStopLossValue(calculateDefaultSL('buy'))
            }}>
            <Text
              className={`text-body-medium font-medium ${
                transactionType === 'buy'
                  ? 'text-success-500'
                  : 'text-neutral-500'
              }`}>
              Buy
            </Text>
          </TouchableOpacity>
        </View>

        {/* <Pressable onPress={() => setT((pre) => (pre == 'b' ? 's' : 'b'))}>
          <Text>{t}</Text>
        </Pressable> */}

        {/* Order Type */}
        <View className='px-4 mt-5'>
          <View className='flex-row items-center justify-between'>
            <Text className='text-body-medium text-neutral-500'>
              Order Type
            </Text>
            <TouchableOpacity
              className='flex-row items-center gap-2 px-3 py-1.5'
              onPress={() => orderTypeReference.current?.open()}>
              <Text className='text-body-medium text-neutral-900'>
                {orderType}
              </Text>
              <ChevronDown />
            </TouchableOpacity>
          </View>
        </View>

        {/* Limit Price - Only show for Limit Order */}
        {orderType === 'Limit Order' && (
          <View className='px-4 mt-5'>
            <View className='flex-row items-center mb-2'>
              <Text className='text-body-medium mr-1'>Limit Price</Text>
              <Text className='text-body-medium text-neutral-500 ml-1'>ⓘ</Text>
            </View>
            <View className='flex-row items-center justify-between rounded-lg py-3'>
              <TextInput
                className='text-3xl font-medium text-neutral-900'
                keyboardType='decimal-pad'
                placeholder={transactionType === 'sell' ? sellPrice : buyPrice}
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
                  className='w-[40px] rounded-[4px] aspect-square bg-neutral-100 items-center justify-center'
                  onPress={() => {
                    handleIncrement(setLimitPrice, limitPrice, 0.1)
                  }}>
                  <Text className='text-2xl text-neutral-900'>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className='w-[40px] rounded-[4px] aspect-square bg-neutral-100 items-center justify-center'
                  onPress={() => {
                    handleDecrement(setLimitPrice, limitPrice, 0.1)
                  }}>
                  <Text className='text-h1-regular text-neutral-900'>−</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Quantity */}
        <View className='px-4 mt-5'>
          <View className='flex-row items-center mb-2'>
            <Text className='text-body-medium mr-1'>Quantity (Lot)</Text>
            <Text className='text-body-medium text-neutral-500 ml-1'>ⓘ</Text>
          </View>
          <View className='flex-row items-center justify-between rounded-lg py-3'>
            <TextInput
              className='text-3xl font-medium text-neutral-900'
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
                className='w-[40px] rounded-[4px] aspect-square bg-neutral-100 items-center justify-center'
                onPress={() => {
                  handleIncrement(setQuantity, quantity)
                }}>
                <Text className='text-h1-regular text-neutral-900'>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='w-[40px] rounded-[4px] aspect-square bg-neutral-100 items-center justify-center'
                onPress={() => {
                  handleDecrement(setQuantity, quantity)
                }}>
                <Text className='text-h1-regular text-neutral-900'>−</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Leverage Selector */}
        <View className='px-4 mt-5'>
          <View className='flex-row items-center justify-between'>
            <Text className='text-body-medium text-neutral-500'>Leverage</Text>
            <TouchableOpacity
              className='flex-row items-center gap-2 px-3 py-1.5'
              onPress={() => marginReference.current?.open()}>
              <Text className='text-body-regular text-neutral-900'>
                {leverage}x
              </Text>
              <ChevronDown />
            </TouchableOpacity>
          </View>
        </View>

        {/* Margin Info */}
        <View className='px-4 mt-3'>
          <View className='flex-row justify-between'>
            <View>
              <View className='flex-row items-center'>
                <Text className='text-neutral-500 mb-1'>Margin Required</Text>
                <Text className='text-body-medium text-neutral-500 ml-1 -mt-[6px]'>
                  ⓘ
                </Text>
              </View>
              <Text className='text-body-small-regular font-medium '>
                ${calculateMarginRequired().toFixed(2)}
              </Text>
            </View>
            <View className='items-end'>
              <Text className=' text-neutral-500 mb-1'>Free</Text>
              <Text className='text-body-small-regular font-medium '>
                {freeMargin}
              </Text>
            </View>
          </View>
        </View>

        {/* Take Profit */}
        <View className='px-4 mt-5 pt-5 border-t border-neutral-100'>
          <View className='flex-row items-center justify-between mb-3 pr-4'>
            <Text className='text-body-medium'>Take Profit</Text>
            <Switch
              thumbColor={colors.neutral0}
              trackColor={{ false: colors.neutral200, true: colors.primary500 }}
              value={takeProfitEnabled}
              onValueChange={setTakeProfitEnabled}
            />
          </View>

          {takeProfitEnabled ? (
            <>
              <View className='flex-row items-center justify-between mb-3'>
                <Text className=' text-neutral-500'>Trigger</Text>
                <TouchableOpacity
                  className='flex-row items-center gap-2 px-3 py-1'
                  onPress={() => takeProfitTriggerReference.current?.open()}>
                  <Text className='text-body-medium text-neutral-900'>
                    {takeProfitTrigger}
                  </Text>
                  <ChevronDown />
                </TouchableOpacity>
              </View>

              <View className='flex-row items-center justify-between rounded-lg py-3'>
                <TextInput
                  className='text-h2-medium font-medium text-neutral-900'
                  keyboardType='decimal-pad'
                  value={takeProfitValue}
                  onBlur={() => {
                    handleBlur(setTakeProfitValue, takeProfitValue)
                  }}
                  onChangeText={(text) => {
                    handleTextChange(setTakeProfitValue, text)
                  }}
                />
                <View className='flex-row gap-6'>
                  <TouchableOpacity
                    className='w-[40px] aspect-square bg-neutral-100 items-center justify-center'
                    onPress={() => {
                      handleIncrement(setTakeProfitValue, takeProfitValue)
                    }}>
                    <Text className='text-h1-regular text-neutral-900'>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className='w-[40px] aspect-square bg-neutral-100 items-center justify-center'
                    onPress={() => {
                      handleDecrement(setTakeProfitValue, takeProfitValue)
                    }}>
                    <Text className='text-h1-regular text-neutral-900'>−</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : null}
        </View>

        {/* Stop Loss */}
        <View className='px-4 mt-5 pt-5 border-t border-neutral-100'>
          <View className='flex-row items-center justify-between mb-3 pr-4'>
            <Text className='text-body-medium'>Stop Loss</Text>
            <Switch
              thumbColor={colors.neutral0}
              trackColor={{ false: colors.neutral200, true: colors.primary500 }}
              value={stopLossEnabled}
              onValueChange={setStopLossEnabled}
            />
          </View>

          {stopLossEnabled ? (
            <>
              <View className='flex-row items-center justify-between mb-3'>
                <Text className=' text-neutral-500'>Trigger</Text>
                <TouchableOpacity
                  className='flex-row items-center gap-2 px-3 py-1'
                  onPress={() => stopLossTriggerReference.current?.open()}>
                  <Text className='text-body-medium text-neutral-900'>
                    {stopLossTrigger}
                  </Text>
                  <ChevronDown />
                </TouchableOpacity>
              </View>

              <View className='flex-row items-center justify-between rounded-lg py-3'>
                <TextInput
                  className='text-h2-medium text-neutral-900'
                  keyboardType='decimal-pad'
                  value={stopLossValue}
                  onBlur={() => {
                    handleBlur(setStopLossValue, stopLossValue)
                  }}
                  onChangeText={(text) => {
                    handleTextChange(setStopLossValue, text)
                  }}
                />
                <View className='flex-row gap-6'>
                  <TouchableOpacity
                    className='w-[40px] aspect-square bg-neutral-100 items-center justify-center'
                    onPress={() => {
                      handleIncrement(setStopLossValue, stopLossValue)
                    }}>
                    <Text className='text-h1-regular text-neutral-900'>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className='w-[40px] aspect-square bg-neutral-100 items-center justify-center'
                    onPress={() => {
                      handleDecrement(setStopLossValue, stopLossValue)
                    }}>
                    <Text className='text-h1-regular text-neutral-900'>−</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : null}
        </View>

        {/* Trailing Stop */}
        <View className='px-4 mt-5 pt-5 border-t border-neutral-100'>
          <View className='flex-row items-center justify-between mb-3 pr-4'>
            <View className='flex-row items-center'>
              <Text className='text-body-medium'>Trailing Stop</Text>
              <Text className='text-body-medium text-neutral-500 ml-1'>ⓘ</Text>
            </View>
            <Switch
              thumbColor={colors.neutral0}
              trackColor={{ false: colors.neutral200, true: colors.primary500 }}
              value={trailingStopEnabled}
              onValueChange={setTrailingStopEnabled}
            />
          </View>

          {trailingStopEnabled ? (
            <>
              <View className='flex-row items-center justify-between rounded-lg py-3'>
                <View className='flex-row items-center gap-2'>
                  <TextInput
                    className='text-h2-medium text-neutral-900'
                    keyboardType='number-pad'
                    value={trailingStopValue}
                    onChangeText={(text) => {
                      setTrailingStopValue(text.replaceAll(/\D/g, ''))
                    }}
                  />
                  <Text className='text-neutral-500'>points</Text>
                </View>
                <View className='flex-row gap-6'>
                  <TouchableOpacity
                    className='w-[40px] aspect-square bg-neutral-100 items-center justify-center'
                    onPress={() => {
                      setTrailingStopValue(
                        (
                          (Number.parseInt(trailingStopValue) || 0) + 1
                        ).toString(),
                      )
                    }}>
                    <Text className='text-h1-regular text-neutral-900'>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className='w-[40px] aspect-square bg-neutral-100 items-center justify-center'
                    onPress={() => {
                      const value = Number.parseInt(trailingStopValue) || 0
                      if (value > 1)
                        setTrailingStopValue((value - 1).toString())
                    }}>
                    <Text className='text-h1-regular text-neutral-900'>−</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text className=' text-neutral-500 mt-2'>
                Estimated P/L: USD -80,20
              </Text>
            </>
          ) : null}
        </View>

        {/* Submit Button */}
        {/* <TouchableOpacity
          className={`mx-4 mt-6 rounded-lg py-4 items-center ${
            transactionType === 'buy' ? 'bg-green-500' : 'bg-red-500'
          } ${isCreatingOrder ? 'opacity-50' : ''}`}
          disabled={isCreatingOrder}
          onPress={handleSubmitOrder}>
          <Text className='text-lg font-semibold text-white'>
            {isCreatingOrder
              ? 'Processing...'
              : transactionType === 'sell'
                ? 'Sell'
                : 'Buy'}
          </Text>
        </TouchableOpacity> */}
        <ButtonCustom
          type={transactionType === 'buy' ? 'BUY' : 'SELL'}
          className='mx-4 mt-6'
          onPress={handleSubmitOrder}
          disabled={isCreatingOrder}
          isLoading={isCreatingOrder}></ButtonCustom>

        <View className='h-10' />
      </ScrollView>

      {/* Order Type Modal */}
      <AppBottomSheetModal ref={orderTypeReference}>
        <View className='px-5 pb-10'>
          <Text className='text-h2-semibold text-neutral-900 mb-5 text-center'>
            Order Type
          </Text>
          {ordersOptions.map((option) => (
            <TouchableOpacity
              key={option.label}
              className='py-3 gap-1'
              onPress={() => {
                setOrderType(option.label)
                orderTypeReference.current?.close()
              }}>
              <TouchableOpacity className='flex-row items-center justify-between '>
                <Text
                  className={`text-body-medium ${
                    orderType === option.label
                      ? 'text-primary-500 font-semibold '
                      : 'text-neutral-900'
                  }`}>
                  {option.label}
                </Text>
                {orderType === option.label && (
                  <Check color={colors.primary500} />
                )}
              </TouchableOpacity>
              <Text className='text-secondary'>{option.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </AppBottomSheetModal>

      {/* Take Profit Trigger Modal */}
      <AppBottomSheetModal ref={takeProfitTriggerReference}>
        <View className='px-5 pb-10'>
          <Text className='text-h2-semibold text-neutral-900 mb-5 text-center'>
            Trigger
          </Text>
          {triggerOptions.map((option) => (
            <View key={option.label} className='py-3 gap-1'>
              <TouchableOpacity
                className='flex-row items-center justify-between'
                onPress={() => {
                  setTakeProfitTrigger(option.label)
                  takeProfitTriggerReference.current?.close()
                }}>
                <Text
                  className={`text-body-medium ${
                    takeProfitTrigger === option.label
                      ? 'text-primary-500 font-semibold'
                      : 'text-neutral-900'
                  }`}>
                  {option.label}
                </Text>
                {takeProfitTrigger === option.label && (
                  <Check color={colors.primary500} />
                )}
              </TouchableOpacity>
              <Text className='text-secondary'>{option.desc}</Text>
            </View>
          ))}
        </View>
      </AppBottomSheetModal>

      {/* Stop Loss Trigger Modal */}
      <AppBottomSheetModal ref={stopLossTriggerReference}>
        <View className='px-5 pb-10'>
          <Text className='text-h2-semibold text-neutral-900 mb-5 text-center'>
            Trigger
          </Text>
          {triggerOptions.map((option) => (
            <View key={option.label} className='py-3 gap-1'>
              <TouchableOpacity
                className='flex-row items-center justify-between'
                onPress={() => {
                  setStopLossTrigger(option.label)
                  stopLossTriggerReference.current?.close()
                }}>
                <Text
                  className={`text-body-medium ${
                    stopLossTrigger === option.label
                      ? 'text-primary-500 font-semibold'
                      : 'text-neutral-900'
                  }`}>
                  {option.label}
                </Text>
                {stopLossTrigger === option.label && (
                  <Check color={colors.primary500} />
                )}
              </TouchableOpacity>
              <Text className='text-secondary'>{option.desc}</Text>
            </View>
          ))}
        </View>
      </AppBottomSheetModal>

      {/* Margin/Leverage Modal */}
      <AppBottomSheetModal ref={marginReference}>
        <View className='px-5 pb-10'>
          <Text className='text-h2-semibold text-neutral-900 mb-5 text-center'>
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
                className='py-4 border-b border-neutral-100 flex-row items-center justify-between'
                onPress={() => {
                  setLeverage(option.leverage)
                  marginReference.current?.close()
                }}>
                <View>
                  <Text
                    className={`text-lg font-semibold ${
                      leverage === option.leverage
                        ? 'text-primary-500'
                        : 'text-neutral-900'
                    }`}>
                    {option.label}
                  </Text>
                  <Text className='text-sm text-neutral-500 mt-1'>
                    Margin: ${marginRequired}
                  </Text>
                </View>
                {leverage === option.leverage && (
                  <Check color={colors.primary500} />
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      </AppBottomSheetModal>
    </SafeAreaView>
  )
}

export default Transaction
