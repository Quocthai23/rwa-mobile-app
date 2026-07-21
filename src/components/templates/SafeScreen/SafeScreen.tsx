import { cssInterop } from 'nativewind'
import type { PropsWithChildren } from 'react'
import { StatusBar, View } from 'react-native'
import type { SafeAreaViewProps } from 'react-native-safe-area-context'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { DefaultError } from '@/components/molecules'
import { ErrorBoundary } from '@/components/organisms'
import { useTheme } from '@/theme'

cssInterop(SafeAreaView, {
  className: 'style',
})

type Properties = PropsWithChildren<
  {
    readonly bottomOnly?: boolean
    readonly isError?: boolean
    readonly onResetError?: () => void
  } & Omit<SafeAreaViewProps, 'edges' | 'mode'>
>

function SafeScreen({
  bottomOnly = false,
  children,
  isError = false,
  onResetError,
  style,
  ...props
}: Properties) {
  const { layout, navigationTheme, variant } = useTheme()
  const insets = useSafeAreaInsets()

  if (bottomOnly) {
    // For tab screens, only add top padding to avoid status bar
    // Tab bar already handles bottom safe area
    return (
      <View
        style={[
          layout.flex_1,
          style,
          { backgroundColor: 'white' },
          { paddingTop: insets.top },
        ]}>
        <StatusBar
          backgroundColor={navigationTheme.colors.background}
          barStyle={variant === 'dark' ? 'light-content' : 'dark-content'}
        />
        <ErrorBoundary onReset={onResetError}>
          {isError ? <DefaultError onReset={onResetError} /> : children}
        </ErrorBoundary>
      </View>
    )
  }

  return (
    <SafeAreaView
      {...props}
      mode='padding'
      style={[layout.flex_1, { backgroundColor: 'white' }, style]}>
      <StatusBar
        backgroundColor={navigationTheme.colors.background}
        barStyle={variant === 'dark' ? 'light-content' : 'dark-content'}
      />
      <ErrorBoundary onReset={onResetError}>
        {isError ? <DefaultError onReset={onResetError} /> : children}
      </ErrorBoundary>
    </SafeAreaView>
  )
}

export default SafeScreen
