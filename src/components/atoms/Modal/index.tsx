/**
 * Modal
 * Dependencies:
 * - @gorhom/bottom-sheet.
 *
 * Props:
 * - All `BottomSheetModalProps` props.
 * - `title` (string | undefined): Optional title for the modal header.
 *
 * Usage Example:
 * import { Modal, useModal } from '@gorhom/bottom-sheet';
 *
 * function DisplayModal() {
 *   const { ref, present, dismiss } = useModal();
 *
 *   return (
 *     <View>
 *       <Modal
 *         snapPoints={['60%']} // optional
 *         title="Modal Title"
 *         ref={ref}
 *       >
 *         Modal Content
 *       </Modal>
 *     </View>
 *   );
 * }
 *
 */

import { useTheme } from '@/theme'
import type {
  BottomSheetBackdropProps,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  SCREEN_HEIGHT,
  TouchableOpacity,
} from '@gorhom/bottom-sheet'
import { XIcon } from 'lucide-react-native'
import { cssInterop } from 'nativewind'
import * as React from 'react'
import { Text, View, type ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { twMerge } from 'tailwind-merge'

cssInterop(BottomSheetView, {
  className: 'style',
})

type ModalHeaderProps = {
  readonly dismiss: () => void
  readonly title?: string
}

type ModalProps = {
  readonly title?: string
} & BottomSheetModalProps

type ModalReference = React.ForwardedRef<BottomSheetModal>

export const useModal = () => {
  const reference = React.useRef<BottomSheetModal>(null)
  const present = React.useCallback((data?: any) => {
    reference.current?.present(data)
  }, [])
  const dismiss = React.useCallback(() => {
    reference.current?.dismiss()
  }, [])

  return React.useMemo(
    () => ({ dismiss, present, ref: reference }),
    [present, dismiss],
  )
}

export const Modal = React.forwardRef(
  (
    { detached = false, snapPoints: _snapPoints, title, ...props }: ModalProps,
    reference: ModalReference,
  ) => {
    const detachedProps = React.useMemo(
      () => getDetachedProps(detached),
      [detached],
    )
    const modal = useModal()
    const snapPoints = React.useMemo(() => _snapPoints, [_snapPoints])

    React.useImperativeHandle(reference, () => modal.ref.current! || null)

    const renderHandleComponent = React.useCallback(
      () => (
        <>
          <View className='mb-4' />
          <ModalHeader dismiss={modal.dismiss} title={title} />
        </>
      ),
      [title, modal.dismiss],
    )

    return (
      <BottomSheetModal
        backgroundStyle={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        enableDynamicSizing={false}
        handleComponent={renderHandleComponent}
        snapPoints={snapPoints}
        {...props}
        {...detachedProps}
        ref={modal.ref}
        backdropComponent={props.backdropComponent ?? renderBackdrop}
        index={0}
        maxDynamicContentSize={SCREEN_HEIGHT * 0.8}
      />
    )
  },
)

export const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop {...props} disappearsOnIndex={-1} />
)

/**
 *
 * @param detached
 * @returns
 *
 * @description
 * In case the modal is detached, we need to add some extra props to the modal to make it look like a detached modal.
 */

const getDetachedProps = (detached: boolean) => {
  if (detached) {
    return {
      bottomInset: 46,
      detached: true,
      style: { marginHorizontal: 16, overflow: 'hidden' },
    } as Partial<BottomSheetModalProps>
  }

  return {} as Partial<BottomSheetModalProps>
}

/**
 * ModalHeader
 */

const ModalHeader = React.memo(({ dismiss, title }: ModalHeaderProps) => {
  const { colors } = useTheme()
  if (!title) return null

  return (
    <View className='flex-row justify-between items-center py-2 mb-3 mx-4'>
      <Text className='text-h3-semibold text-neutral-900'>{title}</Text>
      <TouchableOpacity className='size-6' hitSlop={10} onPress={dismiss}>
        <XIcon color={colors.neutral700} size={24} />
      </TouchableOpacity>
    </View>
  )
})

type FooterProps = {
  readonly children?: React.ReactNode | React.ReactNode[]
  readonly className?: string
} & ViewProps

export const ModalFooter: React.FC<FooterProps> = ({
  children,
  className = '',
  ...props
}) => {
  const insets = useSafeAreaInsets()
  const paddingBottom = insets.bottom + (insets.bottom === 0 ? 12 : 4)

  return (
    <View
      style={{ paddingBottom }}
      {...props}
      className={twMerge(`px-4 pt-2`, className)}>
      {children}
    </View>
  )
}
