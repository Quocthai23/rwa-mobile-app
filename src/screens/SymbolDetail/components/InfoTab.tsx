import React from 'react'
import { ScrollView, Text, View, ActivityIndicator } from 'react-native'

import { useAssetById } from '@/hooks/useAssets'
import { formatPositionDateTime } from '@/utils/dateUtils'

type InfoTabProps = {
  readonly assetId?: string
}

function InfoTab({ assetId }: InfoTabProps) {
  const { data: asset, isLoading } = useAssetById(assetId)

  if (isLoading) {
    return (
      <View className='flex-1 items-center justify-center bg-white dark:bg-background'>
        <ActivityIndicator size='large' />
      </View>
    )
  }

  if (!asset) {
    return (
      <View className='flex-1 items-center justify-center bg-white dark:bg-background'>
        <Text className='text-body-medium text-neutral-500'>
          Asset not found
        </Text>
      </View>
    )
  }

  // Format volume per trade
  const volumePerTrade = `${asset.minTradeSize}-${asset.maxTradeSize} Lot`

  // Format leverage
  const leverage = `${asset.maxLeverage}X`

  // Format contract size
  const contractSize = `${asset.contractSize} Contract`

  // Format max volume
  const maxVolume = `${asset.maxTradeSize} Lot`

  return (
    <ScrollView className='flex-1 bg-white dark:bg-background'>
      {/* Info Section */}
      <View className='px-4 py-4'>
        <Text className='text-h2-semibold mb-3'>Info</Text>

        {/* Description */}
        <Text className='text-body-small-regular mb-4'>
          {asset.category.description || asset.name}
        </Text>

        {/* Info Rows */}
        <InfoRow label='Volume Per Trade' value={volumePerTrade} />
        <InfoRow label='Maximum Leverage' value={leverage} />
        <InfoRow label='Contract Size' value={contractSize} />
        <InfoRow label='Max volume of open positions' value={maxVolume} />
        <InfoRow label='Currency of Quote' value={asset.profitCurrency} />
        <InfoRow label='Floating Spread' value={asset.spread} />
        {/* <InfoRow
          label='Overnight Funding'
          value={
            <View className=''>
              <Text className='text-body-small-regular'>Buy: -0,02311%</Text>
              <Text className='text-body-small-regular'>Sell: -0,007168%</Text>
              <Text className='text-body-small-regular'>Time: 05:00:00</Text>
              <Text className='text-caption-regular text-neutral-500 mt-1'>
                Charged from full size
              </Text>
            </View>
          }
        /> */}
        {/* <InfoRow
          label='Trading Session'
          value={
            <View>
              <View className='flex-row justify-end mb-1'>
                <Text className='text-body-medium  mr-2 -mt-1'>
                  Current Session:
                </Text>
                <View>
                  <Text className='text-body-small-regular text-right'>
                    29 Jan, 06:00
                  </Text>
                  <Text className='text-body-small-regular text-right'>
                    30 Jan, 05:00
                  </Text>
                </View>
              </View>
              <View className='flex-row justify-end'>
                <Text className='text-body-medium  mr-2 -mt-1'>
                  Next Session:
                </Text>
                <View>
                  <Text className='text-body-small-regular text-right'>
                    30 Jan, 06:00
                  </Text>
                  <Text className='text-body-small-regular text-right'>
                    31 Jan, 05:00
                  </Text>
                </View>
              </View>
            </View>
          }
        /> */}
      </View>

      {/* Corporate Actions Section */}
      <View
        className='px-4 py-4 pt-0
      '>
        <Text className='text-body-medium mb-3'>Corporate Actions</Text>

        {/* Action Item */}
        <View className='mb-4'>
          {/* <Text className=' mb-2'>{formatPositionDateTime(asset.createdAt)}</Text> */}
          <View className='flex-row justify-between items-center'>
            <Text className=' text-neutral-500 dark:text-white'>
              Indices Dividend
            </Text>
            <Text className=''>
              {asset.profitCurrency} {asset.minTradeSize} / Lot
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default InfoTab

// Info Row Component
function InfoRow({
  label,
  value,
}: {
  readonly label: string
  readonly value: React.ReactNode | string
}) {
  return (
    <View className='flex-row justify-between py-3 '>
      <Text className=' text-neutral-500 flex-1'>{label}</Text>
      {typeof value === 'string' ? (
        <Text className=' text-black dark:text-white text-right flex-1'>
          {value}
        </Text>
      ) : (
        <View className='w-[35%]'>{value}</View>
      )}
    </View>
  )
}
