import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import ArrowDownIcon from '@/components/icons/ArrowDownIcon'
import { useGlobalModal } from '@/hooks/useGlobalModal'
import { useTransactionStore } from '@/store/transactionStore'

import PopupSearch from './PopupSearch'
import PopupTrade from './PopupTrade'

interface IHeaderTradeProps {
  symbol: string
  descSymbol: string
}

const HeaderTrade = ({ symbol, descSymbol }: IHeaderTradeProps) => {
  const { showModal, closeModal } = useGlobalModal()

  const isShowQuickTrade = useTransactionStore(
    (state) => state.isShowQuickTrade,
  )
  const setIsShowQuickTrade = useTransactionStore(
    (state) => state.setIsShowQuickTrade,
  )
  const setIsShowTradePanel = useTransactionStore(
    (state) => state.setIsShowTradePanel,
  )
  const isShowTradePanel = useTransactionStore(
    (state) => state.isShowTradePanel,
  )

  const onOpenSearch = () => {
    showModal({
      content: <PopupSearch onClose={closeModal} />,
      snapPoints: ['70%', '85%'],
      initialSnapIndex: 2,
      backdropOpacity: 0.7,
      animationDuration: 200,
      // enablePanDownToClose: false,
    })
  }
  const onOpenTradePanel = () => {
    setIsShowTradePanel(true)

    showModal({
      content: (
        <PopupTrade
          onClose={() => {
            closeModal()
            setIsShowTradePanel(false)
          }}
        />
      ),
      snapPoints: ['70%', '85%'],
      initialSnapIndex: 2,
      backdropOpacity: 0.7,
      animationDuration: 200,
      onClose: () => setIsShowTradePanel(false),
    })
  }

  const iconOneClickOff = require('@/assets/images/market/one_click_off.png')
  const iconOneClickOn = require('@/assets/images/market/one_click_on.png')
  const iconLimitOff = require('@/assets/images/market/limit_off.png')
  const iconLimitOn = require('@/assets/images/market/limit_on.png')

  return (
    <View className='h-[60px] w-full flex-row px-4 items-center justify-between'>
      <TouchableOpacity
        className=''
        onPress={() => {
          onOpenSearch()
        }}>
        <View className='flex-row gap-1 items-center'>
          <Text className='text-h3-semibold'>
            {symbol?.slice(0, 3)}/{symbol?.slice(3)}
          </Text>
          <ArrowDownIcon size={24} />
        </View>

        <Text className='text-h5-regular text-gray-500'>{descSymbol}</Text>
      </TouchableOpacity>
      <View className='flex-row gap-3 items-center'>
        <TouchableOpacity
          className='w-[24px] aspect-[50/34]'
          onPress={onOpenTradePanel}>
          <Image
            className='w-full h-full'
            source={isShowTradePanel ? iconLimitOn : iconLimitOff}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className='w-[24px] aspect-[50/34]'
          onPress={() => setIsShowQuickTrade(!isShowQuickTrade)}>
          <Image
            className='w-full h-full'
            source={isShowQuickTrade ? iconOneClickOn : iconOneClickOff}
          />
        </TouchableOpacity>
        {/* <Image className='w-[24px] aspect-[50/34]' source={modeTrade === 'limit' ? iconLimitOn : iconLimitOff} />
        <Image className='w-[24px] aspect-[50/34]' source={modeTrade === 'oneClick' ? iconOneClickOn : iconOneClickOff} /> */}
      </View>
    </View>
  )
}

export default HeaderTrade
