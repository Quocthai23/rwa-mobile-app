import { Text, View } from 'react-native'

import { Button } from '@/components/atoms'

export function ReferralCommission() {
  return (
    <View className='p-4'>
      <View className='mb-4'>
        <Text className='text-h3-semibold text-neutral-900'>
          Referral Commission
        </Text>
        <Text className='text-body-large-regular text-neutral-500'>
          Earn rewards while your friends trade
        </Text>
      </View>

      <View className='border border-neutral-200 rounded-lg p-4'>
        <View className='flex-row items-center justify-between'>
          <View className='items-start'>
            <Text className='text-display-sm text-primary-500'>$1,250.80</Text>
            <Text className='text-body-medium text-neutral-900'>
              Total Earned
            </Text>
          </View>
          <View className='items-end'>
            <Button className='px-3' label='Claim all' size={40} />
          </View>
        </View>

        <View className='border-t border-neutral-200 my-4' />

        <View className='gap-y-2'>
          <View className='flex-row items-center justify-between'>
            <Text className='text-body-small-regular text-neutral-500'>
              Total Volume
            </Text>
            <Text className='text-body-medium text-neutral-900'>$2345.80</Text>
          </View>

          <View className='flex-row items-center justify-between'>
            <Text className='text-body-small-regular text-neutral-500'>
              Claimed
            </Text>
            <Text className='text-body-medium text-neutral-900'>$1232.22</Text>
          </View>

          <View className='flex-row items-center justify-between'>
            <Text className='text-body-small-regular text-neutral-500'>
              Total Members
            </Text>
            <Text className='text-body-medium text-neutral-900'>45</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
