import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  View,
} from 'react-native'

import { Text } from '@/components/atoms/TranslatedText/TranslatedText'

type SocialButtonProps = {
  readonly icon: null | React.ReactNode
  readonly text: string
  readonly loading?: boolean
} & PressableProps

export function SocialButton({
  text,
  icon,
  className,
  loading = false,
  ...props
}: SocialButtonProps) {
  return (
    <Pressable
      className={`flex-row items-center justify-center py-3 border border-gray-200 rounded bg-gray-50/10 gap-4 ${className}`}
      disabled={loading}
      {...props}>
      {loading ? (
        <ActivityIndicator size='small' color='#666' />
      ) : (
        <>
          <View className='w-5 h-5 items-center justify-center'>{icon}</View>
          {text ? (
            <Text className='text-neutral-900 text-body-large-semibold'>
              {text}
            </Text>
          ) : null}
        </>
      )}
    </Pressable>
  )
}
