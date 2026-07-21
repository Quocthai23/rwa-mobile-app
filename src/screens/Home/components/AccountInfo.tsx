import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import Decimal from 'decimal.js'
import { Eye, EyeOff } from 'lucide-react-native'
import React, { memo, useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { Button } from '@/components/atoms'
import { ACCOUNT_TYPES_ID } from '@/constants/account'
import { useAppNavigation } from '@/hooks'
import { useAccountBalance } from '@/hooks/account/useAccountBalance'
import { useAllAssetsList } from '@/hooks/assets/useAllAssetsList'
import { useSymbols } from '@/hooks/market/useSymbols'
import { useGlobalModal } from '@/hooks/useGlobalModal'
import { usePositions } from '@/hooks/usePosition'
import { Paths } from '@/navigation/paths'
import type { MainTabParamList } from '@/navigation/types'
import DepositMethod from '@/screens/Deposit/DepositMethod'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useAccountStore } from '@/store/useAccountStore'
import { useTheme } from '@/theme'
import { formatBalance } from '@/utils/currency'

import DonutChart from './DonutChart'

type PortfolioItem = {
  color: string
  name: string
  value: number
}

const CHART_COLORS = [
  '#F78A8F',
  '#F69E66',
  '#FCC573',
  '#C5E866',
  '#6BD096',
  '#6B7AD0',
]

const AccountInfo = () => {
  const { colors } = useTheme()
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const navigation = useAppNavigation()
  const tabNavigation =
    useNavigation<BottomTabNavigationProp<MainTabParamList>>()
  const { showModal, closeModal } = useGlobalModal()
  const selectedAccount = useAccountStore((state) => state.selectedAccount)

  // Fetch positions and assets data
  const { data: apiPositions } = usePositions(selectedAccount?.id || '')
  const { data: assetsData } = useAllAssetsList()
  const { data: balanceData } = useAccountBalance(selectedAccount?.id || '', 1)

  // Get open positions
  const openPositions = useMemo(() => {
    return apiPositions?.filter((position) => position.status === 0) ?? []
  }, [apiPositions])

  // Create asset map for quick lookup
  const assetsBySymbol = useMemo(() => {
    if (!assetsData?.data) return {}

    return assetsData.data.reduce(
      (acc, asset) => {
        acc[asset.symbol] = {
          contractSize: parseFloat(asset.contractSize) || 100,
          digit: asset.digit || 2,
        }

        return acc
      },
      {} as Record<string, { contractSize: number; digit: number }>,
    )
  }, [assetsData])

  // Subscribe to real-time prices
  const symbols = useMemo(
    () => openPositions.map((position) => position.symbol),
    [openPositions],
  )
  useSymbols(symbols, symbols.length > 0)

  const rtBySymbol = useMarketSocketStore((s) => s.rtBySymbol)

  // Calculate balance, equity, margin, and availableBalance
  const balance = Number.parseFloat(
    (
      Number.parseFloat(selectedAccount?.lockedBalance || '0') +
      Number.parseFloat(selectedAccount?.availableBalance || '0')
    ).toString(),
  )
  const lockedBalance = Number.parseFloat(selectedAccount?.lockedBalance || '0')

  const currentUnrealizedPnl = useMemo(() => {
    return openPositions.reduce((acc, position) => {
      const isBuy = position.side === 0
      const openPrice = new Decimal(position.openPrice)
      const rt = rtBySymbol?.[position.symbol]
      const realtimePrice = isBuy ? rt?.bid : rt?.ask
      const currentPrice = realtimePrice
        ? new Decimal(realtimePrice)
        : openPrice
      const contractSize = new Decimal(
        assetsBySymbol[position.symbol]?.contractSize || 100,
      )
      const quantity = new Decimal(position.quantity)
      const priceDiff = isBuy
        ? currentPrice.minus(openPrice)
        : openPrice.minus(currentPrice)

      return acc + priceDiff.mul(quantity).mul(contractSize).toNumber()
    }, 0)
  }, [openPositions, rtBySymbol, assetsBySymbol])

  const equity = balance + currentUnrealizedPnl
  const margin = lockedBalance
  const totalAsset = equity - margin

  // Check if there are no symbols
  const notSymbol = openPositions.length === 0

  // Group positions by symbol and calculate total lots
  const portfolioData: PortfolioItem[] = useMemo(() => {
    if (openPositions.length === 0) return []

    // Group by symbol
    const groupedBySymbol = openPositions.reduce(
      (acc, position) => {
        if (!acc[position.symbol]) {
          acc[position.symbol] = 0
        }
        acc[position.symbol] += Number(position.quantity)

        return acc
      },
      {} as Record<string, number>,
    )

    // Convert to array and sort by value descending
    const sortedSymbols = Object.entries(groupedBySymbol)
      .map(([symbol, quantity]) => ({ symbol, quantity }))
      .sort((a, b) => b.quantity - a.quantity)

    // If <=6 symbols, show all
    if (sortedSymbols.length <= 6) {
      return sortedSymbols.map((item, index) => ({
        color: CHART_COLORS[index],
        name: item.symbol,
        value: item.quantity,
      }))
    }

    // If >6 symbols, show first 5 + Others
    const top5 = sortedSymbols.slice(0, 5).map((item, index) => ({
      color: CHART_COLORS[index],
      name: item.symbol,
      value: item.quantity,
    }))

    const othersTotal = sortedSymbols
      .slice(5)
      .reduce((sum, item) => sum + item.quantity, 0)

    return [
      ...top5,
      {
        color: CHART_COLORS[5],
        name: 'Others',
        value: othersTotal,
      },
    ]
  }, [openPositions])

  const totalLots = useMemo(() => {
    return portfolioData.reduce((sum, item) => sum + item.value, 0)
  }, [portfolioData])

  // Calculate change from yesterday's balance
  const yesterdayBalance = useMemo(() => {
    if (!balanceData) return totalAsset

    const currentBalance = Number.parseFloat(balanceData.currentBalance)
    const pnl = Number.parseFloat(balanceData.pnl)

    return currentBalance - pnl
  }, [balanceData, totalAsset])

  const changeAmount = totalAsset - yesterdayBalance
  const changePercent =
    yesterdayBalance !== 0 ? (changeAmount / yesterdayBalance) * 100 : 0
  const isPositive = changePercent >= 0

  const changeText = `${isPositive ? '+' : '-'}$${Math.abs(changeAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${changePercent.toFixed(2)}%)`

  const handleShowDepositMethod = () => {
    if (selectedAccount?.accountTypeId == ACCOUNT_TYPES_ID.DEMO) {
      navigation.navigate(Paths.TopUp)

      return
    }

    showModal({
      content: <DepositMethod onClose={closeModal} />,
      snapPoints: ['50%', '70%'],
      initialSnapIndex: 2,
      backdropOpacity: 0.7,
      animationDuration: 200,
      // enablePanDownToClose: false,
    })
  }

  if (notSymbol) {
    return (
      <View className='p-4'>
        <View className='bg-neutral-100 rounded p-4 gap-1'>
          <View className='flex-row items-center' style={{ gap: 4 }}>
            <Text className='text-body-large-medium text-neutral-500'>
              Total Asset
            </Text>
            <Pressable onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
              {isBalanceVisible ? (
                <Eye color={colors.neutral900} size={24} />
              ) : (
                <EyeOff color={colors.neutral900} size={24} />
              )}
            </Pressable>
          </View>
          {/* <Text className='text-h1-semibold text-neutral-900'>
            {isBalanceVisible ? `$${formatBalance(totalAsset)}` : '****'}
          </Text>{' '} */}
          <View className='flex-row items-center' style={{ gap: 8 }}>
            <Text
              className='text-h1-semibold text-neutral-900'
              style={{ fontFamily: 'Inter-SemiBold' }}>
              {isBalanceVisible ? `$${formatBalance(totalAsset)}` : '****'}
            </Text>
            <Text
              className='text-body-large-medium '
              style={{
                color: isPositive ? colors.success500 : colors.error500,
                fontFamily: 'Inter-Medium',
                display: isBalanceVisible ? 'flex' : 'none',
              }}>
              {changeText}
            </Text>
          </View>
          <Button
            className='flex-1 mt-1'
            label='Deposit'
            size={40}
            style={{ minHeight: 40, height: 40 }}
            variant='primary'
            onPress={handleShowDepositMethod}
          />
        </View>
      </View>
    )
  }

  return (
    <View className='p-4'>
      <View className=' rounded p-4 gap-3 bg-neutral-100'>
        {/* Top Section */}
        <View style={{ gap: 8 }}>
          <View style={{ gap: 4 }}>
            {/* Total Asset Label with Hide/Show Icon */}
            <View className='flex-row items-center' style={{ gap: 4 }}>
              <Text className='text-body-large-medium text-neutral-500'>
                Total Asset
              </Text>
              <Pressable onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
                {isBalanceVisible ? (
                  <Eye color={colors.neutral900} size={24} />
                ) : (
                  <EyeOff color={colors.neutral900} size={24} />
                )}
              </Pressable>
            </View>

            {/* Amount */}
            <View className='flex-row items-center' style={{ gap: 8 }}>
              <Text
                className='text-h1-semibold text-neutral-900'
                style={{ fontFamily: 'Inter-SemiBold' }}>
                {isBalanceVisible ? `$${formatBalance(totalAsset)}` : '****'}
              </Text>
              <Text
                className='text-body-large-medium '
                style={{
                  color: isPositive ? colors.success500 : colors.error500,
                  fontFamily: 'Inter-Medium',
                  display: isBalanceVisible ? 'flex' : 'none',
                }}>
                {changeText}
              </Text>
            </View>
          </View>

          {/* Portfolio Chart and Legend */}
          <View
            className='flex-row items-center justify-between'
            style={{ gap: 12 }}>
            <DonutChart
              backgroundColor={colors.neutral100}
              gapDeg={4}
              segments={portfolioData.map((item) => ({
                value: item.value,
                color: item.color,
              }))}
              size={120}
              thickness={12}
              unitText='Lots'
              valueText={totalLots.toFixed(2)}
            />
            {/* Legend */}
            <View className='flex-row items-center' style={{ gap: 24 }}>
              <View style={{ gap: 12 }}>
                {portfolioData.slice(0, 3).map((item, index) => (
                  <View
                    key={index}
                    className='flex-row items-center'
                    style={{ gap: 4 }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: item.color,
                      }}
                    />
                    <Text className='text-caption-medium text-neutral-900'>
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={{ gap: 12 }}>
                {portfolioData.slice(3).map((item, index) => (
                  <View
                    key={index}
                    className='flex-row items-center'
                    style={{ gap: 4 }}>
                    <View
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: item.color,
                      }}
                    />
                    <Text className='text-caption-medium text-neutral-900'>
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className='flex-row flex-wrap gap-3'>
          <Button
            className='flex-1 min-w-0'
            label='Deposit'
            size={40}
            style={{ minHeight: 40, height: 40 }}
            variant='primary'
            onPress={handleShowDepositMethod}
          />
          <Button
            className='flex-1 min-w-0'
            label='Transfer'
            size={40}
            style={{ minHeight: 40, height: 40 }}
            variant='secondaryBrand'
            onPress={() =>
              navigation.navigate(Paths.Transfer, {
                transferType: 'other_account',
              })
            }
          />
          <Button
            className='flex-1 min-w-0'
            label='Trade'
            size={40}
            style={{ minHeight: 40, height: 40 }}
            variant='primary'
            onPress={() => tabNavigation.navigate(Paths.Trade)}
          />
        </View>
      </View>
    </View>
  )
}

export default memo(AccountInfo)
