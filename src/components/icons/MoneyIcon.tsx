;<svg
  fill='none'
  height='24'
  viewBox='0 0 24 24'
  width='24'
  xmlns='http://www.w3.org/2000/svg'>
  <path
    d='M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z'
    stroke='#374151'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeMiterlimit='10'
    strokeWidth='2'
  />
  <path
    d='M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z'
    stroke='#374151'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeMiterlimit='10'
    strokeWidth='2'
  />
  <path
    d='M5.5 9.5V14.5'
    stroke='#374151'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeMiterlimit='10'
    strokeWidth='2'
  />
  <path
    d='M18.5 9.5V14.5'
    stroke='#374151'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeMiterlimit='10'
    strokeWidth='2'
  />
</svg>

import Svg, { Path } from 'react-native-svg'
import { useTheme } from '@/theme'

type Props = {
  readonly color?: string
  readonly size?: number
  readonly strokeColor?: string
}

function MoneyIcon({ color, size = 24, strokeColor }: Props) {
  const { colors } = useTheme()
  const strokeColorResolved = strokeColor ?? colors.neutral700
  return (
    <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
      <Path
        d='M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z'
        stroke={strokeColorResolved}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeMiterlimit='10'
        strokeWidth='2'
      />
      <Path
        d='M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z'
        stroke={strokeColorResolved}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeMiterlimit='10'
        strokeWidth='2'
      />
      <Path
        d='M5.5 9.5V14.5'
        stroke={strokeColorResolved}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeMiterlimit='10'
        strokeWidth='2'
      />
      <Path
        d='M18.5 9.5V14.5'
        stroke={strokeColorResolved}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeMiterlimit='10'
        strokeWidth='2'
      />
    </Svg>
  )
}

export default MoneyIcon
