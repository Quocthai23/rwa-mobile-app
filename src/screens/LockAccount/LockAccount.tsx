import { TriangleAlert } from 'lucide-react-native'
import { View } from 'react-native'

import { Button } from '@/components/atoms'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { Header, SafeScreen } from '@/components/templates'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { error } from '@/theme/colors'

const LOCK_CONSEQUENCES = [
  'Terminate all ongoing withdrawal and verification option change requests',
  'Log out all devices and suspend login, trading, and API functions',
  'Restrict API key usage',
  'Remove all trusted devices',
]

function LockAccount({ navigation }: RootScreenProps<Paths.LockAccount>) {
  const handleLockAccount = () => {
    // TODO: call API to lock account
  }

  return (
    <SafeScreen className='bg-white'>
      <Header />

      <View className='flex-1 px-5'>
        {/* Icon */}
        <View className='items-center mt-10 mb-6'>
          <View className='size-16 rounded-full bg-error-50 items-center justify-center'>
            <TriangleAlert color={error[500]} size={28} />
          </View>
        </View>

        {/* Title */}
        <Text className='text-h2-bold text-neutral-900 text-center mb-6'>
          Lock your account?
        </Text>

        {/* Description */}
        <Text className='text-body-regular text-neutral-700 mb-4'>
          If you suspect your account is compromised, you can immediately lock
          it to prevent asset theft.{'\n'}Locking will result in the following:
        </Text>

        {/* Bullet points */}
        <View className='ml-2'>
          {LOCK_CONSEQUENCES.map((item) => (
            <View key={item} className='flex-row mb-3'>
              <Text className='text-body-regular text-neutral-900 mr-2'>•</Text>
              <Text className='text-body-regular text-neutral-900 flex-1'>
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* Spacer */}
        <View className='flex-1' />

        {/* Lock Button */}
        <View className='mb-6'>
          <Button label='Lock account' onPress={handleLockAccount} />
        </View>
      </View>
    </SafeScreen>
  )
}

export default LockAccount
