import React from 'react'
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native'

import { useNetworkReconnect } from '@/hooks/useNetworkReconnect'
import { useTheme } from '@/theme'

/**
 * NetworkReconnectOverlay Component
 *
 * Displays appropriate UI based on network state:
 * 1. Offline Alert Modal - Shows when network connection is lost
 *    - User can dismiss this alert
 *    - Shows again if network is lost after dismissal
 *
 * 2. Reconnecting Modal - Shows when network is restored
 *    - Full-screen loading indicator
 *    - Auto-hides after data sync completes (~1s minimum)
 *
 * Performance optimizations:
 * - Single NetInfo listener shared across app
 * - No unnecessary re-renders (uses refs internally)
 * - Integrated with TanStack Query for automatic cache management
 */
const NetworkReconnectOverlay = () => {
  const { colors } = useTheme()
  const { isReconnecting, showOfflineAlert, dismissOfflineAlert } =
    useNetworkReconnect()

  // Show reconnecting modal
  if (isReconnecting) {
    return (
      <Modal transparent visible={isReconnecting}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: colors.neutral0,
              borderRadius: 16,
              padding: 24,
              alignItems: 'center',
              gap: 16,
              minWidth: 200,
            }}>
            <ActivityIndicator color={colors.primary500} size='large' />
            <Text
              style={{
                color: colors.neutral900,
                fontSize: 16,
                fontWeight: '600',
              }}>
              Reconnecting...
            </Text>
            <Text
              style={{
                color: colors.neutral500,
                fontSize: 14,
                textAlign: 'center',
              }}>
              Syncing data with server
            </Text>
          </View>
        </View>
      </Modal>
    )
  }

  // Show offline alert
  if (showOfflineAlert) {
    return (
      <Modal transparent visible={showOfflineAlert}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}>
          <View
            style={{
              backgroundColor: colors.neutral0,
              borderRadius: 16,
              padding: 24,
              width: '100%',
              maxWidth: 340,
              gap: 16,
            }}>
            <View style={{ alignItems: 'center', gap: 8 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: colors.error50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 32 }}>📡</Text>
              </View>
              <Text
                style={{
                  color: colors.neutral900,
                  fontSize: 18,
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                No Internet Connection
              </Text>
              <Text
                style={{
                  color: colors.neutral500,
                  fontSize: 14,
                  textAlign: 'center',
                  lineHeight: 20,
                }}>
                Please check your internet connection and try again
              </Text>
            </View>
            <Pressable
              style={{
                backgroundColor: colors.primary500,
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
              }}
              onPress={dismissOfflineAlert}>
              <Text
                style={{
                  color: colors.neutral0,
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                OK
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
  }

  return null
}

export default NetworkReconnectOverlay
