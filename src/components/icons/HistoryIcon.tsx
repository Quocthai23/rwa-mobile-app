import React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
import { useTheme } from '@/theme'

type Props = {
  size?: number
  color?: string
}

const HistoryIcon = ({ size = 24, color }: Props) => {
  const { colors } = useTheme()
  const colorResolved = color ?? colors.neutral700
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Defs>
        <ClipPath id='clip0_355_25358'>
          <Rect width='24' height='24' fill='white' />
        </ClipPath>
      </Defs>
      <G clipPath='url(#clip0_355_25358)'>
        <Path
          d='M22.7 13.5L20.7005 11.5L18.7 13.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C15.3019 3 18.1885 4.77814 19.7545 7.42909M12 7V12L15 14'
          stroke={colorResolved}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </G>
    </Svg>
  )
}

export default HistoryIcon
