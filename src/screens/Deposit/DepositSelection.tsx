import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'

import { SlideUpPanel } from '@/components/templates/SlideUpPanel/SlideUpPanel'
import { ACCOUNT_TYPES_ID } from '@/constants/account'
import { CHAINS } from '@/constants/chain'
import { useCreateWallet } from '@/hooks/payment/useCreateWallet'
import { useDepositDemo } from '@/hooks/payment/useDepositDemo'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
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
    name: 'Tether (USDT) - ERC20',
    processingTime: 'Instant - 15 min',
  },
  {
    chainId: CHAINS.bscTestnet.chainId, // Sepolia: 11155111
    icon: require('@/assets/images/tether.png'),
    id: 'tether-2',
    limit: '$10 - $200,000',
    name: 'Tether (USDT) - BEP20',
    processingTime: 'Instant - 15 min',
  },
  {
    chainId: CHAINS.bscTestnet.chainId, // Default chainId
    comingSoon: true,
    icon: require('@/assets/images/mastercard.png'),
    id: 'card',
    limit: '$10 - $200,000',
    name: 'Card',
    processingTime: 'Instant - 2 min',
  },
]

function DepositSelection({ navigation }: RootScreenProps<Paths.Deposit>) {
  const { colors } = useTheme()
  const selectedAccount = useAccountStore((s) => s.selectedAccount)
  const { isPending: isDemoDepositing, mutate: depositDemo } = useDepositDemo()
  const { isPending: isCreatingWallet, mutate: createWallet } =
    useCreateWallet()

  const isPending = isDemoDepositing || isCreatingWallet

  const handleDepositDemo = () => {
    depositDemo(
      {
        accountId: String(selectedAccount?.id || '1000000000000000'),
      },
      {
        onError: (error) => {
          navigation.navigate(Paths.DepositFailure, {
            errorCode: error.code,
            errorMessage: error.message || 'Failed to process deposit',
          })
        },
        onSuccess: (data) => {
          navigation.navigate(Paths.DepositSuccess, {
            accountId: data.accountId,
            amount: data.amount,
            availableBalance: data.availableBalance,
            balance: data.balance,
          })
        },
      },
    )
  }

  const handleCreateWallet = (chainId: number) => {
    createWallet(
      {
        accountId: String(selectedAccount?.id || '1470823613144764428'),
        chainId: String(chainId),
        type: 'EVM',
      },
      {
        onError: (error) => {
          navigation.navigate(Paths.DepositFailure, {
            errorCode: error.code,
            errorMessage: error.message || 'Failed to create wallet',
          })
        },
        onSuccess: (data) => {
          navigation.navigate(Paths.DepositQR, {
            address: data.wallet.address,
            amount: '0',
            currency: 'USDT',
            network: data.wallet.type,
          })
        },
      },
    )
  }

  console.log('selectedAccount', selectedAccount)

  return (
    <SlideUpPanel title='Deposit'>
      <ScrollView className='flex-1 p-4'>
        {methods.map((method, index) => (
          <Pressable
            key={`${method.id}-${index}`}
            className={` p-4 rounded-xl mb-4 border flex-row items-center ${method.comingSoon || isPending ? 'opacity-80' : ''}`}
            disabled={method.comingSoon || isPending}
            style={{
              borderColor: colors.neutral200,
            }}
            onPress={() => {
              if (!method.comingSoon) {
                if (
                  selectedAccount?.accountTypeId == ACCOUNT_TYPES_ID.STANDARD
                ) {
                  handleCreateWallet(method.chainId)
                }
                if (
                  selectedAccount?.accountTypeId == ACCOUNT_TYPES_ID.DEMO ||
                  !selectedAccount
                ) {
                  handleDepositDemo()
                }
              }
            }}>
            <View className='mr-4'>
              <Image
                resizeMode='contain'
                source={method.icon}
                style={{ height: 40, width: 40 }}
              />
              {index === 0 && (
                <View className='absolute -bottom-1 -right-1 rounded-full p-[2px]'>
                  <Image
                    source={require('@/assets/images/tether-1.png')}
                    style={{ height: 14, width: 14 }}
                  />
                </View>
              )}
              {index === 1 && (
                <View className='absolute -bottom-1 -right-1 rounded-full p-[2px]'>
                  <Image
                    source={require('@/assets/images/tether-2.png')}
                    style={{ height: 14, width: 14 }}
                  />
                </View>
              )}
            </View>

            <View className='flex-1'>
              <View className='flex-row items-center'>
                <Text className='text-body-semibold text-neutral-900 mr-2'>
                  {method.name}
                </Text>
                {method.comingSoon ? (
                  <View className='bg-blue-100 px-2 py-0.5 rounded'>
                    <Text className='text-primary-500 text-caption-medium'>
                      Coming soon
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text className='text-gray-500 text-body-small-regular mt-1'>
                Processing time:{' '}
                <Text
                  className='text-body-small-semibold'
                  style={{ color: colors.neutral900 }}>
                  {method.processingTime}
                </Text>
              </Text>
              <Text
                className='text-body-small-regular'
                style={{ color: colors.neutral500 }}>
                Limit:{' '}
                <Text
                  className='text-body-small-semibold'
                  style={{ color: colors.neutral900 }}>
                  {method.limit}
                </Text>
              </Text>
            </View>
            {isPending ? (
              <ActivityIndicator color={colors.primary500} size='small' />
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
    </SlideUpPanel>
  )
}

export default DepositSelection
