import { CircleAlert } from 'lucide-react-native'
import React, { useCallback, useState } from 'react'
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'

import ChartCommon from '@/components/chart/ChartCommon'
import { ORDER_SIDES, ORDER_TYPE_CODES, ORDER_TYPES } from '@/constants/order'
import { useCreateOrder } from '@/hooks/orders/useCreateOrder'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useTransactionStore } from '@/store/transactionStore'
import { useAccountStore } from '@/store/useAccountStore'
import { useTheme } from '@/theme'

import TpSlInput from './trade/TpSlInput'
import TradeActions from './trade/TradeActions'
import TradeTabs from './trade/TradeTabs'
import TriggerSelector from './trade/TriggerSelector'
import {
  type EstimateItem,
  type TabId,
  type TabInfo,
  TRIGGER_STEP,
  TRIGGER_UNIT,
  type TriggerType,
} from './trade/types'

const tabs: TabInfo[] = [
  { id: 'MARKET', label: 'Market', type: ORDER_TYPES.MARKET },
  {
    id: 'BUY_LIMIT',
    label: 'Buy Limit',
    side: ORDER_SIDES.BUY,
    type: ORDER_TYPES.LIMIT,
  },
  {
    id: 'SELL_LIMIT',
    label: 'Sell Limit',
    side: ORDER_SIDES.SELL,
    type: ORDER_TYPES.LIMIT,
  },
  {
    id: 'BUY_STOP',
    label: 'Buy Stop',
    side: ORDER_SIDES.BUY,
    type: ORDER_TYPES.STOP,
  },
  {
    id: 'SELL_STOP',
    label: 'Sell Stop',
    side: ORDER_SIDES.SELL,
    type: ORDER_TYPES.STOP,
  },
]

const PopupTrade = ({ onClose: _onClose }: { onClose: () => void }) => {
  const { colors } = useTheme()
  const selectedAccount = useAccountStore((s) => s.selectedAccount)
  const symbol = useTransactionStore((s) => s.symbolStore.symbol)
  const descSymbol = useTransactionStore((s) => s.symbolStore.descSymbol)
  const isShowTradePanel = useTransactionStore((s) => s.isShowTradePanel)
  const { height: screenHeight } = useWindowDimensions()
  const bid = useMarketSocketStore((s) => s.rtBySymbol[symbol]?.bid)
  const ask = useMarketSocketStore((s) => s.rtBySymbol[symbol]?.ask)
  const { isPending: isCreatingOrder, mutate: createOrder } = useCreateOrder()

  const [activeTab, setActiveTab] = useState<TabId>('MARKET')
  const [quantity, setQuantity] = useState('0.01')
  const [triggerType, setTriggerType] = useState<TriggerType>('Price')
  const [showTriggerDropdown, setShowTriggerDropdown] = useState(false)
  const [takeProfit, setTakeProfit] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [limitStopPrice, setLimitStopPrice] = useState('')

  const isMarket = activeTab === 'MARKET'
  const currentTab = tabs.find((t) => t.id === activeTab)
  const unitLabel = TRIGGER_UNIT[triggerType]
  const step = TRIGGER_STEP[triggerType]

  /* ────────── helpers ────────── */

  const handleIncrement = (
    setter: (v: string) => void,
    value: string,
    s = 0.01,
  ) => {
    setter(((Number.parseFloat(value) || 0) + s).toFixed(2))
  }

  const handleDecrement = (
    setter: (v: string) => void,
    value: string,
    s = 0.01,
  ) => {
    const num = Number.parseFloat(value) || 0
    if (num > s) setter((num - s).toFixed(2))
  }

  const handleTextChange = (setter: (v: string) => void, text: string) => {
    const cleaned = text.replaceAll(/[^\d.]/g, '')
    const parts = cleaned.split('.')

    setter(
      parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned,
    )
  }

  const handleBlur = (setter: (v: string) => void, value: string) => {
    if (value === '') return

    const n = Number.parseFloat(value)

    setter(isNaN(n) ? '0.00' : n.toFixed(2))
  }

  /* ────────── TP / SL logic ────────── */

  const getDefaultTpSlValue = useCallback(
    (direction: 'tp' | 'sl', side: 0 | 1) => {
      const base =
        side === ORDER_SIDES.BUY
          ? Number.parseFloat(String(ask ?? 0))
          : Number.parseFloat(String(bid ?? 0))

      if (triggerType === 'Price') {
        const off =
          direction === 'tp' ? (side === 0 ? 1 : -1) : side === 0 ? -1 : 1

        return (base + off).toFixed(2)
      }

      if (triggerType === 'Pips') return '100'
      if (triggerType === 'PNL') return '100'

      return '1.00'
    },
    [ask, bid, triggerType],
  )

  const computeTpSlPrice = useCallback(
    (
      value: string,
      direction: 'tp' | 'sl',
      side: 0 | 1,
    ): number | undefined => {
      const num = Number.parseFloat(value)

      if (!value || isNaN(num)) return undefined

      const base =
        side === ORDER_SIDES.BUY
          ? Number.parseFloat(String(ask ?? 0))
          : Number.parseFloat(String(bid ?? 0))

      if (triggerType === 'Price') return num

      const sign =
        direction === 'tp' ? (side === 0 ? 1 : -1) : side === 0 ? -1 : 1

      if (triggerType === 'Pips') return base + sign * num * 0.01

      if (triggerType === 'PNL') {
        const qty = Number.parseFloat(quantity) || 0

        if (qty === 0) return undefined

        const entry =
          !isMarket && limitStopPrice ? Number.parseFloat(limitStopPrice) : base

        return entry + (sign * num) / (qty * 100)
      }

      // Change(%)
      return base * (1 + (sign * num) / 100)
    },
    [ask, bid, triggerType, quantity, isMarket, limitStopPrice],
  )

  const computeEstimateDisplay = useCallback(
    (value: string, direction: 'tp' | 'sl', side: 0 | 1) => {
      const numVal = Number.parseFloat(value)

      if (!value || isNaN(numVal)) return null

      const qty = Number.parseFloat(quantity) || 0

      if (qty === 0) return null

      const marketPrice =
        side === ORDER_SIDES.BUY
          ? Number.parseFloat(String(ask ?? 0))
          : Number.parseFloat(String(bid ?? 0))
      const entry =
        !isMarket && limitStopPrice
          ? Number.parseFloat(limitStopPrice)
          : marketPrice

      if (isNaN(entry) || entry === 0) return null

      const sign =
        direction === 'tp' ? (side === 0 ? 1 : -1) : side === 0 ? -1 : 1

      let target: number

      if (triggerType === 'Price') {
        target = numVal
      } else if (triggerType === 'Pips') {
        target = entry + sign * numVal * 0.01
      } else if (triggerType === 'PNL') {
        target = entry + (sign * numVal) / (qty * 100)
      } else {
        // Change(%)
        target = entry * (1 + (sign * numVal) / 100)
      }

      const pnl = (target - entry) * (side === 0 ? 1 : -1) * qty * 100

      return {
        isPositive: pnl >= 0,
        profitUsd: pnl.toFixed(2),
        targetPrice: target.toFixed(2),
      }
    },
    [ask, bid, triggerType, quantity, isMarket, limitStopPrice],
  )

  const formatEstimate = (
    est: { profitUsd: string; targetPrice: string } | null,
  ) => {
    if (!est) return null
    if (triggerType === 'PNL') return `@ ${est.targetPrice}`
    if (triggerType === 'Pips')
      return `${est.targetPrice} - ${est.profitUsd} USD`

    return `${est.profitUsd} USD`
  }

  const buildEstimates = (
    direction: 'tp' | 'sl',
    value: string,
  ): (EstimateItem | null)[] => {
    if (isMarket) {
      return [ORDER_SIDES.BUY, ORDER_SIDES.SELL].map((s) => {
        const est = computeEstimateDisplay(value, direction, s)
        const label = formatEstimate(est)

        if (!est || !label) return null

        return {
          isPositive: est.isPositive,
          label,
          prefix: `${s === ORDER_SIDES.BUY ? 'Buy' : 'Sell'} ${direction.toUpperCase()}`,
        }
      })
    }

    const side = (currentTab?.side ?? ORDER_SIDES.BUY) as 0 | 1
    const est = computeEstimateDisplay(value, direction, side)
    const label = formatEstimate(est)

    if (!est || !label) return []

    return [
      { isPositive: est.isPositive, label, prefix: direction.toUpperCase() },
    ]
  }

  /* ────────── order ────────── */

  const handleOrder = (side: 0 | 1) => {
    if (!selectedAccount?.id) return

    const qty = Number.parseFloat(quantity) || 0

    if (qty <= 0) return

    const orderTypeCode =
      currentTab?.type === ORDER_TYPES.MARKET
        ? ORDER_TYPE_CODES.MARKET
        : currentTab?.type === ORDER_TYPES.LIMIT
          ? ORDER_TYPE_CODES.LIMIT
          : ORDER_TYPE_CODES.STOP

    createOrder({
      accountId: selectedAccount.id,
      leverage: 100,
      orderType: orderTypeCode,
      price:
        !isMarket && limitStopPrice
          ? Number.parseFloat(limitStopPrice)
          : undefined,
      quantity: qty,
      side,
      stopLossPrice: computeTpSlPrice(stopLoss, 'sl', side),
      symbol,
      takeProfitPrice: computeTpSlPrice(takeProfit, 'tp', side),
    })
  }

  /* ────────── TP / SL increment / decrement ────────── */

  const tpSlSide = (currentTab?.side ?? ORDER_SIDES.BUY) as 0 | 1

  const handleTpIncrement = () => {
    if (!takeProfit) setTakeProfit(getDefaultTpSlValue('tp', tpSlSide))
    else handleIncrement(setTakeProfit, takeProfit, step)
  }

  const handleTpDecrement = () => {
    if (!takeProfit) setTakeProfit(getDefaultTpSlValue('tp', tpSlSide))
    else handleDecrement(setTakeProfit, takeProfit, step)
  }

  const handleSlIncrement = () => {
    if (!stopLoss) setStopLoss(getDefaultTpSlValue('sl', tpSlSide))
    else handleIncrement(setStopLoss, stopLoss, step)
  }

  const handleSlDecrement = () => {
    if (!stopLoss) setStopLoss(getDefaultTpSlValue('sl', tpSlSide))
    else handleDecrement(setStopLoss, stopLoss, step)
  }

  /* ────────── tab / trigger ────────── */

  const getDefaultLimitStopPrice = () => {
    // BUY_LIMIT: below ask | BUY_STOP: above ask
    // SELL_LIMIT: above bid | SELL_STOP: below bid
    const isBuy = currentTab?.side === ORDER_SIDES.BUY
    const isLimit = currentTab?.type === ORDER_TYPES.LIMIT
    const base = isBuy
      ? Number.parseFloat(String(ask ?? 0))
      : Number.parseFloat(String(bid ?? 0))
    const offset = isBuy === isLimit ? -1 : 1 // limit→below for buy, above for sell; stop→above for buy, below for sell

    return (base + offset).toFixed(2)
  }

  const handleTabPress = (tabId: TabId) => {
    setActiveTab(tabId)
    setLimitStopPrice('')
  }

  const handleTriggerSelect = (type: TriggerType) => {
    setTriggerType(type)
    setShowTriggerDropdown(false)
    setTakeProfit('')
    setStopLoss('')
  }

  if (!isShowTradePanel) return null

  return (
    <View className='pt-4' style={{ maxHeight: screenHeight * 0.85, flex: 1 }}>
      {/* Header */}
      <View className='h-[52px] w-full flex-row px-4 items-center justify-between'>
        <TouchableOpacity
          className=''
          onPress={() => {
            //   onOpenSearch()
          }}>
          <View className='flex-row gap-1 items-center'>
            <Text className='text-h3-semibold'>
              {symbol?.slice(0, 3)}/{symbol?.slice(3)}
            </Text>
          </View>
          <Text className='text-h5-regular text-gray-500'>{descSymbol}</Text>
        </TouchableOpacity>

        <View className='flex-row items-center gap-3'>
          <Text className='text-h3-semibold text-error-500 w-[80px]  text-center'>
            {' '}
            {bid}
          </Text>
          <View className='w-[1px] h-[36px] bg-neutral-200' />
          <Text className='text-h3-semibold text-success-500 w-[80px] text-center'>
            {ask}
          </Text>
        </View>
      </View>

      <TradeTabs
        activeTab={activeTab}
        tabs={tabs}
        onTabPress={handleTabPress}
      />

      {/* body */}
      <ScrollView
        className='mt-4'
        contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}>
        {/* Quantity */}
        <View className='px-4'>
          <View className='flex-row items-center gap-1'>
            <Text className='text-body-large-medium'>Quantity (Lot)</Text>
            <CircleAlert color={colors.secondary500} size={20} />
          </View>
          <View className='flex-row items-center justify-between'>
            <TextInput
              className='text-3xl font-medium flex-1'
              keyboardType='decimal-pad'
              value={quantity}
              onBlur={() => handleBlur(setQuantity, quantity)}
              onChangeText={(text) => handleTextChange(setQuantity, text)}
            />
            <View className='flex-row gap-6'>
              <TouchableOpacity
                className='w-[40px] h-[40px] bg-neutral-100 dark:bg-gray-700 items-center justify-center rounded'
                onPress={() => handleIncrement(setQuantity, quantity)}>
                <Text className='text-2xl'>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className='w-[40px] h-[40px] bg-neutral-100 dark:bg-gray-700 items-center justify-center rounded'
                onPress={() => handleDecrement(setQuantity, quantity)}>
                <Text className='text-2xl'>−</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Price (Limit / Stop only) */}
        {!isMarket && (
          <View className='px-4'>
            <Text className='text-body-large-medium mb-1'>Price</Text>
            <View className='flex-row items-center justify-between'>
              <TextInput
                className='text-3xl font-medium flex-1'
                keyboardType='decimal-pad'
                placeholder='0.00'
                placeholderTextColor={colors.neutral400}
                value={limitStopPrice}
                onBlur={() => handleBlur(setLimitStopPrice, limitStopPrice)}
                onChangeText={(text) =>
                  handleTextChange(setLimitStopPrice, text)
                }
              />
              <View className='flex-row gap-6'>
                <TouchableOpacity
                  className='w-[40px] h-[40px] bg-neutral-100 dark:bg-gray-700 items-center justify-center rounded'
                  onPress={() => {
                    if (!limitStopPrice) {
                      setLimitStopPrice(getDefaultLimitStopPrice())
                    } else {
                      handleIncrement(setLimitStopPrice, limitStopPrice)
                    }
                  }}>
                  <Text className='text-2xl'>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className='w-[40px] h-[40px] bg-neutral-100 dark:bg-gray-700 items-center justify-center rounded'
                  onPress={() => {
                    if (!limitStopPrice) {
                      setLimitStopPrice(getDefaultLimitStopPrice())
                    } else {
                      handleDecrement(setLimitStopPrice, limitStopPrice)
                    }
                  }}>
                  <Text className='text-2xl'>−</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <TriggerSelector
          showDropdown={showTriggerDropdown}
          triggerType={triggerType}
          onSelect={handleTriggerSelect}
          onToggleDropdown={() => setShowTriggerDropdown(!showTriggerDropdown)}
        />

        <TpSlInput
          estimates={buildEstimates('tp', takeProfit)}
          label='Take Profit'
          unitLabel={unitLabel}
          value={takeProfit}
          onBlur={() => handleBlur(setTakeProfit, takeProfit)}
          onChangeText={(text) => handleTextChange(setTakeProfit, text)}
          onDecrement={handleTpDecrement}
          onIncrement={handleTpIncrement}
        />

        <TpSlInput
          estimates={buildEstimates('sl', stopLoss)}
          label='Stop Loss'
          unitLabel={unitLabel}
          value={stopLoss}
          onBlur={() => handleBlur(setStopLoss, stopLoss)}
          onChangeText={(text) => handleTextChange(setStopLoss, text)}
          onDecrement={handleSlDecrement}
          onIncrement={handleSlIncrement}
        />
        <View className='h-[300px]'>
          <ChartCommon
            isChartMini
            assetId={''}
            isShowBuyCell={false}
            isShowSelectSymbol={false}
            symbol={symbol}
            timeFrame={60}
          />
        </View>
      </ScrollView>
      <View className='px-4 pt-2 pb-6'>
        <TradeActions
          currentTab={currentTab}
          isCreatingOrder={isCreatingOrder}
          isMarket={isMarket}
          limitStopPrice={limitStopPrice}
          onOrder={handleOrder}
        />
      </View>
    </View>
  )
}

export default PopupTrade
