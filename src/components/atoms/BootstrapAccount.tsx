import { useEffect } from 'react'

import { useAccounts } from '@/hooks/useAccount'
import { useAccountStore } from '@/store/useAccountStore'

function BootstrapAccount() {
  const setAccounts = useAccountStore((state) => state.setAccounts)
  const { data } = useAccounts()

  useEffect(() => {
    if (data && data.length > 0) {
      setAccounts(data)
    }
  }, [data])

  return null
}

export default BootstrapAccount
