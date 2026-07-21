import { useNavigation } from '@react-navigation/native'
import { type StackNavigationProp } from '@react-navigation/stack'

import { type RootStackParamList } from '@/navigation/types'

export const useAppNavigation = () => {
  return useNavigation<StackNavigationProp<RootStackParamList>>()
}
