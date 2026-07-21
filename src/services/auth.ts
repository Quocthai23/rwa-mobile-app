import type {
  LoginResponse,
  RegisterResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
  User,
} from '@/types/auth'

import { apiClient } from './ApiClient'
import { tokenStorage } from './tokenStorage'

export const authApi = {
  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<UpdateProfileResponse> => {
    return apiClient.post<UpdateProfileResponse>('user', payload)
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<{
      avatar: null | string
      createdAt: string
      email: string
      gender: null | string
      id: string
      status: number
      username: string
    }>('user/me')

    return {
      avatarUrl: res.avatar ?? null,
      createdAt: res.createdAt,
      email: res.email,
      gender: res.gender ?? null,
      id: res.id,
      status: res.status,
      username: res.username,
    }
  },

  checkEmail: async (email: string): Promise<{ exists: boolean }> => {
    return apiClient.post<{ exists: boolean }>(
      'auth/check-email',
      { email },
      { skipAuth: true },
    )
  },

  checkReferenceCode: async (
    referenceCode: string,
  ): Promise<{ exists: boolean; isValid: boolean }> => {
    return apiClient.post<{ exists: boolean; isValid: boolean }>(
      'auth/check-reference-code',
      { referenceCode },
      { skipAuth: true },
    )
  },

  login: async (payload: {
    email: string
    password: string
  }): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      'auth/login',
      payload,
      { skipAuth: true },
    )
    tokenStorage.setAccessToken(response.accessToken)
    tokenStorage.setRefreshToken(response.refreshToken)

    return response
  },

  loginSocial: async (payload: {
    idToken: string
    provider: string
  }): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      'auth/login-with-social',
      payload,
      { skipAuth: true },
    )
    tokenStorage.setAccessToken(response.accessToken)
    tokenStorage.setRefreshToken(response.refreshToken)

    return response
  },

  logout: async (): Promise<{ success: boolean }> => {
    try {
      return await apiClient.post<{ success: boolean }>('auth/logout')
    } finally {
      tokenStorage.clearToken()
    }
  },

  refreshToken: async (
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await apiClient.post<{
      accessToken: string
      refreshToken: string
    }>('auth/refresh', { refreshToken }, { skipAuth: true })
    tokenStorage.setAccessToken(response.accessToken)
    tokenStorage.setRefreshToken(response.refreshToken)

    return response
  },

  register: async (payload: {
    avatarUrl?: null | string
    password: string
    referenceCode?: string
    registerToken: string
    username?: string
  }): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      'auth/register',
      payload,
      { skipAuth: true },
    )
    tokenStorage.setAccessToken(response.accessToken)
    tokenStorage.setRefreshToken(response.refreshToken)

    return response
  },

  sendOTP: async (
    email: string,
    purpose: 'register' | 'reset_password',
  ): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(
      'auth/send-otp',
      { email, purpose },
      { skipAuth: true },
    )
  },

  verifyOTP: async (
    email: string,
    otp: string,
    purpose: 'register' | 'reset_password',
  ): Promise<{ token: string }> => {
    return apiClient.post<{ token: string }>(
      'auth/verify-otp',
      { email, otp, purpose },
      { skipAuth: true },
    )
  },
  resetPassword: async (
    resetPasswordToken: string,
    newPassword: string,
  ): Promise<{ success: boolean }> => {
    return apiClient.post<{ success: boolean }>(
      'auth/reset-password',
      { resetPasswordToken, newPassword },
      { skipAuth: true },
    )
  },
}
