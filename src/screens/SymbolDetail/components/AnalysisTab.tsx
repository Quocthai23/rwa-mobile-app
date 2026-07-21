import useTheme from '@/theme/hooks/useTheme'
import { ArrowDown, Info } from 'lucide-react-native'
import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

function AnalysisTab() {
  const { colors } = useTheme()
  const [activeStrategyTab, setActiveStrategyTab] = useState<
    'medium' | 'short'
  >('short')

  return (
    <ScrollView className='flex-1 bg-neutral-0'>
      {/* Strategy Section */}
      <View className='border-b border-neutral-200  pb-4'>
        <Text className='text-h2-semibold px-4 pt-4 pb-2'>Strategy</Text>
        <View className='flex-row items-center px-4 pb-3 gap-3'>
          <View className='flex-row px-[10px] py-[6px] rounded-[4px] bg-error-50 items-center'>
            <ArrowDown color={colors.error500} size={16} />
            <Text className='text-error-500 ml-1 font-semibold'>
              Short Term
            </Text>
          </View>

          <Text className='text-body-small-medium'>
            Short Term: consolidation
          </Text>
        </View>

        {/* Custom Tabs Header */}
        <View className='flex-row px-4 gap-2 mt-2'>
          {['short', 'medium'].map((type) => (
            <TouchableOpacity
              key={type}
              className={`flex-1 h-[40px] items-center rounded-[4px] justify-center ${
                activeStrategyTab === type
                  ? 'bg-primary-50 '
                  : 'bg-neutral-100 '
              }`}
              onPress={() => {
                setActiveStrategyTab(type as 'medium' | 'short')
              }}>
              <Text
                className={`font-medium text-[16px] ${
                  activeStrategyTab === type
                    ? 'text-primary-500'
                    : 'text-neutral-500'
                }`}>
                {type === 'short' ? 'Short Term' : 'Medium Term'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <StrategyContent type={activeStrategyTab} />
      </View>

      {/* Data Section */}
      <View className='px-4 py-4'>
        <Text className='text-h2-semibold mb-4'>Data</Text>

        {/* Trading Sentiment */}
        <View className='mb-6'>
          <Text className='text-body-regular mb-3'>Trading sentiment</Text>
          <View className='flex-row items-center justify-between mb-2'>
            <Text className=' text-neutral-500'>Seller</Text>
            <Text className=' text-neutral-500'>Buyer</Text>
          </View>
          <View className='flex-row h-2 rounded-[2px] overflow-hidden mb-2'>
            <View className='bg-success-500' style={{ width: '58%' }} />
            <View className='bg-error-500' style={{ width: '42%' }} />
          </View>
          <View className='flex-row items-center justify-between'>
            <Text className=' font-semibold text-success-500 '>58%</Text>
            <Text className=' font-semibold text-error-500 '>42%</Text>
          </View>
          <View className='flex-row items-center mt-2'>
            <Text className=' text-neutral-500 mr-2'>
              Data Source: Mirroto (updated every 15 mins)
            </Text>
            <Info className='' color={colors.error500} size={14} />
          </View>
        </View>

        {/* Price Range */}
        <View>
          <Text className='text-body-regular mb-3'>Price range</Text>

          {/* Time periods */}
          <View className='flex-row justify-between mb-3'>
            <PriceRangePeriod
              isNegative
              label='5 mins'
              value='-0,05%'
              isStart
            />
            <PriceRangePeriod isNegative label='60 mins' value='-0,05%' />
            <PriceRangePeriod isNegative label='Today' value='-0,05%' />
          </View>

          {/* Current Price */}
          <View className='flex-row items-baseline mb-4'>
            <Text className='text-body-regular mr-2'>Current Price</Text>
            <Text className='text-body-regular text-success-500'>26067,8</Text>
          </View>

          {/* Price Ranges */}
          <PriceRangeBar
            current={26_067.8}
            highest='26096,9'
            label='5 mins'
            lowest='26065,8'
          />
          <PriceRangeBar
            current={26_067.8}
            highest='26096,9'
            label='60 mins'
            lowest='26065,8'
          />
          <PriceRangeBar
            current={26_067.8}
            highest='26096,9'
            label='Today'
            lowest='26065,8'
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default AnalysisTab

// Strategy Content Component
function StrategyContent({ type }: { readonly type: 'medium' | 'short' }) {
  return (
    <View className='p-4'>
      <Text className='text-neutral-500 text-body-small-regular mb-3'>
        Release time: 24 Jan, 04:26
      </Text>

      {/* Our preference */}
      <View className='mb-4'>
        <View className='flex-row items-center mb-2'>
          <View className='w-2 h-2 rounded-full bg-primary-500 mr-2' />
          <Text className='text-body-regular'>Our preference</Text>
        </View>
        <Text className=' text-neutral-500 leading-5 ml-[16px]'>
          long positions above 24950.00 with targets at 26170.00 & 26700.00 in
          extension.
        </Text>
      </View>

      {/* Alternative scenario */}
      <View className='mb-4'>
        <View className='flex-row items-center mb-2'>
          <View className='w-2 h-2 rounded-full bg-primary-500 mr-2' />
          <Text className='text-body-regular'>Alternative scenario</Text>
        </View>
        <Text className=' text-neutral-500 leading-5 ml-[16px]'>
          below 24950.00 look for further downside with 24620.00 & 23860.00 as
          targets.
        </Text>
      </View>

      {/* Comment */}
      <View className='mb-4'>
        <View className='flex-row items-center mb-2'>
          <View className='w-2 h-2 rounded-full bg-primary-500 mr-2' />
          <Text className='text-body-regular'>Comment</Text>
        </View>
        <Text className=' text-neutral-500 leading-5 ml-[16px]'>
          the RSI is mixed to bullish.
        </Text>
      </View>

      {/* Source */}
      <View className='flex-row items-center'>
        <Text className=' text-neutral-500 mr-2'>
          Source: Trading Central (Reference Only)
        </Text>
        <Info className='ml-2' color='red' size={18} />
      </View>
    </View>
  )
}

// Price Range Period Component
function PriceRangePeriod({
  isNegative,
  label,
  value,
  isStart,
}: {
  readonly isNegative: boolean
  readonly label: string
  readonly value: string
  readonly isStart?: boolean
}) {
  return (
    <View
      className={`flex-1  border-neutral-200 pl-6 ${isStart ? 'border-0 pl-0' : 'border-l'}`}>
      <Text className='text-body-small-regular mb-1'>{label}</Text>
      <Text
        className={`text-body-small-regular ${isNegative ? 'text-error-500' : 'text-success-500'}`}>
        {value}
      </Text>
    </View>
  )
}

// Price Range Bar Component
function PriceRangeBar({
  current,
  highest,
  label,
  lowest,
}: {
  readonly current: number
  readonly highest: string
  readonly label: string
  readonly lowest: string
}) {
  const { colors } = useTheme()
  const lowestNumber = Number.parseFloat(lowest.replace(',', '.'))
  const highestNumber = Number.parseFloat(highest.replace(',', '.'))
  const range = highestNumber - lowestNumber
  const percentage = ((current - lowestNumber) / range) * 100

  return (
    <View className='mb-6'>
      <View className='flex-row justify-between items-center mb-2'>
        <View className='items-start flex-1'>
          <Text className=' text-neutral-500 mb-1'>Lowest price</Text>
        </View>

        <View className='items-end flex-1'>
          <Text className=' text-neutral-500 mb-1'>Highest price</Text>
        </View>
      </View>
      <View className='relative h-1.5 bg-primary-500 dark:bg-gray-700 rounded-full mt-1'>
        <View
          className='absolute h-1.5 bg-primary-500 rounded-full'
          style={{ width: `${percentage}%` }}
        />
        {/* Triangle indicator */}
        <View
          className='absolute'
          style={{
            left: `${percentage}%`,
            marginLeft: -4,
            top: -6,
          }}>
          <View
            style={{
              backgroundColor: 'transparent',
              borderTopColor: colors.primary500,
              borderTopWidth: 6,
              borderLeftColor: 'transparent',
              borderLeftWidth: 4,
              borderRightColor: 'transparent',
              borderRightWidth: 4,
              borderStyle: 'solid',
              height: 0,
              width: 0,
            }}
          />
        </View>
      </View>
      <View className='flex-row items-center justify-between mt-2'>
        <Text className=' dark:text-white'>{lowest}</Text>
        <Text className=' text-neutral-500'>{label}</Text>
        <Text className=' dark:text-white'>{highest}</Text>
      </View>
    </View>
  )
}
