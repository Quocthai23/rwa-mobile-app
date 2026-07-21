import { useNavigation } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import {
  Check,
  CircleX,
  Copy,
  ListFilter,
  MoveRight,
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
import { useToast } from '@/hooks/useToast'
import { Paths } from '@/navigation/paths'
import type { MainTabScreenProps } from '@/navigation/types'
import { deleteOrderAPI } from '@/services/oderService'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import useTheme from '@/theme/hooks/useTheme'
import type { OrderItem } from '@/types/orders'
import { setString } from '@/utils/clipboard'
import { formatPositionDateTime } from '@/utils/dateUtils'

type CancelOrdersMutation = {
  mutate: (orders: OrderItem[], callbacks: any) => void
  isPending: boolean
}

type OrdersTabProps = {
  readonly apiOrders: OrderItem[] | undefined
  readonly selectedSort: string | null
  readonly onSortPress: () => void
  readonly refetchOrders: () => void
  readonly bulkOperationsModalVisible: boolean
  readonly setBulkOperationsModalVisible: (visible: boolean) => void
  readonly cancelOrdersMutation: CancelOrdersMutation
  readonly activeAccountId: string
}

export function OrdersTab({
  apiOrders,
  selectedSort,
  onSortPress,
  refetchOrders,
  bulkOperationsModalVisible,
  setBulkOperationsModalVisible,
  cancelOrdersMutation,
  activeAccountId,
}: OrdersTabProps) {
  const navigation = useNavigation<MainTabScreenProps['navigation']>()
  const { colors } = useTheme()
  const { showError, showSuccess } = useToast()
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const rtBySymbol = useMarketSocketStore((s) => s.rtBySymbol)
  const [copiedOrderId, setCopiedOrderId] = useState(false)
  const queryClient = useQueryClient()

  // Animated values for modals
  const slideOrderAnim = useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current
  const slideBulkAnim = useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current

  // Handle order modal animation
  useEffect(() => {
    if (showOrderModal) {
      slideOrderAnim.setValue(Dimensions.get('window').height)
      Animated.timing(slideOrderAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideOrderAnim, {
        toValue: Dimensions.get('window').height,
        duration: 600,
        useNativeDriver: true,
      }).start()
    }
  }, [showOrderModal, slideOrderAnim])

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

  const getOrderTypeLabel = (orderType: number) => {
    if (orderType === 0) return 'Market'
    if (orderType === 1) return 'Limit'
    if (orderType === 2) return 'Stop'
    if (orderType === 3) return 'Stop Limit'

    return 'Market'
  }

  const getStatusLabel = (status: number) => {
    if (status === 0) return 'Placed'
    if (status === 1) return 'Partially Filled'
    if (status === 2) return 'Filled'
    if (status === 3) return 'Cancelled'

    return 'Placed'
  }

  const handleCancelAllOrders = () => {
    if (apiOrders && apiOrders.length > 0) {
      cancelOrdersMutation.mutate(apiOrders, {
        onError: (error: any) => {
          console.error('❌ Cancel All Orders Error:', error)
        },
        onSuccess: () => {
          setBulkOperationsModalVisible(false)

          queryClient.invalidateQueries({
            queryKey: ['orders', activeAccountId],
          })

          queryClient.invalidateQueries({ queryKey: ['accounts'] })
        },
      })
    } else {
      console.log('No orders to cancel')
      setBulkOperationsModalVisible(false)
    }
  }

  const handleCopyOrderId = async () => {
    if (!selectedOrder?.id) return
    try {
      await setString(selectedOrder.id)
      setCopiedOrderId(true)
      setTimeout(() => setCopiedOrderId(false), 2000)
    } catch (error) {
      showError('Copy failed', 'Failed to copy order ID')
    }
  }
  const handleOrderPress = (order: OrderItem) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const handleCancelOrder = async (order: OrderItem) => {
    try {
      await deleteOrderAPI(order.id, order.accountId)
      refetchOrders()
      showSuccess('Order deleted', 'Order deleted successfully.')
    } catch (error: any) {
      showError('Error deleting order', error || 'Failed to delete order')
    } finally {
      setCancelingOrderId(null)
    }
  }

  const renderRightActions = (order: OrderItem) => {
    const isCanceling = cancelingOrderId === order.id

    return (
      <View className='flex-row items-center ml-8'>
        <TouchableOpacity
          className={`rounded-md justify-center items-center ${isCanceling ? 'bg-neutral-200' : 'bg-error-500/20'}`}
          // disabled={isClosing}
          style={{ width: 55, height: 60 }}
          onPress={() => handleCancelOrder(order)}>
          <CircleX color={colors.error500} size={24} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className='flex-1'>
      <View className='flex-row gap-4 items-center mb-3'>
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
      </View>
      <View className='flex-col gap-2 flex-1'>
        <View className='flex-row justify-between items-center'>
          <Text className='text-h3-semibold text-neutral-900'>Pending</Text>
          <ButtonNew
            type='text'
            name='Close'
            textColor='text-primary-500'
            size='md'
            onPress={() => setBulkOperationsModalVisible(true)}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
          <View className='flex-col gap-1'>
            {apiOrders?.map((order) => {
              const isBuy = order.side === 0
              const badgeColor = isBuy ? 'bg-success-50' : 'bg-error-50'
              const badgeTextColor = isBuy
                ? 'text-success-500'
                : 'text-error-500'
              const canCancel = order.status === 0 || order.status === 1

              return (
                <Swipeable
                  key={order.id}
                  overshootRight={false}
                  renderRightActions={
                    canCancel ? () => renderRightActions(order) : undefined
                  }>
                  <TouchableOpacity
                    className='flex-row justify-between items-center bg-white'
                    onPress={() => handleOrderPress(order)}>
                    <View className='flex-col items-start gap-1'>
                      <View className='flex-row items-center gap-2'>
                        <Text className='text-body-small-medium text-neutral-900'>
                          {order.symbol}
                        </Text>
                        <View className={`rounded-md ${badgeColor}`}>
                          <Text
                            className={`py-1.5 px-2.5 text-caption-medium ${badgeTextColor}`}>
                            {isBuy ? 'Buy' : 'Sell'}{' '}
                            {getOrderTypeLabel(order.orderType).toLowerCase()}
                          </Text>
                        </View>
                      </View>
                      <Text className='text-body-small-regular text-neutral-500'>
                        {order.quantity} / {order.filledQuantity}
                        {order.price ? ` at ${order.price}` : ''}
                      </Text>
                    </View>

                    <View className='items-end'>
                      <Text className={`text-h3-semibold`}>
                        {getStatusLabel(order.status).toLowerCase()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              )
            })}
          </View>
        </ScrollView>
      </View>
      {/* Order Details Modal */}
      <Modal
        visible={showOrderModal}
        animationType='none'
        transparent
        onRequestClose={() => setShowOrderModal(false)}>
        <Pressable className='flex-1' onPress={() => setShowOrderModal(false)}>
          {/* Animated overlay background */}
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              opacity: slideOrderAnim.interpolate({
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
              transform: [{ translateY: slideOrderAnim }],
            }}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View>
                {selectedOrder && (
                  <ScrollView>
                    {/* Header */}
                    <View className='rounded-[4px] mx-4 bg-white mb-2 mt-4'>
                      {/* Title and Badge Row */}
                      <View className='bg-neutral-100 p-4 rounded-t-[4px]'>
                        <View className='flex flex-row items-start justify-between'>
                          <View className='flex-row items-center mb-2 gap-2'>
                            <Text className='text-h2-semibold text-neutral-900'>
                              {selectedOrder.symbol}
                            </Text>
                            <View
                              className={`rounded-[4px] ${selectedOrder.side === 0 ? 'bg-success-50' : 'bg-error-50'}`}>
                              <Text
                                className={`py-1.5 px-2.5 text-caption-medium ${selectedOrder.side === 0 ? 'text-success-500' : 'text-error-500'}`}>
                                {selectedOrder.side === 0 ? 'Buy' : 'Sell'}{' '}
                                {getOrderTypeLabel(selectedOrder.orderType)}
                              </Text>
                            </View>
                          </View>
                          <View className='flex flex-row items-center gap-1'>
                            <Text className='text-body-small-regular text-neutral-900'>
                              #{(selectedOrder as any).id || 'Unknown Asset'}
                            </Text>
                            <TouchableOpacity onPress={handleCopyOrderId}>
                              {copiedOrderId ? (
                                <Check size={15} color={colors.success500} />
                              ) : (
                                <Copy size={15} />
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Asset Name */}
                        <Text className='text-body-small-regular text-neutral-500'>
                          {(selectedOrder as any).name || 'Unknown Asset'}
                        </Text>
                      </View>
                      <View className='flex flex-row justify-between items-center mt-2  mb-2'>
                        <View className=' px-4 flex flex-row items-center'>
                          <Text className='text-body-small-regular text-neutral-900'>
                            <Text className='text-success-500'>
                              {selectedOrder.side === 0
                                ? rtBySymbol?.[selectedOrder.symbol]?.bid
                                : rtBySymbol?.[selectedOrder.symbol]?.ask}
                            </Text>
                            <MoveRight width={13} height={10} />
                            {parseFloat(selectedOrder.price as string)}
                          </Text>
                        </View>
                        <View className='mr-4'>
                          <Text className='text-h3-regular'>
                            {getStatusLabel(selectedOrder.status).toLowerCase()}
                          </Text>
                        </View>
                      </View>

                      {/* Order Details */}
                      <View className='px-4 mb-4'>
                        <View className='flex-row justify-between mb-1'>
                          <Text className='text-body-small-regular text-neutral-500'>
                            Volume:
                          </Text>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {selectedOrder.quantity}/{' '}
                            {selectedOrder.filledQuantity}
                          </Text>
                        </View>
                        <View className='flex-row justify-between mb-1'>
                          <Text className='text-body-small-regular text-neutral-500'>
                            S/L:
                          </Text>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {selectedOrder.stopLoss || 'Unset'}
                          </Text>
                        </View>
                        <View className='flex-row justify-between mb-1'>
                          <Text className='text-body-small-regular text-neutral-500'>
                            T/P:
                          </Text>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {selectedOrder.takeProfit || 'Unset'}
                          </Text>
                        </View>

                        <View className='flex-row justify-between'>
                          <Text className='text-body-small-regular text-neutral-500'>
                            Time:
                          </Text>
                          <Text className='text-body-small-medium text-neutral-900'>
                            {formatPositionDateTime(selectedOrder.createdAt)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View className='p-4 gap-3 rounded-[4px] bg-white mx-4 mb-5'>
                      <TouchableOpacity
                        className='bg-error-50 rounded-lg py-3 items-center'
                        // disabled={closingPositionId === selectedOrder.id}
                        onPress={() => handleCancelOrder(selectedOrder)}>
                        <Text className='text-button-large-medium text-error-500'>
                          Delete
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className='bg-neutral-100 rounded-lg py-3 items-center'
                        onPress={() => {
                          setShowOrderModal(false)
                          navigation.navigate(Paths.ModifyOpeningOrder, {
                            position: selectedOrder,
                          })
                        }}>
                        <Text className='text-button-large-medium text-neutral-900'>
                          Modify
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity className='bg-neutral-100 rounded-lg py-3 items-center'>
                        <Text className='text-button-large-medium text-neutral-900'>
                          Trade
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className='bg-neutral-100 rounded-lg py-3 items-center'
                        onPress={() => {
                          setShowOrderModal(false)
                          navigation.navigate(Paths.SymbolDetail, {
                            symbol: selectedOrder.symbol,
                          })
                        }}>
                        <Text className='text-button-large-medium text-neutral-900'>
                          Chart
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className='bg-neutral-100 rounded-lg py-3 items-center'
                        onPress={() => {
                          setShowOrderModal(false)
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
                    disabled={cancelOrdersMutation.isPending}
                    onPress={handleCancelAllOrders}>
                    {cancelOrdersMutation.isPending ? (
                      <ActivityIndicator
                        className='text-neutral-900'
                        size='small'
                      />
                    ) : (
                      <Text className='text-button-large-medium text-neutral-900'>
                        Delete All Orders
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View className='px-4 gap-3 mb-9'>
                  <TouchableOpacity
                    className='px-4 py-4 rounded-md bg-neutral-100 items-center'
                    disabled={cancelOrdersMutation.isPending}
                    onPress={handleCancelAllOrders}>
                    {cancelOrdersMutation.isPending ? (
                      <ActivityIndicator
                        className='text-neutral-900'
                        size='small'
                      />
                    ) : (
                      <Text className='text-button-large-medium text-neutral-900'>
                        Delete Limit Orders
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
