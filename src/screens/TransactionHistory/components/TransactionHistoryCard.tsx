import { ArrowRightCircle } from 'lucide-react-native'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import DepositIcon from '@/components/icons/DepositIcon'
import IconArrowTransaction from '@/components/icons/IconArrowTransaction'
import WithdrawIcon from '@/components/icons/WithdrawIcon'
import {
  STATUS_HISTORY_ID,
  STATUS_HISTORY_NAME,
  TYPE_HISTORY_ID,
  TYPE_HISTORY_NAME,
} from '@/constants/payment'
import { useTheme } from '@/theme'
import type { PaymentHistoryItem } from '@/types/payment'

type Props = {
  transaction: PaymentHistoryItem
  onPress?: () => void
}

const TransactionHistoryCard = ({ transaction, onPress }: Props) => {
  const { colors } = useTheme()

  // Determine status badge color
  const getStatusColor = () => {
    switch (transaction.status) {
      case STATUS_HISTORY_ID.COMPLETED: // Completed
        return {
          bg: colors.success50,
          text: colors.success500,
        }
      case STATUS_HISTORY_ID.PENDING: // Pending
      case STATUS_HISTORY_ID.APPROVED: // Approved
      case STATUS_HISTORY_ID.PROCESSING: // Processing
        return {
          bg: colors.warning50,
          text: colors.warning500,
        }
      case STATUS_HISTORY_ID.FAILED: // Failed
      case STATUS_HISTORY_ID.REJECTED: // Rejected
      case STATUS_HISTORY_ID.CANCELLED: // Cancelled
        return {
          bg: colors.error50,
          text: colors.error500,
        }
      default:
        return {
          bg: colors.neutral50,
          text: colors.neutral500,
        }
    }
  }

  const statusColor = getStatusColor()
  const typeName =
    TYPE_HISTORY_NAME[transaction.type as keyof typeof TYPE_HISTORY_NAME] ||
    'Unknown'
  const statusName =
    STATUS_HISTORY_NAME[
      transaction.status as keyof typeof STATUS_HISTORY_NAME
    ] || 'Unknown'

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    return `${day} ${month}, ${time}`
  }

  // Format amount with sign
  const formatAmount = () => {
    const amount = parseFloat(transaction.netAmount)
    const sign = transaction.type === 1 ? '-' : '+' // Withdrawal is negative
    return `${sign}${Math.abs(amount).toFixed(2)} USD`
  }

  const chainIconMap: Record<string, any> = {
    '97': require('@/assets/images/97.png'),
    '11155111': require('@/assets/images/11155111.png'),
  }

  return (
    <TouchableOpacity
      className='px-4 py-3 mb-3 rounded'
      style={{
        backgroundColor: colors.neutral0,
        borderWidth: 1,
        borderColor: colors.neutral200,
      }}
      onPress={onPress}
      activeOpacity={0.7}>
      {/* Main Content */}
      <View className=''>
        <View className='flex-row items-start justify-between'>
          {/* Left: Type and Status */}
          <View className='flex-1'>
            <View className='flex-row items-center gap-2 mb-2'>
              {transaction.type === TYPE_HISTORY_ID.DEPOSIT ? (
                <DepositIcon size={24} strokeColor={statusColor.text} />
              ) : transaction.type === TYPE_HISTORY_ID.WITHDRAWAL ? (
                <WithdrawIcon size={24} strokeColor={statusColor.text} />
              ) : (
                <ArrowRightCircle color={statusColor.text} size={24} />
              )}
              <Text
                className='text-body-large-medium'
                style={{ color: colors.neutral900 }}>
                {typeName}
              </Text>
              <View
                className='px-2 py-1 rounded'
                style={{ backgroundColor: statusColor.bg }}>
                <Text
                  className='text-caption-medium'
                  style={{ color: statusColor.text }}>
                  {statusName}
                </Text>
              </View>
            </View>
            <Text
              className='text-body-small-regular'
              style={{ color: colors.neutral500 }}>
              Invoice ID {transaction.id.slice(-10)}
            </Text>
          </View>

          {/* Right: Amount and Date */}
          <View className='items-end'>
            <Text
              className='text-body-large-semibold mb-1'
              style={{ color: colors.neutral900 }}>
              {formatAmount()}
            </Text>
            <Text
              className='text-body-small-regular'
              style={{ color: colors.neutral500 }}>
              {formatDate(transaction.createdAt || new Date().toISOString())}
            </Text>
          </View>
        </View>
      </View>

      {/* Withdrawal Details (if applicable) */}
      {transaction.type === TYPE_HISTORY_ID.WITHDRAWAL &&
        transaction.withdrawalMetadata && (
          <View className='pt-3'>
            <View className='flex-row items-center gap-3'>
              <View className='flex-row items-center gap-2 w-1/3'>
                <Image
                  className='w-[24px] h-[24px]'
                  source={require('@/assets/images/transaction-history/icon.png')}
                />
                <Text
                  className='text-body-small-regular text-neutral-900 flex-1'
                  numberOfLines={1}
                  ellipsizeMode='middle'>
                  {transaction.accountId}
                </Text>
              </View>
              <IconArrowTransaction />
              <View className='flex-row items-center gap-2 flex-1'>
                <Image
                  className='w-[24px] h-[24px]'
                  source={
                    chainIconMap[
                      String(transaction.withdrawalMetadata.chainId)
                    ] ?? require('@/assets/images/97.png')
                  }
                />
                <Text
                  className='text-body-small-regular flex-1'
                  style={{ color: colors.neutral900 }}
                  numberOfLines={1}
                  ellipsizeMode='middle'>
                  {transaction.withdrawalMetadata.address}
                </Text>
              </View>
            </View>
          </View>
        )}
    </TouchableOpacity>
  )
}

export default TransactionHistoryCard
