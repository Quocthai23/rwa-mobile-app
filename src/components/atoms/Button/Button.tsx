import useTheme from '@/theme/hooks/useTheme'
import { fontFamily } from '@/theme/typography'
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  Text,
  View,
} from 'react-native'
import { twMerge } from 'tailwind-merge'

type ButtonProps = {
  readonly label: string
  readonly leftIcon?: React.ReactNode
  readonly loading?: boolean
  readonly rightIcon?: React.ReactNode
  readonly size?: ButtonSize
  readonly variant?: ButtonVariant
} & PressableProps
type ButtonSize = 36 | 40 | 48 | 49

type ButtonVariant =
  | 'ghost'
  | 'link'
  | 'outline'
  | 'primary'
  | 'secondary'
  | 'secondaryBrand'

export function Button({
  className,
  disabled,
  label,
  leftIcon,
  loading = false,
  rightIcon,
  size = 48,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const { colors } = useTheme()
  const getVariantStyle = () => {
    switch (variant) {
      case 'ghost': {
        return 'bg-transparent border-transparent'
      }
      case 'link': {
        return 'bg-transparent border-transparent'
      }
      case 'outline': {
        return 'bg-transparent border-gray-200'
      }
      case 'primary': {
        return 'bg-primary-500 border-primary-500'
      }
      case 'secondary': {
        return 'bg-gray-100 border-gray-100'
      }
      case 'secondaryBrand': {
        return 'bg-primary-100 border-primary-100'
      }
      default: {
        return 'bg-primary-500 border-primary-500'
      }
    }
  }

  const getSizeStyle = () => {
    switch (size) {
      case 36: {
        return 'px-4 py-2'
      }
      case 40: {
        return 'h-[40px] px-0'
      } // Link usually has 0 horizontal padding or minimal
      case 48: {
        return 'h-[48px] px-4'
      }
      case 49: {
        return 'h-[49px] px-4'
      }
      default: {
        return 'h-[48px] px-4'
      }
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case 'ghost':
      case 'outline':
      case 'secondary': {
        return 'text-gray-900'
      }
      case 'link':
      case 'secondaryBrand': {
        return 'text-primary-500'
      }
      case 'primary': {
        return 'text-white'
      }
      default: {
        return 'text-white'
      }
    }
  }

  const getTextSizeStyle = () => {
    switch (size) {
      case 36: {
        return 'text-sm leading-5'
      }
      case 40: {
        return 'text-base leading-6'
      }
      default: {
        return 'text-base leading-6'
      }
    }
  }

  const getIconSizeStyle = () => {
    switch (size) {
      case 36:
      case 40: {
        return 'w-6 h-6'
      }
      default: {
        return 'w-5 h-5'
      }
    }
  }

  return (
    <Pressable
      className={twMerge(
        `flex-row items-center justify-center rounded-[4px] border gap-2 ${getVariantStyle()} ${getSizeStyle()} ${disabled || loading ? 'opacity-50' : ''}`,
        className,
      )}
      disabled={disabled || loading}
      {...props}>
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary'
              ? 'white'
              : variant === 'secondaryBrand'
                ? colors.primary500
                : colors.neutral900
          }
          size='small'
        />
      ) : (
        <>
          {leftIcon ? (
            <View
              className={`${getIconSizeStyle()} items-center justify-center`}>
              {leftIcon}
            </View>
          ) : null}
          <Text
            className={`font-medium ${getTextSizeStyle()} ${getTextStyle()}`}
            style={{ fontFamily: fontFamily.primary }}>
            {label}
          </Text>
          {rightIcon ? (
            <View
              className={`${getIconSizeStyle()} items-center justify-center`}>
              {rightIcon}
            </View>
          ) : null}
        </>
      )}
    </Pressable>
  )
}
