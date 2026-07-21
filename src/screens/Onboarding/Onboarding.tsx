import { useMemo, useRef, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import PagerView from 'react-native-pager-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useAuthStore } from '@/store/authStore'

function Onboarding({ navigation }: RootScreenProps<Paths.Onboarding>) {
  const insets = useSafeAreaInsets()
  const pagerReference = useRef<PagerView>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding)

  const slides = useMemo(
    () => [
      {
        description:
          'Trade Forex, Stocks, and Crypto all in one place with real-time data.',
        title: 'Welcome to MTXTrading',
      },
      {
        description:
          'Advanced charts and analysis tools to help you make better decisions.',
        title: 'Powerful Tools',
      },
      {
        description: 'Auto-copy top traders and earn while you learn.',
        title: 'Copy Trading',
      },
    ],
    [],
  )

  const handleNext = () => {
    if (pageIndex < slides.length - 1) {
      pagerReference.current?.setPage(pageIndex + 1)
    } else {
      completeOnboarding()

      navigation.reset({
        index: 0,
        routes: [{ name: Paths.Main }],
      })
    }
  }

  const handleSkip = () => {
    completeOnboarding()

    navigation.reset({
      index: 0,
      routes: [{ name: Paths.Main }],
    })
  }

  // Mock images for now if assets don't exist, we'll use Views with background color
  const renderSlideImage = (index: number) => {
    // In a real app we would use actual images.
    // For this prototype, I'll use a placeholder View with an icon or simple shape.
    return (
      <View className='h-64 w-64 bg-gray-200 rounded-full items-center justify-center mb-10 overflow-hidden'>
        <Text className='text-6xl'>
          {index === 0 ? '👋' : index === 1 ? '📈' : '🚀'}
        </Text>
      </View>
    )
  }

  return (
    <View className='flex-1 bg-white' style={{ paddingBottom: insets.bottom }}>
      <PagerView
        ref={pagerReference}
        className='flex-1'
        initialPage={0}
        style={{ flex: 1 }}
        onPageSelected={(e) => {
          setPageIndex(e.nativeEvent.position)
        }}>
        {slides.map((slide, index) => (
          <View key={index} className='flex-1 items-center justify-center px-8'>
            {renderSlideImage(index)}
            <Text className='text-3xl font-bold text-center mb-4 text-gray-900'>
              {slide.title}
            </Text>
            <Text className='text-base text-center text-gray-500 leading-6'>
              {slide.description}
            </Text>
          </View>
        ))}
      </PagerView>

      {/* Footer Controls */}
      <View className='px-8 pb-8 pt-4'>
        {/* Pagination Dots */}
        <View className='flex-row justify-center space-x-2 mb-8 gap-2'>
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${index === pageIndex ? 'w-8 bg-primary' : 'w-2 bg-gray-300'}`}
            />
          ))}
        </View>

        {/* Buttons */}
        <View className='flex-row justify-between items-center'>
          <Pressable className='px-4 py-2' onPress={handleSkip}>
            <Text className='text-gray-400 font-semibold text-base'>Skip</Text>
          </Pressable>
          <Pressable
            className='bg-primary-500 px-8 py-3 rounded-full'
            onPress={handleNext}>
            <Text className='text-white font-bold text-base'>
              {pageIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default Onboarding
