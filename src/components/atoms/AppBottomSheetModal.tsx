import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import type { ViewStyle } from 'react-native'

export type AppBottomSheetModalHandle = {
  close: () => void
  isOpen: () => boolean
  open: (param?: string) => void
}

type Props = {
  readonly animationDuration?: number // default 250

  readonly backdropOpacity?: number // default 0.5
  readonly children: React.ReactNode
  readonly containerStyle?: ViewStyle
  readonly contentStyle?: ViewStyle

  readonly enablePanDownToClose?: boolean // default true
  readonly snapPoints?: (number | string)[] // ['60%'] | [300]

  readonly modalProps?: Partial<
    Omit<BottomSheetModalProps, 'children' | 'ref' | 'snapPoints'>
  >

  readonly onClose?: () => void
  readonly onOpen?: () => void
}

const AppBottomSheetModal = forwardRef<AppBottomSheetModalHandle, Props>(
  (
    {
      animationDuration = 250,
      backdropOpacity = 0.5,
      children,
      containerStyle,
      contentStyle,
      enablePanDownToClose = true,
      modalProps,
      onClose,
      onOpen,
      snapPoints,
    },
    reference,
  ) => {
    const modalReference = useRef<BottomSheetModal>(null)
    const isOpenReference = useRef(false)
    const memoSnapPoints = useMemo(() => snapPoints, [snapPoints])
    const previousIndexReference = useRef(-1)
    const open = useCallback(() => {
      modalReference.current?.present()
    }, [])

    const close = useCallback(() => {
      modalReference.current?.dismiss()
    }, [])

    useImperativeHandle(
      reference,
      () => ({ close, isOpen: () => isOpenReference?.current, open }),
      [open, close],
    )

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={backdropOpacity}
          pressBehavior='close'
        />
      ),
      [backdropOpacity],
    )

    return (
      <BottomSheetModal
        ref={modalReference}
        enableDismissOnClose
        animationConfigs={{ duration: animationDuration }}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={enablePanDownToClose}
        snapPoints={memoSnapPoints}
        style={containerStyle}
        onChange={(index) => {
          const wasOpen = previousIndexReference.current >= 0
          const isOpen = index >= 0

          if (!wasOpen && isOpen) {
            onOpen?.()
          }

          if (wasOpen && !isOpen) {
            onClose?.()
          }

          previousIndexReference.current = index
        }}
        onDismiss={() => {
          previousIndexReference.current = -1
          onClose?.()
        }}
        {...modalProps}>
        <BottomSheetView style={[{ flex: 1 }, contentStyle]}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    )
  },
)

export default AppBottomSheetModal
