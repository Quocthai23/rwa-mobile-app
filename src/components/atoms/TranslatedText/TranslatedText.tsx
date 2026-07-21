import type React from 'react'
import { useMemo } from 'react'
import { Text as RNText, type TextProps } from 'react-native'
import { useTranslatedText } from '@/hooks/useTranslation'
import { fontFamily } from '@/theme/typography'

type TranslatedTextProps = {
  readonly fallback?: string
  readonly showLoading?: boolean
  readonly text?: string
} & TextProps

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  children,
  fallback,
  showLoading = false,
  text,
  ...textProps
}) => {
  const shouldTranslate = Boolean(text) || typeof children === 'string'
  const sourceText = text ?? (typeof children === 'string' ? children : '')

  const { isTranslating, translatedText } = useTranslatedText(
    shouldTranslate ? sourceText : '',
    fallback,
  )

  const content = useMemo(() => {
    if (shouldTranslate) {
      return translatedText !== '' ? translatedText : (children ?? '')
    }

    return children
  }, [children, shouldTranslate, translatedText])

  return (
    <RNText {...textProps} style={[textProps.style]}>
      {content}
      {showLoading && isTranslating ? '…' : null}
    </RNText>
  )
}

type TProps = {
  readonly fallback?: string
  readonly text: string
}

export const T: React.FC<TProps> = ({ fallback, text }) => {
  return <TranslatedText fallback={fallback} showLoading={false} text={text} />
}

// Alias to drop-in replace RN Text when imported from this module
export { TranslatedText as Text }
