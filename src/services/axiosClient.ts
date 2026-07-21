// services/axiosClient.ts
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { MIRROTO_API_BASE_URL } from '@/constants/api'
import { useAuthStore } from '@/store/authStore'

import { ApiError } from './ApiClient'
import { tokenStorage } from './tokenStorage'

let isRefreshing = false
let failedQueue: {
  reject: (error: any) => void
  resolve: (token: string) => void
}[] = []

const processQueue = (error: any, token: null | string = null) => {
  for (const prom of failedQueue) {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  }

  failedQueue = []
}

export const axiosClient = axios.create({
  baseURL: MIRROTO_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken()

    if (token && !config.headers?.Authorization) {
      config.headers = config.headers ?? {}

      config.headers.Authorization = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
    }

    // Log request
    // console.log('📤 AXIOS REQUEST', {
    //   method: config.method?.toUpperCase(),
    //   url: config.url,
    //   baseURL: config.baseURL,
    //   params: config.params,
    //   data: config.data,
    //   headers: config.headers,
    // })

    return config
  },
  (error) => Promise.reject(error),
)

const handleAuthError = async (
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean },
  status: number | undefined,
) => {
  if (originalRequest._retry) {
    throw new ApiError(
      'AUTH_ERROR',
      'Session expired. Please login again.',
      status || 401,
    )
  }

  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ reject, resolve })
    })
      .then((token) => {
        originalRequest.headers.Authorization = token.startsWith('Bearer ')
          ? token
          : `Bearer ${token}`
        return axiosClient(originalRequest)
      })
      .catch((error_) => {
        throw error_
      })
  }

  originalRequest._retry = true
  isRefreshing = true

  const refreshToken = tokenStorage.getRefreshToken()

  if (!refreshToken) {
    isRefreshing = false
    processQueue(new Error('No refresh token'), null)
    tokenStorage.clearToken()

    setTimeout(() => {
      useAuthStore.getState().logout()
    }, 0)

    throw new ApiError('AUTH_ERROR', 'No refresh token available', 401)
  }

  try {
    const refreshResponse = await axios.post(
      `${MIRROTO_API_BASE_URL}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    if (refreshResponse.data) {
      const data = refreshResponse.data
      const accessToken =
        data.accessToken ||
        data.access_token ||
        data.data?.accessToken ||
        data.data?.access_token
      const newRefreshToken =
        data.refreshToken ||
        data.refresh_token ||
        data.data?.refreshToken ||
        data.data?.refresh_token

      if (accessToken) {
        tokenStorage.setAccessToken(accessToken)
        if (newRefreshToken) {
          tokenStorage.setRefreshToken(newRefreshToken)
        }

        originalRequest.headers.Authorization = accessToken.startsWith(
          'Bearer ',
        )
          ? accessToken
          : `Bearer ${accessToken}`

        isRefreshing = false
        processQueue(null, accessToken)

        return axiosClient(originalRequest)
      }
    }

    throw new Error('Invalid refresh response')
  } catch (refreshError) {
    console.error('🚨 Token Refresh Failed:', refreshError)
    isRefreshing = false
    processQueue(refreshError, null)
    tokenStorage.clearToken()

    setTimeout(() => {
      useAuthStore.getState().logout()
    }, 0)

    throw new ApiError(
      'AUTH_ERROR',
      'Session expired. Please login again.',
      401,
    )
  }
}

axiosClient.interceptors.response.use(
  (response) => {
    // Log response
    // console.log('📥 AXIOS RESPONSE', {
    //   status: response.status,
    //   statusText: response.statusText,
    //   url: response.config.url,
    //   data: response.data,
    // })

    if (response.data?.success === false || response.data?.error) {
      const code =
        response.data?.code || response.data?.error?.code || 'API_ERROR'
      const message =
        response.data?.message ||
        response.data?.error?.message ||
        'Request failed'

      // Handle token errors returned with 200 OK
      if (code === 'invalid-token') {
        return handleAuthError(
          response.config as InternalAxiosRequestConfig,
          response.status,
        ) as any
      }

      throw new ApiError(code, message, response.status)
    }

    return response
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as {
      _retry?: boolean
    } & InternalAxiosRequestConfig

    // ❌ có response (400/401/403/500…)
    if (error.response) {
      const { data, status } = error.response

      console.log('❌ AXIOS RESPONSE ERROR', {
        data,
        status,
      })

      // Check if it's an invalid token error
      const code = data?.code || data?.error?.code
      const isInvalidToken =
        status === 401 ||
        ((status === 400 || status === 403) && code === 'invalid-token')

      if (isInvalidToken) {
        return handleAuthError(originalRequest, status)
      }

      throw new ApiError(
        code ?? 'API_ERROR',
        data?.message ?? data?.error?.message ?? 'Request failed',
        status,
      )
    }

    // ❌ không có response → network error
    console.log('❌ AXIOS NETWORK ERROR', error.message)

    throw new ApiError(
      'NETWORK_ERROR',
      'Network error. Please check your connection.',
    )
  },
)

export async function apiRequest<T>(config: {
  data?: any
  method: 'delete' | 'get' | 'patch' | 'post' | 'put'
  params?: any
  url: string
}): Promise<T> {
  const res = await axiosClient.request(config)

  return res.data
}
