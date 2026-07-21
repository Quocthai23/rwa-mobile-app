import { useEffect } from 'react'

import { useAppStore } from '@/store/useAppStore'
import i18n from '@/translations'

export const useLanguageInit = () => {
  const language = useAppStore((s) => s.language)

  useEffect(() => {
    if (language) {
      // Set i18n language to match stored preference
      // For Vietnamese, set to 'vi-VN' so translation service will translate to 'vi'
      if (language === 'vi-VN') {
        void i18n.changeLanguage('vi-VN')
      } else {
        void i18n.changeLanguage(language)
      }
    }
  }, [language])
}
