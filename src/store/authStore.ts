import { MMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware'

import type { User } from '@/types/auth'

const storage = new MMKV()

const zustandStorage: StateStorage = {
  getItem: (name) => {
    const value = storage.getString(name)

    return value ?? null
  },
  removeItem: (name) => {
    storage.delete(name)
  },
  setItem: (name, value) => {
    storage.set(name, value)
  },
}

type AuthState = {
  completeOnboarding: () => void
  hasSeenOnboarding: boolean
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (partial: Partial<User>) => void
  user: undefined | User
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      hasSeenOnboarding: false,
      isAuthenticated: false,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: undefined }),
      updateUser: (partial) =>
        set((state) => ({
          user: state.user != null ? { ...state.user, ...partial } : state.user,
        })),
      user: undefined,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
)
