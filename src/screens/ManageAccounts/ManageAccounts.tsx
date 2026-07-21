// import { SearchIcon } from 'lucide-react-native'
// import { useState } from 'react'
// import { ScrollView, View } from 'react-native'

// import { Button, Input, SegmentTabs } from '@/components/atoms'
// import { useModal } from '@/components/atoms/Modal'
// import { Header, SafeScreen } from '@/components/templates'
// import { useAccounts, useAccountTypes } from '@/hooks/useAccount'
// import { Paths } from '@/navigation/paths'
// import type { RootScreenProps } from '@/navigation/types'
// import { TradeAccountItem } from './components/TradeAccountItem'

// function ManageAccounts({ navigation }: RootScreenProps<Paths.ManageAccounts>) {
//   const { data: accounts } = useAccounts()
//   // UI State
//   const [activeTab, setActiveTab] = useState<'Demo' | 'Live'>('Live')
//   const [searchQuery, setSearchQuery] = useState('')
//   const { data: accountTypes } = useAccountTypes()
//   const addAccountReference = useModal()

//   const filteredAccounts =
//     accounts?.filter((account) => {
//       const type = accountTypes?.find((t) => t.id === account.accountTypeId)
//       const isDemo =
//         type?.name.toLowerCase().includes('demo') ||
//         type?.code.toLowerCase().includes('demo')
//       const matchesTab = activeTab === 'Demo' ? isDemo : !isDemo
//       const matchesSearch =
//         account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         account.id.toString().includes(searchQuery)

//       return matchesTab && matchesSearch
//     }) ?? []

//   return (
//     <SafeScreen className='bg-white'>
//       <View className='flex-1'>
//         {/* Header List */}
//         <Header />
//         <SegmentTabs
//           className='mx-4 mt-3'
//           options={[
//             { label: 'Live Account', value: 'Live' },
//             { label: 'Demo Account', value: 'Demo' },
//           ]}
//           selected={activeTab}
//           onChanged={(value) => {
//             setActiveTab(value as 'Demo' | 'Live')
//           }}
//         />

//         <View className='mx-3'>
//           <Input
//             leftAccessory={
//               <SearchIcon className='mr-1' color='#6B7280' size={20} />
//             }
//             rounded='sm'
//             placeholder='Search by name or ID'
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             className='ml-[-10px]'
//           />
//         </View>

//         {/* Account List */}
//         <ScrollView
//           className='flex-1'
//           contentContainerStyle={{ paddingBottom: 80 }}>
//           {filteredAccounts.map((account) => (
//             <TradeAccountItem key={account.id} account={account} />
//           ))}
//         </ScrollView>

//         {/* <Button
//           className='mx-4 mb-5'
//           label='Add Account'
//           onPress={() => {
//             addAccountReference.present()
//           }}
//         />
//         <AddTradeAccountModal
//           ref={addAccountReference.ref}
//           onPress={(type) => {
//             addAccountReference.dismiss()

//             navigation.navigate(Paths.CreateAccountDetail, {
//               accountType: type,
//             })
//           }}
//         /> */}
//       </View>
//     </SafeScreen>
//   )
// }

// export default ManageAccounts
