import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { useTheme } from '@/theme'

type Props = {
  size?: number
  color?: string
  strokeColor?: string
}

const SortIcon = ({ size = 24, color, strokeColor }: Props) => {
  const { colors } = useTheme()
  const colorResolved = color ?? colors.primary500
  const strokeColorResolved = strokeColor ?? colors.neutral700
  return (
    <Svg width={size} height={size} viewBox='0 0 20 20' fill='none'>
      <Path
        d='M5 10H15M2.5 5H17.5M7.5 15H12.5'
        stroke={strokeColorResolved}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill={colorResolved}
      />
    </Svg>
  )
}

export default SortIcon
