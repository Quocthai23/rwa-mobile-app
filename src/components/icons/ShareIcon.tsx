import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { useTheme } from '@/theme'

type Props = {
  readonly color?: string
  readonly size?: number
  readonly strokeColor?: string
}

function ShareIcon({ color, size = 24, strokeColor }: Props) {
  const { colors } = useTheme()
  const colorResolved = color ?? colors.primary500
  const strokeColorResolved = strokeColor ?? colors.neutral700
  return (
    <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
      <Path
        d='M21 9L21 3M21 3H15M21 3L13 11M10 5H7.8C6.11984 5 5.27976 5 4.63803 5.32698C4.07354 5.6146 3.6146 6.07354 3.32698 6.63803C3 7.27976 3 8.11984 3 9.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V14'
        fill={colorResolved}
        stroke={strokeColorResolved}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </Svg>
  )
}

export default ShareIcon
