import React, { useEffect, useRef } from 'react'

import AppBottomSheetModal, {
  type AppBottomSheetModalHandle,
} from './AppBottomSheetModal'
import { useGlobalModalStore } from '@/store/globalModalStore'

export default function GlobalModal() {
  const modalReference = useRef<AppBottomSheetModalHandle>(null)
  const { close, config, isVisible } = useGlobalModalStore()

  useEffect(() => {
    if (isVisible) {
      modalReference.current?.open()
    } else {
      modalReference.current?.close()
    }
  }, [isVisible])

  if (!config) return null

  return (
    <AppBottomSheetModal
      ref={modalReference}
      animationDuration={config.animationDuration}
      backdropOpacity={config.backdropOpacity}
      enablePanDownToClose={config.enablePanDownToClose}
      snapPoints={config.snapPoints}
      modalProps={{
        index: config.initialSnapIndex ?? 0,
      }}
      onClose={() => {
        close()
        config.onClose?.()
      }}>
      {config.content}
    </AppBottomSheetModal>
  )
}
