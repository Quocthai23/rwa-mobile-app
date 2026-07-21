import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  View,
} from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Text } from '@/components/atoms/Text/Text'
import { Plus } from 'lucide-react-native'
import useTheme from '@/theme/hooks/useTheme'

type ButtonNewProps = {
  readonly name: string
  readonly type?: 'button' | 'icon' | 'text'
  readonly leftIcon?: React.ReactNode
  readonly rightIcon?: React.ReactNode
  readonly loading?: boolean
  readonly color?: 'blue' | 'red' | 'green' | 'primary' | 'error' | 'success'
  readonly variant?: 'solid' | 'light' | 'outline' | 'ghost'
  readonly rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  readonly border?: string // Border color class (e.g., 'border-red-500', 'border-[#FF5733]')
  readonly size?: 'sm' | 'md' | 'lg'
  readonly bg?: string // Custom background color class (e.g., 'bg-blue-500', 'bg-[#FF5733]')
  readonly textColor?: string // Custom text color class (e.g., 'text-white', 'text-gray-900')
  readonly iconColor?: string // Custom icon color (e.g., 'white', '#0158FF')
} & PressableProps

export function ButtonNew({
  className,
  disabled,
  name,
  type = 'button',
  leftIcon,
  rightIcon,
  loading = false,
  color = 'blue',
  variant = 'solid',
  rounded = 'md',
  border,
  size = 'md',
  bg,
  textColor,
  iconColor,
  ...props
}: ButtonNewProps) {
  // Map color names to Tailwind color classes
  const colorMap = {
    blue: 'primary',
    red: 'error',
    green: 'success',
    primary: 'primary',
    error: 'error',
    success: 'success',
  }

  const tailwindColor = colorMap[color]
  const { colors } = useTheme()
  // Get variant styles based on color and variant
  const getVariantStyle = () => {
    const isDisabledOrLoading = disabled || loading

    switch (variant) {
      case 'solid': {
        return {
          bg: isDisabledOrLoading
            ? `bg-${tailwindColor}/50`
            : `bg-${tailwindColor}-500`,
          border: isDisabledOrLoading
            ? `border-${tailwindColor}/50`
            : `border-${tailwindColor}-500`,
          text: isDisabledOrLoading
            ? `text-${tailwindColor}-400`
            : 'text-white',
        }
      }
      case 'light': {
        return {
          bg: isDisabledOrLoading
            ? `bg-${tailwindColor}/50`
            : `bg-${tailwindColor}-100`,
          border: isDisabledOrLoading
            ? `border-${tailwindColor}/50`
            : `border-${tailwindColor}-100`,
          text: isDisabledOrLoading
            ? `text-${tailwindColor}-300`
            : `text-${tailwindColor}-500`,
        }
      }
      case 'outline': {
        return {
          bg: 'bg-transparent',
          border: isDisabledOrLoading
            ? `border-${tailwindColor}/50`
            : `border-${tailwindColor}-500`,
          text: isDisabledOrLoading
            ? `text-${tailwindColor}-300`
            : `text-${tailwindColor}-500`,
        }
      }
      case 'ghost': {
        return {
          bg: 'bg-transparent',
          border: 'border-transparent',
          text: isDisabledOrLoading
            ? `text-${tailwindColor}-300`
            : `text-${tailwindColor}-500`,
        }
      }
      default: {
        return {
          bg: isDisabledOrLoading
            ? `bg-${tailwindColor}-200`
            : `bg-${tailwindColor}-500`,
          border: isDisabledOrLoading
            ? `border-${tailwindColor}-200`
            : `border-${tailwindColor}-500`,
          text: isDisabledOrLoading
            ? `text-${tailwindColor}-400`
            : 'text-white',
        }
      }
    }
  }

  // Get rounded style
  const getRoundedStyle = () => {
    switch (rounded) {
      case 'none':
        return 'rounded-none'
      case 'sm':
        return 'rounded-sm'
      case 'md':
        return 'rounded-md'
      case 'lg':
        return 'rounded-lg'
      case 'full':
        return 'rounded-full'
      default:
        return 'rounded-md'
    }
  }

  // Get size styles
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'py-2 px-3',
          text: 'text-button-small-medium',
          icon: 'w-5 h-5',
          iconSize: 20,
        }
      case 'md':
        return {
          container: 'py-2 px-4',
          text: 'text-button-large-medium',
          icon: 'w-6 h-6',
          iconSize: 24,
        }
      case 'lg':
        return {
          container: 'py-3 px-4',
          text: 'text-button-large-medium',
          icon: 'w-6 h-6',
          iconSize: 24,
        }
      default:
        return {
          container: 'py-2 px-4',
          text: 'text-button-large-medium',
          icon: 'w-6 h-6',
          iconSize: 24,
        }
    }
  }

  const variantStyles = getVariantStyle()
  const sizeStyles = getSizeStyle()

  // Get ActivityIndicator color based on variant and disabled state
  const getSpinnerColor = () => {
    if (disabled || loading) {
      return colors.neutral400 // Gray color for disabled/loading state
    }
    return variant === 'solid' ? 'white' : colors.primary500
  }

  return (
    <>
      {type === 'button' ? (
        <>
          <Pressable
            className={twMerge(
              `flex-row items-center justify-center gap-2`,
              bg || variantStyles.bg, // Use custom bg if provided, otherwise use variant bg
              border && `border ${border}`, // Only add border if border prop is provided
              getRoundedStyle(),
              sizeStyles.container,
              (disabled || loading) && 'opacity-50',
              className,
            )}
            disabled={disabled || loading}
            {...props}>
            {loading ? (
              <ActivityIndicator color={getSpinnerColor()} size='small' />
            ) : leftIcon ? (
              <View
                className={`${sizeStyles.icon} items-center justify-center`}>
                {leftIcon}
              </View>
            ) : null}
            <Text
              className={` ${sizeStyles.text} ${textColor || variantStyles.text}`}>
              {name}
            </Text>
            {!loading && rightIcon ? (
              <View
                className={`${sizeStyles.icon} items-center justify-center`}>
                {rightIcon}
              </View>
            ) : null}
          </Pressable>
        </>
      ) : type === 'icon' ? (
        <Pressable
          className={twMerge(
            `flex-row items-center justify-center gap-2`,
            bg || variantStyles.bg, // Use custom bg if provided, otherwise use variant bg
            border && `border ${border}`, // Only add border if border prop is provided
            getRoundedStyle(),
            sizeStyles.container,
            (disabled || loading) && 'opacity-50',
            className,
          )}
          disabled={disabled || loading}
          {...props}>
          {loading ? (
            <ActivityIndicator color={getSpinnerColor()} size='small' />
          ) : (
            <>
              <View
                className={`${sizeStyles.icon} items-center justify-center`}>
                <Plus
                  size={sizeStyles.iconSize}
                  color={iconColor || getSpinnerColor()}
                />
              </View>
            </>
          )}
        </Pressable>
      ) : type === 'text' ? (
        <Pressable
          className={twMerge(
            `flex-row items-center justify-center gap-2`,
            (disabled || loading) && 'opacity-50',
            className,
          )}
          disabled={disabled || loading}
          {...props}>
          {loading ? (
            <ActivityIndicator color={getSpinnerColor()} size='small' />
          ) : (
            <>
              {leftIcon ? (
                <View
                  className={`${sizeStyles.icon} items-center justify-center`}>
                  {leftIcon}
                </View>
              ) : null}
              <Text
                className={`font-medium ${sizeStyles.text} ${textColor || variantStyles.text}`}>
                {name}
              </Text>
              {rightIcon ? (
                <View
                  className={`${sizeStyles.icon} items-center justify-center`}>
                  {rightIcon}
                </View>
              ) : null}
            </>
          )}
        </Pressable>
      ) : null}
    </>
  )
}
