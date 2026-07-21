import React, { memo } from 'react'
import { Image, Pressable, Text, View } from 'react-native'

import { useTheme } from '@/theme'

type ViewType = 'spread' | 'chart'

type LayoutSymbolViewProps = {
  readonly onSelect: (viewType: ViewType) => void
  readonly selectedView: ViewType
}

function LayoutSymbolView({ onSelect, selectedView }: LayoutSymbolViewProps) {
  const { colors } = useTheme()

  return (
    <View className='pt-2 pb-10'>
      <Text className='text-h3-semibold pb-4 px-4 border-b border-neutral-200'>
        Switch List Style
      </Text>

      <View className='mt-5 px-4 flex-row gap-3'>
        {/* Spread View Option */}
        <Pressable className='flex-1' onPress={() => onSelect('spread')}>
          <Text
            className={`text-body-medium mb-2 ${selectedView === 'spread' ? 'text-primary-500' : 'text-neutral-500'}`}>
            Spread View
          </Text>
          <View
            className='rounded-lg border overflow-hidden'
            style={{
              borderWidth: 2,
              borderColor:
                selectedView === 'spread'
                  ? colors.primary500
                  : colors.neutral200,
            }}>
            <Image
              source={require('@/assets/images/market/spread-view.png')}
              style={{ width: '100%', height: 200 }}
              resizeMode='cover'
            />
          </View>
        </Pressable>

        {/* Chart View Option */}
        <Pressable className='flex-1' onPress={() => onSelect('chart')}>
          <Text
            className={`text-body-medium mb-2 ${selectedView === 'chart' ? 'text-primary-500' : 'text-neutral-500'}`}>
            Chart View
          </Text>
          <View
            className='rounded-lg border overflow-hidden'
            style={{
              borderWidth: 2,
              borderColor:
                selectedView === 'chart'
                  ? colors.primary500
                  : colors.neutral200,
            }}>
            <Image
              source={require('@/assets/images/market/chart-view.png')}
              style={{ width: '100%', height: 200 }}
              resizeMode='cover'
            />
          </View>
        </Pressable>
      </View>
    </View>
  )
}

export default memo(LayoutSymbolView)
