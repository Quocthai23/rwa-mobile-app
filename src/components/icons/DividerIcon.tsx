import { useTheme } from '@/theme'
import Svg, { Line } from 'react-native-svg'

type Props = {
  readonly width?: number
  readonly height?: number
  readonly strokeColor?: string
}

function DividerIcon({ width = 32, height = 24, strokeColor }: Props) {
  const { colors } = useTheme()
  const strokeColorResolved = strokeColor ?? colors.primary500
  return (
    <Svg fill='none' width={width} height={height} viewBox='0 0 32 24'>
      <Line
        x1='15'
        y1='23'
        x2='15'
        y2='1'
        stroke={strokeColorResolved}
        strokeWidth='2'
        strokeLinecap='round'
        strokeDasharray={[4, 4]}
      />
    </Svg>
  )
}

export default DividerIcon
