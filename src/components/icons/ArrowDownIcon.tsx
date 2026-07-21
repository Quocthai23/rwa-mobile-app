import Svg, { Path } from 'react-native-svg'

import { useTheme } from '@/theme'

type Props = {
  readonly color?: string
  readonly size?: number
}

function ArrowDownIcon({ color, size = 24 }: Props) {
  const { colors } = useTheme()
  const colorResolved = color ?? colors.neutral900

  return (
    <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
      <Path
        d='M17.92 8.17969H11.69H6.07999C5.11999 8.17969 4.63999 9.33969 5.31999 10.0197L10.5 15.1997C11.33 16.0297 12.68 16.0297 13.51 15.1997L15.48 13.2297L18.69 10.0197C19.36 9.33969 18.88 8.17969 17.92 8.17969Z'
        fill={colorResolved}
      />
    </Svg>
  )
}

export default ArrowDownIcon
