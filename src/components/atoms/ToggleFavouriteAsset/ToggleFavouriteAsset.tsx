import { Star } from 'lucide-react-native'
import { ActivityIndicator, TouchableOpacity } from 'react-native'

import { useToggleFavoriteAsset } from '@/hooks/users/useToggleFavoriteAsset'
import { useFavoriteAssetsStore } from '@/store/favoriteAssetsStore'
import { useTheme } from '@/theme'
import { useAuthStore } from '@/store/authStore'
import { useAppNavigation } from '@/hooks'
import { Paths } from '@/navigation/paths'

type ToggleFavouriteAssetProps = {
  readonly assetId: string
  readonly className?: string
  readonly size?: number
}

export function ToggleFavouriteAsset({
  assetId,
  className = '',
  size = 18,
}: ToggleFavouriteAssetProps) {
  const navigation = useAppNavigation()
  const user = useAuthStore((state) => state.user)
  const { colors } = useTheme()
  const isFavoriteAssetId = useFavoriteAssetsStore((s) => s.isFavoriteAssetId)
  const isFavorite = assetId ? isFavoriteAssetId(assetId) : false

  const { isPending: isTogglingFavorite, mutate: toggleFavorite } =
    useToggleFavoriteAsset()

  const handleToggleFavorite = () => {
    if (!user) {
      navigation.navigate(Paths.Login)
      return
    }
    if (isTogglingFavorite || !assetId) return
    toggleFavorite({ assetId })
  }

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center ${className}`}
      disabled={isTogglingFavorite || !assetId}
      onPress={handleToggleFavorite}>
      {isTogglingFavorite ? <ActivityIndicator size='small' /> : null}
      {!isTogglingFavorite && (
        <>
          {isFavorite ? (
            <Star
              color={colors.warning500}
              fill={colors.warning500}
              size={size}
            />
          ) : (
            <Star color={colors.neutral500} size={size} />
          )}
        </>
      )}
    </TouchableOpacity>
  )
}
