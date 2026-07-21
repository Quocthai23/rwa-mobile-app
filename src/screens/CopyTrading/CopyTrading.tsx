import { ChevronLeft } from 'lucide-react-native'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAppNavigation } from '@/hooks'
import type { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'

function CopyTrading({}: RootScreenProps<Paths.CopyTrading>) {
  const navigation = useAppNavigation()

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'bottom']}>
      <View className='flex-1'>
        {/* Header */}
        <View className='h-[60px] px-4 flex-row relative items-center justify-center'>
          <TouchableOpacity
            className='absolute left-4'
            onPress={() => {
              navigation.goBack()
            }}>
            <ChevronLeft size={24} />
          </TouchableOpacity>
          <Text className='text-h3-semibold text-center'>Copy Trading</Text>
        </View>

        {/* Content */}
        <View className='flex-1 items-center justify-center'>
          <Text className='text-h2-semibold text-neutral-400'>Coming Soon</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default CopyTrading
