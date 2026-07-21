import { useEffect, useRef } from 'react'
import { Animated, Pressable, View } from 'react-native'

function SkeletonBlock({
  className = '',
  shimmer = true,
}: {
  readonly className?: string
  readonly shimmer?: boolean
}) {
  const opacity = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    if (!shimmer) return

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          duration: 650,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: 650,
          toValue: 0.5,
          useNativeDriver: true,
        }),
      ]),
    )

    loop.start()

    return () => {
      loop.stop()
    }
  }, [opacity, shimmer])

  return (
    <Animated.View
      className={`bg-gray-700/10 rounded ${className}`}
      style={{ opacity }}
    />
  )
}

// 2) Row skeleton (thay cho Pressable row)
export function SymbolRowSkeleton({
  shimmer = true,
}: {
  readonly shimmer?: boolean
}) {
  return (
    <Pressable
      disabled
      className='flex-row items-center gap-2 border-b border-subTitle py-3'>
      {/* Left 40% */}
      <View className='w-[40%] gap-[6px]'>
        {/* Line 1: symbol + star */}
        <View className='flex-row items-center gap-2'>
          <SkeletonBlock className='h-[18px] w-[70px]' shimmer={shimmer} />
          <SkeletonBlock
            className='h-[18px] w-[18px] rounded-full'
            shimmer={shimmer}
          />
        </View>

        {/* Spread */}
        <SkeletonBlock className='h-[14px] w-[90px]' shimmer={shimmer} />

        {/* Change */}
        <SkeletonBlock className='h-[14px] w-[120px]' shimmer={shimmer} />
      </View>

      {/* Right */}
      <View className='flex-1 flex-row'>
        {/* Bid */}
        <View className='w-1/2 justify-center gap-2'>
          <SkeletonBlock className='h-[18px] w-[80px]' shimmer={shimmer} />
          <SkeletonBlock className='h-[14px] w-[90px]' shimmer={shimmer} />
        </View>

        {/* Ask */}
        <View className='w-1/2 justify-center gap-2'>
          <SkeletonBlock className='h-[18px] w-[80px]' shimmer={shimmer} />
          <SkeletonBlock className='h-[14px] w-[90px]' shimmer={shimmer} />
        </View>
      </View>
    </Pressable>
  )
}
