import {
  BellIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react-native'
import { useState } from 'react'
import {
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAppNavigation } from '@/hooks'
import { useAccounts } from '@/hooks/useAccount'
import { Paths } from '@/navigation/paths'
import { useAccountStore } from '@/store/useAccountStore'
import colors from '@/theme/colors'
import type { Account } from '@/types/account'
import { formatBalance } from '@/utils/currency'

export default function HomeHeader() {
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const navigation = useAppNavigation()
  const selectedAccount = useAccountStore((state) => state.selectedAccount)
  const selectAccount = useAccountStore((state) => state.selectAccount)
  const accounts = useAccounts()
  const handleSelectAccount = (account: Account) => {
    selectAccount(account)
    setDropdownVisible(false)
  }

  return (
    <View className='relative'>
      <View className='flex-row items-center gap-4 p-4 bg-white z-10'>
        <View className='flex-1 flex-row items-center gap-3'>
          <TouchableOpacity
            className='flex-row items-center gap-3'
            onPress={() => setDropdownVisible(true)}>
            <Image
              resizeMode='contain'
              source={require('@/theme/assets/images/logoimg.png')}
              style={{ height: 36, width: 36 }}
            />
            <Text className='typo-body-medium text-neutral-900'>
              {selectedAccount?.name || 'Account'}
            </Text>
            <ChevronDownIcon color={colors.iconColors.default} size={20} />
          </TouchableOpacity>
        </View>

        <View className='flex-row items-center gap-5'>
          <TouchableOpacity
            className=''
            hitSlop={10}
            onPress={() => navigation.navigate(Paths.Setting)}>
            <SettingsIcon color={colors.iconColors.default} size={22} />
          </TouchableOpacity>
          <TouchableOpacity
            className=''
            hitSlop={10}
            onPress={() => navigation.navigate(Paths.Notifications)}>
            <BellIcon color={colors.iconColors.default} size={22} />
          </TouchableOpacity>
          <TouchableOpacity
            className=''
            hitSlop={10}
            onPress={() => {
              navigation.navigate(Paths.Search)
            }}>
            <SearchIcon color={colors.iconColors.default} size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent
        animationType='fade'
        visible={dropdownVisible}
        onRequestClose={() => setDropdownVisible(false)}>
        <SafeAreaView className='flex-1' edges={['top']}>
          {/* Header duplicate - stays on top */}
          <View className='flex-row items-center gap-4 p-4 bg-white'>
            <View className='flex-1 flex-row items-center gap-3'>
              <TouchableOpacity
                className='flex-row items-center gap-3'
                onPress={() => setDropdownVisible(false)}>
                <Image
                  resizeMode='contain'
                  source={require('@/theme/assets/images/logoimg.png')}
                  style={{ height: 36, width: 36 }}
                />
                <Text className='typo-body-medium text-neutral-900'>
                  {selectedAccount?.name || 'Account'}
                </Text>
                <ChevronUpIcon color={colors.iconColors.default} size={20} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Dropdown */}
          <View className='px-4 py-4 gap-3 bg-white rounded-b-2xl'>
            {!accounts.isLoading &&
              accounts.data?.map((account) => {
                const isSelected = selectedAccount?.id === account.id
                console.log('isSelected', isSelected)

                return (
                  <Pressable
                    key={account.id}
                    className={`flex-row items-center justify-between p-4 ${
                      isSelected
                        ? 'border-[1px] border-primary-500 bg-primary-100 rounded-[4px]'
                        : 'border-[1px] border-neutral-200 rounded-[4px]'
                    }`}
                    onPress={() => handleSelectAccount(account)}>
                    <Text className='text-body-small-medium text-neutral-900'>
                      {account.name}
                    </Text>
                    <Text className='text-body-small-regular text-secondary-500'>
                      Equity:{' '}
                      {formatBalance(
                        (
                          Number(account.availableBalance) +
                          Number(account.lockedBalance)
                        ).toString(),
                      )}
                    </Text>
                  </Pressable>
                )
              })}
          </View>

          {/* Dark overlay for the rest */}
          <Pressable
            className='flex-1 bg-black/50'
            onPress={() => setDropdownVisible(false)}
          />
        </SafeAreaView>
      </Modal>
    </View>
  )
}
