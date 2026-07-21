import Svg, { Path } from 'react-native-svg'
import { useTheme } from '@/theme'

type Props = {
  readonly color?: string
  readonly size?: number
  readonly strokeColor?: string
}

function SocialIcon({ color, size = 24, strokeColor }: Props) {
  const { colors } = useTheme()
  const colorResolved = color ?? colors.primary500
  const strokeColorResolved = strokeColor ?? colors.neutral700
  return (
    <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
      <Path
        d='M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22M12 2C9.49872 4.73835 8.07725 8.29203 8 12C8.07725 15.708 9.49872 19.2616 12 22M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22M2.50002 9H21.5M2.5 15H21.5'
        fill={colorResolved}
        stroke={strokeColorResolved}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </Svg>
  )
}

export default SocialIcon
