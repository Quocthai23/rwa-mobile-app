import {
  ChevronLeft,
  MinusCircle,
  PlusCircle,
  RotateCcw,
} from 'lucide-react-native'
import { useMemo, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import ChatIcon from '@/components/icons/ChatIcon'
import FeedBackIcon from '@/components/icons/FeedBackIcon'
import HelpCenterIcon from '@/components/icons/HelpCenterIcon'
import HistoryIcon from '@/components/icons/HistoryIcon'
import { IconCustom } from '@/components/icons/IconCustom'
import SocialIcon from '@/components/icons/SocialIcon'
import { ACCOUNT_TYPES_ID } from '@/constants/account'
import { useGlobalModal } from '@/hooks/useGlobalModal'
import { Paths } from '@/navigation/paths'
import { type RootScreenProps } from '@/navigation/types'
import { useAccountStore } from '@/store/useAccountStore'
import { useAppStore } from '@/store/useAppStore'
import { useTheme } from '@/theme'

import DepositMethod from '../Deposit/DepositMethod'
import WithdrawMethod from '../Withdraw/WithdrawMethod'

type Props = RootScreenProps<Paths.More>

function More({ navigation }: Props) {
  const { colors } = useTheme()
  const { showModal, closeModal } = useGlobalModal()
  const selectedAccount = useAccountStore((state) => state.selectedAccount)
  const [isEditMode, setIsEditMode] = useState(false)
  const { quickAccessKeys, setQuickAccessKeys } = useAppStore()

  const defaultQuickAccessKeys = [
    'deposit',
    'withdraw',
    'transfer',
    'history',
    'social',
    'copy_trading',
    'chat',
    'ranking',
  ]

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
  const datas = [
    {
      items: [
        {
          icon: (
            <IconCustom color={colors.neutral700} name='deposit' size={24} />
          ),
          key: 'deposit',
          name: 'Deposit',
          onPress: () => {
            if (selectedAccount?.accountTypeId === ACCOUNT_TYPES_ID.DEMO) {
              navigation.navigate(Paths.TopUp)

              return
            }
            handleShowDepositMethod()
          },
        },
        {
          icon: (
            <IconCustom color={colors.neutral700} name='withdraw' size={24} />
          ),
          key: 'withdraw',
          name: 'Withdraw',
          onPress: () => {
            handleShowWithdrawMethod()
          },
        },
        {
          icon: (
            <IconCustom color={colors.neutral700} name='transfer' size={24} />
          ),
          key: 'transfer',
          name: 'Transfer',
          onPress: () => {
            navigation.navigate(Paths.Transfer, {
              transferType: 'other_account',
            })
          },
        },
        {
          icon: <HistoryIcon color={colors.neutral700} size={24} />,
          key: 'history',
          name: 'History',
          onPress: () => {
            navigation.navigate(Paths.TransactionHistory)
          },
        },
      ],
      title: 'Core Features',
    },
    {
      items: [
        {
          icon: (
            <SocialIcon
              color={colors.neutral0}
              strokeColor={colors.neutral700}
            />
          ),
          key: 'social',
          name: 'Social',
          onPress: () => {
            navigation.navigate(Paths.Social)
          },
        },
        {
          icon: (
            <Image
              source={require('@/assets/icons/copy_trading.png')}
              style={{ height: 24, width: 24 }}
            />
          ),
          key: 'copy_trading',
          name: 'Copy Trading',
          onPress: () => {
            navigation.navigate(Paths.CopyTrading)
          },
        },
        {
          icon: (
            <ChatIcon color={colors.neutral0} strokeColor={colors.neutral700} />
          ),
          key: 'chat',
          name: 'Chat',
          onPress: () => {
            navigation.navigate(Paths.Chat)
          },
        },
      ],
      title: 'Discover',
    },
    {
      items: [
        {
          icon: (
            <IconCustom color={colors.neutral700} name='ranking' size={24} />
          ),
          key: 'ranking',
          name: 'Ranking',
          onPress: () => {},
        },
        {
          icon: (
            <IconCustom color={colors.neutral700} name='reward_hub' size={24} />
          ),
          key: 'rewards_hub',
          name: 'Rewards Hub',
          onPress: () => {},
        },
        {
          icon: (
            <IconCustom color={colors.neutral700} name='referral' size={24} />
          ),
          key: 'referral',
          name: 'Referral',
          onPress: () => {
            navigation.navigate(Paths.Referral)
          },
        },
      ],
      title: 'Event & Rewards',
    },
    {
      items: [
        {
          icon: (
            <HelpCenterIcon
              color={colors.neutral0}
              size={24}
              strokeColor={colors.neutral700}
            />
          ),
          key: 'help_center',
          name: 'Help Center',
          onPress: () => {},
        },
        {
          icon: (
            <FeedBackIcon
              color={colors.neutral0}
              size={24}
              strokeColor={colors.neutral700}
            />
          ),
          key: 'feedback',
          name: 'Feedback',
          onPress: () => {},
        },
      ],
      title: 'Help',
    },
  ]

  const allItems = useMemo(() => {
    return datas.flatMap((section) => section.items)
  }, [datas])

  const quickAccessItems = useMemo(() => {
    return quickAccessKeys
      .map((key) => allItems.find((item) => item.key === key))
      .filter(Boolean) as (typeof datas)[0]['items']
  }, [quickAccessKeys, allItems])

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  const handleAddToQuickAccess = (key: string) => {
    if (!quickAccessKeys.includes(key)) {
      setQuickAccessKeys([...quickAccessKeys, key])
    }
  }

  const handleRemoveFromQuickAccess = (key: string) => {
    setQuickAccessKeys(quickAccessKeys.filter((k) => k !== key))
  }

  const handleRestoreDefault = () => {
    setQuickAccessKeys(defaultQuickAccessKeys)
  }

  return (
    <SafeAreaView className='flex-1'>
      <View className='h-[60px] px-4 flex-row relative items-center justify-center'>
        <TouchableOpacity
          className='absolute left-4'
          onPress={() => {
            navigation.goBack()
          }}>
          <ChevronLeft size={24} />
        </TouchableOpacity>
        <Text className='text-h3-semibold text-center'>Menu</Text>
      </View>

      <ScrollView className='p-4 flex-1'>
        <View className='mb-6'>
          <View className='flex-row justify-between items-center mb-4'>
            <Text className='text-body-large-semibold text-neutral-900'>
              Quick Access
            </Text>
            {isEditMode && (
              <TouchableOpacity
                className='px-3 py-1.5 rounded-md bg-neutral-100'
                onPress={handleToggleEditMode}>
                <Text className='text-body-small-semibold text-neutral-700'>
                  Done
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditMode ? (
            <View className='p-4 border border-neutral-100 rounded-xl'>
              <View className='flex-row flex-wrap'>
                {quickAccessItems.map((item) => (
                  <View key={item.key} className='items-center w-1/4 mb-4'>
                    <View className='relative'>
                      <View
                        className='w-[48px] aspect-square rounded-full flex items-center justify-center'
                        style={{ backgroundColor: colors.neutral100 }}>
                        {item.icon}
                      </View>
                      <TouchableOpacity
                        className='absolute -top-1 -right-1'
                        onPress={() => handleRemoveFromQuickAccess(item.key)}>
                        <MinusCircle color={colors.neutral400} size={20} />
                      </TouchableOpacity>
                    </View>
                    <Text
                      className='text-body-small-regular mt-2 text-neutral-900 text-center'
                      numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                className='flex-row items-center justify-center mt-2'
                onPress={handleRestoreDefault}>
                <RotateCcw color={colors.primary500} size={16} />
                <Text className='text-body-small-semibold text-primary-500 ml-1.5'>
                  Restore to default
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className='flex-row justify-between items-center bg-neutral-0 p-3 border border-neutral-100 rounded-xl'>
              <View className='flex-row justify-between items-center flex-1'>
                {quickAccessItems.slice(0, 7).map((item) => (
                  <TouchableOpacity key={item.key} onPress={item.onPress}>
                    {item.icon}
                  </TouchableOpacity>
                ))}
                {quickAccessItems.length > 7 && (
                  <Text className='text-neutral-400'>...</Text>
                )}
              </View>
              <TouchableOpacity
                className='px-3 py-1.5 rounded-md bg-primary-500 ml-4'
                onPress={handleToggleEditMode}>
                <Text className='text-body-small-semibold text-neutral-0'>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {datas.map((section) => (
          <View key={section.title} className='mb-6'>
            <Text className='text-body-large-semibold mb-4 text-neutral-900'>
              {section.title}
            </Text>
            <View className='flex-row flex-wrap'>
              {section.items.map((item) => {
                const isInQuickAccess = quickAccessKeys.includes(item.key)

                return (
                  <TouchableOpacity
                    key={item.key}
                    className='items-center w-1/4 mb-6 relative'
                    disabled={isEditMode && isInQuickAccess}
                    onPress={item.onPress}>
                    <View className='relative'>
                      <View
                        className='w-[48px] aspect-square rounded-full flex items-center justify-center'
                        style={{
                          backgroundColor: colors.neutral100,
                          opacity: isEditMode && isInQuickAccess ? 0.4 : 1,
                        }}>
                        {item.icon}
                      </View>
                      {isEditMode && (
                        <TouchableOpacity
                          className='absolute -top-1 -right-1'
                          onPress={() =>
                            isInQuickAccess
                              ? handleRemoveFromQuickAccess(item.key)
                              : handleAddToQuickAccess(item.key)
                          }>
                          {isInQuickAccess ? (
                            <MinusCircle color={colors.neutral400} size={20} />
                          ) : (
                            <PlusCircle color={colors.neutral400} size={20} />
                          )}
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text
                      className='text-body-large-regular mt-2 text-neutral-900'
                      numberOfLines={1}
                      style={{
                        opacity: isEditMode && isInQuickAccess ? 0.4 : 1,
                      }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* <TransferSelection ref={transferSelectionReference} /> */}
    </SafeAreaView>
  )
}

export default More
