import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'

import { CHAINS } from '@/constants/chain'
import { useTheme } from '@/theme'
import { useAppNavigation } from '@/hooks'
import { Paths } from '@/navigation/paths'
import { useAccountStore } from '@/store/useAccountStore'
import { useToast } from '@/hooks/useToast'
import { ACCOUNT_TYPES_ID } from '@/constants/account'
import { useCreateWallet } from '@/hooks/payment/useCreateWallet'
import { useDepositDemo } from '@/hooks/payment/useDepositDemo'
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
    name: 'Tether (USDT ERC20)',
    processingTime: 'Instant - 15 min',
  },
  {
    chainId: CHAINS.bscTestnet.chainId, // Sepolia: 11155111
    icon: require('@/assets/images/tether.png'),
    id: 'tether-2',
    limit: '$10 - $200,000',
    name: 'Tether (USDT BEP20)',
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

const DepositMethod = ({ onClose }: { onClose: () => void }) => {
  const navigation = useAppNavigation()
  const { colors } = useTheme()
  const { showInfo } = useToast()
  const selectedAccount = useAccountStore((state) => state.selectedAccount)
  const { isPending: isDemoDepositing, mutate: depositDemo } = useDepositDemo()
  const { isPending: isCreatingWallet, mutate: createWallet } =
    useCreateWallet()

  const isPending = isDemoDepositing || isCreatingWallet
  const handleSelectMethod = (chainId: number, comingSoon?: boolean) => {
    if (comingSoon) {
      showInfo('This deposit method is coming soon. Stay tuned!')
      return
    }

    if (selectedAccount?.accountTypeId === ACCOUNT_TYPES_ID.DEMO) {
      // showInfo(
      //   'Demo accounts cannot make deposits. Please switch to a real account.',
      // )
      handleDepositDemo()
      return
    }
    handleCreateWallet(chainId)

    // navigation.navigate(Paths.DepositTo, { chainId })
  }

  const handleDepositDemo = () => {
    if (!selectedAccount) return

    depositDemo(
      {
        accountId: String(selectedAccount.id),
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
          onClose()
        },
      },
    )
  }

  const handleCreateWallet = (chainId: number) => {
    if (!selectedAccount) return

    createWallet(
      {
        accountId: String(selectedAccount.id),
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
            network: data.wallet.chainId,
          })
          onClose()
        },
      },
    )
  }
  return (
    <View>
      <View className='flex-row'>
        <Text className='text-h3-semibold p-4 pt-2 border-b border-neutral-200 flex-1'>
          Deposit
        </Text>
      </View>
      <ScrollView className='flex-1 p-4'>
        {methods.map((method, index) => (
          <Pressable
            key={`${method.id}-${index}`}
            disabled={isPending || method.comingSoon}
            className={` p-4 rounded-xl mb-4 border flex-row items-center ${method.comingSoon || isPending ? 'opacity-50' : ''}`}
            style={{
              borderColor: colors.neutral200,
            }}
            onPress={() =>
              handleSelectMethod(method.chainId, method.comingSoon)
            }>
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
              <ActivityIndicator size='small' color={colors.primary500} />
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}

export default DepositMethod
