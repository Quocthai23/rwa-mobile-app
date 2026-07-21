import { SCREEN_WIDTH } from '@gorhom/bottom-sheet'
import React, { useRef, useState, useEffect } from 'react'
import { Image, View } from 'react-native'
import PagerView from 'react-native-pager-view'

const BANNER_DATA = [
  { id: 1, image: require('@/assets/images/Banner.png') },
  { id: 2, image: require('@/assets/images/Banner.png') },
  { id: 3, image: require('@/assets/images/Banner.png') },
  { id: 4, image: require('@/assets/images/Banner.png') },
  { id: 5, image: require('@/assets/images/Banner.png') },
]

const AUTO_SCROLL_INTERVAL = 3000 // 3 seconds

export const HomeBanner = () => {
  const pagerRef = useRef<PagerView>(null)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      const nextPage = (currentPage + 1) % BANNER_DATA.length
      pagerRef.current?.setPage(nextPage)
    }, AUTO_SCROLL_INTERVAL)

    return () => clearInterval(timer)
  }, [currentPage])

  return (
    <View className='my-4'>
      <View style={{ width: SCREEN_WIDTH, height: (SCREEN_WIDTH - 32) * 0.4 }}>
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}>
          {BANNER_DATA.map((banner, index) => (
            <View key={banner.id} style={{ flex: 1, paddingHorizontal: 16 }}>
              <View
                className='rounded-lg overflow-hidden bg-neutral-100'
                style={{ flex: 1 }}>
                <Image
                  resizeMode='cover'
                  source={banner.image}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            </View>
          ))}
        </PagerView>
      </View>

      {/* Pagination Dots */}
      <View className='absolute bottom-4 left-0 right-0 flex-row justify-center items-center mt-3 gap-1.5'>
        {BANNER_DATA.map((_, index) => (
          <View
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === currentPage
                ? 'w-1.5 bg-primary-500'
                : 'w-1.5 bg-neutral-300'
            }`}
          />
        ))}
      </View>
    </View>
  )
}
