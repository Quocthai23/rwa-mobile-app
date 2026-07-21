import { ACCOUNTS_ENDPOINTS } from '@/constants/api'
import type {
  Account,
  AccountType,
  AccountTypesResponse,
  CreateAccountRequest,
} from '@/types/account'

import { apiClient } from './ApiClient'

export type AccountBalanceResponse = {
  accountId: string
  currentBalance: string
  pnl: string
}

export const getAccounts = async (userId?: string): Promise<Account[]> => {
  try {
    console.log('Fetching accounts...', userId ? `for user ${userId}` : '')

    const searchParameters: Record<string, string> = {}
    if (userId) {
      searchParameters.userId = userId
    }

    const response = await apiClient.get<{ accounts: Account[] } | Account[]>(
      ACCOUNTS_ENDPOINTS.LIST,
      searchParameters,
    )
    console.log('Accounts fetched:', response)

    if (Array.isArray(response)) {
      return response
    }

    return (response as any).accounts || []
  } catch (error) {
    console.error('Error fetching accounts:', error)
    throw error
  }
}

export const getAccountTypes = async (): Promise<AccountType[]> => {
  try {
    console.log('Fetching account types...')

    const response = await apiClient.get<AccountTypesResponse>(
      ACCOUNTS_ENDPOINTS.TYPES,
      undefined,
      {
        skipAuth: true,
      },
    )
    console.log('Account types fetched:', response)

    return response.accountTypes
  } catch (error) {
    console.error('Error fetching account types:', error)
    throw error
  }
}

export const createAccount = async (
  data: CreateAccountRequest,
): Promise<Account> => {
  try {
    console.log('Creating account with data:', data)

    const response = await apiClient.post<Account>(
      ACCOUNTS_ENDPOINTS.CREATE,
      data as any,
    )
    console.log('Account created successfully:', response)

    return response
  } catch (error) {
    console.error('Error creating account:', error)
    throw error
  }
}

export const deleteAccount = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(ACCOUNTS_ENDPOINTS.DELETE(id))
  } catch (error) {
    console.error('Error deleting account:', error)
    throw error
  }
}

export const updateAccountName = async (
  id: string,
  name: string,
): Promise<Account> => {
  try {
    const response = await apiClient.patch<Account>(
      ACCOUNTS_ENDPOINTS.UPDATE(id),
      { name },
    )

    return response
  } catch (error) {
    console.error('Error updating account name:', error)
    throw error
  }
}

export const archiveAccount = async (id: string): Promise<Account> => {
  try {
    const response = await apiClient.patch<Account>(
      ACCOUNTS_ENDPOINTS.UPDATE(id),
      { isArchived: true },
    )

    return response
  } catch (error) {
    console.error('Error archiving account:', error)
    throw error
  }
}

export const getAccountBalance = async (
  accountId: string,
  period: number,
): Promise<AccountBalanceResponse> => {
  try {
    const response = await apiClient.get<AccountBalanceResponse>(
      ACCOUNTS_ENDPOINTS.BALANCE,
      { accountId, period: period.toString() },
    )

    return response
  } catch (error) {
    console.error('Error fetching account balance:', error)
    throw error
  }
}
