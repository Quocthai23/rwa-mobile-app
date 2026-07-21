import { useNavigation } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowRight,
  Check,
  CircleX,
  Copy,
  ListFilter,
  MoveRight,
  PenLine,
} from 'lucide-react-native'
import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import { ButtonNew } from '@/components/atoms/Button/ButtonNew'
import { usePositions } from '@/hooks/usePosition'
import { useToast } from '@/hooks/useToast'
import { Paths } from '@/navigation/paths'
import type { MainTabScreenProps } from '@/navigation/types'
import { closePositions } from '@/services/positionService'
import useTheme from '@/theme/hooks/useTheme'
import { type Position } from '@/types/position'
import { setString } from '@/utils/clipboard'
import { formatPositionDateTime } from '@/utils/dateUtils'

import {
  calculatePositionFields,
  calculateUnrealizedPnL,
} from '../position.calculations'

type ClosePositionsMutation = {
  mutate: (positions: Position[], callbacks: any) => void
  isPending: boolean
}

type PositionsTabProps = {
  readonly selectedSort: string | null
  readonly onSortPress: () => void
  readonly bulkOperationsModalVisible: boolean
  readonly setBulkOperationsModalVisible: (visible: boolean) => void
  readonly closePositionsMutation: ClosePositionsMutation
  readonly openPositions: Position[]
  readonly rtBySymbol: Record<string, any>
  readonly assetsBySymbol: Record<
    string,
    { contractSize: number; digit: number }
  >
  readonly activeAccountId: string
}

export function PositionsTab({
  selectedSort,
  onSortPress,
  bulkOperationsModalVisible,
  setBulkOperationsModalVisible,
  closePositionsMutation,
  openPositions,
  rtBySymbol,
  assetsBySymbol,
  activeAccountId,
}: PositionsTabProps) {
  const navigation = useNavigation<MainTabScreenProps['navigation']>()
  const [closingPositionId] = useState<string | null>(null)
  const [openSwipeableId, setOpenSwipeableId] = useState<string | null>(null)
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map())
  const [selectedPosition, setSelectedPosition] = useState<
    (Position & { digit: number; profit: number }) | null
  >(null)
  const [copiedPositionId, setCopiedPositionId] = useState(false)
  const [showPositionModal, setShowPositionModal] = useState(false)

  const { colors } = useTheme()
  const { showError, showSuccess } = useToast()
  const { refetch: refetchPositions } = usePositions({
    accountId: activeAccountId || '',
  })
  // Animated values for modals
  const slidePositionAnim = useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current
  const slideBulkAnim = useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current
  // Handle position modal animation
  useEffect(() => {
    if (showPositionModal) {
      slidePositionAnim.setValue(Dimensions.get('window').height)
      Animated.timing(slidePositionAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slidePositionAnim, {
        toValue: Dimensions.get('window').height,
        duration: 600,
        useNativeDriver: true,
      }).start()
    }
  }, [showPositionModal, slidePositionAnim])

  // Handle bulk operations modal animation
  useEffect(() => {
    if (bulkOperationsModalVisible) {
      slideBulkAnim.setValue(Dimensions.get('window').height)
      Animated.timing(slideBulkAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideBulkAnim, {
        toValue: Dimensions.get('window').height,
        duration: 600,
        useNativeDriver: true,
      }).start()
    }
  }, [bulkOperationsModalVisible, slideBulkAnim])

  const handleEditPosition = (position: Position) => {
    // Close the swipeable
    const ref = swipeableRefs.current.get(position.id)
    if (ref) {
      ref.close()
    }
    // Navigate to modify opening order screen
    navigation.navigate(Paths.ModifyOpeningOrder, { position })
  }

  const handlePositionLongPress = (
    position: Position,
    digit: number,
    profit: number,
  ) => {
    setSelectedPosition({ ...position, digit, profit })
    setCopiedPositionId(false)
    setShowPositionModal(true)
  }

  const handleCopyPositionId = async () => {
    if (!selectedPosition?.id) return
    try {
      await setString(selectedPosition.id)
      setCopiedPositionId(true)
      setTimeout(() => setCopiedPositionId(false), 2000)
    } catch (error) {
      showError('Copy failed', 'Failed to copy position ID')
    }
  }
  const handleClosePosition = async (position: Position) => {
    // Close the swipeable
    const ref = swipeableRefs.current.get(position.id)
    if (ref) {
      ref.close()
    }

    showSuccess('Closing position', position.symbol)

    if (!position) return

    try {
      await closePositions(position.id, position.accountId, position.quantity)
      refetchPositions()

      setShowPositionModal(false)
      setSelectedPosition(null)
      showSuccess('Position closed', 'Position closed successfully.')
    } catch (error: any) {
      showError('Error closing position', error)
    } finally {
    }
  }

  const renderRightActions = (position: Position) => {
    const isClosing = closingPositionId === position.id

    return (
      <View className='flex-row items-center ml-8'>
        <TouchableOpacity
          className=' justify-center items-center bg-success-500/20'
          style={{ width: 55, height: 60 }}
          onPress={() => handleEditPosition(position)}>
          <PenLine color={colors.success500} size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          className={`rounded-md justify-center items-center ${isClosing ? 'bg-neutral-200' : 'bg-error-500/20'}`}
          // disabled={isClosing}
          style={{ width: 55, height: 60 }}
          onPress={() => handleClosePosition(position)}>
          <CircleX color={colors.error500} size={24} />
        </TouchableOpacity>
      </View>
    )
  }
  const queryClient = useQueryClient()

  const handleCloseAllPositions = () => {
    if (openPositions && openPositions.length > 0) {
      closePositionsMutation.mutate(openPositions, {
        onError: (error: any) => {
          console.error('❌ Close All Positions Error:', error)
        },
        onSuccess: () => {
          setBulkOperationsModalVisible(false)

          queryClient.invalidateQueries({
            queryKey: ['positions', activeAccountId],
          })

          queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
      })
    } else {
      console.log('No positions to close')
      setBulkOperationsModalVisible(false)
    }
  }

  const handleCloseProfitablePositions = () => {
    const profitablePositions = openPositions.filter((position) => {
      const profit = calculateUnrealizedPnL(position, rtBySymbol)
      return profit > 0
    })

    if (profitablePositions.length > 0) {
      closePositionsMutation.mutate(profitablePositions, {
        onError: (error: any) => {
          console.error('❌ Close Profitable Positions Error:', error)
        },
        onSuccess: () => {
          setBulkOperationsModalVisible(false)

          queryClient.invalidateQueries({
            queryKey: ['positions', activeAccountId],
          })

          queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
      })
    } else {
      console.log('No profitable positions to close')
      setBulkOperationsModalVisible(false)
    }
  }

  const handleCloseLosingPositions = () => {
    const losingPositions = openPositions.filter((position) => {
      const profit = calculateUnrealizedPnL(position, rtBySymbol)
      return profit < 0
    })

    if (losingPositions.length > 0) {
      closePositionsMutation.mutate(losingPositions, {
        onError: (error: any) => {
          console.error('❌ Close Losing Positions Error:', error)
        },
        onSuccess: () => {
          setBulkOperationsModalVisible(false)

          queryClient.invalidateQueries({
            queryKey: ['positions', activeAccountId],
          })

          queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
      })
    } else {
      console.log('No losing positions to close')
      setBulkOperationsModalVisible(false)
    }
  }

  return (
    <View className='flex-1'>
      <View className='flex-row gap-4 items-center mb-3'>
        <TouchableOpacity
          className='rounded-md bg-neutral-100'
          onPress={onSortPress}>
          <View className='flex-row items-center gap-2 py-2 px-3'>
            <ListFilter className='text-neutral-700' size={20} />
            <Text className='text-button-small-medium text-neutral-900'>
              Sort by: {selectedSort}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className='flex-col gap-2 flex-1'>
        <View className='flex-row justify-between items-center'>
          <Text className='text-h3-semibold text-neutral-900'>Positions</Text>
          <ButtonNew
            name='Close'
            size='md'
            textColor='text-primary-500'
            type='text'
            onPress={() => setBulkOperationsModalVisible(true)}
          />
        </View>
        {openPositions.length === 0 ? (
          <View className='py-8 items-center'>
            <Text className='text-body-medium text-neutral-500'>
              No positions available
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
            <View className='flex-col gap-1'>
              {openPositions.map((position) => {
                const fields = calculatePositionFields(
                  position,
                  assetsBySymbol,
                  rtBySymbol,
                )
                const { isBuy, openPrice, currentPrice, profit, digit } = fields
                const badgeColor = isBuy ? 'bg-success-50' : 'bg-error-50'
                const badgeTextColor = isBuy
                  ? 'text-success-500'
                  : 'text-error-500'
                const positionType = isBuy ? 'Buy' : 'Sell'

                return (
                  <Swipeable
                    key={position.id}
                    ref={(el) => {
                      if (el) {
                        swipeableRefs.current.set(position.id, el)
                      }
                    }}
                    overshootRight={false}
                    onSwipeableOpen={() => {
                      // Close previous open swipeable if it's different
                      if (openSwipeableId && openSwipeableId !== position.id) {
                        const prevRef =
                          swipeableRefs.current.get(openSwipeableId)
                        if (prevRef) {
                          prevRef.close()
                          // Reset state since close() might not trigger onSwipeableClose
                          setOpenSwipeableId(null)
                        }
                      }
                      setOpenSwipeableId(position.id)
                    }}
                    onSwipeableClose={() => {
                      if (openSwipeableId === position.id) {
                        setOpenSwipeableId(null)
                      }
                    }}
                    renderRightActions={() => renderRightActions(position)}>
                    <TouchableOpacity
                      className='flex-row justify-between items-center bg-white'
                      onPress={() =>
                        handlePositionLongPress(position, digit, profit)
                      }>
                      <View className='flex-col items-start gap-1 justify-center flex-1'>
                        <View className='flex-row items-center gap-2'>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {position.symbol}
                          </Text>
                          <View className={`rounded-md ${badgeColor}`}>
                            <Text
                              className={`py-1.5 px-2.5 text-caption-medium ${badgeTextColor}`}>
                              {positionType} {position.quantity}
                            </Text>
                          </View>
                        </View>
                        <Text className='text-body-small-regular text-neutral-500'>
                          {openPrice}
                          <ArrowRight
                            className='text-neutral-500'
                            width={13.33}
                            height={10}
                          />{' '}
                          {currentPrice}
                        </Text>
                      </View>

                      <View className='items-end'>
                        <Text
                          className={`text-h3-semibold text-${profit < 0 ? 'error-500' : 'success-500'}`}>
                          {profit > 0 ? '+' : ''}
                          {profit.toFixed(2)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Swipeable>
                )
              })}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Position Details Modal */}
      <Modal
        visible={showPositionModal}
        animationType='none'
        transparent
        onRequestClose={() => {
          setShowPositionModal(false)
          setCopiedPositionId(false)
        }}>
        <Pressable
          className='flex-1'
          onPress={() => {
            setShowPositionModal(false)
            setCopiedPositionId(false)
          }}>
          {/* Animated overlay background */}
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              opacity: slidePositionAnim.interpolate({
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
              transform: [{ translateY: slidePositionAnim }],
            }}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View>
                {selectedPosition && (
                  <ScrollView>
                    {/* Header */}
                    <View className='rounded-[4px] mx-4 bg-white mb-2 mt-4'>
                      {/* Title and Badge Row */}
                      <View className='bg-neutral-100 p-4 rounded-t-[4px]'>
                        <View className='flex flex-row items-start justify-between'>
                          <View className='flex-row items-center mb-2 gap-2  '>
                            <Text className='text-h2-semibold text-neutral-900'>
                              {selectedPosition.symbol}
                            </Text>
                            <View
                              className={`rounded-[4px] ${selectedPosition.side === 0 ? 'bg-success-50' : 'bg-error-50'}`}>
                              <Text
                                className={`py-1.5 px-2.5 text-caption-medium ${selectedPosition.side === 0 ? 'text-success-500' : 'text-error-500'}`}>
                                {selectedPosition.side === 0 ? 'Buy' : 'Sell'}{' '}
                                {selectedPosition.quantity}
                              </Text>
                            </View>
                          </View>
                          <View className='flex flex-row items-center gap-1'>
                            <Text className='text-body-small-regular text-neutral-900'>
                              #{(selectedPosition as any).id || 'Unknown Asset'}
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
                          {(selectedPosition as any).name || 'Unknown Asset'}
                        </Text>
                      </View>

                      {/* Price Range */}
                      <View className='flex flex-row items-center justify-between'>
                        <View>
                          <View className=' px-4'>
                            <Text className='text-body-small-regular text-neutral-900 mt-2'>
                              {parseFloat(selectedPosition.openPrice)}
                              <MoveRight width={13.3} height={10} />
                              {selectedPosition.side === 0
                                ? rtBySymbol?.[selectedPosition.symbol]?.bid
                                : rtBySymbol?.[selectedPosition.symbol]?.ask}
                            </Text>
                          </View>

                          {/* PnL Row */}
                          <View className='flex-row justify-between items-center mb-2 px-4'>
                            <View className=''>
                              {(() => {
                                const fields = calculatePositionFields(
                                  selectedPosition,
                                  assetsBySymbol,
                                  rtBySymbol,
                                )
                                const { percentage, priceDiff, digit, profit } =
                                  fields
                                return (
                                  <Text
                                    className={`text-body-small-regular ${profit >= 0 ? 'text-success-500' : 'text-error-500'} mb-1`}>
                                    Δ = {priceDiff.toFixed(digit)} (
                                    {percentage.toFixed(2)}
                                    %)
                                  </Text>
                                )
                              })()}
                            </View>
                          </View>
                        </View>
                        <View className='mr-4'>
                          {(() => {
                            const fields = calculatePositionFields(
                              selectedPosition,
                              assetsBySymbol,
                              rtBySymbol,
                            )
                            const { profit } = fields
                            return (
                              <Text
                                className={`text-h2-semibold ${profit >= 0 ? 'text-success-500' : 'text-error-500'}`}>
                                {profit > 0 ? '+' : ''}
                                {profit.toFixed(2)}
                              </Text>
                            )
                          })()}
                        </View>
                      </View>

                      {/* Details Grid */}
                      <View className='px-4 mb-4'>
                        <View className='flex-row justify-between mb-1'>
                          <Text className='text-body-small-regular text-neutral-500'>
                            S/L:
                          </Text>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {selectedPosition.stopLoss || 'Unset'}
                          </Text>
                        </View>
                        <View className='flex-row justify-between mb-1'>
                          <Text className='text-body-small-regular text-neutral-500'>
                            T/P:
                          </Text>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {selectedPosition.takeProfit || 'Unset'}
                          </Text>
                        </View>
                        <View className='flex-row justify-between mb-1'>
                          <Text className='text-body-small-regular text-neutral-500'>
                            Swap:
                          </Text>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {selectedPosition.totalFees}
                          </Text>
                        </View>
                        <View className='flex-row justify-between'>
                          <Text className='text-body-small-regular text-neutral-500'>
                            Time:
                          </Text>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {formatPositionDateTime(selectedPosition.openedAt)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className='p-4 gap-3 rounded-[4px] bg-white mx-4 mb-5'>
                      <TouchableOpacity
                        className='bg-error-50 rounded-lg py-3 items-center'
                        onPress={() => {
                          setShowPositionModal(false)
                          navigation.navigate(Paths.OpeningOrder, {
                            position: selectedPosition,
                            tab: 'close_position',
                          })
                        }}>
                        <Text className='text-button-large-medium text-error-500'>
                          Close position
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className='bg-neutral-100 rounded-lg py-3 items-center'
                        onPress={() => {
                          setShowPositionModal(false)
                          navigation.navigate(Paths.OpeningOrder, {
                            position: selectedPosition,
                            tab: 'close_position',
                            orderTypeDefault: 'Modify Position',
                          })
                        }}>
                        <Text className='text-button-large-medium text-neutral-900'>
                          Modify position
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className='bg-neutral-100 rounded-lg py-3 items-center'
                        onPress={() => {
                          setShowPositionModal(false)

                          navigation.navigate(Paths.OpeningOrder, {
                            position: selectedPosition,
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
                          setShowPositionModal(false)
                          // navigation.navigate(Paths.SymbolDetail, {
                          //   symbol: selectedPosition.symbol,
                          // })
                          navigation.navigate(Paths.Market, {
                            screen: Paths.SymbolDetail,
                            params: {
                              symbol: selectedPosition.symbol,
                            },
                          })
                        }}>
                        <Text className='text-button-large-medium text-neutral-900'>
                          Chart
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className='bg-neutral-100 rounded-lg py-3 items-center'
                        onPress={() => {
                          setShowPositionModal(false)
                          setBulkOperationsModalVisible(true)
                        }}>
                        <Text className='text-button-large-medium text-neutral-900'>
                          Bulk Operations
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

      {/* Bulk Operations Modal */}
      <Modal
        transparent
        animationType='none'
        visible={bulkOperationsModalVisible}
        onRequestClose={() => {
          setBulkOperationsModalVisible(false)
        }}>
        <Pressable
          className='flex-1'
          onPress={() => {
            setBulkOperationsModalVisible(false)
          }}>
          {/* Animated overlay background */}
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              opacity: slideBulkAnim.interpolate({
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
              transform: [{ translateY: slideBulkAnim }],
            }}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation()
              }}>
              <View className='bg-white rounded-t-sm'>
                <View className='px-4 pb-4 pt-8 border-b border-neutral-200'>
                  <Text className='text-h3-semibold text-neutral-900'>
                    Bulk Operations
                  </Text>
                </View>
                <View className='p-4 gap-3'>
                  <TouchableOpacity
                    className='px-4 py-4 rounded-md bg-neutral-100 items-center'
                    disabled={closePositionsMutation.isPending}
                    onPress={handleCloseAllPositions}>
                    {closePositionsMutation.isPending ? (
                      <ActivityIndicator
                        className='text-neutral-900'
                        size='small'
                      />
                    ) : (
                      <Text className='text-button-large-medium text-neutral-900'>
                        Close All Positions
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    className='px-4 py-4 rounded-md bg-neutral-100 items-center'
                    disabled={closePositionsMutation.isPending}
                    onPress={handleCloseProfitablePositions}>
                    {closePositionsMutation.isPending ? (
                      <ActivityIndicator
                        className='text-neutral-900'
                        size='small'
                      />
                    ) : (
                      <Text className='text-button-large-medium text-neutral-900'>
                        Close Profitable Positions
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    className='px-4 py-4 rounded-md bg-neutral-100 items-center'
                    disabled={closePositionsMutation.isPending}
                    onPress={handleCloseLosingPositions}>
                    {closePositionsMutation.isPending ? (
                      <ActivityIndicator
                        className='text-neutral-900'
                        size='small'
                      />
                    ) : (
                      <Text className='text-button-large-medium text-neutral-900'>
                        Close Losing Positions
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View className='px-4 my-4'>
                  <TouchableOpacity
                    className='w-full rounded-md py-3 bg-error-50'
                    onPress={() => {
                      setBulkOperationsModalVisible(false)
                    }}>
                    <Text className='text-button-large-medium text-error-500 text-center'>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  )
}
