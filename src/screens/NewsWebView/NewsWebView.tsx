import { ChevronLeft } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'

import { useAppNavigation } from '@/hooks'
import type { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'

function NewsWebView({ route }: RootScreenProps<Paths.NewsWebView>) {
  const navigation = useAppNavigation()
  const { url, title } = route.params

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'bottom']}>
      <View className='flex-1'>
        {/* Header */}
        <View className='h-[60px] px-4 flex-row relative items-center justify-center border-b border-neutral-200'>
          <TouchableOpacity
            className='absolute left-0 ml-4 h-10 w-10 items-center justify-center'
            onPress={() => {
              navigation.goBack()
            }}>
            <ChevronLeft className='text-neutral-900' size={24} />
          </TouchableOpacity>
          <Text
            className='text-h3-semibold text-center text-neutral-900 flex-1 px-12 max-w-[80%] '
            ellipsizeMode='tail'
            numberOfLines={1}
            pointerEvents='none'>
            {title}
          </Text>
        </View>

        {/* WebView */}
        <WebView
          startInLoadingState
          renderLoading={() => (
            <View className='flex-1 items-center justify-center'>
              <ActivityIndicator size='large' />
            </View>
          )}
          source={{ uri: url }}
        />
      </View>
    </SafeAreaView>
  )
}

export default NewsWebView
