import Svg, { Path } from 'react-native-svg'

type Props = {
  readonly color?: string
  readonly size?: number
  readonly strokeColor?: string
}

function WithdrawIcon({
  color = '#ffffff',
  size = 24,
  strokeColor = '#12B76A',
}: Props) {
  return (
    <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
      <Path
        d='M2.33938 14.5896C1.44846 11.2534 2.31164 7.54623 4.92893 4.92893C8.83418 1.02369 15.1658 1.02369 19.0711 4.92893C22.9763 8.83418 22.9763 15.1658 19.0711 19.0711C16.4538 21.6884 12.7466 22.5515 9.41045 21.6606M15.0001 15.0001V9.0001M15.0001 9.0001H9.00014M15.0001 9.0001L4.99995 19'
        fill={color}
        stroke={strokeColor}
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </Svg>
  )
}

export default WithdrawIcon
