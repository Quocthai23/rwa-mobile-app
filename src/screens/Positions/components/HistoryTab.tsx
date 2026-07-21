import { useToast } from '@/hooks/useToast'
import { Paths } from '@/navigation/paths'
import useTheme from '@/theme/hooks/useTheme'
import { setString } from '@/utils/clipboard'
import { Check, Copy, Funnel, ListFilter } from 'lucide-react-native'
import { useMemo, useState, useEffect, useRef } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MainTabScreenProps } from '@/navigation/types'
import { CustomPosition, Position } from '@/types'
import { formatPositionDateTime } from '@/utils/dateUtils'

type HistoryTabProps = {
  readonly historyData: Position[]
  readonly onFilterPress: () => void
  readonly onSortPress: () => void
  readonly selectedSort: string | null
}

export function HistoryTab({
  historyData,
  onFilterPress,
  onSortPress,
  selectedSort,
}: HistoryTabProps) {
  const closedItems = historyData.filter((item) => item.status === 2)
  const [selectedItem, setSelectedItem] = useState<CustomPosition | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [copiedPositionId, setCopiedPositionId] = useState(false)
  const { showError } = useToast()
  const { colors } = useTheme()
  const navigation = useNavigation<MainTabScreenProps['navigation']>()

  const slideAnim = useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current

  useEffect(() => {
    if (showDetailModal) {
      slideAnim.setValue(Dimensions.get('window').height)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700, // 800ms for slow slide-up
        useNativeDriver: true,
      }).start()
    } else {
      // Slide-down animation
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 600, // faster close
        useNativeDriver: true,
      }).start()
    }
  }, [showDetailModal, slideAnim])
  const handleCopyPositionId = async () => {
    if (!selectedItem?.id) return
    try {
      await setString(selectedItem.id.toString())
      setCopiedPositionId(true)
      setTimeout(() => setCopiedPositionId(false), 2000)
    } catch (error) {
      showError('Copy failed', 'Failed to copy position ID')
    }
  }
  const open = Number(selectedItem?.openPrice ?? 0)
  const close = Number(selectedItem?.closePrice ?? 0)
  const isBuy = selectedItem?.side === 0

  const priceDiff = isBuy ? close - open : open - close

  return (
    <View className='flex-1'>
      <View className='flex-col gap-3 flex-1'>
        <View className='flex-row gap-4 items-center'>
          <TouchableOpacity
            className='rounded-md bg-neutral-100'
            onPress={onSortPress}>
            <View className='flex-row items-center gap-2 py-2 px-3'>
              <ListFilter size={20} className='text-neutral-700' />
              <Text className='text-button-small-medium text-neutral-900'>
                Sort by: {selectedSort}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className='rounded-md bg-neutral-100'
            onPress={onFilterPress}>
            <View className='flex-row items-center gap-2 py-2 px-3'>
              <Funnel size={20} className='text-neutral-700' />
              <Text className='text-button-small-medium text-neutral-900'>
                Filter
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className='flex-1'
          contentContainerStyle={{ paddingBottom: 20 }}>
          <View className='flex-col gap-1'>
            {closedItems.length === 0 ? (
              <View className='flex-1 justify-center items-center py-8'>
                <Text className='text-body-medium-regular text-neutral-500'>
                  No positions history available
                </Text>
              </View>
            ) : (
              closedItems.map((item) => {
                const checkSide = item.side === 0 ? 'Buy' : 'Sell'
                const isBuy = checkSide.toLowerCase().includes('buy')
                const badgeColor = isBuy ? 'bg-success-50' : 'bg-error-50'
                const badgeTextColor = isBuy
                  ? 'text-success-500'
                  : 'text-error-500'
                const realizedPnl = Number(item.realizedPnl) || 0
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setSelectedItem(item)
                      setShowDetailModal(true)
                    }}>
                    <View className='flex-row justify-between items-center'>
                      <View className='flex-col items-start gap-1'>
                        <View className='flex-row items-center gap-2'>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {item.symbol}
                          </Text>
                          <View className={`rounded-md ${badgeColor}`}>
                            <Text
                              className={`py-1.5 px-2.5 text-caption-medium ${badgeTextColor}`}>
                              {checkSide}
                            </Text>
                          </View>
                        </View>
                        <Text className='text-body-small-regular text-neutral-500'>
                          {item.initialQuantity} at {item.openPrice}
                        </Text>
                      </View>

                      <View className='flex-col items-end'>
                        <Text
                          className={`text-h3-semibold text-${realizedPnl < 0 ? 'error-500' : 'success-500'}`}>
                          {realizedPnl > 0 ? '+' : ''}
                          {realizedPnl}
                        </Text>
                        <Text className='text-body-small-regular text-neutral-500'>
                          {item.closedAt
                            ? formatPositionDateTime(item.closedAt)
                            : 'Unknown time'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })
            )}
          </View>
        </ScrollView>
      </View>
      {/* History Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType='none'
        transparent
        onRequestClose={() => {
          setShowDetailModal(false)
        }}>
        <Pressable
          className='flex-1'
          onPress={() => {
            setShowDetailModal(false)
          }}>
          {/* Animated overlay background */}
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              opacity: slideAnim.interpolate({
                inputRange: [0, Dimensions.get('window').height],
                outputRange: [1, 0],
              }),
            }}
            pointerEvents='none'
          />
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              transform: [{ translateY: slideAnim }],
            }}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View>
                {selectedItem && (
                  <ScrollView>
                    {/* Header */}
                    <View className='rounded-[4px] mx-4 bg-white mb-2 mt-4'>
                      {/* Title and Badge Row */}

                      <View className='bg-neutral-100 p-4 rounded-t-[4px]'>
                        <View className='flex flex-row items-start justify-between'>
                          <View className='flex-row items-center mb-2 gap-2  '>
                            <Text className='text-h2-semibold text-neutral-900'>
                              {selectedItem.symbol}
                            </Text>
                            <View
                              className={`rounded-[4px] ${selectedItem.side === 0 ? 'bg-success-50' : 'bg-error-50'}`}>
                              <Text
                                className={`py-1.5 px-2.5 text-caption-medium ${selectedItem.side === 0 ? 'text-success-500' : 'text-error-500'}`}>
                                {selectedItem.side === 0 ? 'Buy' : 'Sell'}
                              </Text>
                            </View>
                          </View>

                          <View className='flex flex-row items-center gap-1'>
                            <Text className='text-body-small-regular text-neutral-900'>
                              #{(selectedItem as any).id || 'Unknown Asset'}
                            </Text>
                            <TouchableOpacity onPress={handleCopyPositionId}>
                              {copiedPositionId ? (
                                <Check size={15} color={colors.success500} />
                              ) : (
                                <Copy size={15} />
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Asset Name */}
                        <Text className='text-body-small-regular text-neutral-500'>
                          {(selectedItem as any).name || 'Unknown Asset'}
                        </Text>
                      </View>

                      {/* Price Info */}
                      <View className='flex flex-row items-center justify-between mt-2'>
                        <View>
                          <View className=' px-4 flex flex-row gap-1 items-center'>
                            <Text className='text-body-small-regular text-neutral-900'>
                              {parseFloat(selectedItem.initialQuantity)}
                            </Text>
                            <Text>at</Text>
                            <Text>{selectedItem.openPrice}</Text>
                          </View>
                          {/* PnL Row */}
                          <View className='flex-row justify-between items-center mb-2 px-4'>
                            <View className=''>
                              <Text
                                className={`text-body-small-regular ${Number(selectedItem.realizedPnl) >= 0 ? 'text-success-500' : 'text-error-500'} mb-1`}>
                                Δ =
                                {Number(selectedItem.realizedPnl) >= 0
                                  ? Math.abs(priceDiff).toFixed(
                                      selectedItem.digit ?? 2,
                                    )
                                  : `-${Math.abs(priceDiff).toFixed(selectedItem.digit ?? 2)}`}
                                (
                                {Number(selectedItem.realizedPnl) >= 0
                                  ? (
                                      (((Number(selectedItem.closePrice) ?? 0) -
                                        Number(selectedItem.openPrice)) /
                                        Number(selectedItem.openPrice || 1)) *
                                      100
                                    ).toFixed(2)
                                  : `-${(
                                      (((Number(selectedItem.closePrice) ?? 0) -
                                        Number(selectedItem.openPrice)) /
                                        Number(selectedItem.openPrice || 1)) *
                                      100
                                    ).toFixed(2)}`}
                                %)
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View className='mr-4'>
                          <Text
                            className={`text-h2-semibold ${Number(selectedItem.realizedPnl) >= 0 ? 'text-success-500' : 'text-error-500'}`}>
                            {Number(selectedItem.realizedPnl) > 0 ? '+' : ''}
                            {Number(selectedItem.realizedPnl).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                      <View className='px-4 mb-4 flex flex-col gap-2'>
                        {/* <View className='flex-row justify-between mb-3'> */}
                        <View className='flex-row justify-between'>
                          <Text className='text-body-small-regular text-neutral-500'>
                            S/L:
                          </Text>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {selectedItem.stopLoss || 'Unset'}
                          </Text>
                        </View>
                        <View className='flex-row justify-between '>
                          <Text className='text-body-small-regular text-neutral-500'>
                            T/P:
                          </Text>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {selectedItem.takeProfit || 'Unset'}
                          </Text>
                        </View>
                        <View className='flex-row justify-between'>
                          <Text className='text-body-small-regular text-neutral-500'>
                            Swap:
                          </Text>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {selectedItem.totalFees}
                          </Text>
                        </View>
                        <View className='flex-row justify-between'>
                          <Text className='text-body-small-regular text-neutral-500'>
                            Open time:
                          </Text>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {formatPositionDateTime(
                              selectedItem.openedAt as string,
                            )}
                          </Text>
                        </View>
                        <View className='flex-row justify-between'>
                          <Text className='text-body-small-regular text-neutral-500'>
                            Close time
                          </Text>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {formatPositionDateTime(
                              selectedItem.closedAt as string,
                            )}
                          </Text>
                          {/* </View> */}
                        </View>
                      </View>
                    </View>

                    {/* Details Grid */}

                    {/* Action Buttons */}
                    <View className='p-4 gap-3 rounded-[4px] bg-white mx-4 mb-5'>
                      <TouchableOpacity
                        className='bg-neutral-100 rounded-lg py-3 items-center'
                        onPress={() => {
                          setShowDetailModal(false)
                          navigation.navigate(Paths.OpeningOrder, {
                            position: selectedItem,
                            tab: 'open_position',
                          })
                        }}>
                        <Text className='text-button-large-medium text-neutral-900'>
                          Trade
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className='bg-neutral-100 rounded-lg py-3 items-center'
                        onPress={() => {
                          setShowDetailModal(false)
                          // navigation.navigate(Paths.SymbolDetail, {
                          //   symbol: selectedPosition.symbol,
                          // })
                          navigation.navigate(Paths.Market, {
                            screen: Paths.SymbolDetail,
                            params: {
                              symbol: selectedItem.symbol,
                            },
                          })
                        }}>
                        <Text className='text-button-large-medium text-neutral-900'>
                          Chart
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                )}
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  )
}
