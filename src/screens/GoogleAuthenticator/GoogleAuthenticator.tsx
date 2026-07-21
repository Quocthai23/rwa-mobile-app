import { Switch, View } from 'react-native'

import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { Header, SafeScreen } from '@/components/templates'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { neutral } from '@/theme/colors'
import { useTheme } from '@/theme'

function GoogleAuthenticator({
  navigation,
}: RootScreenProps<Paths.GoogleAuthenticator>) {
  const { colors } = useTheme()
  return (
    <SafeScreen className='bg-white'>
      <Header label='Google Authenticator(2FA)' />

      <View className='px-5 mt-2'>
        <View className='flex-row items-center justify-between py-4'>
          <Text className='text-body-large-medium text-neutral-900'>
            Google Authenticator
          </Text>
          <Switch
            trackColor={{ false: colors.gray200, true: colors.primary500 }}
            thumbColor={neutral[0]}
            value={false}
          />
        </View>
      </View>
    </SafeScreen>
  )
}

export default GoogleAuthenticator
