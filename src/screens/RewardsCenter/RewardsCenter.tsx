import { Calendar } from 'lucide-react-native'
import { memo } from 'react'
import { ImageBackground, ScrollView, View } from 'react-native'

import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { Header, SafeScreen } from '@/components/templates'
import { type Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import useTheme from '@/theme/hooks/useTheme'

import { RewardHistoryItem } from './components/RewardHistoryItem'
import { ThisMonthIcon } from './components/ThisMonthIcon'
import { TotalEarnIcon } from './components/TotalEarnIcon'
import { MOCK_EARNINGS, MOCK_REWARD_HISTORY } from './mockData'

const BACKGROUND_IMAGE = require('@/assets/images/rewards/background.png')

const CARD_STYLE = {
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 4,
  paddingVertical: 16,
  paddingHorizontal: 8,
} as const

const ICON_WRAP_SIZE = 32
const ICON_SIZE = 19
const TITLE_COLOR = '#6B7280'

function RewardsCenterScreen(_: RootScreenProps<Paths.RewardsCenter>) {
  const { colors } = useTheme()

  return (
    <SafeScreen bottomOnly>
      <Header label='Rewards Center' />
      <ScrollView
        className='flex-1 bg-white'
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}>
        {/* Earnings Summary */}
        <View className='relative mb-6 overflow-hidden'>
          <ImageBackground
            imageStyle={{
              opacity: 1,
              top: -136,
              right: 12,
              transform: [{ scale: 1.09 }],
            }}
            resizeMode='cover'
            source={BACKGROUND_IMAGE}
            style={{ overflow: 'hidden' }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: colors.neutral900,
                marginTop: 20,
              }}>
              Earnings Summary
            </Text>
            <View className='flex-row gap-2 py-4'>
              <View className='flex-1 bg-white' style={CARD_STYLE}>
                <View
                  style={{
                    width: ICON_WRAP_SIZE,
                    height: ICON_WRAP_SIZE,
                    borderRadius: ICON_WRAP_SIZE / 2,
                    backgroundColor: colors.neutral100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}>
                  <Calendar color={colors.neutral700} size={ICON_SIZE} />
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.neutral900,
                  }}>
                  ${MOCK_EARNINGS.today}
                </Text>
                <Text style={{ fontSize: 14, color: TITLE_COLOR }}>Today</Text>
              </View>
              <View className='flex-1 bg-white' style={CARD_STYLE}>
                <View
                  style={{
                    width: ICON_WRAP_SIZE,
                    height: ICON_WRAP_SIZE,
                    borderRadius: ICON_WRAP_SIZE / 2,
                    backgroundColor: colors.neutral100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}>
                  <ThisMonthIcon color={colors.neutral700} size={ICON_SIZE} />
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.neutral900,
                  }}>
                  ${MOCK_EARNINGS.thisMonth}
                </Text>
                <Text style={{ fontSize: 14, color: TITLE_COLOR }}>
                  This Month
                </Text>
              </View>
              <View className='flex-1 bg-white' style={CARD_STYLE}>
                <View
                  style={{
                    width: ICON_WRAP_SIZE,
                    height: ICON_WRAP_SIZE,
                    borderRadius: ICON_WRAP_SIZE / 2,
                    backgroundColor: colors.neutral100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}>
                  <TotalEarnIcon color={colors.neutral700} size={ICON_SIZE} />
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.neutral900,
                  }}>
                  ${MOCK_EARNINGS.totalEarned}
                </Text>
                <Text style={{ fontSize: 14, color: TITLE_COLOR }}>
                  Total Earned
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Reward History */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: colors.neutral900,
            marginBottom: 8,
          }}>
          Reward History
        </Text>
        {MOCK_REWARD_HISTORY.map((group) => (
          <View key={group.date} className='mb-4'>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '400',
                color: '#6B7280',
                marginBottom: 4,
              }}>
              {group.date}
            </Text>
            <View
              style={{
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                backgroundColor: 'white',
                overflow: 'hidden',
                paddingHorizontal: 16,
              }}>
              {group.items.map((item, index) => (
                <View key={`${group.date}-${item.pair}-${index}`}>
                  <RewardHistoryItem item={item} />
                  {index < group.items.length - 1 ? (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: '#E5E7EB',
                      }}
                    />
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeScreen>
  )
}

export default memo(RewardsCenterScreen)
