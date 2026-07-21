import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet'
import { Check, Search } from 'lucide-react-native'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ListRenderItem } from 'react-native'
import { Dimensions, Pressable, TextInput, View } from 'react-native'

import type { AppBottomSheetModalHandle } from '@/components/atoms/AppBottomSheetModal'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import { neutral, primary } from '@/theme/colors'
import { fontFamily, fontWeight } from '@/theme/typography'

// Sheet: 75px gap from phone header (blur visible), no drag needed
const SHEET_TOP_INSET_PX = 75

const COLORS = {
  neutralPrimary: neutral[900], // #111827
  brandPrimary: primary[500], // #0158FF
  iconSubtle: neutral[500], // #6B7280
  textTertiary: neutral[400], // #9CA3AF
} as const

export type LanguageOption = {
  code: string
  label: string
  region?: string
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'de-DE', label: 'Deutsch', region: 'Deutschland' },
  { code: 'en-GB', label: 'English', region: 'UK' },
  { code: 'en-US', label: 'English', region: 'US' },
  { code: 'es-ES', label: 'Español', region: 'España' },
  { code: 'es-419', label: 'Español', region: 'Latinoamérica' },
  { code: 'fr-FR', label: 'Français', region: 'France' },
  { code: 'it-IT', label: 'Italiano', region: 'Italia' },
  { code: 'pt-BR', label: 'Português', region: 'Brasil' },
  { code: 'ru', label: 'Русский' },
  { code: 'ko', label: '한국어' },
  { code: 'ja', label: '日本語' },
  { code: 'zh-TW', label: '繁體中文', region: '台灣' },
  { code: 'en-EN', label: 'English', region: 'EN' },
  { code: 'vi-VN', label: 'Tiếng Việt' },
]

/** Display text in picker: label + (region) when region is set */
export function getLanguagePickerDisplayText(option: LanguageOption): string {
  return option.region ? `${option.label} (${option.region})` : option.label
}

/** Label only, for Setting screen. Resolves app code (e.g. en-EN) to option label. */
export function getLanguageLabelForSetting(appLanguageCode: string): string {
  const code = appLanguageCode ?? 'en-EN'
  const option =
    LANGUAGE_OPTIONS.find((o) => o.code === code) ??
    LANGUAGE_OPTIONS.find((o) => toAppLanguage(o.code) === code)

  return option?.label ?? code
}

// Map picker codes to app-supported locale (store + i18n)
const toAppLanguage = (code: string): string => {
  if (code === 'en-GB' || code === 'en-US') return 'en-EN'

  return code
}

type LanguagePickerProps = {
  readonly currentLanguage: string | undefined
  readonly onDismiss: () => void
  readonly onSelect: (languageCode: string) => void
}

const DRAG_HANDLE = (
  <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
    <View
      style={{
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: neutral[300],
      }}
    />
  </View>
)

export const LanguagePicker = forwardRef<
  AppBottomSheetModalHandle,
  LanguagePickerProps
>(function LanguagePicker({ currentLanguage, onDismiss, onSelect }, ref) {
  const modalRef = useRef<BottomSheetModal>(null)
  const [query, setQuery] = useState('')

  const effectiveCurrent = useMemo(() => {
    if (!currentLanguage) return 'en-EN'

    if (currentLanguage === 'en-EN') return 'en-GB' // show English (UK) as selected when en-EN

    return currentLanguage
  }, [currentLanguage])

  const filtered = useMemo(() => {
    if (!query.trim()) return LANGUAGE_OPTIONS

    const q = query.toLowerCase()

    return LANGUAGE_OPTIONS.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.code.toLowerCase().includes(q) ||
        (o.region?.toLowerCase().includes(q) ?? false),
    )
  }, [query])

  const handleClose = useCallback(() => {
    onDismiss()
  }, [onDismiss])

  const handleSelect = useCallback(
    (code: string) => {
      onSelect(toAppLanguage(code))
      modalRef.current?.dismiss()
    },
    [onSelect],
  )

  const renderItem: ListRenderItem<LanguageOption> = useCallback(
    ({ item }) => {
      const isActive = effectiveCurrent === item.code

      return (
        <Pressable
          className='flex-row items-center justify-between py-4 px-1'
          onPress={() => handleSelect(item.code)}>
          <Text
            style={{
              fontFamily: fontFamily.primary,
              fontWeight: fontWeight.regular,
              fontSize: 15,
              color: isActive ? COLORS.brandPrimary : COLORS.neutralPrimary,
            }}>
            {getLanguagePickerDisplayText(item)}
          </Text>
          {isActive ? (
            <Check color={COLORS.brandPrimary} size={20} strokeWidth={2} />
          ) : null}
        </Pressable>
      )
    },
    [effectiveCurrent, handleSelect],
  )

  useImperativeHandle(
    ref,
    () => ({
      open: () => modalRef.current?.present(),
      close: () => modalRef.current?.dismiss(),
      isOpen: () => false,
    }),
    [],
  )

  const closeSheet = useCallback(() => {
    modalRef.current?.dismiss()
  }, [])

  const fixedHeader = useMemo(
    () => (
      <View className='px-4 pb-2'>
        <View
          className='mb-3 flex-row items-center justify-between'
          style={{
            height: 56,
            marginHorizontal: -16,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: neutral[200],
          }}>
          <Text className='text-h3-semibold text-neutral-900'>
            Select Language
          </Text>
          <Pressable onPress={closeSheet}>
            <Text className='text-button-medium text-primary-500'>Done</Text>
          </Pressable>
        </View>
        <View className='mb-2 flex-row items-center' style={{ gap: 8 }}>
          <View
            className='flex-1 flex-row items-center rounded-lg border border-neutral-200 bg-white px-3'
            style={{ height: 40 }}>
            <Search
              color={COLORS.iconSubtle}
              size={24}
              strokeWidth={2}
              style={{ marginRight: 8 }}
            />
            <TextInput
              className='flex-1 py-0'
              placeholder='Search'
              placeholderTextColor={COLORS.textTertiary}
              style={{
                fontFamily: fontFamily.primary,
                fontWeight: fontWeight.regular,
                fontSize: 15,
                color: COLORS.neutralPrimary,
                paddingVertical: 0,
              }}
              value={query}
              onChangeText={setQuery}
            />
          </View>
          <Pressable onPress={closeSheet}>
            <Text className='text-button-medium text-neutral-900'>Cancel</Text>
          </Pressable>
        </View>
      </View>
    ),
    [query, closeSheet],
  )

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior='close'
      />
    ),
    [],
  )

  const sheetHeight = Dimensions.get('window').height - SHEET_TOP_INSET_PX

  return (
    <BottomSheetModal
      ref={modalRef}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleComponent={() => DRAG_HANDLE}
      snapPoints={[sheetHeight]}
      style={{ marginTop: SHEET_TOP_INSET_PX }}
      onDismiss={handleClose}>
      {/* Fixed header (title + search); only list scrolls */}
      <View style={{ flex: 1 }}>
        {fixedHeader}
        <BottomSheetFlatList
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          data={filtered}
          keyExtractor={(item: LanguageOption) => item.code}
          keyboardShouldPersistTaps='handled'
          renderItem={renderItem}
          showsVerticalScrollIndicator={true}
          style={{ flex: 1 }}
        />
      </View>
    </BottomSheetModal>
  )
})
