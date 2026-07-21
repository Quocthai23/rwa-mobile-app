import React from 'react'
import { View } from 'react-native'
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'

import type { Candle } from '@/services/marketService'
import { useTheme } from '@/theme'

type MiniChartProps = {
  candles: Candle[]
  height?: number
  isPositive?: boolean
  strokeWidth?: number
  width?: number
}

const MiniChart = ({
  candles,
  height = 37.5,
  isPositive = false,
  strokeWidth = 0.42,
  width = 75,
}: MiniChartProps) => {
  const { colors } = useTheme()

  if (!candles || candles.length === 0) {
    return <View style={{ height, width }} />
  }

  const prices = candles.map((c) => c.close)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice

  if (priceRange === 0) {
    return <View style={{ height, width }} />
  }

  const points = candles.map((candle, index) => {
    const x = (index / (candles.length - 1)) * width
    const normalizedPrice = (candle.close - minPrice) / priceRange
    const y = height - normalizedPrice * height

    return { x, y }
  })

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  const strokeColor = isPositive ? colors.success500 : colors.error500
  const gradientId = isPositive ? 'positiveGradient' : 'negativeGradient'

  return (
    <View style={{ height, width }}>
      <Svg height={height} width={width}>
        <Defs>
          <LinearGradient id={gradientId} x1='0%' x2='0%' y1='0%' y2='100%'>
            <Stop offset='0%' stopColor={strokeColor} stopOpacity='1' />
            <Stop offset='93%' stopColor={strokeColor} stopOpacity='0' />
          </LinearGradient>
        </Defs>

        {/* Fill area with gradient */}
        <Path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Line path */}
        <Path
          d={linePath}
          fill='none'
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </Svg>
    </View>
  )
}

export default MiniChart
