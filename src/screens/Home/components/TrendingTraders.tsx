import { Filter } from 'lucide-react-native'
import { Image, TouchableOpacity, View } from 'react-native'

import { Button } from '@/components/atoms'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'

type Trader = {
  avatar: string
  copiers: number
  id: string
  name: string
  risk: number
  roi: string
}

function TrendingTraders() {
  const traders: Trader[] = [
    {
      avatar: 'https://via.placeholder.com/40',
      copiers: 1232,
      id: '1',
      name: 'the. best',
      risk: 2,
      roi: '+16.93%',
    },
    {
      avatar: 'https://via.placeholder.com/40',
      copiers: 346,
      id: '2',
      name: 'Bulumer',
      risk: 5,
      roi: '+12.57%',
    },
    {
      avatar: 'https://via.placeholder.com/40',
      copiers: 346,
      id: '3',
      name: 'pingping123',
      risk: 3,
      roi: '+5,239.22%',
    },
  ]

  return (
    <View className='p-4'>
      <View className='flex-row justify-between items-center'>
        <Text className='typo-h3-semibold text-neutral-900'>
          Trending Traders
        </Text>
        <TouchableOpacity>
          <Filter className='text-neutral-700' size={24} />
        </TouchableOpacity>
      </View>

      <View className='my-4 p-4 border rounded-lg border-neutral-200'>
        {traders.map((trader, index) => (
          <View key={trader.id}>
            <View className='flex-row items-center justify-between mb-6'>
              <View className='flex-row items-center flex-1 gap-2'>
                <Image
                  className='w-8 h-8 rounded-full bg-neutral-100'
                  source={{ uri: trader.avatar }}
                />
                <Text className='typo-h3-semibold text-neutral-900'>
                  {trader.name}
                </Text>
              </View>

              <TouchableOpacity className='bg-primary-500 px-3 py-2 rounded-lg'>
                <Text className='text-white text-button-small-medium'>
                  Copy
                </Text>
              </TouchableOpacity>
            </View>

            <View className='flex-row justify-between items-center'>
              <View className='flex-1 items-start'>
                <Text className='typo-body-semibold text-success-500'>
                  {trader.roi}
                </Text>
                <Text className='typo-body-small-regular text-neutral-500'>
                  30D ROI
                </Text>
              </View>

              <View className='flex-1 items-center'>
                <Text className='typo-body-semibold text-neutral-900'>
                  {trader.copiers}
                </Text>
                <Text className='typo-body-small-regular text-neutral-500'>
                  Copiers
                </Text>
              </View>

              <View className='flex-1 items-end'>
                <View className='items-center'>
                  <View className='rounded-md bg-success-50'>
                    <Text className='px-2 typo-body-semibold text-success-500'>
                      {trader.risk}
                    </Text>
                  </View>
                  <Text className='typo-body-small-regular text-neutral-500'>
                    Risk
                  </Text>
                </View>
              </View>
            </View>
            {index !== traders.length - 1 && (
              <View className='h-px w-full my-4 bg-neutral-100' />
            )}
          </View>
        ))}
      </View>

      <Button label='View more' size={40} variant='secondary' />
    </View>
  )
}

export default TrendingTraders
