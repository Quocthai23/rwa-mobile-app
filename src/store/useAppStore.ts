import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { storage } from '@/App'
import { SEARCH_HISTORY_LIMIT } from '@/constants/ui'
import type { Language } from '@/hooks/language/schema'
import { tokenStorage } from '@/services/tokenStorage'

type CurrencyCode = 'EUR' | 'GBP' | 'JPY' | 'USD' | 'VND'

type AppState = {
  // Auth
  accessToken: string | undefined
  clearAuth: () => void
  refreshToken: string | undefined
  setAccessToken: (accessToken: string) => void
  setRefreshToken: (refreshToken: string) => void

  // Theme
  isDarkMode: boolean
  toggleTheme: () => void

  // Language
  language: 'vi-VN' | Language | undefined
  setLanguage: (language: 'vi-VN' | Language) => void

  // Currency
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void

  // Search history
  addSearchHistory: (query: string) => void
  clearSearchHistory: () => void
  searchHistory: string[]

  // UI state
  isFirstLaunch: boolean
  setFirstLaunch: (value: boolean) => void

  // Quick Access
  quickAccessKeys: string[]
  setQuickAccessKeys: (keys: string[]) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      accessToken: undefined,
      clearAuth: () => {
        tokenStorage.removeAccessToken()

        set({
          accessToken: undefined,
          refreshToken: undefined,
        })
      },
      refreshToken: undefined,
      setAccessToken: (accessToken: string) => {
        tokenStorage.setAccessToken(accessToken)
        set({ accessToken })
      },
      setRefreshToken: (refreshToken: string) => set({ refreshToken }),

      // Theme
      isDarkMode: false,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Language
      language: undefined,
      setLanguage: (language) => set({ language }),

      // Currency
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),

      // Search history
      addSearchHistory: (query: string) =>
        set((state) => {
          const filtered = state.searchHistory.filter((q) => q !== query)

          return {
            searchHistory: [query, ...filtered].slice(0, SEARCH_HISTORY_LIMIT),
          }
        }),
      clearSearchHistory: () => set({ searchHistory: [] }),
      searchHistory: [],

      // UI state
      isFirstLaunch: true,
      setFirstLaunch: (value: boolean) => set({ isFirstLaunch: value }),

      // Quick Access
      quickAccessKeys: [
        'deposit',
        'withdraw',
        'transfer',
        'history',
        'social',
        'copy_trading',
        'chat',
        'ranking',
      ],
      setQuickAccessKeys: (keys: string[]) => set({ quickAccessKeys: keys }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => ({
        getItem: (name: string) => {
          const value = storage.getString(name)

          return value ?? null
        },
        removeItem: (name: string) => {
          storage.delete(name)
        },
        setItem: (name: string, value: string) => {
          storage.set(name, value)
        },
      })),
    },
  ),
)
