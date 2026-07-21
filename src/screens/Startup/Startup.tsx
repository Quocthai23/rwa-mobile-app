import LottieView from 'lottie-react-native'
import { useEffect } from 'react'
import { View } from 'react-native'

import { storage } from '@/App'
import { SafeScreen } from '@/components/templates'
import { PIN_SESSION_VERIFIED_KEY } from '@/constants/pin'
import { usePINGuard } from '@/hooks/usePINGuard'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useAuthStore } from '@/store/authStore'
import { useTheme } from '@/theme'

function Startup({ navigation }: RootScreenProps<Paths.Startup>) {
  const { layout } = useTheme()
  const { hasSeenOnboarding, isAuthenticated } = useAuthStore()
  const { hasPIN, shouldRequirePIN } = usePINGuard()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasSeenOnboarding) {
        navigation.reset({
          index: 0,
          routes: [{ name: Paths.Onboarding }],
        })
      } else if (isAuthenticated) {
        const hasPinSet = hasPIN()
        const sessionVerified = storage.getString(PIN_SESSION_VERIFIED_KEY)

        if (hasPinSet && (sessionVerified !== 'true' || shouldRequirePIN())) {
          storage.set(PIN_SESSION_VERIFIED_KEY, 'false')
          navigation.reset({
            index: 0,
            routes: [{ name: Paths.EnterPIN }],
          })
        } else if (hasPinSet) {
          storage.set(PIN_SESSION_VERIFIED_KEY, 'true')
          navigation.reset({
            index: 0,
            routes: [{ name: Paths.Main }],
          })
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: Paths.Main }],
          })
        }
      } else {
        navigation.reset({
          index: 1,
          routes: [{ name: Paths.Main }, { name: Paths.Login }],
        })
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [hasSeenOnboarding, isAuthenticated, hasPIN, navigation, shouldRequirePIN])

  return (
    <SafeScreen>
      <View
        style={[
          layout.flex_1,
          layout.col,
          layout.itemsCenter,
          layout.justifyCenter,
        ]}>
        <LottieView
          autoPlay
          loop
          source={require('@/theme/assets/images/MTX1.json')}
          style={{ width: 200, height: 200 }}
        />

        {/* <ActivityIndicator size='large' style={[gutters.marginVertical_24]} /> */}
      </View>
    </SafeScreen>
  )
}

export default Startup
