import { useEffect, useMemo, useRef } from 'react'
import { Animated, FlatList, ScrollView, Text, View } from 'react-native'

import { ToggleFavouriteAsset } from '@/components/atoms'
import { useAssetsList } from '@/hooks/assets/useAssetsList'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { formatPriceDecimal } from '@/utils/currency'

function HotTab() {
  // const { isLoading, listPopular } = useGetListPopular();
  const parameters = useMemo(
    () => ({
      categoryId: '',
      search: '',
      take: 20,
    }),
    [],
  )
  const { data, isLoading } = useAssetsList(parameters)
  const listPopular = useMemo(() => {
    return data?.pages.flatMap((p) => p.data) ?? []
  }, [data])

  // const rtBySymbol = useMarketSocketStore((s) => s.rtBySymbol)

  const enrichedList = useMemo(() => {
    return listPopular.map((item) => {
      // const rt = rtBySymbol?.[item.symbol]

      return {
        ...item,
        // ask: rt?.ask,
        // bid: rt?.bid,
        // change: rt?.change,
        // changePercent: rt?.changePercent,
        stats: {
          highDaily: 0,
          lowDaily: 0,
        },
      }
    })
  }, [listPopular])

  return (
    <ScrollView
      className='flex-1 p-4'
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
      {isLoading ? (
        <SkeletonList />
      ) : (
        <FlatList
          ListEmptyComponent={
            <View className='items-center justify-center py-20'>
              <Text className='text-secondary text-base'>No symbols found</Text>
            </View>
          }
          data={enrichedList}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item }) => (
            <ItemRender
              assetId={item.id}
              isFavorite={false}
              symbol={item.symbol}
              nameSymbol={item.name}
            />
          )}
        />
      )}
    </ScrollView>
  )
}

export default HotTab

function ItemRender({
  assetId,
  symbol,
  nameSymbol,
}: {
  readonly assetId: string
  readonly isFavorite: boolean
  readonly symbol: string
  readonly nameSymbol: string
}) {
  // const rt = useMarketSocketStore((s) => s.rtBySymbol?.[symbol])
  const changeValue =
    useMarketSocketStore((s) => s.rtBySymbol?.[symbol]?.change) ?? 0
  const percentChangeValue =
    useMarketSocketStore((s) => s.rtBySymbol?.[symbol]?.changePercent) ?? 0
  const isPositive = changeValue >= 0

  return (
    <View className='flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 gap-3'>
      <View className='w-[40%]'>
        <View className='flex-row gap-2'>
          <Text className='text-[16px] font-semibold text-black dark:text-white'>
            {symbol.slice(0, 3)}/{symbol.slice(3)}
          </Text>
          <ToggleFavouriteAsset assetId={assetId} size={18} />
        </View>

        <Text className=' text-secondary mt-1'>{nameSymbol}</Text>
      </View>
      <View className='flex-1 justify-between flex-row items-center'>
        <Text
          className={`text-[16px] font-semibold  flex-1 items-center justify-center ${isPositive ? 'text-success-500' : 'text-error-500'}`}>
          {changeValue > 0 ? '+' : ''}
          {formatPriceDecimal(changeValue)}
        </Text>
        <Text
          className={`text-[16px] flex-1 items-center justify-center ${
            isPositive ? 'text-success-500' : 'text-error-500'
          }`}>
          {isPositive ? '+' : ''}
          {percentChangeValue.toFixed(2)}%
        </Text>
      </View>
    </View>
  )
}

function SkeletonItem() {
  const pulseAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          duration: 1000,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          duration: 1000,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [pulseAnim])

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  })

  return (
    <View className='flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800'>
      {/* Left side */}
      <View className='flex-1'>
        <Animated.View
          className='h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2'
          style={{ opacity }}
        />
        <Animated.View
          className='h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded'
          style={{ opacity }}
        />
      </View>

      {/* Right side */}
      <View className='w-[60%] justify-between flex-row items-center'>
        <Animated.View
          className='h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded flex-1 mr-2'
          style={{ opacity }}
        />
        <Animated.View
          className='h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded flex-1'
          style={{ opacity }}
        />
      </View>
    </View>
  )
}

function SkeletonList() {
  return (
    <View className='px-4'>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <SkeletonItem key={item} />
      ))}
    </View>
  )
}
