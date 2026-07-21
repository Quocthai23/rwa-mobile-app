import { useCallback, useEffect, useRef, useState } from 'react'

import {
  clearExpiredCache,
  mapAppLangToISO,
  translateWithCache,
} from '@/services/translationService'
import i18n from '@/translations'

type TranslationOptions = {
  readonly cacheKey?: string
  readonly fallback?: string
}

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language)
  const translationQueue = useRef<Set<string>>(new Set())

  useEffect(() => {
    clearExpiredCache()
  }, [])

  // Listen to language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng)
    }

    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [])

  const translate = useCallback(
    async (text: string, options: TranslationOptions = {}) => {
      if (!text) {
        return options.fallback ?? text
      }

      const target = mapAppLangToISO(currentLanguage)

      // App content is authored in English, so:
      // - If target is 'en', return original text (already English)
      // - If target is 'vi' or 'fr', translate from English to target language
      if (!target) {
        return options.fallback ?? text
      }

      if (target === 'en') {
        // Already English, return original
        return options.fallback ?? text
      }

      // Translate from English (source) to target language
      const source = 'en' // App content is in English
      const cacheKey = options.cacheKey ?? `${text}-${source}-${target}`

      if (translationQueue.current.has(cacheKey)) {
        return options.fallback ?? text
      }

      try {
        translationQueue.current.add(cacheKey)
        setIsTranslating(true)

        const translated = await translateWithCache(text, { source, target })

        return translated || options.fallback || text
      } catch {
        return options.fallback ?? text
      } finally {
        translationQueue.current.delete(cacheKey)
        setIsTranslating(false)
      }
    },
    [currentLanguage],
  )

  const translateMultiple = useCallback(
    async (texts: string[], options: TranslationOptions = {}) => {
      const target = mapAppLangToISO(currentLanguage)
      const source = 'en' // App content is in English

      if (!target) {
        return texts.map((text) => options.fallback ?? text)
      }

      if (target === 'en') {
        // Already English, return original
        return texts.map((text) => options.fallback ?? text)
      }

      try {
        setIsTranslating(true)

        const translations = await Promise.all(
          texts.map((text) => translateWithCache(text, { source, target })),
        )

        return translations.map(
          (translated, index) => translated || options.fallback || texts[index],
        )
      } catch {
        return texts.map((text) => options.fallback ?? text)
      } finally {
        setIsTranslating(false)
      }
    },
    [currentLanguage],
  )

  return {
    appLanguage: currentLanguage,
    isTranslating,
    translate,
    translateMultiple,
  }
}

export const useTranslatedText = (text: string, fallback?: string) => {
  const [translatedText, setTranslatedText] = useState<string>(fallback ?? text)
  const [isLoading, setIsLoading] = useState(false)
  const { appLanguage, isTranslating, translate } = useTranslation()
  const lastTranslatedText = useRef<string>('')
  const lastLanguage = useRef<string>('')

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      // Re-translate if text changed OR language changed
      const textChanged = text && text !== lastTranslatedText.current
      const languageChanged = appLanguage !== lastLanguage.current

      if (!text || (!textChanged && !languageChanged)) {
        return
      }

      setIsLoading(true)

      try {
        const result = await translate(text, { fallback })

        if (isMounted) {
          setTranslatedText(result)
          lastTranslatedText.current = text
          lastLanguage.current = appLanguage
        }
      } catch {
        if (isMounted) {
          setTranslatedText(fallback ?? text)
          lastLanguage.current = appLanguage
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void run()

    return () => {
      isMounted = false
    }
  }, [text, fallback, translate, appLanguage])

  return {
    isTranslating: isTranslating || isLoading,
    translatedText,
  }
}

export const useTranslatedTexts = (texts: string[], fallbacks?: string[]) => {
  const [translatedTexts, setTranslatedTexts] = useState<string[]>(
    fallbacks ?? texts,
  )
  const { appLanguage, isTranslating, translateMultiple } = useTranslation()
  const lastTexts = useRef<string>('')
  const lastLanguage = useRef<string>('')

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      if (texts.length === 0) {
        return
      }

      const textsKey = texts.join('|')
      const textsChanged = textsKey !== lastTexts.current
      const languageChanged = appLanguage !== lastLanguage.current

      if (!textsChanged && !languageChanged) {
        return
      }

      const results = await translateMultiple(texts, {
        fallback: fallbacks?.[0],
      })

      if (isMounted) {
        setTranslatedTexts(results)
        lastTexts.current = textsKey
        lastLanguage.current = appLanguage
      }
    }

    void run()

    return () => {
      isMounted = false
    }
  }, [texts, fallbacks, translateMultiple, appLanguage])

  return { isTranslating, translatedTexts }
}
