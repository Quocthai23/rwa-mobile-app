import { ChevronLeft, Filter } from 'lucide-react-native'
import { useState } from 'react'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAppNavigation, useCommission } from '@/hooks'
import { ReferralFilterModal } from './components/ReferralFilterModal'
import { ReferralHistoryItem } from './components/ReferralHistoryItem'
import noRefImg from '@/assets/images/referral/no-ref.png'

function MyReferral() {
  const navigation = useAppNavigation()
  const [filterVisible, setFilterVisible] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('1 week')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const { data, isLoading } = useCommission(
    fromDate || undefined,
    toDate || undefined,
  )

  const handleApplyFilter = (
    newFromDate: string,
    newToDate: string,
    period: string,
  ) => {
    // console.log('Applying filter:', { newFromDate, newToDate, period })
    setFromDate(newFromDate)
    setToDate(newToDate)
    setSelectedPeriod(period)
    setFilterVisible(false)
  }

  const hasData = data && data.details.length > 0
  const totalEarned = data?.totalAmount || '0'

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'bottom']}>
      <View className='flex-1'>
        {/* Header */}
        <View
          className='h-[60px] px-4 flex-row items-center justify-between border-b border-neutral-50'
          style={{ zIndex: 100 }}>
          <TouchableOpacity
            className='p-1'
            onPress={() => {
              navigation.goBack()
            }}>
            <ChevronLeft size={24} color='#111827' />
          </TouchableOpacity>
          <Text className='text-h3-semibold text-neutral-900'>My Referral</Text>
          <TouchableOpacity
            className='p-2'
            style={{ zIndex: 110 }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            onPress={() => {
              setFilterVisible(true)
            }}>
            <Filter size={24} color='#111827' />
          </TouchableOpacity>
        </View>

        <ScrollView
          className='flex-1'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}>
          {isLoading ? (
            <View className='flex-1 items-center justify-center'>
              <ActivityIndicator size='large' color='#0158FF' />
            </View>
          ) : !hasData ? (
            <View className='flex-1 items-center justify-center'>
              <View className='w-32 h-32 bg-primary-50 rounded-full items-center justify-center mb-6'>
                <Image
                  source={noRefImg}
                  className='w-full h-full'
                  resizeMode='contain'
                />
              </View>
              <Text className='text-h3-semibold text-neutral-900 text-center mb-2'>
                You haven't invited anyone yet.
              </Text>
              <Text className='text-body-regular text-neutral-500 text-center'>
                Invite friends to start racking up rewards
              </Text>
            </View>
          ) : (
            <View className='pb-10'>
              <View className='py-6 px-4'>
                <Text className='text-body-regular text-neutral-500 mb-1'>
                  You've earned
                </Text>
                <Text className='text-[40px] font-bold text-neutral-900 leading-[48px]'>
                  ${totalEarned}
                </Text>
              </View>

              <View className='mb-6 px-4'>
                {data.details.map((item, index) => {
                  const totalLots = item.volumes
                    .reduce((sum, v) => sum + parseFloat(v.quantity), 0)
                    .toFixed(2)
                  const totalEarnedItem = item.volumes
                    .reduce((sum, v) => sum + parseFloat(v.amount), 0)
                    .toFixed(2)

                  return (
                    <ReferralHistoryItem
                      key={index}
                      details={item.volumes}
                      email={item.email}
                      totalEarned={`+$${totalEarnedItem}`}
                      totalLots={totalLots}
                    />
                  )
                })}
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <ReferralFilterModal
        visible={filterVisible}
        selectedPeriod={selectedPeriod}
        fromDate={fromDate}
        toDate={toDate}
        onClose={() => setFilterVisible(false)}
        onApply={handleApplyFilter}
      />
    </SafeAreaView>
  )
}

export default MyReferral
