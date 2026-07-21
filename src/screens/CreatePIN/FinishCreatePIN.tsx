import { View } from 'react-native'
import LottieView from 'lottie-react-native'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { SafeScreen } from '@/components/templates'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { TouchableOpacity } from 'react-native'

function FinishCreatePIN({
  navigation,
}: RootScreenProps<Paths.FinishCreatePIN>) {
  const handleGetStarted = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: Paths.Main }],
    })
  }

  return (
    <SafeScreen>
      <View className='flex-1 bg-white px-4'>
        <View className='flex-1 items-center justify-center'>
          {/* Success Animation */}
          <LottieView
            autoPlay
            loop={false}
            source={require('@/assets/lottie/finishcreatepin.json')}
            style={{ width: 250, height: 250 }}
          />

          {/* Title */}
          <Text className='text-h2-semibold text-neutral-900 text-center'>
            You're All Set!
          </Text>

          {/* Subtitle */}
          <Text className='text-body-large-medium text-neutral-900 text-center mt-1'>
            Your security PIN has been activated
          </Text>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          className='py-4 rounded-[4px] mb-5 bg-primary-500'
          onPress={handleGetStarted}>
          <Text className='text-white text-button-large-medium text-center'>
            Get started
          </Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  )
}

export default FinishCreatePIN
