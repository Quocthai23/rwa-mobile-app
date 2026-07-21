import { MMKV } from 'react-native-mmkv'

export type SupportedLang = string

export type TranslateOptions = {
  readonly apiKey?: string
  readonly apiUrl?: string
  readonly provider?: TranslationProvider
  readonly source?: SupportedLang
  readonly target: SupportedLang
}

export type TranslationProvider = 'google' | 'libre'

const DEFAULT_API_URL =
  process.env.TRANSLATION_API_URL ??
  'https://hzqhjtr88l.execute-api.ap-southeast-2.amazonaws.com/translate'

const DEFAULT_API_KEY = process.env.TRANSLATION_API_KEY

const DEFAULT_PROVIDER: TranslationProvider =
  (process.env.TRANSLATION_PROVIDER as TranslationProvider | undefined) ??
  'google'

export async function translateText(
  text: string,
  options: TranslateOptions,
): Promise<string> {
  if (!text) {
    return ''
  }

  const provider = options.provider ?? DEFAULT_PROVIDER

  if (provider === 'google') {
    return translateViaGoogle(text, options)
  }

  return translateViaLibre(text, options)
}

async function translateViaGoogle(
  text: string,
  options: TranslateOptions,
): Promise<string> {
  const sourceLanguage = options.source ?? 'auto'
  const targetLanguage = options.target

  const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
    sourceLanguage,
  )}&tl=${encodeURIComponent(targetLanguage)}&dt=t&q=${encodeURIComponent(text)}`

  try {
    const response = await fetch(translateUrl)

    if (!response.ok) {
      return text
    }

    const data = (await response.json()) as unknown

    if (
      Array.isArray(data) &&
      Array.isArray(data[0]) &&
      Array.isArray(data[0][0])
    ) {
      const segments = data[0] as unknown[]
      const translated = segments
        .map((segment) =>
          Array.isArray(segment) ? (segment[0] as string) : '',
        )
        .join('')

      return translated || text
    }

    return text
  } catch {
    return text
  }
}

async function translateViaLibre(
  text: string,
  options: TranslateOptions,
): Promise<string> {
  const apiUrl = options.apiUrl ?? DEFAULT_API_URL
  const apiKey = options.apiKey ?? DEFAULT_API_KEY
  const source = options.source ?? 'auto'
  const target = options.target

  try {
    const response = await fetch(apiUrl, {
      body: JSON.stringify({
        api_key: apiKey,
        format: 'text',
        q: text,
        source,
        target,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) {
      return text
    }

    const data = (await response.json()) as { translatedText?: string }

    return data.translatedText ?? text
  } catch {
    return text
  }
}

// ---------------------------------------------------------------------------
// Caching
// ---------------------------------------------------------------------------

const TRANSLATION_CACHE_KEY = 'translation-cache'
const TRANSLATION_CACHE_EXPIRY_KEY = 'translation-cache-expiry'
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

const storage = new MMKV({ id: 'translation-cache-storage' })

const memoryCache = new Map<string, string>()

const loadCacheFromStorage = (): Map<string, string> => {
  try {
    const cached = storage.getString(TRANSLATION_CACHE_KEY)
    const expiry = storage.getNumber(TRANSLATION_CACHE_EXPIRY_KEY)

    if (!cached || !expiry) {
      return new Map()
    }

    const now = Date.now()

    if (now > expiry) {
      storage.delete(TRANSLATION_CACHE_KEY)
      storage.delete(TRANSLATION_CACHE_EXPIRY_KEY)

      return new Map()
    }

    const cacheData = JSON.parse(cached) as Record<string, string>

    return new Map(Object.entries(cacheData))
  } catch (error) {
    console.warn('Failed to load translation cache from storage:', error)

    return new Map()
  }
}

const saveCacheToStorage = (cache: Map<string, string>) => {
  try {
    const cacheData = Object.fromEntries(cache)
    const expiry = Date.now() + CACHE_DURATION

    storage.set(TRANSLATION_CACHE_KEY, JSON.stringify(cacheData))
    storage.set(TRANSLATION_CACHE_EXPIRY_KEY, expiry)
  } catch (error) {
    console.warn('Failed to save translation cache to storage:', error)
  }
}

const persistentCache = loadCacheFromStorage()

export async function translateWithCache(
  text: string,
  options: TranslateOptions,
): Promise<string> {
  if (!text) {
    return text
  }

  const key = JSON.stringify({ text, ...options, apiKey: undefined })

  console.log('[Translation]', text.slice(0, 30), '→', options.target)

  const memoryCached = memoryCache.get(key)
  if (memoryCached !== undefined) {
    return memoryCached
  }

  const persistentCached = persistentCache.get(key)
  if (persistentCached !== undefined) {
    memoryCache.set(key, persistentCached)

    return persistentCached
  }

  const translated = await translateText(text, options)

  memoryCache.set(key, translated)
  persistentCache.set(key, translated)

  saveCacheToStorage(persistentCache)

  return translated
}

export const clearExpiredCache = () => {
  try {
    const expiry = storage.getNumber(TRANSLATION_CACHE_EXPIRY_KEY)

    if (expiry && Date.now() > expiry) {
      storage.delete(TRANSLATION_CACHE_KEY)
      storage.delete(TRANSLATION_CACHE_EXPIRY_KEY)
      memoryCache.clear()
      persistentCache.clear()
    }
  } catch (error) {
    console.warn('Failed to clear expired translation cache:', error)
  }
}

export const clearAllCache = () => {
  try {
    storage.delete(TRANSLATION_CACHE_KEY)
    storage.delete(TRANSLATION_CACHE_EXPIRY_KEY)
    memoryCache.clear()
    persistentCache.clear()
  } catch (error) {
    console.warn('Failed to clear all translation cache:', error)
  }
}

export const getCacheStats = () => {
  return {
    memoryCacheSize: memoryCache.size,
    persistentCacheSize: persistentCache.size,
    totalSize: memoryCache.size + persistentCache.size,
  }
}

// Simple helper to go from app language (e.g. en-EN, fr-FR, vi-VN) to ISO code
export function mapAppLangToISO(
  lang: string | undefined,
): SupportedLang | undefined {
  if (!lang) {
    return undefined
  }

  // If already looks like short ISO (en, fr, vi, etc.)
  if (/^[a-z]{2}(-[A-Z]{2})?$/.test(lang)) {
    return lang.slice(0, 2).toLowerCase()
  }

  // Fallback: just take first two letters
  return lang.slice(0, 2).toLowerCase()
}
