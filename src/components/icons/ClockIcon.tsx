import Svg, { Path } from 'react-native-svg'
import { useTheme } from '@/theme'

type Props = {
  readonly color?: string
  readonly isFilled?: boolean
  readonly size?: number
}

function ClockIcon({ color, isFilled = false, size = 24 }: Props) {
  const { colors } = useTheme()
  const colorResolved = color ?? colors.primary500
  if (isFilled) {
    return (
      <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
        <Path
          clipRule='evenodd'
          d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7V11.5858C11 12.1162 11.2107 12.6249 11.5858 13L13.7929 15.2071C14.1834 15.5976 14.8166 15.5976 15.2071 15.2071C15.5976 14.8166 15.5976 14.1834 15.2071 13.7929L13 11.5858V7Z'
          fill={colorResolved}
          fillRule='evenodd'
        />
      </Svg>
    )
  }

  return (
    <Svg fill='none' height={size} viewBox='0 0 24 24' width={size}>
      <Path
        clipRule='evenodd'
        d='M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z'
        fill={colorResolved}
        fillRule='evenodd'
      />
      <Path
        clipRule='evenodd'
        d='M12 6C12.5523 6 13 6.44772 13 7V11.5858L15.2071 13.7929C15.5976 14.1834 15.5976 14.8166 15.2071 15.2071C14.8166 15.5976 14.1834 15.5976 13.7929 15.2071L11.5858 13C11.2107 12.6249 11 12.1162 11 11.5858V7C11 6.44772 11.4477 6 12 6Z'
        fill={colorResolved}
        fillRule='evenodd'
      />
    </Svg>
  )
}

export default ClockIcon
