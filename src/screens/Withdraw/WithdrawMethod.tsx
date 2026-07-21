import { ChevronRight } from 'lucide-react-native'
import React from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'

import { ACCOUNT_TYPES_ID } from '@/constants/account'
import { CHAINS } from '@/constants/chain'
import { useAppNavigation } from '@/hooks'
import { useToast } from '@/hooks/useToast'
import { Paths } from '@/navigation/paths'
import { useAccountStore } from '@/store/useAccountStore'
import { useTheme } from '@/theme'

type Method = {
  chainId: number
  comingSoon?: boolean
  icon: any
  id: string
  limit: string
  name: string
  processingTime: string
}

const methods: Method[] = [
  {
    chainId: CHAINS.sepolia.chainId, // BSC Testnet: 97
    icon: require('@/assets/images/tether.png'),
    id: 'tether-1',
    limit: '$10 - $200,000',
    name: 'Tether (USDT)',
    processingTime: 'Instant - 15 min',
  },
  {
    chainId: CHAINS.bscTestnet.chainId, // Sepolia: 11155111
    icon: require('@/assets/images/tether.png'),
    id: 'tether-2',
    limit: '$10 - $200,000',
    name: 'Tether (USDT)',
    processingTime: 'Instant - 15 min',
  },
]

const WithdrawMethod = ({ onClose }: { onClose: () => void }) => {
  const { colors } = useTheme()
  const navigation = useAppNavigation()
  const selectedAccount = useAccountStore((state) => state.selectedAccount)
  const { showError } = useToast()

  return (
    <View>
      <View className='flex-row'>
        <Text className='text-h3-semibold p-4 pt-2 border-b border-neutral-200 flex-1'>
          Withdraw
        </Text>
      </View>
      <ScrollView className='flex-1  p-4'>
        {methods.map((method, index) => (
          <Pressable
            key={`${method.id}-${index}`}
            className={`bg-white p-4 rounded-xl mb-4 border  flex-row items-center ${method.comingSoon ? 'opacity-80' : ''}`}
            disabled={method.comingSoon}
            style={{ borderColor: colors.neutral200 }}
            onPress={() => {
              if (selectedAccount?.accountTypeId == ACCOUNT_TYPES_ID.DEMO) {
                showError('Demo accounts cannot perform withdrawals.')

                return
              }
              if (!method.comingSoon) {
                // Close modal first, then navigate to detail screen
                onClose()

                setTimeout(() => {
                  navigation.navigate(Paths.WithdrawDetail, {
                    chainId: method.chainId.toString(),
                  })
                }, 300)
              }
            }}>
            <View className='mr-4'>
              <Image
                resizeMode='contain'
                source={
                  index === 0
                    ? require('@/assets/images/tether-1.png')
                    : index === 1
                      ? require('@/assets/images/tether-2.png')
                      : method.icon
                }
                style={{ height: 40, width: 40 }}
              />
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
    </View>
  )
}

export default WithdrawMethod
