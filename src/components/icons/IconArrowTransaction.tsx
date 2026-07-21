import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { useTheme } from '@/theme'

type Props = {
  size?: number
  color?: string
}

const IconArrowTransaction = ({ size = 24, color }: Props) => {
  const { colors } = useTheme()
  const colorResolved = color ?? colors.neutral700
  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M3.33301 10H16.6663M16.6663 10L11.6663 5M16.6663 10L11.6663 15'
        stroke={colorResolved}
        strokeWidth='1.66667'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  )
}

export default IconArrowTransaction
