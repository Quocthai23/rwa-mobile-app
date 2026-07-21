import { ChevronRight, LogOut } from 'lucide-react-native'
import { memo, useCallback, useRef } from 'react'
import { Image, Pressable, ScrollView, View } from 'react-native'

import { storage } from '@/App'
import type { AppBottomSheetModalHandle } from '@/components/atoms/AppBottomSheetModal'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { Header, SafeScreen } from '@/components/templates'
import { PIN_LAST_ACTIVE_KEY, PIN_STORAGE_KEY } from '@/constants/pin'
import { useAppNavigation } from '@/hooks'
import type { Language } from '@/hooks/language/schema'
import { Paths } from '@/navigation/paths'
import { useAuthStore } from '@/store/authStore'
import { useFavoriteAssetsStore } from '@/store/favoriteAssetsStore'
import { useAppStore } from '@/store/useAppStore'
import useTheme from '@/theme/hooks/useTheme'
import i18n from '@/translations'

import {
  getLanguageLabelForSetting,
  LanguagePicker,
} from './components/LanguagePicker'
import { UserCard } from './components/UserCard'

const DISCOVER_ICONS = {
  about: require('@/assets/images/discover/about-building.png'),
  feedback: require('@/assets/images/discover/feedback-message.png'),
  language: require('@/assets/images/discover/language.png'),
  referral: require('@/assets/images/discover/referral-gift.png'),
  settings: require('@/assets/images/discover/settings.png'),
  tradingGuide: require('@/assets/images/discover/trading-guide-help.png'),
} as const

const ICON_SIZE = 24

function Setting() {
  const navigation = useAppNavigation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const clearFavorites = useFavoriteAssetsStore((state) => state.clearFavorites)
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const { colors } = useTheme()
  const languagePickerRef = useRef<AppBottomSheetModalHandle>(null)

  const currentLanguageLabel = getLanguageLabelForSetting(language ?? 'en-EN')

  const handleLanguageSelect = useCallback(
    (code: string) => {
      if (code === 'en-EN' || code === 'fr-FR' || code === 'vi-VN') {
        setLanguage(code as 'vi-VN' | Language)
        void i18n.changeLanguage(code)
      }
    },
    [setLanguage],
  )

  const handleLogout = () => {
    storage.delete(PIN_STORAGE_KEY)
    storage.delete(PIN_LAST_ACTIVE_KEY)
    logout()
    clearFavorites()
  }

  const renderMenuItem = (
    iconSource: number,
    label: string,
    onPress?: () => void,
    rightElement?: React.ReactNode,
    isBorderBottom = false,
  ) => (
    <Pressable
      className={`flex-row items-center bg-white py-4 ${isBorderBottom ? 'border-b border-neutral-200' : ''}`}
      onPress={onPress}>
      <View className='mr-2'>
        <Image
          resizeMode='contain'
          source={iconSource}
          style={{ height: ICON_SIZE, width: ICON_SIZE }}
        />
      </View>
      <Text className='flex-1 text-body-large-medium text-neutral-900'>
        {label}
      </Text>
      {rightElement ?? <ChevronRight color={colors.neutral500} size={24} />}
    </Pressable>
  )

  const renderSectionHeader = (title: string) => (
    <Text className='text-secondary-500 text-button-small-medium mb-2 mt-3'>
      {title}
    </Text>
  )

  return (
    <SafeScreen bottomOnly>
      <Header label='Settings' />
      <LanguagePicker
        ref={languagePickerRef}
        currentLanguage={language ?? 'en-EN'}
        onDismiss={() => {}}
        onSelect={handleLanguageSelect}
      />
      <ScrollView
        className='flex-1 bg-white'
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}>
        <View>
          <UserCard />

          {/* General */}
          {renderSectionHeader('General')}
          {renderMenuItem(
            DISCOVER_ICONS.language,
            'Language',
            () => languagePickerRef.current?.open(),
            <View className='flex-row items-center'>
              <Text className='text-body-large-medium text-neutral-900 mr-1'>
                {currentLanguageLabel}
              </Text>
              <ChevronRight color={colors.neutral500} size={24} />
            </View>,
            true,
          )}
          {renderMenuItem(
            DISCOVER_ICONS.settings,
            'Security',
            () => navigation.navigate(Paths.SecurityCenter),
            undefined,
            true,
          )}
          {renderMenuItem(DISCOVER_ICONS.referral, 'Rewards Center', () =>
            navigation.navigate(Paths.RewardsCenter),
          )}

          {/* Support */}
          {renderSectionHeader('Support')}
          {renderMenuItem(
            DISCOVER_ICONS.feedback,
            'Feedback',
            () => navigation.navigate(Paths.Feedback),
            undefined,
            true,
          )}
          {renderMenuItem(
            DISCOVER_ICONS.tradingGuide,
            'Trading Guide',
            undefined,
            undefined,
            true,
          )}
          {renderMenuItem(DISCOVER_ICONS.about, 'About MTX')}

          {/* Sign out */}
          {user ? (
            <Pressable
              className='flex-row items-center py-4 mt-4 gap-2'
              onPress={handleLogout}>
              <LogOut className='mr-4' color={colors.error500} size={20} />
              <Text className='text-base font-medium text-red-500'>
                Sign out
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeScreen>
  )
}

export default memo(Setting)
