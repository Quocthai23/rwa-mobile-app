import '@/translations'
import 'react-native-gesture-handler'
import './config/defaultTextProps'
import './styles/global.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { MMKV } from 'react-native-mmkv'

import { useLanguageInit } from '@/hooks/language/useLanguageInit'
import ApplicationNavigator from '@/navigation/Application'
import { ThemeProvider } from '@/theme'

import BootstrapAccount from './components/atoms/BootstrapAccount'
import BootstrapMarketSocket from './components/atoms/BootstrapMarketSocket'
import NetworkReconnectOverlay from './components/atoms/NetworkReconnectOverlay'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      retry: 2,
      staleTime: 10_000,
    },
    mutations: {
      networkMode: 'offlineFirst',
      retry: 0,
    },
  },
})

export const storage = new MMKV()

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider storage={storage}>
          <AppContent />
          <BootstrapAccount />
          <BootstrapMarketSocket />
          <NetworkReconnectOverlay />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}

function AppContent() {
  useLanguageInit()

  return <ApplicationNavigator />
}

export default App
