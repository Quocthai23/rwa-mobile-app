import React from 'react'
import { Text, View } from 'react-native'

import ButtonCustom from '@/components/atoms/Button/ButtonCustom'
import { ORDER_SIDES } from '@/constants/order'

import type { TabInfo } from './types'

type TradeActionsProps = {
  currentTab: TabInfo | undefined
  isCreatingOrder: boolean
  isMarket: boolean
  limitStopPrice: string
  onOrder: (side: 0 | 1) => void
}

const TradeActions = ({
  currentTab,
  isCreatingOrder,
  isMarket,
  limitStopPrice,
  onOrder,
}: TradeActionsProps) => {
  return (
    <View className='flex-row gap-3 mt-2 px-4'>
      {isMarket ? (
        <>
          <ButtonCustom
            disabled={isCreatingOrder}
            isLoading={isCreatingOrder}
            type='SELL'
            onPress={() => onOrder(ORDER_SIDES.SELL)}>
            <Text className='text-lg font-semibold text-white'>Sell</Text>
          </ButtonCustom>
          <ButtonCustom
            disabled={isCreatingOrder}
            isLoading={isCreatingOrder}
            type='BUY'
            onPress={() => onOrder(ORDER_SIDES.BUY)}>
            <Text className='text-md font-semibold text-white'>Buy</Text>
          </ButtonCustom>
        </>
      ) : (
        <ButtonCustom
          disabled={isCreatingOrder || !limitStopPrice}
          isLoading={isCreatingOrder}
          type={currentTab?.side === ORDER_SIDES.BUY ? 'BUY' : 'SELL'}
          onPress={() =>
            onOrder((currentTab?.side ?? ORDER_SIDES.BUY) as 0 | 1)
          }>
          <Text className='text-lg font-semibold text-white'>
            {currentTab?.label}
          </Text>
        </ButtonCustom>
      )}
    </View>
  )
}

export default TradeActions
