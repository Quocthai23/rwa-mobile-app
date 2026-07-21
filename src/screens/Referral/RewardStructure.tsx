import { ChevronLeft } from 'lucide-react-native'
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAppNavigation, useAssets } from '@/hooks'
import type { Asset } from '@/types'
import { RewardCategoryItem } from './components/RewardCategoryItem'
import earnImg from '@/assets/images/referral/earn-structure.png'

const categoryIcons: Record<string, string> = {
  METAL: '💎',
  CRYPTO: '₿',
  INDEX: '📊',
  FOREX: '💰',
  STOCK: '📉',
  COMMODITY: '⛽',
}

function RewardStructure() {
  const navigation = useAppNavigation()
  const { data: assets, isLoading } = useAssets()

  const groupedAssets = assets?.reduce(
    (
      acc: Record<string, { label: string; items: Asset[]; icon: string }>,
      asset,
    ) => {
      const categoryName = asset.category?.name || 'Other'
      const categoryCode = asset.category?.code || 'OTHER'

      if (!acc[categoryCode]) {
        acc[categoryCode] = {
          label: categoryName,
          items: [],
          icon: categoryIcons[categoryCode] || '📦',
        }
      }
      acc[categoryCode].items.push(asset)
      return acc
    },
    {},
  )

  const sortedCategories = groupedAssets
    ? Object.values(groupedAssets).sort((a, b) =>
        a.label.localeCompare(b.label),
      )
    : []

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top', 'bottom']}>
      <View className='flex-1'>
        {/* Header */}
        <View className='h-[60px] px-4 flex-row items-center'>
          <TouchableOpacity
            className='p-1'
            onPress={() => {
              navigation.goBack()
            }}>
            <ChevronLeft size={24} color='#111827' />
          </TouchableOpacity>
          <Text className='text-h3-semibold text-neutral-900 ml-4'>
            Reward Structure
          </Text>
        </View>

        <ScrollView
          className='flex-1 px-4'
          showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View className='py-6 flex-row items-center justify-between'>
            <View className='flex-1 pr-4'>
              <Text className='text-h2-bold text-neutral-900 leading-[32px] mb-2'>
                Earn up to $10.00 per lot
              </Text>
              <Text className='text-body-regular text-neutral-500 leading-[20px]'>
                Rewards depend on instrument and spread. Per standard lot.
              </Text>
            </View>
            <View className='w-20 h-20 items-center justify-center'>
              <Image
                source={earnImg}
                className='w-full h-full'
                resizeMode='contain'
              />
            </View>
          </View>

          {/* Categories */}
          <View className='mt-4 pb-10'>
            <Text className='text-h4-semibold text-neutral-900 mb-4'>
              Reward Categories
            </Text>

            {isLoading ? (
              <View className='py-20 items-center justify-center'>
                <ActivityIndicator size='large' color='#0158FF' />
              </View>
            ) : sortedCategories.length > 0 ? (
              sortedCategories.map((category, index) => (
                <RewardCategoryItem
                  key={index}
                  icon={<Text className='text-lg'>{category.icon}</Text>}
                  instruments={category.items}
                  label={category.label}
                />
              ))
            ) : (
              <View className='py-20 items-center justify-center'>
                <Text className='text-neutral-500'>No data available</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default RewardStructure
