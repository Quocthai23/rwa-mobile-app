import { Image, Text, View } from 'react-native'

import { Button } from '@/components/atoms'
import { useAppNavigation } from '@/hooks'
import { Paths } from '@/navigation/paths'

export function GuestHomeHeader() {
  const navigation = useAppNavigation()

  return (
    <View className='h-[160px] p-4 w-full justify-center relative'>
      <View className='w-[55%]'>
        <Text className='text-body-small-regular'>
          Connect your crypto world
        </Text>
        <Text className='text-h3-semibold '>
          Ready to Start? Log In to Get Moving!
        </Text>
        <View className='flex-row gap-3 mt-3'>
          <Button
            className='flex-1'
            label='Log in'
            size={40}
            variant='secondaryBrand'
            onPress={() => navigation.navigate(Paths.Login)}
          />
          <Button
            className='flex-1'
            label='Sign up'
            size={40}
            variant='primary'
            onPress={() => navigation.navigate(Paths.Register)}
          />
        </View>
      </View>

      <Image
        resizeMode='contain'
        source={require('@/theme/assets/images/home_banner.png')}
        style={{
          width: 217,
          height: 160,
          position: 'absolute',
          right: 20,
          transform: [{ translateX: 92 }], // 300 / 3
        }}
      />
    </View>
  )
}
