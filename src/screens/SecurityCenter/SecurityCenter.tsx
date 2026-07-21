import { ChevronRight } from 'lucide-react-native'
import { Pressable, ScrollView, Switch, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { Header, SafeScreen } from '@/components/templates'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'

const RING_SIZE = 64
const STROKE_WIDTH = 5
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function CircleProgress({
  max,
  value,
}: {
  readonly max: number
  readonly value: number
}) {
  const progress = value / max
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress)
  const { colors } = useTheme()
  return (
    <View
      className='items-center justify-center'
      style={{ width: RING_SIZE, height: RING_SIZE }}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        {/* Background track */}
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke={colors.neutral200}
          strokeWidth={STROKE_WIDTH}
          fill='none'
        />
        {/* Progress arc */}
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke={colors.primary500}
          strokeWidth={STROKE_WIDTH}
          fill='none'
          strokeLinecap='round'
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          rotation={-90}
          origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
        />
      </Svg>
      <View className='absolute items-center justify-center'>
        <Text className='text-h4-bold text-neutral-700'>
          {value}/{max}
        </Text>
      </View>
    </View>
  )
}

type SecurityItemProps = {
  readonly isDestructive?: boolean
  readonly label: string
  readonly onPress?: () => void
  readonly rightElement?: React.ReactNode
}

function SecurityItem({
  isDestructive = false,
  label,
  onPress,
  rightElement,
}: SecurityItemProps) {
  const { colors } = useTheme()
  return (
    <Pressable
      className='flex-row items-center justify-between py-4 border-b border-neutral-100'
      onPress={onPress}>
      <Text
        className={`flex-1 text-body-large-medium ${isDestructive ? 'text-error-500' : 'text-neutral-900'}`}>
        {label}
      </Text>
      {rightElement ?? <ChevronRight color={colors.neutral500} size={20} />}
    </Pressable>
  )
}

function SecurityCenter({ navigation }: RootScreenProps<Paths.SecurityCenter>) {
  const { colors } = useTheme()
  const securityScore = 1
  const maxScore = 5

  return (
    <SafeScreen className='bg-white'>
      <Header label='Security Center' />

      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}>
        {/* Security Level Card */}
        <View className='bg-neutral-50 rounded-xl p-4 mt-4 flex-row items-center'>
          <View className='mr-4'>
            <CircleProgress value={securityScore} max={maxScore} />
          </View>
          <View className='flex-1'>
            <View className='flex-row items-center mb-1'>
              <Text className='text-body-large-semibold text-neutral-900 mr-2'>
                Security level:
              </Text>
              <Text className='text-body-large-semibold text-error-500'>
                Weak
              </Text>
            </View>
            <Text className='text-body-small-regular text-neutral-500'>
              Weak account security. Please enable more verification options
            </Text>
          </View>
        </View>

        {/* Security Verification Options */}
        <Text className='text-body-small-regular text-neutral-400 mt-8 mb-1'>
          Security Verification Options
        </Text>
        <View>
          <SecurityItem
            label='Change PIN'
            onPress={() => navigation.navigate(Paths.ChangePINCode)}
          />
          <SecurityItem
            label='Google Authenticator(2FA)'
            onPress={() => navigation.navigate(Paths.GoogleAuthenticator)}
            rightElement={
              <View className='flex-row items-center'>
                <Text className='text-body-medium text-neutral-400 mr-1'>
                  Off
                </Text>
                <ChevronRight color={colors.neutral500} size={20} />
              </View>
            }
          />
          <SecurityItem label='Email Management' />
          <SecurityItem
            label='Change Password'
            onPress={() => navigation.navigate(Paths.ChangePassword)}
          />
          <SecurityItem
            label='Set Fund Password'
            onPress={() => navigation.navigate(Paths.SetFundPassword)}
          />
        </View>

        {/* Advanced Settings */}
        <Text className='text-body-small-regular text-neutral-400 mt-8 mb-1'>
          Advanced Settings
        </Text>
        <View>
          <SecurityItem
            label='Face ID'
            rightElement={
              <Switch
                trackColor={{
                  false: colors.neutral200,
                  true: colors.primary500,
                }}
                thumbColor={colors.neutral0}
                value
              />
            }
          />
          <SecurityItem
            label='Lock account'
            onPress={() => navigation.navigate(Paths.LockAccount)}
          />
          <SecurityItem isDestructive label='Delete account' />
        </View>
      </ScrollView>
    </SafeScreen>
  )
}

export default SecurityCenter
