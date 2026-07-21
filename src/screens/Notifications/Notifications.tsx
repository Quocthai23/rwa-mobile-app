import { ChevronLeft } from 'lucide-react-native'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { type Paths } from '@/navigation/paths'
import { type RootScreenProps } from '@/navigation/types'

type Props = RootScreenProps<Paths.Notifications>
export default function Notifications({ navigation }: Props) {
  return (
    <SafeAreaView className='flex-1 bg-neutral-0' edges={['top']}>
      <View className='h-[60px] px-4 flex-row relative items-center justify-center'>
        <TouchableOpacity
          className='absolute left-4'
          onPress={() => {
            navigation.goBack()
          }}>
          <ChevronLeft size={24} />
        </TouchableOpacity>
        <Text className='text-h3-semibold text-center'>Notifications</Text>
      </View>

      <ScrollView className='flex-1 px-4'>
        <View className='py-4'>
          <Text className='text-body-medium text-neutral-500'>
            No notifications yet
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
