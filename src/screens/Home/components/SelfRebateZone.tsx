import { UserRound } from 'lucide-react-native'
import { Text, View } from 'react-native'

import { Button } from '@/components/atoms'
import IconZone from '@/theme/assets/icons/home/Zone.svg'
import colors from '@/theme/colors'

function SelfRebateZone() {
  return (
    <View className='p-4'>
      <View className='mb-4'>
        <View className='flex-row items-center mb-2'>
          <View className='flex-row items-center gap-3'>
            <Text className='typo-h3-semibold text-neutral-900'>
              Self-Rebate Zone
            </Text>
            <View className='px-3 py-1 rounded-md bg-warning-600'>
              <Text className='typo-body-small-bold text-neutral-900'>
                Earn Back
              </Text>
            </View>
          </View>
        </View>

        <Text className='typo-body-large-regular text-neutral-500'>
          Get cash back on every trade you make
        </Text>
      </View>

      <View className='rounded-lg border border-neutral-200'>
        <View className='items-center justify-center overflow-hidden pb-4'>
          <IconZone width={200} height={170} />
        </View>
        <View className='px-4 pt-4'>
          <View className=''>
            <Text className='typo-h3-semibold text-neutral-900'>
              Congratulations!
            </Text>
            <Text className='typo-body-small-regular text-neutral-800'>
              Claim your total earnings of{' '}
              <Text className='typo-body-small-semibold text-neutral-900'>
                $1,250.80
              </Text>{' '}
              today.
            </Text>
          </View>

          <View className='mt-3 flex-row items-center gap-2'>
            <UserRound color={colors.iconColors.default} size={20} />
            <Text className='typo-body-small-medium text-neutral-900'>
              12 Distributed
            </Text>
          </View>
        </View>

        <View className='my-4 mx-4 h-px bg-neutral-200' />

        <View className='flex-row items-center justify-between px-4 pb-4'>
          <View>
            <Text className='typo-body-small-regular text-neutral-500'>
              Pending now
            </Text>
            <Text className='mt-1 typo-body-semibold text-primary-500'>
              $345.80
            </Text>
          </View>

          <Button className='px-3' label='Claim all' size={40} />
        </View>
      </View>
    </View>
  )
}

export default SelfRebateZone
