import { useCallback, useEffect, useRef } from 'react'
import { AppState, type AppStateStatus } from 'react-native'

import { storage } from '@/App'
import {
  PIN_LAST_ACTIVE_KEY,
  PIN_SESSION_VERIFIED_KEY,
  PIN_STORAGE_KEY,
  PIN_TIMEOUT_MS,
} from '@/constants/pin'

type UsePINGuardOptions = {
  onPINRequired?: () => void
}

export function usePINGuard(options?: UsePINGuardOptions) {
  const appState = useRef(AppState.currentState)
  const { onPINRequired } = options || {}

  // Check if PIN verification is required
  const shouldRequirePIN = useCallback((): boolean => {
    const savedPin = storage.getString(PIN_STORAGE_KEY)

    // No PIN set - don't require
    if (!savedPin) {
      return false
    }

    const lastActiveTime = storage.getNumber(PIN_LAST_ACTIVE_KEY)

    // No last active time recorded - app hasn't gone to background yet, don't require PIN
    if (!lastActiveTime) {
      return false
    }

    const timeDiff = Date.now() - lastActiveTime

    // If more than PIN_TIMEOUT_MS has passed, require PIN
    return timeDiff > PIN_TIMEOUT_MS
  }, [])

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        const sessionVerified = storage.getString(PIN_SESSION_VERIFIED_KEY)
        if (sessionVerified === 'true') {
          storage.set(PIN_LAST_ACTIVE_KEY, Date.now())
        }
      }

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (shouldRequirePIN() && onPINRequired) {
          storage.set(PIN_SESSION_VERIFIED_KEY, 'false')
          onPINRequired()
        } else {
          storage.set(PIN_SESSION_VERIFIED_KEY, 'true')
        }
      }

      appState.current = nextAppState
    },
    [onPINRequired, shouldRequirePIN],
  )

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    )

    return () => {
      subscription.remove()
    }
  }, [handleAppStateChange])

  const updateLastActiveTime = useCallback(() => {
    storage.set(PIN_LAST_ACTIVE_KEY, Date.now())
    storage.set(PIN_SESSION_VERIFIED_KEY, 'true')
  }, [])

  // Check if PIN exists
  const hasPIN = useCallback((): boolean => {
    return !!storage.getString(PIN_STORAGE_KEY)
  }, [])

  return {
    hasPIN,
    shouldRequirePIN,
    updateLastActiveTime,
  }
}
