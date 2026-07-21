import React from 'react'
import Svg, { G, Mask, Path, Defs, ClipPath, Rect } from 'react-native-svg'
import { useTheme } from '@/theme'

type Props = {
  readonly size?: number
  readonly strokeColor?: string
}

const SearchCloseIcon = ({ size = 44, strokeColor }: Props) => {
  const { colors } = useTheme()
  const strokeColorResolved = strokeColor ?? colors.neutral700
  return (
    <Svg width={size} height={size} viewBox='0 0 44 44' fill='none'>
      <G clipPath='url(#clip0_355_27416)'>
        <Mask
          id='mask0_355_27416'
          maskUnits='userSpaceOnUse'
          x={0}
          y={0}
          width={44}
          height={44}>
          <Path d='M0 0H44V44H0V0Z' fill='#fff' />
        </Mask>

        <G mask='url(#mask0_355_27416)'>
          <Path
            d='M40.1461 26.125C41.505 23.7429 42.2812 20.9855 42.2812 18.0469C42.2812 9.02903 34.9709 1.71875 25.9531 1.71875C16.9353 1.71875 9.625 9.02903 9.625 18.0469C9.625 27.0647 16.9353 34.375 25.9531 34.375C28.8565 34.375 31.5828 33.6172 33.9453 32.2886'
            stroke={strokeColorResolved}
            strokeWidth={3.4375}
            strokeMiterlimit={10}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <Path
            d='M14.3516 29.7344L1.71875 42.2812'
            stroke={strokeColorResolved}
            strokeWidth={3.4375}
            strokeMiterlimit={10}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <Path
            d='M20.7969 23.2031L31.1094 12.8906'
            stroke={strokeColorResolved}
            strokeWidth={3.4375}
            strokeMiterlimit={10}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <Path
            d='M20.7969 12.8906L31.1094 23.2031'
            stroke={strokeColorResolved}
            strokeWidth={3.4375}
            strokeMiterlimit={10}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </G>
      </G>

      <Defs>
        <ClipPath id='clip0_355_27416'>
          <Rect width={44} height={44} fill='#fff' />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default SearchCloseIcon
