import LottieView from 'lottie-react-native'
import { useRef } from 'react'
import { Pressable, Text, View } from 'react-native'

export default function Demo2() {
  const reference = useRef<LottieView>(null)

  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
      <LottieView
        ref={reference}
        autoPlay={false}
        loop={false}
        source={require('@/assets/lottie/demo2.json')}
        style={{ height: 120, width: 120 }}
      />

      <Pressable
        style={{
          backgroundColor: '#111',
          borderRadius: 8,
          marginTop: 16,
          padding: 12,
        }}
        onPress={() => {
          reference.current?.reset()
          reference.current?.play()
        }}>
        <Text style={{ color: '#fff' }}>Play</Text>
      </Pressable>
    </View>
  )
}
