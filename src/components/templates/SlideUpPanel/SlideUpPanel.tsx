import { Text, View, type ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type SlideUpPanelProps = {
  readonly children: React.ReactNode
  readonly fillSpace?: boolean
  readonly headerLeft?: React.ReactNode
  readonly headerRight?: React.ReactNode
  readonly title?: string
} & ViewProps

export function SlideUpPanel({
  children,
  fillSpace = true,
  headerLeft,
  headerRight,
  style,
  title,
  ...props
}: SlideUpPanelProps) {
  const insets = useSafeAreaInsets()

  return (
    <View style={{ flex: fillSpace ? 1 : 0, paddingBottom: insets.bottom }}>
      <View
        className={`bg-white rounded-t-3xl overflow-hidden ${fillSpace ? 'flex-1' : ''}`}
        {...props}>
        {/* Drag Handle */}
        <View className='items-center pt-3 pb-3 bg-white w-full'>
          <View className='w-12 h-1.5 bg-gray-300 rounded-full' />
        </View>

        {/* Header */}
        {title || headerLeft || headerRight ? (
          <View className='relative flex-row items-center justify-between px-4 pb-4 bg-white border-b border-gray-100 min-h-[48px]'>
            {/* Title Absolute Center */}
            {title ? (
              <View
                className='absolute left-0 right-0 bottom-4 justify-center items-center z-0'
                pointerEvents='none'>
                <Text
                  className='text-lg font-bold text-gray-900 text-center px-12'
                  numberOfLines={1}>
                  {title}
                </Text>
              </View>
            ) : null}

            {/* Buttons (z-index higher to ensure clickability) */}
            <View className='flex-1 items-start justify-center z-10'>
              {headerLeft}
            </View>

            <View className='flex-1 items-end justify-center z-10'>
              {headerRight}
            </View>
          </View>
        ) : null}

        {/* Content */}
        <View className={fillSpace ? 'flex-1' : ''} style={style}>
          {children}
        </View>
      </View>
    </View>
  )
}
