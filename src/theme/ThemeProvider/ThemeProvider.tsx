import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import type { PropsWithChildren } from 'react'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { MMKV } from 'react-native-mmkv'

import {
  generateBackgrounds,
  staticBackgroundStyles,
} from '@/theme/backgrounds'
import {
  generateBorderColors,
  generateBorderRadius,
  generateBorderWidths,
  staticBorderStyles,
} from '@/theme/borders'
import componentsGenerator from '@/theme/components'
import {
  generateFontColors,
  generateFontSizes,
  staticFontStyles,
} from '@/theme/fonts'
import { generateGutters, staticGutterStyles } from '@/theme/gutters'
import layout from '@/theme/layout'
import generateConfig from '@/theme/ThemeProvider/generateConfig'
import type { FulfilledThemeConfiguration, Variant } from '@/theme/types/config'
import type { ComponentTheme, Theme } from '@/theme/types/theme'

type Context = {
  changeTheme: (variant: Variant) => void
} & Theme

export const ThemeContext = createContext<Context | undefined>(undefined)

type Properties = PropsWithChildren<{
  readonly storage: MMKV
}>

function ThemeProvider({ children = false, storage }: Properties) {
  // Current theme variant
  const [variant, setVariant] = useState(
    (storage.getString('theme') ?? 'default') as Variant,
  )

  // Initialize theme at default if not defined
  useEffect(() => {
    const appHasThemeDefined = storage.contains('theme')
    if (!appHasThemeDefined) {
      storage.set('theme', 'default')
      setVariant('default')
    }
  }, [storage])

  const changeTheme = useCallback(
    (nextVariant: Variant) => {
      setVariant(nextVariant)
      storage.set('theme', nextVariant)
    },
    [storage],
  )

  // Flatten config with current variant
  const fullConfig = useMemo(() => {
    return generateConfig(variant) satisfies FulfilledThemeConfiguration
  }, [variant])

  const fonts = useMemo(() => {
    return {
      ...generateFontSizes(),
      ...generateFontColors(fullConfig),
      ...staticFontStyles,
    }
  }, [fullConfig])

  const backgrounds = useMemo(() => {
    return {
      ...generateBackgrounds(fullConfig),
      ...staticBackgroundStyles,
    }
  }, [fullConfig])

  const gutters = useMemo(() => {
    return {
      ...generateGutters(fullConfig),
      ...staticGutterStyles,
    }
  }, [fullConfig])

  const borders = useMemo(() => {
    return {
      ...generateBorderColors(fullConfig),
      ...generateBorderRadius(),
      ...generateBorderWidths(),
      ...staticBorderStyles,
    }
  }, [fullConfig])

  const navigationTheme = useMemo(() => {
    if (variant === 'dark') {
      return {
        ...DarkTheme,
        colors: fullConfig.navigationColors,
        dark: true,
      }
    }

    return {
      ...DefaultTheme,
      colors: fullConfig.navigationColors,
      dark: false,
    }
  }, [variant, fullConfig])

  const theme = useMemo(() => {
    return {
      backgrounds,
      borders,
      colors: fullConfig.colors,
      fonts,
      gutters,
      layout,
      typography: fullConfig.typography,
      variant,
    } satisfies ComponentTheme
  }, [variant, fonts, backgrounds, borders, fullConfig, gutters])

  const components = useMemo(() => {
    return componentsGenerator(theme)
  }, [theme])

  const value = useMemo(() => {
    return { ...theme, changeTheme, components, navigationTheme }
  }, [theme, components, navigationTheme, changeTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
