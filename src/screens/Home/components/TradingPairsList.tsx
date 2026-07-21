import React, { useCallback, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  InteractionManager,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { useAppNavigation } from '@/hooks'
import { useAssetsList } from '@/hooks/assets/useAssetsList'
import { useSymbols } from '@/hooks/market/useSymbols'
import { Paths } from '@/navigation/paths'
import MT5PriceText from '@/screens/Market/components/MT5PriceText'
import { useAuthStore } from '@/store/authStore'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useFavoriteAssetsStore } from '@/store/favoriteAssetsStore'
import type { Asset } from '@/types'
import { formatPriceDecimal2 } from '@/utils/currency'
import { ToggleFavouriteAsset } from '@/components/atoms'
import useTheme from '@/theme/hooks/useTheme'

type Tab = {
  id: string
  label: string
}

type TradingPair = {
  askPrice: string
  base: string
  bidPrice: string
  high: string
  id: string
  isFavorite: boolean
  low: string
  maxLeverage?: number
  name: string
  priceChange?: 'down' | 'up'
  quote: string
  spread: string
  spreadPercent: string
  symbol: string
  hasValidPrices: boolean
}

export type TradingPairsListVariant = 'home' | 'default'

type TradingPairsListProps = {
  readonly variant?: TradingPairsListVariant
}

const SYMBOL_REGEX = /^([A-Z]{3})([A-Z]{3})$/

const convertAssetToTradingPair = (
  asset: Asset,
  isFavorite: boolean,
  realtimeData?: {
    ask?: number
    bid?: number
    change?: number
    changePercent?: number
    sessionStats?: { high: number; low: number }
  },
): TradingPair => {
  const symbol = asset.symbol
  const parts = SYMBOL_REGEX.exec(symbol)
  const base = parts ? parts[1] : symbol.slice(0, 3)
  const quote = parts ? parts[2] : symbol.slice(3)

  const bid = realtimeData?.bid ?? 0
  const ask = realtimeData?.ask ?? 0
  const hasValidPrices = bid !== 0 || ask !== 0
  const askPrice = hasValidPrices && ask ? ask.toFixed(5) : '0.00000'
  const bidPrice = hasValidPrices && bid ? bid.toFixed(5) : '0.00000'
  const high = realtimeData?.sessionStats?.high?.toFixed(5) || '0.00000'
  const low = realtimeData?.sessionStats?.low?.toFixed(5) || '0.00000'
  const changeRaw = realtimeData?.change ?? 0
  const change =
    typeof changeRaw === 'number' && !Number.isNaN(changeRaw) ? changeRaw : 0
  const changePercentRaw = realtimeData?.changePercent ?? 0
  const changePercent =
    typeof changePercentRaw === 'number' && !Number.isNaN(changePercentRaw)
      ? changePercentRaw
      : 0
  const priceChange = change >= 0 ? 'up' : 'down'
  const spreadValue =
    realtimeData?.ask != null && realtimeData?.bid != null
      ? realtimeData.ask - realtimeData.bid
      : 0
  const spreadPercent = `${change.toFixed(2)}(${changePercent.toFixed(2)}%)`
  const spreadStr =
    typeof spreadValue === 'number' && Number.isFinite(spreadValue)
      ? spreadValue.toFixed(2)
      : '0.00'

  return {
    askPrice,
    base,
    bidPrice,
    high,
    id: asset.id,
    isFavorite,
    low,
    maxLeverage: asset.maxLeverage,
    name: asset.name,
    priceChange,
    quote,
    spread: spreadStr,
    spreadPercent,
    symbol: asset.symbol,
    hasValidPrices,
  }
}

export function TradingPairsList({
  variant = 'default',
}: TradingPairsListProps) {
  const navigation = useAppNavigation()
  const [activeTab, setActiveTab] = useState<
    'fav' | 'popular' | 'toprisers' | 'topfallers'
  >('popular')
  const isFavoriteAssetId = useFavoriteAssetsStore((s) => s.isFavoriteAssetId)
  const isHomeVariant = variant === 'home'
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const parameters = useMemo(
    () => ({
      categoryCode: activeTab === 'fav' ? 'FAVORITE' : undefined,
      take: 20,
    }),
    [activeTab],
  )

  const { data, error, isLoading } = useAssetsList(parameters)

  const assets = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  )

  const { colors } = useTheme()
  const symbols = useMemo(
    () => (assets || []).map((asset) => asset.symbol),
    [assets],
  )
  useSymbols(symbols, !!assets && assets.length > 0)

  const rtBySymbol = useMarketSocketStore((s) => s.rtBySymbol)

  const tradingPairs: TradingPair[] = useMemo(() => {
    if (!assets || assets.length === 0) return []

    return assets.map((asset) => {
      const realtimeData = rtBySymbol?.[asset.symbol]
      const isFavorite = asset.id
        ? isFavoriteAssetId(asset.id) || asset.isFavorite || false
        : asset.isFavorite || false

      return convertAssetToTradingPair(asset, isFavorite, realtimeData)
    })
  }, [assets, isFavoriteAssetId, rtBySymbol])

  const getPercentageValue = useCallback((spreadPercent: string): number => {
    const match = spreadPercent.match(/\(([^)]+)%\)/)
    return match ? parseFloat(match[1]) : 0
  }, [])

  const filteredAndSortedPairs = useMemo(() => {
    if (!isHomeVariant) return tradingPairs

    let list = tradingPairs

    if (activeTab === 'fav') {
      list = list.filter((p) => p.isFavorite)
    } else if (activeTab === 'toprisers') {
      list = [...list].sort((a, b) => {
        const aPct = getPercentageValue(a.spreadPercent)
        const bPct = getPercentageValue(b.spreadPercent)
        return bPct - aPct
      })
    } else if (activeTab === 'topfallers') {
      list = [...list].sort((a, b) => {
        const aPct = getPercentageValue(a.spreadPercent)
        const bPct = getPercentageValue(b.spreadPercent)
        return aPct - bPct
      })
    }

    return list
  }, [tradingPairs, activeTab, isHomeVariant, getPercentageValue])

  const tabs: Tab[] = useMemo(
    () => [
      { id: 'fav', label: 'Fav.' },
      { id: 'popular', label: 'Popular' },
      { id: 'toprisers', label: 'Top Risers' },
      { id: 'topfallers', label: 'Top Fallers' },
    ],
    [],
  )

  const pairsToRender = isHomeVariant ? filteredAndSortedPairs : tradingPairs
  const emptyMessage =
    isHomeVariant && activeTab === 'fav'
      ? 'No favorite pairs yet'
      : 'No pairs at the moment.'

  const handlePairPress = useCallback(
    (pair: TradingPair) => {
      // Home tab -> go to Market tab (keep tab bar visible) -> push SymbolDetail in MarketStack
      if (isHomeVariant) {
        // Step 1: Navigate to Market tab first
        navigation.navigate(Paths.Main, {
          screen: Paths.Market,
        })

        // Step 2: After tab transition, navigate to SymbolDetail
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            navigation.navigate(Paths.Main, {
              screen: Paths.Market,
              params: {
                screen: Paths.SymbolDetail,
                params: {
                  assetId: pair.id,
                  symbol: pair.symbol,
                  symbolDesc: pair.name,
                  isFavorite: pair.isFavorite,
                },
              },
            })
          }, 50)
        })
        return
      }

      // Default variant (already inside Market stack) -> normal push
      navigation.navigate(Paths.SymbolDetail, {
        assetId: pair.id,
        symbol: pair.symbol,
        symbolDesc: pair.name,
        isFavorite: pair.isFavorite,
      })
    },
    [isHomeVariant, navigation],
  )

  const handleViewAllPress = useCallback(() => {
    if (activeTab === 'fav' && pairsToRender.length === 0 && !isAuthenticated) {
      ;(navigation as { navigate: (name: string) => void }).navigate(
        Paths.Login,
      )
    } else {
      ;(navigation as { navigate: (name: string) => void }).navigate(
        Paths.Market,
      )
    }
  }, [activeTab, pairsToRender.length, isAuthenticated, navigation])

  if (isLoading) {
    return (
      <View
        className='items-center justify-center p-4'
        style={{ minHeight: 200 }}>
        <ActivityIndicator className='text-primary-500' size='large' />
        <Text className='typo-body-large-regular mt-12 text-neutral-500'>
          Loading trading pairs...
        </Text>
      </View>
    )
  }

  if (error) {
    return (
      <View
        className='items-center justify-center p-4'
        style={{ minHeight: 200 }}>
        <Text className='typo-body-large-semibold text-error-500'>
          Failed to load trading pairs
        </Text>
        <Text className='typo-body-small-regular mt-8 text-neutral-500'>
          {error.message}
        </Text>
      </View>
    )
  }

  return (
    <View className='px-4 pb-4 pt-2'>
      {isHomeVariant && (
        <>
          {/* Tabs: Fav. / Popular / Top Risers / Top Fallers - Home only */}
          <View className='mb-3 flex-row border-b border-neutral-200'>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                className='pb-3 pr-4'
                onPress={() => setActiveTab(tab.id as typeof activeTab)}>
                <Text
                  className={
                    activeTab === tab.id
                      ? 'typo-body-large-semibold text-neutral-900'
                      : 'typo-body-large-regular text-neutral-500'
                  }
                  style={
                    activeTab === tab.id
                      ? {
                          borderBottomWidth: 2,
                          borderBottomColor: colors.primary500,
                          paddingBottom: 2,
                          marginBottom: -2,
                        }
                      : undefined
                  }>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sort by / Filter row - Home only */}
          <View className='mb-3 flex-row items-center gap-3'>
            <View className='flex-row items-center gap-2 rounded-md bg-neutral-100 px-3 py-2'>
              <Text className='typo-body-small-regular text-neutral-700'>
                Sort by: Default
              </Text>
            </View>
            <View className='flex-row items-center gap-2 rounded-md bg-neutral-100 px-3 py-2'>
              <Text className='typo-body-small-regular text-neutral-700'>
                Filter
              </Text>
            </View>
          </View>

          {/* Header: Market / % Change (no Short/Long) - Home only */}
          <View className='mb-2 flex-row items-center justify-between border-b border-neutral-100 pb-2'>
            <Text className='typo-body-small-regular text-neutral-500'>
              Market / % Change
            </Text>
            <View className='flex-row gap-6'>
              <View style={{ minWidth: 72 }} />
              <View style={{ minWidth: 72 }} />
            </View>
          </View>
        </>
      )}

      {!isHomeVariant && (
        /* Default variant: header with Short/Long */
        <View className='mb-2 flex-row items-center justify-between border-b border-neutral-100 pb-2'>
          <Text className='typo-body-small-regular text-neutral-500'>
            Market / % Change
          </Text>
          <View className='flex-row gap-4'>
            <Text className='typo-body-small-regular min-w-[64] text-right text-neutral-500'>
              Short
            </Text>
            <Text className='typo-body-small-regular min-w-[64] text-right text-neutral-500'>
              Long
            </Text>
          </View>
        </View>
      )}

      {/* List */}
      <View className='gap-0'>
        {pairsToRender.length > 0 ? (
          pairsToRender.map((pair, index) => {
            const showPrices = pair.hasValidPrices
            const showZeroWithChange =
              isHomeVariant &&
              (Number(pair.bidPrice) === 0 || Number(pair.askPrice) === 0) &&
              pair.spreadPercent !== '0.00(0.00%)'

            return (
              <TouchableOpacity
                key={pair.id}
                activeOpacity={0.7}
                onPress={() => handlePairPress(pair)}
                className={`flex-row items-center justify-between border-b border-neutral-100 ${
                  isHomeVariant ? 'py-3' : 'pb-2'
                } ${index === pairsToRender.length - 1 ? 'border-b-0' : ''}`}>
                <View className='flex-1 flex-col items-start gap-0.5'>
                  <View className='flex-row items-center gap-1'>
                    <Text className='typo-body-large-semibold text-neutral-900'>
                      {pair.base}/{pair.quote}
                    </Text>
                    <ToggleFavouriteAsset assetId={pair.id} />
                  </View>
                  <Text className='typo-body-small-regular text-neutral-500'>
                    Spread: {pair.spread}
                  </Text>
                  <Text
                    className={`typo-body-small-regular ${
                      pair.priceChange === 'down'
                        ? 'text-error-500'
                        : 'text-success-500'
                    }`}>
                    {pair.spreadPercent}
                  </Text>
                </View>

                <View className='flex-row items-end gap-4'>
                  <View
                    className={`items-end gap-0.5 ${isHomeVariant ? 'min-w-[72]' : 'min-w-[64]'}`}>
                    {showPrices && !showZeroWithChange ? (
                      <MT5PriceText
                        style={{
                          color: '#EF4444',
                          fontWeight: isHomeVariant ? '700' : '600',
                        }}
                        value={Number(pair.bidPrice)}
                      />
                    ) : (
                      <Text className='typo-body-large-semibold text-neutral-400'>
                        {isHomeVariant ? '–' : pair.bidPrice}
                      </Text>
                    )}
                    <Text className='typo-body-small-regular text-neutral-500'>
                      Low: {formatPriceDecimal2(Number(pair.low))}
                    </Text>
                  </View>
                  <View
                    className={`items-end gap-0.5 ${isHomeVariant ? 'min-w-[72]' : 'min-w-[64]'}`}>
                    {showPrices && !showZeroWithChange ? (
                      <MT5PriceText
                        style={{
                          color: '#22C55E',
                          fontWeight: isHomeVariant ? '700' : '600',
                        }}
                        value={Number(pair.askPrice)}
                      />
                    ) : (
                      <Text className='typo-body-large-semibold text-neutral-400'>
                        {isHomeVariant ? '–' : pair.askPrice}
                      </Text>
                    )}
                    <Text className='typo-body-small-regular text-neutral-500'>
                      High: {formatPriceDecimal2(Number(pair.high))}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })
        ) : (
          <View className='items-center justify-center py-8'>
            <Text className='typo-body-large-regular text-neutral-400'>
              {emptyMessage}
            </Text>
          </View>
        )}
      </View>

      {/* View all / Add Other Pairs - Home only */}
      {isHomeVariant && (
        <TouchableOpacity
          activeOpacity={0.8}
          className='mt-4 w-full items-center justify-center rounded-lg bg-neutral-100 py-3'
          onPress={handleViewAllPress}>
          <Text className='typo-button-large-medium text-neutral-900'>
            {activeTab === 'fav' && pairsToRender.length === 0
              ? 'Add Other Pairs'
              : 'View all'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}
