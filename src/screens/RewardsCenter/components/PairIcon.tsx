import { Image, View } from 'react-native'

import {
  COMPONENT_SIZE,
  FLAG_SIZE,
  PAIR_ICON_MAP,
  REWARD_ICONS,
} from '../constants'

type PairIconProps = {
  pair: string
}

export function PairIcon({ pair }: PairIconProps) {
  const config = PAIR_ICON_MAP[pair]

  if (!config) {
    return <View style={{ width: COMPONENT_SIZE, height: COMPONENT_SIZE }} />
  }

  if (config.type === 'gold') {
    return (
      <View
        style={{
          width: COMPONENT_SIZE,
          height: COMPONENT_SIZE,
          borderRadius: COMPONENT_SIZE / 2,
          overflow: 'hidden',
        }}>
        <Image
          source={REWARD_ICONS.gold}
          style={{ width: COMPONENT_SIZE, height: COMPONENT_SIZE }}
          resizeMode='cover'
        />
      </View>
    )
  }

  const { base, quote } = config
  const inset = COMPONENT_SIZE - FLAG_SIZE
  const circleStyle = {
    width: FLAG_SIZE,
    height: FLAG_SIZE,
    borderRadius: FLAG_SIZE / 2,
    overflow: 'hidden' as const,
  }
  return (
    <View
      style={{
        width: COMPONENT_SIZE,
        height: COMPONENT_SIZE,
        position: 'relative',
      }}>
      {/* First currency (base, e.g. EUR): bottom-left corner */}
      <View
        style={[
          circleStyle,
          {
            position: 'absolute',
            left: 0,
            top: inset,
            zIndex: 1,
          },
        ]}>
        <Image
          source={REWARD_ICONS[base]}
          style={{ width: FLAG_SIZE, height: FLAG_SIZE }}
          resizeMode='cover'
        />
      </View>
      {/* Second currency (quote, e.g. USD): top-right corner */}
      <View
        style={[
          circleStyle,
          {
            position: 'absolute',
            left: inset,
            top: 0,
            zIndex: 0,
          },
        ]}>
        <Image
          source={REWARD_ICONS[quote]}
          style={{ width: FLAG_SIZE, height: FLAG_SIZE }}
          resizeMode='cover'
        />
      </View>
    </View>
  )
}
