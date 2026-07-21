import { type BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { CircleDollarSignIcon, HandCoinsIcon } from 'lucide-react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { Modal, ModalFooter } from '@/components/atoms/Modal'

type AddTradeAccountModalProps = {
  readonly onPress: (type: 'Demo' | 'Live') => void
}

export const AddTradeAccountModal = React.forwardRef<
  BottomSheetModal,
  AddTradeAccountModalProps
>((props, reference) => {
  return (
    <Modal ref={reference} enableDynamicSizing title='Add Account' {...props}>
      <BottomSheetView className='gap-4'>
        <TouchableOpacity
          className='gap-4 items-center flex-row mx-5'
          onPress={() => {
            props.onPress('Live')
          }}>
          <CircleDollarSignIcon size={24} />
          <View className=''>
            <Text className='text-neutral-900 text-body-large-semibold'>
              Create a Live Account
            </Text>
            <Text className='text-neutral-500 text-body-large-regular'>
              Trade with real funds
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          className='gap-4 items-center flex-row mx-5'
          onPress={() => {
            props.onPress('Demo')
          }}>
          <HandCoinsIcon size={24} />
          <View className=''>
            <Text className='text-neutral-900 text-body-large-semibold'>
              Create a Demo Account
            </Text>
            <Text className='text-neutral-500 text-body-large-regular'>
              Practice with virtual funds
            </Text>
          </View>
        </TouchableOpacity>
        <ModalFooter />
      </BottomSheetView>
    </Modal>
  )
})
