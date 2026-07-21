import { Check } from 'lucide-react-native'
import { Text, TouchableOpacity, View } from 'react-native'
import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from '@/components/atoms/AppBottomSheetModal'
import { useTheme } from '@/theme'
import type { RefObject } from 'react'

import type { Account } from '@/types/account'

interface AccountSelectModalProps {
  modalRef: RefObject<AppBottomSheetModalHandle | null>
  accounts: Account[]
  selectedAccountId: string
  onSelect: (accountId: string) => void
  title: string
}

export const AccountSelectModal = ({
  modalRef,
  accounts,
  selectedAccountId,
  onSelect,
  title,
}: AccountSelectModalProps) => {
  const { colors } = useTheme()

  return (
    <AppBottomSheetModal ref={modalRef} snapPoints={['50%']}>
      <Text className='text-h3-semibold text-neutral-900  px-4 border-b border-gray-100 pb-4'>
        {title}
      </Text>
      <View className='px-5 pb-10'>
        {accounts.map((account) => (
          <TouchableOpacity
            key={account.id}
            className='py-4 flex-row items-center justify-between'
            onPress={() => {
              onSelect(account.id)
              modalRef.current?.close()
            }}>
            <View className='flex-1'>
              <Text
                className={`text-body-semibold ${
                  selectedAccountId === account.id
                    ? 'text-primary-500 '
                    : 'text-neutral-900'
                }`}>
                {account.name}
              </Text>
              <Text className={`text-body-small-regular text-neutral-500`}>
                ID: {account.id}
              </Text>
            </View>
            <View className='flex-row items-center gap-2'>
              <Text
                className={`text-body-semibold ${
                  selectedAccountId === account.id
                    ? 'text-primary-500'
                    : 'text-neutral-900'
                }`}>
                {account.balance} USD
              </Text>
              {selectedAccountId === account.id && (
                <Check color={colors.primary500} size={20} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </AppBottomSheetModal>
  )
}
