import { ChevronRight } from 'lucide-react-native'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'

import { SlideUpPanel } from '@/components/templates/SlideUpPanel/SlideUpPanel'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'

type Method = {
  comingSoon?: boolean
  icon: any
  id: string
  limit: string
  name: string
  processingTime: string
}

const methods: Method[] = [
  {
    icon: require('@/assets/images/tether.png'),
    id: 'tether-1',
    limit: '$10 - $200,000',
    name: 'Tether (USDT)',
    processingTime: 'Instant - 15 min',
  },
  {
    icon: require('@/assets/images/tether.png'),
    id: 'tether-2',
    limit: '$10 - $200,000',
    name: 'Tether (USDT)',
    processingTime: 'Instant - 15 min',
  },
]

function WithdrawSelection({ navigation }: RootScreenProps<Paths.Withdraw>) {
  const { colors } = useTheme()

  return (
    <SlideUpPanel title='Withdraw'>
      <ScrollView className='flex-1  p-4'>
        {methods.map((method, index) => (
          <Pressable
            key={`${method.id}-${index}`}
            className={`bg-white p-4 rounded-xl mb-4 border  flex-row items-center ${method.comingSoon ? 'opacity-80' : ''}`}
            disabled={method.comingSoon}
            style={{ borderColor: colors.neutral200 }}
            onPress={() => {
              if (!method.comingSoon) {
                // Close modal first, then navigate to detail screen
                navigation.goBack()

                setTimeout(() => {
                  navigation.navigate(Paths.WithdrawDetail, {
                    methodId: method.id,
                    methodName: method.name,
                  })
                }, 300)
              }
            }}>
            <View className='mr-4'>
              <Image
                resizeMode='contain'
                source={method.icon}
                style={{ height: 40, width: 40 }}
              />
              {index === 0 && (
                <View className='absolute -bottom-1 -right-1 bg-white rounded-full p-[2px]'>
                  <Image
                    source={require('@/assets/images/tether-1.png')}
                    style={{ height: 14, width: 14 }}
                  />
                </View>
              )}
              {index === 1 && (
                <View className='absolute -bottom-1 -right-1 bg-white rounded-full p-[2px]'>
                  <Image
                    source={require('@/assets/images/tether-2.png')}
                    style={{ height: 14, width: 14 }}
                  />
                </View>
              )}
            </View>

            <View className='flex-1'>
              <Text className='text-base font-bold text-gray-900 mb-1'>
                {method.name}
              </Text>
              <Text className='text-gray-500 text-sm'>
                Processing time:{' '}
                <Text className='text-gray-900 font-medium'>
                  {method.processingTime}
                </Text>
              </Text>
              <Text className='text-gray-500 text-sm'>
                Limit:{' '}
                <Text className='text-gray-900 font-medium'>
                  {method.limit}
                </Text>
              </Text>
            </View>
            {!method.comingSoon && (
              <ChevronRight color={colors.gray400} size={20} />
            )}
          </Pressable>
        ))}
      </ScrollView>
    </SlideUpPanel>
  )
}

export default WithdrawSelection
