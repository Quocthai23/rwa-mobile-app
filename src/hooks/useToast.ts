import { useCallback } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast, { type ToastShowParams } from 'react-native-toast-message'

type ShowToastParameters = {
  message?: string
  title: string
} & Omit<ToastShowParams, 'text1' | 'text2'>

export const useToast = () => {
  const insets = useSafeAreaInsets()

  const showToast = useCallback(
    ({ message, title, type = 'success', ...props }: ShowToastParameters) => {
      Toast.show({
        text1: title,
        text2: message,
        topOffset: insets.top + 10,
        type,
        ...props,
      })
    },
    [insets.top],
  )

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showToast({ message, title, type: 'success' })
    },
    [showToast],
  )

  const showError = useCallback(
    (title: string, message?: string) => {
      showToast({ message, title, type: 'error' })
    },
    [showToast],
  )

  const showInfo = useCallback(
    (title: string, message?: string) => {
      showToast({ message, title, type: 'info' })
    },
    [showToast],
  )

  const showWarning = useCallback(
    (title: string, message?: string) => {
      showToast({ message, title, type: 'warning' })
    },
    [showToast],
  )

  return {
    showError,
    showInfo,
    showSuccess,
    showToast,
    showWarning,
  }
}
