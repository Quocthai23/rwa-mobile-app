import { useTheme } from '@/theme'
import { fontFamily } from '@/theme/typography'
import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
  type TouchableOpacityProps,
  View,
} from 'react-native'

type ButtonCustomProps = {
  readonly children?: React.ReactNode
  readonly isLoading?: boolean
  readonly textStyle?: TextStyle
  readonly textClassName?: string
  readonly type: TradeType
  readonly title?: string
} & TouchableOpacityProps

type TradeType = 'APPLY' | 'BUY' | 'CANCEL' | 'SELL'

function ButtonCustom({
  children,
  disabled,
  isLoading = false,
  style,
  textStyle,
  type,
  title,
  textClassName,
  ...rest
}: ButtonCustomProps) {
  const { colors } = useTheme()
  const bgMap: Record<TradeType, string> = {
    APPLY: colors.primary500,
    BUY: colors.success500,
    CANCEL: colors.neutral100,
    SELL: colors.error500,
  }

  const textColorMap: Record<TradeType, string> = {
    APPLY: colors.neutral0,
    BUY: colors.neutral0,
    CANCEL: colors.neutral900,
    SELL: colors.neutral0,
  }

  const titleMap: Record<TradeType, string> = {
    APPLY: 'Apply',
    BUY: 'Buy',
    CANCEL: 'Cancel',
    SELL: 'Sell',
  }

  const isDisabled = disabled || isLoading

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isDisabled}
      style={[
        styles.base,
        {
          backgroundColor: bgMap[type] ?? colors.neutral500,
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
      {...rest}>
      {isLoading ? (
        <ActivityIndicator color={colors.neutral0} />
      ) : children ? (
        children
      ) : (
        <View style={styles.defaultContent}>
          <Text
            className={`${textClassName}`}
            style={[
              styles.defaultText,
              { color: textColorMap[type] ?? colors.neutral0 },
              textStyle,
            ]}>
            {title ?? titleMap[type] ?? ''}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default ButtonCustom

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 4,
    flex: 1,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  defaultContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  defaultText: {
    color: '#fff',
    fontFamily: fontFamily.primary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
  },
})
