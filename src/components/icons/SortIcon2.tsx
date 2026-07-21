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
        d='M6.66602 7.50033L9.99935 4.16699L13.3327 7.50033H6.66602Z'
        stroke={strokeColorResolved}
        strokeWidth='1.11111'
        strokeLinejoin='round'
        fill={colorResolved}
      />
      <Path
        d='M13.334 12.4997L10.0007 15.833L6.66732 12.4997H13.334Z'
        stroke={strokeColorResolved}
        strokeWidth='1.11111'
        strokeLinejoin='round'
        fill={colorResolved}
      />
    </Svg>
  )
}

export default SortIcon
