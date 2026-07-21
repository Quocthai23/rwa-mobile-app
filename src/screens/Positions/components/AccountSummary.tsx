import { SquarePlus } from 'lucide-react-native'
import { useMemo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { ACCOUNT_TYPES_ID } from '@/constants/account'
import { useAppNavigation } from '@/hooks'
import { Paths } from '@/navigation/paths'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import useTheme from '@/theme/hooks/useTheme'
import type { CustomPosition } from '@/types'
import { formatBalance } from '@/utils/currency'
import { calculateTotalUnrealizedPnL } from '../position.calculations'
import type { Account } from '@/types/account'

export default function AccountSummary({
  position,
  activeAccount,
}: {
  position: CustomPosition[]
  activeAccount: Account
}) {
  const appNavigation = useAppNavigation()

  const { colors } = useTheme()

  const marginPositions = useMemo(() => {
    return position.reduce((acc, position) => {
      return acc + Number(position.margin)
    }, 0)
  }, [position])

  const rtBySymbol = useMarketSocketStore((s) => s.rtBySymbol)

  const balance = Number.parseFloat(
    (
      Number.parseFloat(activeAccount?.lockedBalance || '0') +
      Number.parseFloat(activeAccount?.availableBalance || '0')
    ).toString(),
  )
  const currentUnrealizedPnl = useMemo(() => {
    return calculateTotalUnrealizedPnL(position, rtBySymbol)
  }, [position, rtBySymbol])
  const equity = balance + currentUnrealizedPnl
  const marginLevel = (marginPositions / equity) * 100 || 0
  const availableBalance = equity - marginPositions

  return (
    <View className='px-4 mb-3'>
      <View className='bg-neutral-100 rounded-lg p-4'>
        <View className='flex-row justify-between items-center'>
          <View className='flex-row items-center gap-2'>
            <Text className='text-body-large-medium text-neutral-900'>
              Equity(USD)
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (activeAccount?.accountTypeId === ACCOUNT_TYPES_ID.DEMO) {
                  appNavigation.navigate(Paths.TopUp)
                } else {
                  appNavigation.navigate(Paths.Deposit)
                }
              }}>
              <SquarePlus
                color={colors.primary500}
                size={22}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          </View>
          <Text className='text-h3-semibold text-neutral-900'>
            {formatBalance(equity)}
          </Text>
        </View>

        <View className='border-t border-neutral-200 my-3' />

        <View className='flex-col gap-2'>
          <View className='flex-row justify-between items-center'>
            <Text className='text-body-small-regular text-neutral-500'>
              Balance
            </Text>
            <Text className='text-body-small-medium text-neutral-900'>
              {formatBalance(balance)}
            </Text>
          </View>

          {/* Available Row */}
          <View className='flex-row justify-between items-center'>
            <Text className='text-body-small-regular text-neutral-500'>
              Available
            </Text>
            <Text className='text-body-small-medium text-neutral-900'>
              {formatBalance(availableBalance)}
            </Text>
          </View>

          {/* Margin Row */}
          <View className='flex-row justify-between items-center'>
            <Text className='text-body-small-regular text-neutral-500'>
              Margin
            </Text>
            <Text className='text-body-small-medium text-neutral-900'>
              {formatBalance(marginPositions)}
            </Text>
          </View>
          {/* Margin Level Row */}
          <View className='flex-row justify-between items-center'>
            <Text className='text-body-small-regular text-neutral-500'>
              Margin Level
            </Text>
            <Text className='text-body-small-medium text-success-500'>
              {marginLevel > 0 ? formatBalance(marginLevel) + '%' : '0.00%'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
