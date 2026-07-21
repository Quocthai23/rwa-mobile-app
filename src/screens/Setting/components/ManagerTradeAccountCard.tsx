import { ChevronRightIcon, UserIcon } from 'lucide-react-native'
import { Pressable, Text, View } from 'react-native'

import { useAppNavigation } from '@/hooks'
import { Paths } from '@/navigation/paths'
import { useAuthStore } from '@/store/authStore'
import useTheme from '@/theme/hooks/useTheme'

export function ManagerTradeAccountCard() {
  const navigation = useAppNavigation()
  const user = useAuthStore((s) => s.user)
  const { colors } = useTheme()
  if (!user) return null

  return (
    <Pressable
      className='flex-row items-center justify-between bg-neutral-100 rounded-md p-4 '
      onPress={() => {
        navigation.navigate(Paths.ManageAccounts)
      }}>
      <View className='flex-row items-center'>
        <View className='flex-row mr-2'>
          <View className='size-6 rounded-full bg-pink-100 items-center justify-center border-2 border-white z-10'>
            <UserIcon color={colors.primary500} size={16} />
          </View>
          <View className='size-6 rounded-full bg-gray-100 items-center justify-center border-2 border-white -ml-2 z-10'>
            <Text className='text-xs font-bold text-gray-500'>+</Text>
          </View>
        </View>
        <Text className='text-body-semibold text-gray-900'>
          Manage all accounts
        </Text>
      </View>
      <ChevronRightIcon color={colors.neutral500} size={24} />
    </Pressable>
  )
}
