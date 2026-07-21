import { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import SortModal, { type SortDirection } from '@/components/modals/SortModal'
import { SafeScreen } from '@/components/templates'
import { useAllAssetsList } from '@/hooks/assets/useAllAssetsList'
import { useSymbols } from '@/hooks/market/useSymbols'
import { useAccounts } from '@/hooks/useAccount'
import { useCancelOrders, useOrders } from '@/hooks/useOrder'
import { useClosePositions, usePositions } from '@/hooks/usePosition'
import { useAuthStore } from '@/store/authStore'
import { useMarketSocketStore } from '@/store/marketSocketStore'
import { useAccountStore } from '@/store/useAccountStore'
import type { Account } from '@/types/account'

import HomeHeader from '../Home/components/HomeHeader'
import { HistoryTab, OrdersTab, PositionsTab } from './components'
import AccountSummary from './components/AccountSummary'
import NoSignIn from './components/NoSignIn'

type DirectionOption = 'All' | 'Buy' | 'Sell'
type PeriodOption =
  | '1 month'
  | '1 week'
  | '1 year'
  | '3 months'
  | '6 months'
  | 'Custom'
type StatusOption = 'All' | 'Cancelled' | 'Closed'

function PositionsScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [activeTab, setActiveTab] = useState<
    'History' | 'Pending' | 'Positions'
  >('Positions')
  const [sortModalVisible, setSortModalVisible] = useState(false)
  const [selectedSort, setSelectedSort] = useState<string | null>(null)
  const [selectedDirection, setSelectedDirection] =
    useState<SortDirection>(null)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('1 week')
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>('All')
  const [selectedFilterDirection, setSelectedFilterDirection] =
    useState<DirectionOption>('All')
  const [customStartDate, setCustomStartDate] = useState('2025-11-04')
  const [customEndDate, setCustomEndDate] = useState('2026-02-04')
  const [editingDateField, setEditingDateField] = useState<
    'end' | 'start' | null
  >(null)
  const [temporaryDate, setTemporaryDate] = useState('')
  const [bulkOperationsModalVisible, setBulkOperationsModalVisible] =
    useState(false)
  const { data: accounts, isLoading: isLoadingAccounts } = useAccounts()
  const selectedAccount = useAccountStore((state) => state.selectedAccount)
  const activeAccount =
    accounts && accounts.length > 0
      ? accounts.find((account) => account.id === selectedAccount?.id) ||
        accounts[0]
      : null
  // Use the positions hook with dynamic accountId
  const {
    data: apiPositions,
    error,
    isLoading: isLoadingPositions,
    refetch: refetchPositions,
  } = usePositions({
    accountId: activeAccount?.id || '',
    sortBy: selectedSort as any,
    sortDir: selectedDirection || undefined,
  })
  console.log('🚀 ~ PositionsScreen ~ apiPositions:', apiPositions)
  const { data: apiOrders, refetch: refetchOrders } = useOrders({
    accountId: activeAccount?.id || '',
    sortBy: selectedSort as any,
    sortDir: selectedDirection || undefined,
  })
  const closePositionsMutation = useClosePositions(activeAccount?.id || '')
  const cancelOrdersMutation = useCancelOrders(activeAccount?.id || '')

  // Get all assets to retrieve contract sizes
  const { data: assetsData } = useAllAssetsList()

  // Add asset names to positions based on symbol
  const positionsWithNames = useMemo(() => {
    if (!apiPositions || !assetsData?.data) return apiPositions

    return apiPositions.map((position) => {
      const asset = assetsData.data.find(
        (asset) => asset.symbol === position.symbol,
      )
      return {
        ...position,
        name: asset?.name || position.symbol,
        contractSize: parseFloat(asset?.contractSize || '100'),
        digit: asset?.digit || 2,
      }
    })
  }, [apiPositions, assetsData])

  const filterOrder = useMemo(() => {
    if (!apiOrders) return undefined
    return apiOrders.filter((order) => order.status === 0 || order.status === 1)
  }, [apiOrders])
  const ordersWithNames = useMemo(() => {
    if (!filterOrder || !assetsData?.data) return filterOrder

    return filterOrder.map((order) => {
      const asset = assetsData.data.find(
        (asset) => asset.symbol === order.symbol,
      )
      return {
        ...order,
        name: asset?.name || order.symbol,
      }
    })
  }, [apiOrders, assetsData])
  // Get open positions for real-time price calculation
  const openPositions = useMemo(() => {
    return positionsWithNames?.filter((position) => position.status === 0) ?? []
  }, [positionsWithNames])
  // Create a map of symbol -> contractSize for quick lookup
  const assetsBySymbol = useMemo(() => {
    if (!assetsData?.data) return {}
    return assetsData.data.reduce(
      (acc, asset) => {
        acc[asset.symbol] = {
          contractSize: parseFloat(asset.contractSize) || 100,
          digit: asset.digit || 2,
        }

        return acc
      },
      {} as Record<string, { contractSize: number; digit: number }>,
    )
  }, [assetsData])

  // Subscribe to symbols for real-time prices
  const symbols = useMemo(
    () => openPositions.map((position) => position.symbol),
    [openPositions],
  )

  useSymbols(symbols, symbols.length > 0)

  const rtBySymbol = useMarketSocketStore((s) => s.rtBySymbol)
  // Derived state
  const isLoading = isLoadingAccounts || isLoadingPositions

  // Filter history data (status === 2 means closed)
  const historyData =
    positionsWithNames?.filter((pos) => pos.status === 2) ?? []

  if (!isAuthenticated) {
    return <NoSignIn />
  }

  const tabs = ['Positions', 'Pending', 'History'] as const

  // Sort options for Positions tab
  const positionsSortOptions = [
    { label: 'Default', value: null as any },
    { label: 'Symbol', value: 'symbol' },
    { label: 'Time', value: 'openedAt' },
    { label: 'Volume', value: 'quantity' },
  ]

  // Sort options for Orders tab
  const ordersSortOptions = [
    { label: 'Default', value: null as any },
    { label: 'Symbol', value: 'symbol' },
    { label: 'Time', value: 'createdAt' },
    { label: 'Type', value: 'orderType' },
    { label: 'Volume', value: 'quantity' },
  ]
  const historySortOptions = [
    { label: 'Default', value: null as any },
    { label: 'Symbol', value: 'symbol' },
    { label: 'Time', value: 'openedAt' },
    { label: 'Type', value: 'side' },
    { label: 'Volume', value: 'quantity' },
    { label: 'Profit', value: 'realizedPnl' },
  ]

  // Get current sort options based on active tab
  const currentSortOptions =
    activeTab === 'Positions'
      ? positionsSortOptions
      : activeTab === 'Pending'
        ? ordersSortOptions
        : historySortOptions

  const periodOptions: PeriodOption[] = [
    '1 week',
    '1 month',
    '3 months',
    '6 months',
    '1 year',
    'Custom',
  ]
  const statusOptions: StatusOption[] = ['All', 'Closed', 'Cancelled']
  const directionOptions: DirectionOption[] = ['All', 'Buy', 'Sell']

  return (
    <>
      <SafeScreen className=' bg-white'>
        <HomeHeader />

        <AccountSummary
          position={openPositions}
          activeAccount={activeAccount as Account}
        />
        <View className='flex-col gap-3 px-4 flex-1'>
          <View className=''>
            <View className='flex-row'>
              {tabs.map((tab) => {
                let count = 0
                if (tab === 'Positions') {
                  count = openPositions?.length || 0
                } else if (tab === 'Pending') {
                  count = filterOrder?.length || 0
                }

                return (
                  <TouchableOpacity
                    key={tab}
                    className='flex-1 px-4 py-2 border-b border-neutral-200'
                    onPress={() => {
                      setActiveTab(tab)
                      // Reset sort when switching tabs
                      setSelectedSort(null)
                      setSelectedDirection(null)
                    }}>
                    <View className='flex-row items-center justify-center gap-2'>
                      <Text
                        className={`text-body-medium text-center text-${activeTab === tab ? 'primary-500' : 'neutral-500'}`}>
                        {tab}
                      </Text>
                      {(tab === 'Positions' || tab === 'Pending') && (
                        <View className='bg-primary-50 rounded-full px-2 py-0.5'>
                          <Text className='text-caption-medium text-primary-500'>
                            {count}
                          </Text>
                        </View>
                      )}
                    </View>

                    {activeTab === tab && (
                      <View className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500' />
                    )}
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>

          {/* Tab Content */}
          <View className='flex-1'>
            {isLoading ? (
              <View className='flex-1 items-center justify-center py-10'>
                <ActivityIndicator className='text-primary-500' size='large' />
                <Text className='text-body-medium text-neutral-500 mt-8'>
                  Loading positions...
                </Text>
              </View>
            ) : error ? (
              <View className='flex-1 items-center justify-center py-10'>
                <Text className='text-body-medium text-error-500 mb-8'>
                  {error instanceof Error
                    ? error.message
                    : 'Failed to fetch positions'}
                </Text>
                <TouchableOpacity
                  className='rounded-md py-2 px-4 bg-primary-500'
                  onPress={() => refetchPositions()}>
                  <Text className='text-button-large-medium text-white'>
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            ) : activeTab === 'Positions' ? (
              <PositionsTab
                selectedSort={selectedSort}
                onSortPress={() => setSortModalVisible(true)}
                bulkOperationsModalVisible={bulkOperationsModalVisible}
                setBulkOperationsModalVisible={setBulkOperationsModalVisible}
                closePositionsMutation={closePositionsMutation}
                openPositions={openPositions}
                rtBySymbol={rtBySymbol}
                assetsBySymbol={assetsBySymbol}
                activeAccountId={activeAccount?.id || ''}
              />
            ) : activeTab === 'Pending' ? (
              <OrdersTab
                apiOrders={ordersWithNames}
                selectedSort={selectedSort}
                onSortPress={() => setSortModalVisible(true)}
                refetchOrders={refetchOrders}
                bulkOperationsModalVisible={bulkOperationsModalVisible}
                setBulkOperationsModalVisible={setBulkOperationsModalVisible}
                cancelOrdersMutation={cancelOrdersMutation}
                activeAccountId={activeAccount?.id || ''}
              />
            ) : activeTab === 'History' ? (
              <HistoryTab
                historyData={historyData}
                selectedSort={selectedSort}
                onFilterPress={() => setFilterModalVisible(true)}
                onSortPress={() => setSortModalVisible(true)}
              />
            ) : null}
          </View>
        </View>

        {/* Sort Modal */}
        <SortModal
          visible={sortModalVisible}
          onClose={() => setSortModalVisible(false)}
          options={currentSortOptions}
          selectedSort={selectedSort}
          selectedDirection={selectedDirection}
          onSort={(field, direction) => {
            setSelectedSort(field)
            setSelectedDirection(direction)
            setSortModalVisible(false)
          }}
        />

        {/* Filter Modal */}
        <Modal
          transparent
          animationType='slide'
          visible={filterModalVisible}
          onRequestClose={() => {
            setFilterModalVisible(false)
          }}>
          <Pressable
            className='flex-1 justify-end bg-black/50'
            onPress={() => {
              setFilterModalVisible(false)
            }}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation()
              }}>
              <View className='bg-white rounded-md'>
                <View className='p-4 border-b border-neutral-200'>
                  <Text className='text-h3-semibold text-neutral-900'>
                    Filter
                  </Text>
                </View>

                <ScrollView style={{ maxHeight: 500 }}>
                  {/* Period Section */}
                  <View className='px-4 py-4'>
                    <Text className='text-body-large-medium text-neutral-900 pb-4'>
                      Period
                    </Text>
                    <View className='flex-row flex-wrap gap-3'>
                      {periodOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          className={`rounded-md py-2 px-4 border ${
                            selectedPeriod === option
                              ? 'bg-primary-50 border-primary-500'
                              : 'bg-neutral-100 border-neutral-200'
                          }`}
                          style={{ width: '48%' }}
                          onPress={() => {
                            setSelectedPeriod(option)
                          }}>
                          <Text
                            className={`text-body-small-medium text-center ${
                              selectedPeriod === option
                                ? 'text-primary-500'
                                : 'text-secondary-500'
                            }`}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Custom Date Range */}
                    {selectedPeriod === 'Custom' && (
                      <View className='flex-row items-center gap-2 mt-3'>
                        <TouchableOpacity
                          className='flex-1 rounded-md py-2.5 px-3 bg-neutral-100'
                          onPress={() => {
                            setEditingDateField('start')
                            setTemporaryDate(customStartDate)
                          }}>
                          <Text className='text-body-small-medium text-center text-secondary-500'>
                            {customStartDate}
                          </Text>
                        </TouchableOpacity>
                        <View className='px-2'>
                          <View className='w-3 h-0.5 bg-neutral-500' />
                        </View>
                        <TouchableOpacity
                          className='flex-1 rounded-md py-2.5 px-3 bg-neutral-100'
                          onPress={() => {
                            setEditingDateField('end')
                            setTemporaryDate(customEndDate)
                          }}>
                          <Text className='text-body-small-medium text-center text-secondary-500'>
                            {customEndDate}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {/* Status Section */}
                  <View className='px-4'>
                    <Text className='text-body-large-medium text-neutral-900 mb-3'>
                      Status
                    </Text>
                    <View className='flex-row flex-wrap gap-2'>
                      {statusOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          className={`rounded-md py-2 px-4 border ${
                            selectedStatus === option
                              ? 'bg-primary-50 border-primary-500'
                              : 'bg-neutral-100 border-neutral-200'
                          }`}
                          onPress={() => {
                            setSelectedStatus(option)
                          }}>
                          <Text
                            className={`text-body-small-medium ${
                              selectedStatus === option
                                ? 'text-primary-500'
                                : 'text-neutral-900'
                            }`}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Direction Section */}
                  <View className='px-4 py-4'>
                    <Text className='text-body-large-medium text-neutral-900 mb-3'>
                      Direction
                    </Text>
                    <View className='flex-row flex-wrap gap-2'>
                      {directionOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          className={`rounded-md py-2 px-4 border ${
                            selectedFilterDirection === option
                              ? 'bg-primary-50 border-primary-500'
                              : 'bg-neutral-100 border-neutral-200'
                          }`}
                          onPress={() => {
                            setSelectedFilterDirection(option)
                          }}>
                          <Text
                            className={`text-body-small-medium ${
                              selectedFilterDirection === option
                                ? 'text-primary-500'
                                : 'text-neutral-900'
                            }`}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </ScrollView>

                {/* Action Buttons */}
                <View className='flex-row gap-3 px-4 py-4 border-t border-neutral-200'>
                  <TouchableOpacity
                    className='flex-1 rounded-md py-3 bg-neutral-100'
                    onPress={() => {
                      setFilterModalVisible(false)
                    }}>
                    <Text className='text-button-large-medium text-neutral-900 text-center'>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className='flex-1 rounded-md py-3 bg-primary-500'
                    onPress={() => {
                      // Apply filter logic here
                      setFilterModalVisible(false)
                    }}>
                    <Text className='text-button-large-medium text-white text-center'>
                      Apply
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Date Picker Modal */}
        <Modal
          transparent
          animationType='fade'
          visible={editingDateField !== null}
          onRequestClose={() => {
            setEditingDateField(null)
          }}>
          <Pressable
            className='flex-1 justify-center items-center bg-black/50'
            onPress={() => {
              setEditingDateField(null)
            }}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation()
              }}>
              <View
                className='bg-white rounded-2xl p-4 mx-4'
                style={{ width: 300 }}>
                <View className='flex-row items-center justify-between mb-4'>
                  <Text className='text-h3-semibold text-neutral-900'>
                    Select Date
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingDateField(null)
                    }}>
                    <Text className='text-body-large-medium text-neutral-500'>
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className='mb-4'>
                  <TextInput
                    className='rounded-md py-3 px-4 bg-neutral-100 text-body-medium text-neutral-900'
                    placeholder='YYYY-MM-DD'
                    placeholderTextColor='text-neutral-400'
                    value={temporaryDate}
                    onChangeText={setTemporaryDate}
                  />
                  <Text className='text-caption-regular text-neutral-500 mt-8'>
                    Format: YYYY-MM-DD (e.g., 2026-02-04)
                  </Text>
                </View>

                <View className='flex-row gap-3'>
                  <TouchableOpacity
                    className='flex-1 rounded-md py-3 bg-neutral-100'
                    onPress={() => {
                      setEditingDateField(null)
                    }}>
                    <Text className='text-button-large-medium text-neutral-900 text-center'>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className='flex-1 rounded-md py-3 bg-primary-500'
                    onPress={() => {
                      if (editingDateField === 'start') {
                        setCustomStartDate(temporaryDate)
                      } else if (editingDateField === 'end') {
                        setCustomEndDate(temporaryDate)
                      }
                      setEditingDateField(null)
                    }}>
                    <Text className='text-button-large-medium text-white text-center'>
                      OK
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeScreen>
    </>
  )
}

export default PositionsScreen
