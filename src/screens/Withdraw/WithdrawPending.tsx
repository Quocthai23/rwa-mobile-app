import { ChevronLeft, Copy, ExternalLink } from 'lucide-react-native'
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native'

import { type Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'
import { SafeAreaView } from 'react-native-safe-area-context'

function WithdrawPending({
  navigation,
  route,
}: RootScreenProps<Paths.WithdrawPending>) {
  const { colors } = useTheme()
  const { withdrawData } = route.params

  return (
    // <SlideUpPanel
    //   headerLeft={
    //     <Pressable
    //       onPress={() => {
    //         navigation.goBack()
    //       }}>
    //       <View className='bg-gray-100 p-2 rounded-full'>
    //         <ChevronLeft color={colors.gray800} size={24} />
    //       </View>
    //     </Pressable>
    //   }
    //   title='Pending'>
    <SafeAreaView edges={['top']} className='flex-1 bg-neutral-0'>
      {/* header */}
      <View className='h-[60px] px-4 gap-3 flex-row relative items-center justify-center'>
        <TouchableOpacity
          className='absolute left-4'
          onPress={() => {
            navigation.goBack()
          }}>
          <ChevronLeft size={24} />
        </TouchableOpacity>
        <Image
          source={require('@/assets/images/tether.png')}
          style={{ height: 30, width: 30 }}
        />
        <Text className='text-lg font-bold text-center'>Pending</Text>
      </View>
      <View className='flex-1 bg-white px-4 pt-4'>
        {/* Header Icon & Amount */}
        <View className='items-center mb-8 mt-4'>
          <Image
            resizeMode='contain'
            source={require('@/assets/images/tether.png')}
            style={{ height: 64, marginBottom: 16, width: 64 }}
          />
          <Text className='text-3xl font-bold text-green-500 mb-2'>
            - {withdrawData.amount} USDT
          </Text>
          <Text className='text-gray-500 text-sm'>
            Status: {withdrawData.status === 1 ? 'Pending' : 'Processing'}
          </Text>
        </View>

        {/* Details List */}
        <View>
          <View className='flex-row justify-between items-center mb-6'>
            <Text className='text-gray-400 font-medium text-base'>
              From Account
            </Text>
            <Text className='text-gray-900 font-bold text-base'>
              {withdrawData.accountId}
            </Text>
          </View>

          <View className='flex-row justify-between items-center mb-6'>
            <Text className='text-gray-400 font-medium text-base'>
              To Address
            </Text>
            <View className='flex-row items-center'>
              <Text className='text-gray-900 font-bold mr-2 text-base'>
                {withdrawData.address.slice(0, 6)}...
                {withdrawData.address.slice(-6)}
              </Text>
              <Copy color={colors.gray800} size={18} />
            </View>
          </View>

          <View className='flex-row justify-between items-center mb-6'>
            <Text className='text-gray-400 font-medium text-base'>Time</Text>
            <Text className='text-gray-900 font-bold text-base'>
              {new Date(withdrawData.createdAt).toLocaleString()}
            </Text>
          </View>

          <View className='flex-row justify-between items-center mb-6'>
            <Text className='text-gray-400 font-medium text-base'>
              Chain ID
            </Text>
            <Text className='text-gray-900 font-bold text-base'>
              {withdrawData.chainId}
            </Text>
          </View>

          <View className='flex-row justify-between items-center mb-6'>
            <Text className='text-gray-400 font-medium text-base'>
              Transaction ID
            </Text>
            <View className='flex-row items-center'>
              <Text
                className='text-gray-900 font-bold mr-2 text-base'
                numberOfLines={1}>
                {withdrawData.transactionId.slice(0, 8)}...
              </Text>
              <Copy color={colors.gray800} size={18} />
            </View>
          </View>

          <View className='flex-row justify-between items-center mb-6'>
            <Text className='text-gray-400 font-medium text-base'>
              Available Balance
            </Text>
            <Text className='text-gray-900 font-bold text-base'>
              {withdrawData.availableBalance} USD
            </Text>
          </View>

          <View className='flex-row justify-between items-center'>
            <Text className='text-gray-400 font-medium text-base'>Detail</Text>
            <Pressable className='flex-row items-center'>
              <Text className='text-gray-900 font-bold mr-2 text-base'>
                View in Exchange
              </Text>
              <ExternalLink color={colors.primary500} size={18} />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
    // </SlideUpPanel>
  )
}

export default WithdrawPending
