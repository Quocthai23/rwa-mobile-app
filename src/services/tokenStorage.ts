import { storage } from '@/App'

const REFRESH_TOKEN_KEY = 'refreshToken'
const ACCESS_TOKEN_KEY = 'access_token'

/**
 * A centralized module to manage the access token in MMKV storage.
 * This decouples the API layer from the state management layer (Zustand)
 * and provides a single source of truth for the raw token.
 */
export const tokenStorage = {
  clearToken: (): void => {
    storage.delete(ACCESS_TOKEN_KEY)
    storage.delete(REFRESH_TOKEN_KEY)
  },

  getAccessToken: (): string | undefined => {
    return storage.getString(ACCESS_TOKEN_KEY)
  },

  getRefreshToken: (): string | undefined => {
    return storage.getString(REFRESH_TOKEN_KEY)
  },

  removeAccessToken: (): void => {
    storage.delete(ACCESS_TOKEN_KEY)
  },

  removeRefreshToken: (): void => {
    storage.delete(REFRESH_TOKEN_KEY)
  },

  setAccessToken: (token: string): void => {
    storage.set(ACCESS_TOKEN_KEY, token)
  },

  setRefreshToken: (token: string): void => {
    storage.set(REFRESH_TOKEN_KEY, token)
  },
}
