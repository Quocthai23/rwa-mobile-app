import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { useTheme } from '@/theme'

type Props = {
  size?: number
  color?: string
  strokeColor?: string
}

const SearchIcon = ({ size = 24, color, strokeColor }: Props) => {
  const { colors } = useTheme()
  const colorResolved = color ?? colors.primary500
  const strokeColorResolved = strokeColor ?? colors.neutral700
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z'
        stroke={strokeColorResolved}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill={colorResolved}
      />
    </Svg>
  )
}

export default SearchIcon
