import { Image, Text, TouchableOpacity, View } from 'react-native'

import { ACCOUNT_TYPES_ID } from '@/constants/account'
import { useAppNavigation } from '@/hooks'
import { useGlobalModal } from '@/hooks/useGlobalModal'
import { Paths } from '@/navigation/paths'
import DepositMethod from '@/screens/Deposit/DepositMethod'
import WithdrawMethod from '@/screens/Withdraw/WithdrawMethod'
import { useAuthStore } from '@/store/authStore'
import { useAccountStore } from '@/store/useAccountStore'

const HOME_ICONS = {
  Chat: require('@/assets/images/home/Chat.png'),
  Copy_Trading: require('@/assets/images/home/Copy_Trading.png'),
  Deposit: require('@/assets/images/home/Deposit.png'),
  More: require('@/assets/images/home/More.png'),
  Ranking: require('@/assets/images/home/Ranking.png'),
  Referral: require('@/assets/images/home/Referral.png'),
  Social: require('@/assets/images/home/Social.png'),
  Withdraw: require('@/assets/images/home/Withdraw.png'),
} as const

const ICON_SIZE = 24

const features = [
  { icon: HOME_ICONS.Ranking, id: 'ranking', label: 'Ranking' },
  { icon: HOME_ICONS.Deposit, id: 'deposit', label: 'Deposit' },
  { icon: HOME_ICONS.Withdraw, id: 'withdraw', label: 'Withdraw' },
  { icon: HOME_ICONS.Referral, id: 'referral', label: 'Referral' },
  { icon: HOME_ICONS.Social, id: 'social', label: 'Social' },
  { icon: HOME_ICONS.Copy_Trading, id: 'copy', label: 'Copy Trading' },
  { icon: HOME_ICONS.Chat, id: 'chat', label: 'Chat' },
  { icon: HOME_ICONS.More, id: 'more', label: 'More' },
]

export function HomeFeatures() {
  const navigation = useAppNavigation()
  const selectedAccount = useAccountStore((state) => state.selectedAccount)
  const user = useAuthStore((state) => state.user)
  const { showModal, closeModal } = useGlobalModal()
  const handleShowDepositMethod = () => {
    showModal({
      content: <DepositMethod onClose={closeModal} />,
      snapPoints: ['50%', '70%'],
      initialSnapIndex: 2,
      backdropOpacity: 0.7,
      animationDuration: 200,
      // enablePanDownToClose: false,
    })
  }
  const handleShowWithdrawMethod = () => {
    showModal({
      content: <WithdrawMethod onClose={closeModal} />,
      snapPoints: ['50%', '70%'],
      initialSnapIndex: 2,
      backdropOpacity: 0.7,
      animationDuration: 200,
      // enablePanDownToClose: false,
    })
  }
  const handleFeaturePress = (featureId: string) => {
    if (featureId === 'ranking') {
      navigation.navigate(Paths.Ranking)

      return
    }
    if (featureId === 'social') {
      navigation.navigate(Paths.Social)

      return
    }
    if (featureId === 'referral') {
      if (!user) {
        navigation.navigate(Paths.Commission)

        return
      }
      navigation.navigate(Paths.Referral)

      return
    }

    if (!user) {
      navigation.navigate(Paths.Login)

      return
    }

    if (featureId === 'deposit') {
      if (selectedAccount?.accountTypeId === ACCOUNT_TYPES_ID.DEMO) {
        navigation.navigate(Paths.TopUp)

        return
      }
      handleShowDepositMethod()

      return
    }
    if (featureId === 'withdraw') {
      handleShowWithdrawMethod()

      return
    }

    if (featureId === 'copy') {
      navigation.navigate(Paths.CopyTrading)

      return
    }
    if (featureId === 'chat') {
      navigation.navigate(Paths.Chat)

      return
    }
    if (featureId === 'more') {
      navigation.navigate(Paths.More)
    }
  }

  return (
    <View className='mb-4 mt-3 w-full'>
      <View className='flex-row flex-wrap gap-y-4'>
        {features.map((feature) => (
          <View
            key={feature.id}
            className='items-center'
            style={{ width: '25%' }}>
            <TouchableOpacity
              activeOpacity={0.7}
              className='items-center justify-center'
              onPress={() => handleFeaturePress(feature.id)}>
              <View className='mb-2 h-12 w-12 items-center justify-center rounded-full bg-neutral-100'>
                <Image
                  resizeMode='contain'
                  source={feature.icon}
                  style={{ height: ICON_SIZE, width: ICON_SIZE }}
                />
              </View>
              <Text
                className='typo-body-small-medium w-full text-center text-neutral-900'
                numberOfLines={2}>
                {feature.id === 'referral' && !user
                  ? 'Commission'
                  : feature.label}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  )
}
