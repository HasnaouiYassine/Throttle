import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

const applyDocumentAttrs = (lng) => {
  document.documentElement.lang = lng
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
}

let initialLng = 'en'
try {
  initialLng = localStorage.getItem('throttle-lang') || 'en'
} catch {
  initialLng = 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: initialLng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

applyDocumentAttrs(i18n.language?.split('-')[0] || 'en')

export const setLanguage = (lng) => {
  i18n.changeLanguage(lng)
  try {
    localStorage.setItem('throttle-lang', lng)
  } catch {
    // storage unavailable — language still applies for this session
  }
  applyDocumentAttrs(lng)
}

export default i18n
