import React from 'react'
import { View } from 'react-native'

import { useTheme } from '@/theme'

const TransactionHistoryCardSkeleton = () => {
  const { colors } = useTheme()

  return (
    <View
      className='p-4 mb-3 rounded'
      style={{
        backgroundColor: colors.neutral0,
        borderWidth: 1,
        borderColor: colors.neutral200,
      }}>
      {/* Main Content */}
      <View className='mb-3'>
        <View className='flex-row items-start justify-between mb-1'>
          {/* Left: Type and Status */}
          <View className='flex-1'>
            <View className='flex-row items-center gap-2 mb-2'>
              {/* Icon skeleton */}
              <View
                className='w-5 h-5 rounded'
                style={{ backgroundColor: colors.neutral200 }}
              />
              {/* Type name skeleton */}
              <View
                className='h-5 rounded'
                style={{ backgroundColor: colors.neutral200, width: 80 }}
              />
              {/* Status badge skeleton */}
              <View
                className='px-2 py-1 rounded'
                style={{
                  backgroundColor: colors.neutral200,
                  width: 70,
                  height: 20,
                }}
              />
            </View>
            {/* Invoice ID skeleton */}
            <View
              className='h-4 rounded'
              style={{ backgroundColor: colors.neutral200, width: 150 }}
            />
          </View>

          {/* Right: Amount and Date */}
          <View className='items-end'>
            {/* Amount skeleton */}
            <View
              className='h-5 rounded mb-1'
              style={{ backgroundColor: colors.neutral200, width: 100 }}
            />
            {/* Date skeleton */}
            <View
              className='h-4 rounded'
              style={{ backgroundColor: colors.neutral200, width: 90 }}
            />
          </View>
        </View>
      </View>

      {/* Withdrawal Details skeleton */}
      <View
        className='pt-3'
        style={{ borderTopWidth: 1, borderColor: colors.neutral200 }}>
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center gap-2 flex-1'>
            {/* Logo skeleton */}
            <View
              className='w-6 h-6 rounded-full'
              style={{ backgroundColor: colors.neutral200 }}
            />
            {/* Address skeleton */}
            <View
              className='h-4 rounded flex-1'
              style={{ backgroundColor: colors.neutral200, maxWidth: 200 }}
            />
          </View>
          {/* Arrow skeleton */}
          <View
            className='w-4 h-4 rounded'
            style={{ backgroundColor: colors.neutral200 }}
          />
        </View>
      </View>
    </View>
  )
}

export default TransactionHistoryCardSkeleton
