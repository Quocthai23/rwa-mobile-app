import { memo, useMemo } from 'react'
import {
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native'

type Props = {
  readonly baseFontSize?: number

  readonly baseStyle?: StyleProp<TextStyle>

  readonly bigFontSize?: number

  readonly bigStyle?: StyleProp<TextStyle>

  readonly containerStyle?: StyleProp<ViewStyle>

  readonly fixedDecimals?: number

  readonly style?: StyleProp<TextStyle>

  readonly supFontSize?: number

  readonly supStyle?: StyleProp<TextStyle>

  readonly useGrouping?: boolean

  readonly value: number | string
}

function extractColor(style?: StyleProp<TextStyle>) {
  if (!style) return undefined

  if (Array.isArray(style)) {
    for (let index = style.length - 1; index >= 0; index--) {
      const s = style[index] as null | TextStyle | undefined
      if (s?.color) return s.color
    }

    return undefined
  }

  return (style as TextStyle)?.color
}

function formatGrouping(intPart: string, useGrouping: boolean) {
  if (!useGrouping) return intPart

  return intPart.replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function parseParts(value: number | string, fixedDecimals?: number) {
  const raw = typeof value === 'number' ? String(value) : String(value).trim()

  const sign = raw.startsWith('-') ? '-' : ''
  const unsigned = sign ? raw.slice(1) : raw

  if (fixedDecimals != null) {
    const n =
      typeof value === 'number' ? value : Number(unsigned.replaceAll(',', ''))

    if (!Number.isFinite(n)) {
      return { decPart: '', intPart: unsigned, sign }
    }

    const s = Math.abs(n).toFixed(fixedDecimals)
    const [index, d = ''] = s.split('.')

    return { decPart: d, intPart: index, sign }
  }

  const cleaned = unsigned.replaceAll(',', '')
  let [index = '0', d = ''] = cleaned.split('.')

  if (!d) {
    d = '00'
  } else if (d.length === 1) {
    d = d + '0'
  }

  return { decPart: d, intPart: index || '0', sign }
}

const MT5PriceText = memo(function MT5PriceText({
  baseFontSize,
  baseStyle,
  bigFontSize,
  bigStyle,
  containerStyle,
  fixedDecimals,
  style,
  supFontSize,
  supStyle,
  useGrouping = false,
  value,
}: Props) {
  const inheritedColor = extractColor(style)

  const parts = useMemo(() => {
    const { decPart, intPart, sign } = parseParts(value, fixedDecimals)

    const dec = decPart.length > 5 ? decPart.slice(0, 5) : decPart

    const intFmt = formatGrouping(intPart, useGrouping)
    const decLength = dec.length

    if (decLength >= 3) {
      const normalLength = Math.max(0, decLength - 3)
      const normal = dec.slice(0, normalLength)
      const big = dec.slice(normalLength, normalLength + 2)
      const sup = dec.slice(normalLength + 2, normalLength + 3)

      return { big, hasDot: true, intFmt, normal, sign, sup }
    }

    if (decLength === 2) {
      return { big: dec, hasDot: true, intFmt, normal: '', sign, sup: '' }
    }

    return {
      big: '',
      hasDot: decLength > 0,
      intFmt,
      normal: dec,
      sign,
      sup: '',
    }
  }, [value, fixedDecimals, useGrouping])

  return (
    <View style={[styles.row, containerStyle]}>
      <Text
        style={[
          styles.base,
          baseFontSize ? { fontSize: baseFontSize } : null,
          baseStyle,
          style,
        ]}>
        {parts.sign}
        {parts.intFmt}
        {parts.hasDot ? '.' : ''}
        {parts.normal}
      </Text>

      {!!parts.big && (
        <Text
          style={[
            styles.big,
            bigFontSize ? { fontSize: bigFontSize } : null,
            inheritedColor ? { color: inheritedColor } : null,
            bigStyle,
          ]}>
          {parts.big}
        </Text>
      )}

      {}
      {!!parts.sup && (
        <Text
          style={[
            styles.sup,
            supFontSize ? { fontSize: supFontSize } : null,
            inheritedColor ? { color: inheritedColor } : null,
            supStyle,
          ]}>
          {parts.sup}
        </Text>
      )}
    </View>
  )
})

export default MT5PriceText

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    fontWeight: 600,
    includeFontPadding: false,
    lineHeight: 20,
  },

  big: {
    fontSize: 20,
    fontWeight: 700,
    includeFontPadding: false,
    lineHeight: 20,
    // marginTop: -2,
    transform: [{ translateY: 1 }],
  },

  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },

  sup: {
    fontSize: 16,
    fontWeight: 700,
    includeFontPadding: false,
    lineHeight: 20,
    marginLeft: 1,
    // marginTop: -6,
    transform: [{ translateY: -6 }],
  },
})
