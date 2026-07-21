// import {
//   Archive,
//   CheckCircle2Icon,
//   MoreVerticalIcon,
//   User2Icon,
// } from 'lucide-react-native'
// import { useRef } from 'react'
// import { Text, TouchableOpacity, View } from 'react-native'
// import Swipeable from 'react-native-gesture-handler/Swipeable'
// import Toast from 'react-native-toast-message'

// import { useAppNavigation } from '@/hooks'
// import { useArchiveAccount } from '@/hooks/useAccount'
// import { Paths } from '@/navigation/paths'
// import { useAccountStore } from '@/store/useAccountStore'
// import { type Account } from '@/types/account'

// export function TradeAccountItem({ account }: { readonly account: Account }) {
//   const navigation = useAppNavigation()
//   const swipeableRef = useRef<Swipeable>(null)
//   const selectedAccount = useAccountStore((s) => s.selectedAccount)
//   const selectAccount = useAccountStore((s) => s.selectAccount)
//   const archiveMutation = useArchiveAccount()
//   const isSelected = selectedAccount?.id === account.id

//   const handleSelect = () => {
//     selectAccount(account)
//     navigation.navigate(Paths.Main)
//     // Toast.show({
//     //   text1: `Switched to ${account.name}`,
//     //   type: 'success',
//     // })
//   }

//   const handleArchive = async () => {
//     swipeableRef.current?.close()
//     try {
//       await archiveMutation.mutateAsync(account.id)
//       Toast.show({
//         text1: 'Account archived',
//         type: 'success',
//       })
//     } catch {
//       Toast.show({
//         text1: 'Failed to archive account. Please try again.',
//         type: 'error',
//       })
//     }
//   }

//   const renderRightActions = () => (
//     <TouchableOpacity
//       className='bg-success-500 justify-center items-center rounded-md ml-2'
//       style={{ width: 72, minHeight: 72 }}
//       onPress={handleArchive}
//       disabled={archiveMutation.isPending}>
//       <View className='items-center gap-1'>
//         <Archive color='#FFFFFF' size={24} />
//         <Text className='text-white text-caption-medium font-medium'>
//           Archive
//         </Text>
//       </View>
//     </TouchableOpacity>
//   )

//   return (
//     <Swipeable
//       ref={swipeableRef}
//       renderRightActions={renderRightActions}
//       overshootRight={false}
//       friction={2}>
//       <TouchableOpacity
//         key={account.id}
//         className={`flex-row items-center justify-between py-4 px-4 mb-2 ${isSelected ? 'bg-primary-50' : 'bg-white'}`}
//         onPress={handleSelect}>
//         <View className='flex-row items-center flex-1'>
//           <View
//             className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isSelected ? 'bg-primary-100' : 'bg-gray-100'}`}>
//             <User2Icon color={isSelected ? '#0158FF' : '#6B7280'} size={20} />
//           </View>
//           <View className='flex-1'>
//             <View className='flex-row items-center gap-2'>
//               <Text
//                 className={`text-base ${isSelected ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>
//                 {account.name}
//               </Text>
//               {isSelected && <CheckCircle2Icon color='#0158FF' size={16} />}
//             </View>
//             <Text className='text-gray-900 font-semibold text-base'>
//               {typeof account.balance === 'number'
//                 ? account.balance.toFixed(2)
//                 : (Number(account.balance) || 0).toFixed(2)}{' '}
//               USD
//             </Text>
//           </View>
//         </View>
//         <TouchableOpacity
//           hitSlop={10}
//           onPress={() => {
//             navigation.navigate(Paths.TradeAccountAbout, { account })
//           }}>
//           <MoreVerticalIcon color='#374151' size={20} />
//         </TouchableOpacity>
//       </TouchableOpacity>
//     </Swipeable>
//   )
// }
