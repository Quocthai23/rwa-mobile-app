import { ChevronRightIcon } from 'lucide-react-native'
import React, { useCallback } from 'react'
import {
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native'

import { useAppNavigation } from '@/hooks'
import { Paths } from '@/navigation/paths'
import colors from '@/theme/colors'

type StrategyItem = {
  count: string
  countTone: 'danger' | 'neutral'
  id: string
  name: string
  rightMeta: string
  subtitle: {
    accentText: string
    prefix: string
    suffix: string
  }
}

export const HomeStrategy = () => {
  const navigation = useAppNavigation()
  const handlePressItem = useCallback(() => {
    navigation.navigate(Paths.Ranking)
  }, [navigation])
  const handlePressViewAll = useCallback(() => {
    navigation.navigate(Paths.Main, {
      screen: Paths.Discover,
      params: { initialTab: 'Strategy' },
    })
  }, [navigation])
  const fakeStrategyData: StrategyItem[] = [
    {
      count: '99',
      countTone: 'danger',
      id: 'strategy-1',
      name: 'Forex',
      rightMeta: 'Today 11:14',
      subtitle: {
        accentText: 'Intraday Buy',
        prefix: 'EUR/USD ',
        suffix: ' @1.19960',
      },
    },
    {
      count: '4',
      countTone: 'danger',
      id: 'strategy-2',
      name: 'Shares',
      rightMeta: 'Today 03:45',
      subtitle: {
        accentText: 'Bullish Pennant',
        prefix: 'Brent Crude Oil 5m ',
        suffix: '',
      },
    },
    {
      count: '99+',
      countTone: 'neutral',
      id: 'strategy-3',
      name: 'Commodities',
      rightMeta: 'Today 04:15',
      subtitle: {
        accentText: 'Bullish -0.13%',
        prefix: 'AUD/USD 5m ',
        suffix: '',
      },
    },
    {
      count: '99+',
      countTone: 'neutral',
      id: 'strategy-4',
      name: 'Indices',
      rightMeta: '01/26 10:52',
      subtitle: {
        accentText: 'Buy',
        prefix: 'AUD/CAD ',
        suffix: ' @1.19960',
      },
    },
    {
      count: '24',
      countTone: 'danger',
      id: 'strategy-5',
      name: 'Crypto',
      rightMeta: '2026/01/21',
      subtitle: {
        accentText: '1723 Points',
        prefix: 'Profit ',
        suffix: ' Win Rate 66.67%',
      },
    },
  ]

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {fakeStrategyData.map((strategy) => (
        <View
          key={strategy.id}
          className='rounded-md border border-neutral-200 mb-3 p-4 bg-white'>
          <View className='flex-row items-center justify-between'>
            <TouchableHighlight
              activeOpacity={0.8}
              onPress={() => handlePressItem()}
              style={{
                borderRadius: 6,
                paddingHorizontal: 6,
                paddingVertical: 4,
              }}
              underlayColor='#e5e5e5'>
              <Text className='typo-h3-semibold text-neutral-900'>
                {strategy.name}
              </Text>
            </TouchableHighlight>

            <View className='flex-row items-center gap-3'>
              <TouchableHighlight
                activeOpacity={0.8}
                onPress={() => handlePressItem()}
                underlayColor='#e5e5e5'>
                <View
                  className={
                    strategy.countTone === 'danger'
                      ? 'min-w-[40px] py-1 px-2 rounded-md bg-error-50 items-center'
                      : 'min-w-[40px] py-1 px-2 rounded-md bg-neutral-100 items-center'
                  }>
                  <Text
                    className={
                      strategy.countTone === 'danger'
                        ? 'typo-body-small-medium text-error-500'
                        : 'typo-body-small-medium text-neutral-700'
                    }>
                    {strategy.count}
                  </Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                activeOpacity={0.8}
                hitSlop={{ bottom: 15, left: 15, right: 15, top: 15 }}
                onPress={() => handlePressItem()}
                style={{ borderRadius: 6, padding: 4 }}
                underlayColor='#e5e5e5'>
                <ChevronRightIcon color={colors.iconColors.default} size={20} />
              </TouchableHighlight>
            </View>
          </View>

          <View className='h-px bg-neutral-200 my-2' />
          <TouchableHighlight
            activeOpacity={0.8}
            onPress={() => handlePressItem()}
            style={{
              borderRadius: 6,
              marginHorizontal: -4,
              paddingHorizontal: 4,
              paddingVertical: 6,
            }}
            underlayColor='#e5e5e5'>
            <View className='flex-row items-center justify-between gap-2'>
              <Text
                className='typo-body-small-regular flex-1 text-neutral-800'
                ellipsizeMode='tail'
                numberOfLines={1}
                style={{ minWidth: 0 }}>
                {strategy.subtitle.prefix}
                <Text className='text-success-500'>
                  {strategy.subtitle.accentText}
                </Text>
                {strategy.subtitle.suffix}
              </Text>
              <Text className='typo-body-small-regular shrink-0 text-neutral-500'>
                {strategy.rightMeta}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      ))}

      {/* Button View All ra Discover */}
      <TouchableOpacity
        activeOpacity={0.8}
        className='mt-4 w-full items-center justify-center rounded-lg bg-neutral-100 py-3'
        onPress={handlePressViewAll}>
        <Text className='typo-button-large-medium text-neutral-900'>
          View more
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
