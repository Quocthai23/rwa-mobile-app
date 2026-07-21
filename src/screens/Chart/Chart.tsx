import { useEffect, useState } from 'react'
import { View } from 'react-native'

import TradingView from '@/components/trading-view/TradingView'
import { useTransactionStore } from '@/store/transactionStore'

function ChartScreen() {
  // const { data } = useAllAssetsList()
  // const symbolTrade = useTransactionStore((s) => s.symbolTrade)
  const symbolStore = useTransactionStore((s) => s.symbolStore)
  const [currentSymbol, setCurrentSymbol] = useState({
    symbol: 'XAUUSD',
    descSymbol: 'Gold vs US Dollar',
  })

  // Update symbol when symbolTrade changes (e.g., from SymbolDetail screen)
  useEffect(() => {
    if (symbolStore) {
      setCurrentSymbol(symbolStore)
    }
  }, [symbolStore])

  return (
    <View className='flex-1'>
      {/* <View className='flex-row gap-1'>
        {['XAUUSD', 'XAGUSD', 'BTCUSD', 'EURUSD'].map((sym) => (
          <Button
            key={sym}
            color={currentSymbol === sym ? 'blue' : 'gray'}
            title={sym}
            onPress={() => setCurrentSymbol(sym)}
          />
        ))}
      </View> */}

      {/* <ChartCommon
        isShowPanel
        descSymbol={data?.data[0]?.name}
        setSymbol={setCurrentSymbol}
        symbol={currentSymbol}
      /> */}
      <TradingView
        descSymbol={currentSymbol.descSymbol}
        symbol={currentSymbol.symbol}
      />
    </View>
  )
}

export default ChartScreen
