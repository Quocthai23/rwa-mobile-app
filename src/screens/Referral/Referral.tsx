import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Info,
} from 'lucide-react-native'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import earnImg from '@/assets/images/referral/earn.png'
import { useAppNavigation } from '@/hooks'
import { Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { setString } from '@/utils/clipboard'
import { StatCard } from './components/StatCard'
import { StepItem } from './components/StepItem'

function Referral({}: RootScreenProps<Paths.Referral>) {
  const navigation = useAppNavigation()
  const referralCode = '96T3LF'

  const handleCopy = async () => {
    await setString(referralCode)
    Toast.show({
      type: 'success',
      text1: 'Referral code copied to clipboard',
    })
  }

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'bottom']}>
      <View className='flex-1'>
        {/* Header */}
        <View className='h-[60px] px-4 flex-row items-center justify-between'>
          <TouchableOpacity
            className='p-1'
            onPress={() => {
              navigation.goBack()
            }}>
            <ChevronLeft size={24} color='#111827' />
          </TouchableOpacity>
          <Text className='text-h3-semibold text-neutral-900'>
            Refer a friend
          </Text>
          <TouchableOpacity
            className='p-1'
            onPress={() => {
              navigation.navigate(Paths.MyReferral)
            }}>
            <Clock size={24} color='#111827' />
          </TouchableOpacity>
        </View>

        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          {/* Banner */}
          <View className='flex-row items-center justify-between px-4 py-6 bg-white overflow-hidden'>
            <View className='flex-1 pr-4'>
              <Text className='text-h2-bold text-neutral-900 leading-[32px] mb-2'>
                Earn up to $10 for every lot your friends trade
              </Text>
              <Text className='text-body-small-regular text-neutral-500'>
                Reward varies by product
              </Text>
            </View>
            <View className='w-32 h-32 items-center justify-center'>
              <Image
                source={earnImg}
                className='w-full h-full'
                resizeMode='contain'
              />
            </View>
          </View>

          {/* How It Works */}
          <View className='px-4 mb-8'>
            <View className='flex-row justify-between items-center mb-4'>
              <Text className='text-h4-semibold text-neutral-900'>
                How It Works
              </Text>
              <TouchableOpacity
                className='flex-row items-center'
                onPress={() => {
                  navigation.navigate(Paths.RewardStructure)
                }}>
                <Text className='text-body-small-semibold text-primary-500 mr-1'>
                  View details
                </Text>
                <ChevronRight size={16} color='#0158FF' />
              </TouchableOpacity>
            </View>

            <View className='bg-white border border-[#E5E7EB] rounded-2xl p-4'>
              <StepItem
                step={1}
                title='Invite a friend'
                description='Share your referral link'
              />
              <StepItem
                step={2}
                title='They sign up & trade'
                description='Complete 1 Lots'
              />
              <StepItem
                isLast
                step={3}
                title='You get rewarded'
                description='Earn up to $10 per Lots'
              />
            </View>
          </View>

          {/* Referrals Stats */}
          <View className='px-4 mb-8'>
            <Text className='text-h4-semibold text-neutral-900 mb-4'>
              Referrals
            </Text>
            <StatCard
              horizontal
              label='30D Commission'
              value='$320'
              className='mb-3'
            />
            <View className='flex-row'>
              <StatCard
                label="Today's referrals"
                value='1'
                className='flex-1 mr-3'
              />
              <StatCard label='30D referrals' value='14' className='flex-1' />
            </View>
          </View>

          {/* Referral Code Management */}
          <View className='px-4 mb-10'>
            <View className='flex-row items-center mb-4'>
              <Text className='text-h4-semibold text-neutral-900 mr-2'>
                Referral Code Management
              </Text>
            </View>

            <View className='bg-white border border-[#E5E7EB] rounded-md p-4 flex-row items-center justify-between'>
              <Text className='text-body-regular text-neutral-500'>
                Referral Code
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                className='flex-row items-center'
                onPress={handleCopy}>
                <Text className='text-h4-semibold text-neutral-900 mr-2'>
                  {referralCode}
                </Text>
                <Copy size={20} color='#111827' />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View className='px-4 py-4 border-t border-neutral-100'>
          <TouchableOpacity
            className='bg-[#0158FF] h-14 rounded-md items-center justify-center flex-row'
            onPress={handleCopy}>
            <Text className='text-white text-[16px]'>Copy Referral Code</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Referral
