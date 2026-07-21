import { useNavigation } from '@react-navigation/native'
import { Pressable, type StyleProp, type ViewStyle } from 'react-native'

import { ArrowLeft } from '@/components/atoms/Icon'
import { gray } from '@/theme/colors'

type BackButtonProps = {
  readonly className?: string
  readonly color?: string
  readonly onPress?: () => void
  readonly size?: number
  readonly style?: StyleProp<ViewStyle>
}

export function BackButton({
  className = '',
  color = gray[800], // gray-900 default
  onPress,
  size = 24,
  style,
}: BackButtonProps) {
  const navigation = useNavigation()

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack()
      }
    }
  }

  return (
    <Pressable
      className={`items-center justify-center ${className}`}
      hitSlop={8}
      style={style}
      onPress={handlePress}>
      <ArrowLeft color={color} size={size} />
    </Pressable>
  )
}
