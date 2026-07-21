import { useAssetsList } from '@/hooks/assets/useAssetsList'
import { useSymbols } from '@/hooks/market/useSymbols'
import { useMemo } from 'react'

const BootstrapMarketSocket = () => {
  const parameters = useMemo(
    () => ({
      categoryId: '',
      search: '',
      take: 20,
    }),
    [],
  )
  const { data } = useAssetsList(parameters)

  const listPopular = useMemo(() => {
    return data?.pages.flatMap((p) => p.data) ?? []
  }, [data])

  useSymbols(
    listPopular.map((item) => item.symbol),
    true,
  )
  return null
}

export default BootstrapMarketSocket
