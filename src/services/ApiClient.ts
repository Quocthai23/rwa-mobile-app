import ky, { type Options as KyOptions, type SearchParamsOption } from 'ky'

import { MIRROTO_API_BASE_URL } from '@/constants/api'
import { useAuthStore } from '@/store/authStore'

import { tokenStorage } from './tokenStorage'
import type { ApiResponse } from './types'

const API_BASE = MIRROTO_API_BASE_URL || 'https://mirroto-api.muskcoin.io'

type JsonObject = {
  [key: string]: JsonObject | JsonValue | JsonValue[]
}

type JsonValue = boolean | null | number | string

type QueryParameters = Record<string, JsonValue | undefined>

type RequestOptions = {
  /** Custom base URL for this request */
  baseUrl?: string
  /** If true, skip auto-adding Authorization header */
  skipAuth?: boolean
} & Omit<KyOptions, 'body' | 'json' | 'method' | 'searchParams'>

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const NO_CONTENT_STATUS = 204

const toSearchParametersOption = (
  parameters?: QueryParameters,
): SearchParamsOption | undefined => {
  if (!parameters) return undefined

  const cleanParameters: Record<string, string> = {}
  for (const [key, value] of Object.entries(parameters)) {
    if (value !== undefined && value !== null && value !== '') {
      cleanParameters[key] = String(value)
    }
  }

  return cleanParameters
}

const toHeaders = (headers?: KyOptions['headers']): Record<string, string> => {
  if (!headers) return {}

  if (headers instanceof Headers) {
    const output: Record<string, string> = {}
    for (const [key, value] of headers.entries()) {
      output[key] = value
    }

    return output
  }

  if (Array.isArray(headers)) {
    const output: Record<string, string> = {}
    for (const [key, value] of headers) {
      output[key] = value
    }

    return output
  }

  const output: Record<string, string> = {}
  for (const [key, value] of Object.entries(headers)) {
    if (value !== undefined) {
      output[key] = value
    }
  }

  return output
}

class ApiClient {
  private client = ky.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    hooks: {
      afterResponse: [
        async (request, options, response) => {
          try {
            const url = new URL(request.url)
            const isAuthEndpoint = url.pathname.startsWith('/auth/')
            if (isAuthEndpoint) {
              return response
            }

            const clonedResponse = response.clone()
            const responseText = await clonedResponse.text()
            let body: any = null
            try {
              body = responseText ? JSON.parse(responseText) : null
            } catch (e) {
              body = null
            }

            const code = body?.code || body?.error?.code

            const isInvalidToken =
              response.status === 401 || code === 'invalid-token'

            if (isInvalidToken) {
              const storedRefreshToken = tokenStorage.getRefreshToken()
              if (!storedRefreshToken) {
                throw new Error('No refresh token')
              }

              // Try to refresh token - backend may expect refreshToken (camelCase) or refresh_token (snake_case)
              const refreshResponse = await ky.post(
                `${API_BASE}/auth/refresh`,
                {
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  json: { refreshToken: storedRefreshToken },
                  throwHttpErrors: false,
                },
              )

              if (refreshResponse.ok) {
                const data = (await refreshResponse.json()) as any
                // Handle both camelCase and snake_case response formats
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

                  // Retry: Request headers are immutable - must create new Request with updated Authorization
                  const authHeader = accessToken.startsWith('Bearer ')
                    ? accessToken
                    : `Bearer ${accessToken}`
                  const newHeaders = new Headers(request.headers)
                  newHeaders.set('Authorization', authHeader)

                  // Body may be consumed from original request; use options.body if available (ky preserves it)
                  const options_ = options as { body?: BodyInit_ }
                  const body = request.bodyUsed
                    ? options_?.body
                    : (request.body as BodyInit_)
                  const newRequest = new Request(request.url, {
                    body,
                    headers: newHeaders,
                    method: request.method,
                  })

                  return ky(newRequest)
                }
              }

              throw new Error('Refresh failed')
            }
          } catch (error: any) {
            console.error('🚨 Auth Interceptor Error:', error)
            console.error('🚨 Error Stack:', error.stack)
            if (
              error.message === 'No refresh token' ||
              error.message === 'Refresh failed'
            ) {
              tokenStorage.clearToken()

              // Use setTimeout to avoid state update during render if this happens during fetch
              setTimeout(() => {
                useAuthStore.getState().logout()
              }, 0)
            }
          }

          return response
        },
      ],
      beforeRequest: [
        (request) => {
          const token = tokenStorage.getAccessToken()
          const skipAuth = request.headers.get('x-skip-auth') === 'true'

          if (token && !skipAuth && !request.headers.has('Authorization')) {
            request.headers.set(
              'Authorization',
              token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            )
          }
        },
      ],
    },
    prefixUrl: API_BASE,
    timeout: 30000, // 30 seconds timeout
  })

  /**
   * Create a client instance with custom base URL
   */
  createClient(baseUrl: string) {
    return ky.create({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      hooks: {
        beforeRequest: [
          (request) => {
            const token = tokenStorage.getAccessToken()
            const skipAuth = request.headers.get('x-skip-auth') === 'true'

            if (token && !skipAuth && !request.headers.has('Authorization')) {
              request.headers.set(
                'Authorization',
                token.startsWith('Bearer ') ? token : `Bearer ${token}`,
              )
            }
          },
        ],
      },
      prefixUrl: baseUrl,
    })
  }

  delete<T>(
    endpoint: string,
    parameters?: QueryParameters,
    options?: RequestOptions,
  ) {
    return this.request<T>('delete', endpoint, {
      ...options,
      searchParams: parameters,
    })
  }

  get<T>(
    endpoint: string,
    parameters?: QueryParameters,
    options?: RequestOptions,
    haveTotal = false,
  ) {
    // console.log('API GET Request:', { endpoint, parameters, options })
    return this.request<T>(
      'get',
      endpoint,
      {
        ...options,
        searchParams: parameters,
      },
      haveTotal,
    )
  }

  patch<T>(endpoint: string, json?: JsonObject, options?: RequestOptions) {
    console.log('API PATCH Request:', { endpoint, json, options })

    return this.request<T>('patch', endpoint, { ...options, json })
  }

  post<T>(endpoint: string, json?: JsonObject, options?: RequestOptions) {
    return this.request<T>('post', endpoint, { ...options, json })
  }

  put<T>(endpoint: string, json?: JsonObject, options?: RequestOptions) {
    return this.request<T>('put', endpoint, { ...options, json })
  }

  async request<T>(
    method: 'delete' | 'get' | 'patch' | 'post' | 'put',
    endpoint: string,
    options: {
      baseUrl?: string
      json?: JsonObject
      searchParams?: QueryParameters
    } & RequestOptions = {},
    haveTotal = false,
  ) {
    const { baseUrl, searchParams, skipAuth, ...kyOptions } = options

    const headers = toHeaders(kyOptions.headers)
    if (skipAuth) {
      headers['x-skip-auth'] = 'true'
    }

    // Handle URL manually to avoid ky prefixUrl issues with leading slashes
    // ky throws error if input starts with '/' when prefixUrl is set
    const cleanEndpoint = endpoint.startsWith('/')
      ? endpoint.slice(1)
      : endpoint

    const response = await this.client(cleanEndpoint, {
      method,
      ...kyOptions,
      headers,
      searchParams: toSearchParametersOption(searchParams),
    })
    // console.log('API Response12314:', response)

    if (response.status === NO_CONTENT_STATUS) {
      return undefined as unknown as T
    }

    const data: ApiResponse<T> = await response.json()
    // console.log('API Response12312:', data.data)
    if (data.success === false) {
      throw data.errors
    }

    // Handle cases where response is not wrapped in { data: ... }
    // The Login/Register APIs return the object directly
    if (data.data === undefined) {
      return data as unknown as T
    }
    if (haveTotal) {
      return { data: data.data, total: data.total } as unknown as T
    }

    return data.data
  }

  async upload<T>(endpoint: string, body: FormData, options?: RequestOptions) {
    const { skipAuth, ...kyOptions } = options || {}
    const headers = toHeaders(kyOptions.headers)

    if (skipAuth) {
      headers['x-skip-auth'] = 'true'
    }

    const response = await this.client(endpoint, {
      method: 'post',
      ...kyOptions,
      body,
      headers,
    })

    const data: ApiResponse<T> = await response.json()
    if (!data.success || data.errors) {
      throw data.errors
    }

    return data.data
  }
}

export const apiClient = new ApiClient()

export const createPaginatedQueryKey = (
  baseKey: string[],
  parameters?: QueryParameters,
) => {
  return [...baseKey, ...(parameters ? [parameters] : [])]
}
