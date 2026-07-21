import { SafeScreen } from '@/components/templates'
import { View } from 'react-native'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { Paths } from '@/navigation/paths'
import { useNavigation } from '@react-navigation/native'
import LayersThree02Icon from '@/theme/assets/icons/position/layers-three-02.svg'
import SwitchVertical01Icon from '@/theme/assets/icons/position/switch-vertical-01.svg'
import ShieldTick01Icon from '@/theme/assets/icons/position/shield-tick.svg'
import Lock01Icon from '@/theme/assets/icons/position/lock-01.svg'
import ButtonCustom from '@/components/atoms/Button/ButtonCustom'
import { UserIcon } from 'lucide-react-native'
import { useTheme } from '@/theme'
import { Pressable } from 'react-native'

const NoSignIn = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  return (
    <SafeScreen className='flex-1 bg-white'>
      {/* Content */}
      <View className='flex-1 px-4'>
        {/* Avatar and Auth Buttons */}
        <View className='flex-row items-center py-8 gap-4'>
          {/* Avatar */}
          <View className='w-12 h-12 rounded-full bg-neutral-700 items-center justify-center'>
            <UserIcon size={24} color={colors.neutral0} />
          </View>

          {/* Login and Sign Up Buttons */}
          <View className='flex-row items-center gap-1.5 flex-1'>
            <Pressable
              onPress={() => navigation.navigate(Paths.Login as never)}>
              <Text className='text-body-large-semibold text-neutral-900'>
                Log In
              </Text>
            </Pressable>
            <Text className='text-[25px] text-neutral-900'>|</Text>
            <Pressable
              onPress={() => navigation.navigate(Paths.Register as never)}>
              <Text className='text-body-large-semibold text-neutral-900'>
                Sign Up
              </Text>
            </Pressable>
          </View>
          <View>
            <ButtonCustom
              type='APPLY'
              title='Log In'
              onPress={() => navigation.navigate(Paths.Login as never)}
              style={{ flex: 0 }}
              className='h-[20px] w-[80px]'
            />
          </View>
        </View>

        <Text className='text-h3-semibold text-neutral-900 text-center py-8'>
          Ready for your first portfolio? Just sign in or join us!
        </Text>

        {/* Features List */}
        <View className='gap-6 mb-8'>
          {/* Wide Market Access */}
          <View className='flex-row items-start gap-3'>
            <View className='items-center justify-center'>
              <LayersThree02Icon width={24} height={24} />
            </View>
            <View className='flex-1 space-y-2'>
              <Text className='text-body-large-semibold text-neutral-900'>
                Wide Market Access
              </Text>
              <Text className='text-body-small-regular text-secondary-500'>
                Explore a broad selection of globally popular stocks and
                indices.
              </Text>
            </View>
          </View>

          {/* Reliable Trading Execution */}
          <View className='flex-row items-start gap-3'>
            <SwitchVertical01Icon width={24} height={24} />
            <View className='flex-1 space-y-2'>
              <Text className='text-body-large-semibold text-neutral-900'>
                Reliable Trading Execution
              </Text>
              <Text className='text-body-small-regular text-secondary-500'>
                Place orders quickly with smooth and efficient trade processing.
              </Text>
            </View>
          </View>

          {/* Balance Protection */}
          <View className='flex-row items-start gap-3'>
            <ShieldTick01Icon width={24} height={24} />
            <View className='flex-1 space-y-2'>
              <Text className='text-body-large-semibold text-neutral-900'>
                Balance Protection
              </Text>
              <Text className='text-body-small-regular text-secondary-500'>
                Your account is protected from falling into a negative balance.
              </Text>
            </View>
          </View>

          {/* Secure Trading Environment */}
          <View className='flex-row items-start gap-3'>
            <Lock01Icon width={24} height={24} />
            <View className='flex-1 space-y-2'>
              <Text className='text-body-large-semibold text-neutral-900'>
                Secure Trading Environment
              </Text>
              <Text className='text-body-small-regular text-secondary-500'>
                Trade confidently with SSL-secured protection.
              </Text>
            </View>
          </View>
        </View>
        {/* Button at bottom */}
      </View>
    </SafeScreen>
  )
}

export default NoSignIn
