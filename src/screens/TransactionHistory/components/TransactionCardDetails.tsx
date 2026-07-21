import { CheckIcon, ClockIcon, Copy, X } from 'lucide-react-native'
import React from 'react'
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import DepositIcon from '@/components/icons/DepositIcon'
import DividerIcon from '@/components/icons/DividerIcon'
import WithdrawIcon from '@/components/icons/WithdrawIcon'
import {
  STATUS_HISTORY_ID,
  STATUS_HISTORY_NAME,
  TYPE_HISTORY_NAME,
} from '@/constants/payment'
import { useTheme } from '@/theme'
import type { PaymentHistoryItem } from '@/types/payment'
import { setString } from '@/utils/clipboard'

type Props = {
  transaction?: PaymentHistoryItem
  isVisible: boolean
  onClose: () => void
}

const TransactionCardDetails = ({ transaction, isVisible, onClose }: Props) => {
  const { colors } = useTheme()

  // Get status color
  const getStatusColor = () => {
    if (!transaction) return { bg: colors.neutral50, text: colors.neutral500 }

    switch (transaction.status) {
      case 3: // Completed
        return {
          bg: colors.success50,
          text: colors.success500,
        }
      case 0:
      case 1:
      case 2:
        return {
          bg: colors.warning50,
          text: colors.warning500,
        }
      case 4:
      case 5:
      case 6:
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
  const typeName = transaction
    ? TYPE_HISTORY_NAME[transaction.type as keyof typeof TYPE_HISTORY_NAME] ||
      'Unknown'
    : 'Unknown'
  const statusName = transaction
    ? STATUS_HISTORY_NAME[
        transaction.status as keyof typeof STATUS_HISTORY_NAME
      ] || 'Unknown'
    : 'Unknown'

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

  // Format amount
  const formatAmount = () => {
    if (!transaction) return '0.00 USD'
    const amount = parseFloat(transaction.netAmount)
    const sign = transaction.type === 1 ? '-' : '+'
    return `${sign}${Math.abs(amount).toFixed(2)} USD`
  }

  // Copy to clipboard
  const handleCopy = async (text: string) => {
    await setString(text)
    // You can add a toast notification here
  }

  const isCompleted = transaction?.status === STATUS_HISTORY_ID.COMPLETED
  const chainIconMap: Record<string, any> = {
    '97': require('@/assets/images/97.png'),
    '11155111': require('@/assets/images/11155111.png'),
  }
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType='fade'
      statusBarTranslucent
      onRequestClose={onClose}>
      <StatusBar
        backgroundColor='rgba(0, 0, 0, 0.5)'
        barStyle='light-content'
      />
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}>
          {transaction ? (
            <View
              className='rounded mx-4'
              style={{
                backgroundColor: colors.neutral0,
                width: '90%',
                // maxHeight: '90%',
              }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className='p-4' style={{ gap: 16 }}>
                  {/* Header */}
                  <View style={{ gap: 12 }}>
                    <View className='flex-row justify-between items-start'>
                      {/* Left: Title and Badge */}
                      <View style={{ gap: 4 }}>
                        <View
                          className='flex-row items-center'
                          style={{ gap: 8 }}>
                          {transaction.type === 0 ? (
                            <DepositIcon
                              size={24}
                              strokeColor={statusColor.text}
                            />
                          ) : (
                            <WithdrawIcon
                              size={24}
                              strokeColor={statusColor.text}
                            />
                          )}
                          <View
                            className='flex-row items-center'
                            style={{ gap: 4 }}>
                            <Text
                              className='text-h3-medium'
                              style={{ color: colors.neutral900 }}>
                              {typeName}
                            </Text>
                            <View
                              className='px-2.5 py-1.5 rounded'
                              style={{ backgroundColor: statusColor.bg }}>
                              <Text
                                className='text-caption-medium'
                                style={{ color: statusColor.text }}>
                                {statusName}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <Text
                          className='text-body-small-regular'
                          style={{ color: colors.neutral500 }}>
                          Invoice ID {transaction.id.slice(-10)}
                        </Text>
                      </View>

                      {/* Close button */}
                      <TouchableOpacity
                        onPress={onClose}
                        className='w-7 h-7 items-center justify-center'>
                        <X color={colors.neutral900} size={20} />
                      </TouchableOpacity>
                    </View>

                    {/* Txh and Amount */}
                    <View className='flex-row justify-between items-center'>
                      <View
                        className='flex-row items-center'
                        style={{ gap: 4 }}>
                        <Text
                          className='text-body-small-regular'
                          style={{ color: colors.neutral500 }}>
                          Txh:{' '}
                        </Text>
                        <Text
                          className='text-body-small-regular'
                          style={{ color: colors.primary500 }}>
                          {transaction.id.slice(-12)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleCopy(transaction.id)}>
                          <Copy color={colors.neutral900} size={16} />
                        </TouchableOpacity>
                      </View>
                      <Text
                        className='text-h2-semibold'
                        style={{ color: colors.neutral900 }}>
                        {formatAmount()}
                      </Text>
                    </View>
                  </View>

                  {/* Stepper */}
                  <View style={{ gap: 8 }}>
                    {/* Step 1: Created */}
                    <View className='flex-row' style={{ gap: 8 }}>
                      <View
                        className='w-8 h-8 rounded-full items-center justify-center'
                        style={{ backgroundColor: colors.primary100 }}>
                        <CheckIcon color={colors.primary500} size={16} />
                      </View>
                      <View className='flex-1' style={{ gap: 2 }}>
                        <Text
                          className='text-body-small-semibold'
                          style={{ color: colors.neutral900 }}>
                          Created
                        </Text>
                        <Text
                          className='text-caption-regular'
                          style={{ color: colors.neutral500 }}>
                          {formatDate(
                            transaction.createdAt || new Date().toISOString(),
                          )}
                        </Text>
                      </View>
                    </View>

                    {/* Divider */}
                    <DividerIcon />

                    {/* Step 2: Processed */}
                    <View className='flex-row' style={{ gap: 8 }}>
                      <View
                        className='w-8 h-8 rounded-full items-center justify-center'
                        style={{ backgroundColor: colors.primary100 }}>
                        <CheckIcon color={colors.primary500} size={16} />
                      </View>
                      <View className='flex-1' style={{ gap: 2 }}>
                        <Text
                          className='text-body-small-semibold'
                          style={{ color: colors.neutral900 }}>
                          Processed by Mirroto
                        </Text>
                        <Text
                          className='text-caption-regular'
                          style={{ color: colors.neutral500 }}>
                          {formatDate(
                            transaction.createdAt || new Date().toISOString(),
                          )}
                        </Text>
                      </View>
                    </View>

                    {/* Divider */}
                    <DividerIcon
                      strokeColor={
                        isCompleted ? colors.primary500 : colors.neutral200
                      }
                    />

                    {/* Step 3: Final step based on status */}
                    <View className='flex-row' style={{ gap: 8 }}>
                      <View
                        className='w-8 h-8 rounded-full items-center justify-center'
                        style={{
                          backgroundColor: isCompleted
                            ? colors.primary100
                            : colors.neutral100,
                        }}>
                        {isCompleted ? (
                          <CheckIcon color={colors.primary500} size={16} />
                        ) : (
                          <ClockIcon color={colors.neutral500} size={16} />
                        )}
                      </View>
                      <View className='flex-1' style={{ gap: 2 }}>
                        <Text
                          className='text-body-small-semibold'
                          style={{ color: colors.neutral900 }}>
                          {transaction.type === 0
                            ? 'Crediting to your account'
                            : 'Transfer complete'}
                        </Text>
                        {isCompleted && (
                          <Text
                            className='text-caption-regular'
                            style={{ color: colors.neutral500 }}>
                            {formatDate(
                              transaction.createdAt || new Date().toISOString(),
                            )}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Info Message */}
                  <View
                    className='p-3 rounded'
                    style={{
                      backgroundColor: colors.primary50,
                      borderWidth: 1,
                      borderColor: colors.primary400,
                    }}>
                    <Text
                      className='text-body-small-regular'
                      style={{ color: colors.primary500 }}>
                      The transaction has been successfully processed on our
                      end. Please allow some time for the funds to be credited
                      to your account.
                    </Text>
                  </View>

                  {/* From/To Section */}
                  <View style={{ gap: 16 }}>
                    {/* Divider */}
                    <View
                      style={{
                        height: 1,
                        backgroundColor: colors.neutral200,
                      }}
                    />

                    {/* From */}
                    <View style={{ gap: 12 }}>
                      <View className='gap-1 flex-row items-center justify-between'>
                        <Text
                          className='text-body-small-regular'
                          style={{ color: colors.neutral500 }}>
                          From
                        </Text>
                        <View
                          className='flex-row items-center'
                          style={{ gap: 8 }}>
                          <Image
                            className='w-[24px] h-[24px]'
                            source={require('@/assets/images/transaction-history/icon.png')}
                          />
                          <Text
                            className='text-body-large-medium'
                            style={{ color: colors.neutral900 }}>
                            {transaction.accountId}
                          </Text>
                        </View>
                      </View>

                      {/* To */}
                      {transaction.type === 1 &&
                        transaction.withdrawalMetadata && (
                          <View className='gap-1 flex-row items-center justify-between w-full'>
                            <Text
                              className='text-body-small-regular'
                              style={{ color: colors.neutral500 }}>
                              To
                            </Text>
                            <View
                              className='flex-row items-center'
                              style={{ gap: 8 }}>
                              <Image
                                className='w-[24px] h-[24px]'
                                source={
                                  chainIconMap[
                                    String(
                                      transaction.withdrawalMetadata.chainId,
                                    )
                                  ] ?? require('@/assets/images/97.png')
                                }
                              />
                              <Text
                                className='text-body-large-medium '
                                style={{ color: colors.neutral900 }}
                                numberOfLines={1}
                                ellipsizeMode='middle'>
                                {transaction.withdrawalMetadata.address}
                              </Text>
                            </View>
                          </View>
                        )}
                    </View>

                    {/* Divider */}
                    <View
                      style={{
                        height: 1,
                        backgroundColor: colors.neutral200,
                      }}
                    />

                    {/* Amounts */}
                    <View style={{ gap: 12 }}>
                      <View className='flex-row justify-between'>
                        <Text
                          className='text-body-small-regular'
                          style={{ color: colors.neutral500 }}>
                          Commission
                        </Text>
                        <Text
                          className='text-body-large-medium'
                          style={{ color: colors.neutral900 }}>
                          0 USD
                        </Text>
                      </View>
                      <View className='flex-row justify-between'>
                        <Text
                          className='text-body-small-regular'
                          style={{ color: colors.neutral500 }}>
                          Gross Amount
                        </Text>
                        <Text
                          className='text-body-large-medium'
                          style={{ color: colors.neutral900 }}>
                          {transaction.netAmount} USD
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          ) : (
            <View
              className='rounded mx-4 p-8'
              style={{
                backgroundColor: colors.neutral0,
                width: 358,
              }}>
              <Text
                className='text-center text-body-large-medium'
                style={{ color: colors.neutral900 }}>
                Loading transaction details...
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}

export default TransactionCardDetails
