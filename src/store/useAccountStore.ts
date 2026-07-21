import { MMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware'

import type { Account } from '@/types/account'

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

type AccountState = {
  accounts: Account[]
  clearSelection: () => void
  selectAccount: (account: Account) => void
  selectedAccount: Account | null
  setAccounts: (accounts: Account[]) => void
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      accounts: [],
      clearSelection: () => set({ selectedAccount: null }),
      selectAccount: (account) => set({ selectedAccount: account }),
      selectedAccount: null,
      setAccounts: (accounts) => {
        const { selectedAccount } = get()
        // If no account is selected, or the selected account is not in the new list,
        // select the first account from the new list.
        let newSelectedAccount = selectedAccount

        if (accounts.length > 0) {
          const isSelectedValid =
            selectedAccount && accounts.some((a) => a.id === selectedAccount.id)
          if (!selectedAccount || !isSelectedValid) {
            newSelectedAccount = accounts[0]
          } else {
            // Update the selected account object with latest data from the list
            newSelectedAccount =
              accounts.find((a) => a.id === selectedAccount.id) || accounts[0]
          }
        } else {
          newSelectedAccount = null
        }

        set({ accounts, selectedAccount: newSelectedAccount })
      },
    }),
    {
      name: 'account-storage',
      partialize: (state) => ({ selectedAccount: state.selectedAccount }), // Only persist selectedAccount
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
)
