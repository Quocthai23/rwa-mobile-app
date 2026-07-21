import { CheckCircle2Icon, User2Icon } from 'lucide-react-native'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import AnimatedReact, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { ChevronDown } from '@/components/atoms/Icon'
import { useAccountStore } from '@/store/useAccountStore'
import { formatPriceDecimal } from '@/utils/currency'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/atoms'
import { useAppNavigation } from '@/hooks'
import { Paths } from '@/navigation/paths'

import useTheme from '@/theme/hooks/useTheme'

function AccountDropdown() {
  const { colors } = useTheme()
  const user = useAuthStore((state) => state.user)
  const navigation = useAppNavigation()
  const selectedAccount = useAccountStore((s) => s.selectedAccount)
  const accounts = useAccountStore((s) => s.accounts)
  const selectAccount = useAccountStore((s) => s.selectAccount)
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const scaleAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const overlayOpacity = useRef(new Animated.Value(0)).current

  const accountData = {
    availableBalance: selectedAccount
      ? Number(selectedAccount.availableBalance)
      : 0,
    balance: selectedAccount
      ? Number(selectedAccount.availableBalance || 0) +
        Number(selectedAccount.lockedBalance || 0)
      : 0,
    equity: selectedAccount
      ? Number(selectedAccount.availableBalance || 0) +
        Number(selectedAccount.lockedBalance || 0)
      : 0,
    isDemo: selectedAccount
      ? selectedAccount.accountTypeId.includes('demo')
      : true,
    margin: 0,
    marginLevel: 0,
    profitLoss: 0,
  }

  useEffect(() => {
    if (showAccountDropdown) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          friction: 12,
          tension: 80,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          duration: 250,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          duration: 250,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          duration: 200,
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          duration: 150,
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          duration: 150,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [showAccountDropdown])

  const rotate = useSharedValue(0)

  useEffect(() => {
    rotate.value = withTiming(showAccountDropdown ? 180 : 360, {
      duration: 200,
    })
  }, [showAccountDropdown])

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }))
  if (!user)
    return (
      <View>
        <Button
          size={36}
          label={'Login'}
          onPress={() => navigation.navigate(Paths.Login)}
        />
      </View>
    )

  return (
    <>
      <Pressable
        className='flex-row items-center gap-2'
        onPress={() => setShowAccountDropdown(!showAccountDropdown)}>
        <View className='items-end gap-1'>
          <View className='flex-row items-center gap-1'>
            <Text className='text-body-small-semibold text-neutral-900'>
              ${formatPriceDecimal(accountData.balance, 0, 2)}
            </Text>
            <AnimatedReact.View style={style}>
              <ChevronDown size={16} />
            </AnimatedReact.View>
          </View>

          <View className='flex-row items-center gap-2'>
            <Text className='text-caption-regular text-neutral-900'>
              Available
            </Text>
            <Text className='text-caption-medium w-[54px] h-[28px] text-center text-primary-500 bg-primary-100 rounded-md leading-7'>
              {accountData.isDemo ? 'Demo' : 'Live'}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Overlay */}
      <Animated.View
        pointerEvents={showAccountDropdown ? 'auto' : 'none'}
        style={{
          bottom: -1000,
          left: 0,
          opacity: overlayOpacity,
          position: 'absolute',
          right: 0,
          top: 100,
          zIndex: 20,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1 }}
          onPress={() => {
            setShowAccountDropdown(false)
          }}
        />
      </Animated.View>

      {/* Account Dropdown */}
      <Animated.View
        pointerEvents={showAccountDropdown ? 'auto' : 'none'}
        style={{
          left: 0,
          opacity: opacityAnim,
          position: 'absolute',
          right: 0,
          top: 0,
          transform: [{ scaleY: scaleAnim }],
          transformOrigin: 'top',
          zIndex: 30,
        }}
        className='bg-white border-b border-neutral-200 mt-20'>
        <View className='px-4 py-1'>
          <View className='flex-row flex-wrap -mx-2'>
            <ItemDropdown
              label='Equity'
              value={`$${formatPriceDecimal(accountData.equity, 0, 2)}`}
            />
            <ItemDropdown
              color={
                accountData.profitLoss >= 0
                  ? 'text-success-600'
                  : 'text-error-600'
              }
              label='Profit/Loss'
              value={`${accountData.profitLoss >= 0 ? '+' : ''}$${accountData.profitLoss.toFixed(2)}`}
            />
            <ItemDropdown
              label='Balance'
              value={`$${formatPriceDecimal(accountData.balance, 0, 2)}`}
              borderColor='border-primary-500'
              textColor='text-primary-500'
              bgColor='bg-primary-50'
            />
            <ItemDropdown
              label='Available '
              value={`$${formatPriceDecimal(accountData.availableBalance, 0, 2)}`}
            />
            <ItemDropdown
              label='Margin'
              value={`$${formatPriceDecimal(accountData.margin, 0, 2)}`}
            />
            <ItemDropdown
              label='Margin Level'
              color={
                accountData.profitLoss >= 0
                  ? 'text-success-600'
                  : 'text-error-600'
              }
              value={accountData.marginLevel.toFixed(2)}
            />
          </View>
        </View>
      </Animated.View>
    </>
  )
}

export default AccountDropdown

function ItemDropdown({
  color,
  label,
  value,
  borderColor,
  textColor,
  bgColor,
}: {
  readonly color?: string
  readonly label: string
  readonly value: string
  readonly borderColor?: string
  readonly textColor?: string
  readonly bgColor?: string
}) {
  return (
    <View className='justify-between p-2 w-1/2 rounded-md'>
      <View
        className={`justify-between p-3 border ${borderColor ?? 'border-neutral-200'} ${bgColor ?? ''} w-full rounded-md`}>
        <Text className={`text-body-small-medium text-secondary-500`}>
          {label}
        </Text>
        <Text
          className={`text-body-medium ${color ?? textColor ?? 'text-gray-900'}`}>
          {value}
        </Text>
      </View>
    </View>
  )
}
