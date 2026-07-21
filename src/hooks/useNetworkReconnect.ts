import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

import { queryClient } from '@/App'

export const useNetworkReconnect = () => {
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [showOfflineAlert, setShowOfflineAlert] = useState(false)
  const wasOfflineRef = useRef(false)

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      wasOfflineRef.current = !state.isConnected
      if (!state.isConnected) {
        setShowOfflineAlert(true)
      }
    })

    onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected)
      })
    })

    const unsubscribe = NetInfo.addEventListener((state) => {
      const isNowOnline = !!state.isConnected
      const wasOffline = wasOfflineRef.current

      wasOfflineRef.current = !isNowOnline

      if (!wasOffline && !isNowOnline) {
        setShowOfflineAlert(true)
      }

      if (wasOffline && isNowOnline) {
        setShowOfflineAlert(false)
        setIsReconnecting(true)

        queryClient
          .refetchQueries({
            type: 'active',
          })
          .finally(() => {
            setTimeout(() => {
              setIsReconnecting(false)
            }, 1000)
          })
      }
    })

    // Cleanup listener on unmount
    return () => {
      unsubscribe()
    }
  }, [])

  const dismissOfflineAlert = () => {
    setShowOfflineAlert(false)
  }

  return { isReconnecting, showOfflineAlert, dismissOfflineAlert }
}
