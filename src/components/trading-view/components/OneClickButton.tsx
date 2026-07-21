import { ChevronDown, ChevronUp } from 'lucide-react-native'
import React, { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'

import { sanitizeDecimalInput } from '@/components/chart/helpers/helpers'
import { ORDER_SIDES, ORDER_TYPE_CODES } from '@/constants/order'
import { useAppNavigation } from '@/hooks'
import { useCreateOrder } from '@/hooks/orders/useCreateOrder'
import { Paths } from '@/navigation/paths'
import MT5PriceText from '@/screens/Market/components/MT5PriceText'
import { useAuthStore } from '@/store/authStore'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useTransactionStore } from '@/store/transactionStore'
import { useAccountStore } from '@/store/useAccountStore'
import { useTheme } from '@/theme'

const OneClickButton = ({ symbol }: { symbol: string }) => {
  const navigation = useAppNavigation()
  const { colors } = useTheme()
  const user = useAuthStore((s) => s.user)
  const selectedAccount = useAccountStore((s) => s.selectedAccount)
  const isShowQuickTrade = useTransactionStore(
    (state) => state.isShowQuickTrade,
  )
  const { isPending, mutateAsync: createOrder } = useCreateOrder()
  const [showDecreaseMenu, setShowDecreaseMenu] = useState(false)
  const [showIncreaseMenu, setShowIncreaseMenu] = useState(false)
  const [volume, setVolume] = useState(0.01)
  const [volumeText, setVolumeText] = useState('0.01')
  const bid = useMarketSocketStore((s) => s.rtBySymbol?.[symbol]?.bid)
  const ask = useMarketSocketStore((s) => s.rtBySymbol?.[symbol]?.ask)

  const handleOrder = async (
    side: (typeof ORDER_SIDES)[keyof typeof ORDER_SIDES],
    orderType: (typeof ORDER_TYPE_CODES)[keyof typeof ORDER_TYPE_CODES],
  ) => {
    if (isPending) return
    if (!symbol) return
    if (volume <= 0 || !volumeText) {
      Toast.show({
        text1: 'Invalid Volume',
        type: 'error',
      })

      return
    }
    try {
      console.log('createOrder', {
        accountId: selectedAccount?.id || '',
        leverage: 100,
        orderType: orderType,
        quantity: volume,
        side: side,
        symbol: symbol,
        type: orderType === ORDER_TYPE_CODES.MARKET ? 'MARKET' : 'LIMIT',
      })

      const res = await createOrder({
        accountId: selectedAccount?.id || '',
        leverage: 100,
        orderType: orderType,
        quantity: volume,
        side: side,
        symbol: symbol,
        // type: orderType === ORDER_TYPE_CODES.MARKET ? 'MARKET' : 'LIMIT',
      })

      console.log(res.orderId, res.status)
    } catch (error) {
      console.error(error)
    }
  }

  const onOrderPress = (
    side: (typeof ORDER_SIDES)[keyof typeof ORDER_SIDES],
  ) => {
    if (!user) {
      navigation.navigate(Paths.Login)

      return
    }
    handleOrder(side, ORDER_TYPE_CODES.MARKET)

    // if (quickBuy) {
    //   // addDemoOrder('buy');
    //   handleOrder(side, ORDER_TYPE_CODES.MARKET)

    //   return
    // }

    // navigation.navigate(Paths.Transaction, {
    //   assetId,
    //   symbol: currentSymbol,
    //   type: side === ORDER_SIDES.BUY ? 'buy' : 'sell',
    // })
  }
  const handleChangeText = useCallback(
    (text: string) => {
      const next = sanitizeDecimalInput(text)

      setVolumeText((previous) => (previous === next ? previous : next))
    },
    [setVolumeText],
  )

  const handleBlur = useCallback(() => {
    setVolumeText((t) => {
      const s = t.trim()
      if (s === '' || s === '.') return volume.toFixed(2)

      const n = Number(s)
      if (Number.isFinite(n) && n > 0) {
        setVolume(n)

        return n.toFixed(2)
      }

      return volume.toFixed(2)
    })
  }, [volume, setVolume, setVolumeText])

  const handleFocus = useCallback(() => {
    setShowDecreaseMenu(false)
    setShowIncreaseMenu(false)
  }, [setShowDecreaseMenu, setShowIncreaseMenu])
  // Calculate increment/decrement options based on volume
  const getIncrementOptions = () => {
    const currentVol = Number.parseFloat(volumeText) || volume
    if (currentVol <= 1) {
      return [0.01, 0.1, 0.5]
    } else if (currentVol < 10) {
      return [0.1, 1, 5]
    } else {
      return [0.1, 1, 10]
    }
  }

  // Calculate quick select options based on volume
  const getQuickSelectOptions = () => {
    const currentVol = Number.parseFloat(volumeText) || volume
    if (currentVol <= 1) {
      // 0.1 steps from 1.1 to 2.0
      const options = []
      for (let index = 11; index <= 20; index++) {
        options.push(index / 10)
      }

      return options
    } else if (currentVol < 10) {
      // 1 step increments, show 10 numbers starting from next integer
      const start = Math.ceil(currentVol)
      const options = []
      for (let index = 0; index < 10; index++) {
        options.push(start + index)
      }

      return options
    } else {
      // Multiples of 5 from next multiple of 5 up to 100
      const nextMultiple = Math.ceil(currentVol / 5) * 5
      const options = []
      for (let index = nextMultiple; index <= 100; index += 5) {
        options.push(index)
      }

      return options
    }
  }
  if (!isShowQuickTrade) return null

  return (
    <View className='flex-row items-center h-[48px]'>
      {/* Sell Button */}
      <TouchableOpacity
        className={`bg-error-500 items-center justify-center flex-row h-full relative w-1/3 gap-2`}
        onPress={() => {
          //   if (openTradePanelOnBuySell) {
          //     setSymbolTrade(currentSymbol)
          //     tradePanelReference.current?.open('buySell')
          //   } else {
          //     onOrderPress(ORDER_SIDES.SELL)
          //   }
          onOrderPress(ORDER_SIDES.SELL)
        }}>
        {isPending ? (
          <View className='absolute inset-0 flex-row items-center justify-center'>
            <ActivityIndicator className='' color='#fff' size='small' />
          </View>
        ) : null}
        {!isPending && (
          <>
            <Text className='text-neutral-0 text-body-medium font-medium'>
              Sell
            </Text>
            <Text className='w-[72px] flex-row items-center justify-center '>
              <MT5PriceText
                style={{ color: colors.neutral0 }}
                value={bid || 0}
              />
            </Text>
          </>
        )}
      </TouchableOpacity>

      <View className='border border-neutral-200 h-full w-1/3'>
        <View className='flex-row items-stretch' style={{ height: 48 }}>
          {/* Decrease Button with Dropdown */}
          <Pressable
            className='px-2 items-center justify-center'
            style={{ width: 40 }}
            onPress={() => {
              setShowIncreaseMenu(false)
              setShowDecreaseMenu(!showDecreaseMenu)
            }}>
            <ChevronDown className='text-neutral-700' size={26} />
          </Pressable>

          {/* Volume Display/Input */}
          <TextInput
            inputMode='decimal'
            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
            placeholder='Volume'
            placeholderTextColor='#9ca3af'
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            value={volumeText}
            // returnKeyType="done"
            style={{
              flex: 1,
              height: 48, // quan trọng
              paddingVertical: 0, // quan trọng để không bị tụt
              textAlign: 'center',
              ...(Platform.OS === 'android'
                ? { textAlignVertical: 'center' as const }
                : {}),
              fontSize: 16,
              fontWeight: 500,
              color: colors.neutral500,
            }}
          />

          {/* Increase Button with Dropdown */}
          <Pressable
            className='px-2 items-center justify-center'
            style={{ width: 40 }}
            onPress={() => {
              setShowDecreaseMenu(false)
              setShowIncreaseMenu(!showIncreaseMenu)
            }}>
            <ChevronUp className='text-neutral-700' size={26} />
          </Pressable>
        </View>

        {/* Decrease Menu */}
        {showDecreaseMenu ? (
          <View
            className='absolute bottom-full left-0 right-0 bg-white border border-gray-300 mb-1'
            style={{ zIndex: 10 }}>
            <View className='flex-row'>
              {getIncrementOptions().map((increment) => (
                <TouchableOpacity
                  key={`dec-${increment}`}
                  className='border-b border-gray-200 flex-1 py-2'
                  onPress={() => {
                    const newVol = Math.max(0.01, volume - increment)
                    setVolume(newVol)
                    setVolumeText(newVol.toFixed(2))
                    setShowDecreaseMenu(false)
                  }}>
                  <Text className='text-center font-semibold text-primary-500'>
                    -{increment}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className='px-4 py-2'>
              <View className='flex-row flex-wrap'>
                {getQuickSelectOptions().map((value) => (
                  <TouchableOpacity
                    key={value}
                    className='w-1/2 px-2 py-4 items-center'
                    onPress={() => {
                      setVolume(value)
                      setVolumeText(value.toFixed(2))
                      setShowDecreaseMenu(false)
                    }}>
                    <Text className='text-[14px] font-semibold items-center'>
                      {value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : null}

        {/* Increase Menu */}
        {showIncreaseMenu ? (
          <View
            className='absolute bottom-full left-0 right-0 bg-white border border-gray-300 mb-1 '
            style={{ zIndex: 10 }}>
            <View className='flex-row'>
              {getIncrementOptions().map((increment) => (
                <TouchableOpacity
                  key={`inc-${increment}`}
                  className='border-b border-gray-200 flex-1 py-2'
                  onPress={() => {
                    const newVol = volume + increment
                    setVolume(newVol)
                    setVolumeText(newVol.toFixed(2))
                    setShowIncreaseMenu(false)
                  }}>
                  <Text className='text-center font-semibold text-primary-500'>
                    +{increment}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className='px-4 py-2'>
              <View className='flex-row flex-wrap'>
                {getQuickSelectOptions().map((value) => (
                  <TouchableOpacity
                    key={value}
                    className='w-1/2 px-2 py-4 items-center'
                    onPress={() => {
                      setVolume(value)
                      setVolumeText(value.toFixed(2))
                      setShowIncreaseMenu(false)
                    }}>
                    <Text className='text-[14px] font-semibold items-center'>
                      {value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : null}
      </View>

      {/* Buy Button */}
      <TouchableOpacity
        className={`bg-success-500 items-center justify-center flex-row h-full relative w-1/3 gap-2`}
        disabled={isPending}
        onPress={() => {
          //   if (openTradePanelOnBuySell) {
          //     setSymbolTrade(currentSymbol)
          //     tradePanelReference.current?.open('buySell')
          //   } else {
          //     onOrderPress(ORDER_SIDES.BUY)
          //   }
          onOrderPress(ORDER_SIDES.BUY)
        }}>
        {isPending ? (
          <View className='absolute inset-0 flex-row items-center justify-center'>
            <ActivityIndicator className='' color='#fff' size='small' />
          </View>
        ) : null}
        {!isPending && (
          <>
            <Text className='text-neutral-0 text-body-medium font-medium'>
              Buy
            </Text>
            <Text className='w-[72px] flex-row items-center justify-center'>
              <MT5PriceText
                style={{ color: colors.neutral0 }}
                value={ask || 0}
              />
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  )
}

export default OneClickButton
