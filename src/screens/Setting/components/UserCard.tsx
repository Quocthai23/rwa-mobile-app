import { BadgeCheckIcon, ChevronRightIcon } from 'lucide-react-native'
import { Image, Pressable, Text, View } from 'react-native'

import { Button } from '@/components/atoms'
import { useAppNavigation } from '@/hooks'
import { Paths } from '@/navigation/paths'
import { useAuthStore } from '@/store/authStore'
import colors from '@/theme/colors'

const USER_PLACEHOLDER_ICON = require('@/assets/images/discover/filled.png')

export function UserCard() {
  const navigation = useAppNavigation()
  const user = useAuthStore((state) => state.user)

  return (
    <View className='flex-row items-center justify-between mt-4 mb-8'>
      <View className='flex-row items-center flex-1'>
        {/* Avatar */}
        <View className='size-10 rounded-full bg-gray-100 items-center justify-center overflow-hidden'>
          {user?.avatarUrl ? (
            <Image className='w-14 h-14' source={{ uri: user.avatarUrl }} />
          ) : (
            <Image
              className='size-10'
              resizeMode='contain'
              source={USER_PLACEHOLDER_ICON}
            />
          )}
        </View>

        {/* User Info */}
        <View className='ml-4 flex-1'>
          <Text className='text-body-semibold text-gray-900' numberOfLines={1}>
            {user?.email || 'Log In | Sign Up'}
          </Text>
          {user ? (
            <View className='bg-blue-50 px-2 py-1 rounded-md self-start mt-1 flex-row items-center'>
              <BadgeCheckIcon
                color='white'
                fill='#2563EB'
                size={20}
                style={{ marginRight: 4 }}
              />
              <Text className='text-primary-500 text-xs font-semibold'>
                Verified
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      {user ? (
        <Pressable
          onPress={() => {
            navigation.navigate(Paths.PersonalInfo)
          }}>
          <ChevronRightIcon color={colors.iconColors.subtle} size={24} />
        </Pressable>
      ) : (
        <View className='flex-row items-center gap-2'>
          <Button
            label='Log In'
            size={36}
            variant='primary'
            onPress={() => {
              navigation.navigate(Paths.Login)
            }}
          />
        </View>
      )}
    </View>
  )
}
