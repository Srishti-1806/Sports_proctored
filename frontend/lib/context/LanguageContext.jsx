'use client'

import { createContext, useContext, useState, useEffect } from 'react'

// Import all translations statically
import en from '../../i18n/en.json'
import hi from '../../i18n/hi.json'
import bn from '../../i18n/bn.json'
import te from '../../i18n/te.json'
import mr from '../../i18n/mr.json'
import ta from '../../i18n/ta.json'
import gu from '../../i18n/gu.json'
import ur from '../../i18n/ur.json'
import kn from '../../i18n/kn.json'
import or from '../../i18n/or.json'
import ml from '../../i18n/ml.json'
import pa from '../../i18n/pa.json'
import as from '../../i18n/as.json'
import mai from '../../i18n/mai.json'
import sat from '../../i18n/sat.json'
import ks from '../../i18n/ks.json'
import ne from '../../i18n/ne.json'
import sd from '../../i18n/sd.json'
import doi from '../../i18n/doi.json'
import kok from '../../i18n/kok.json'
import mni from '../../i18n/mni.json'
import brx from '../../i18n/brx.json'
import sa from '../../i18n/sa.json'

// Create translations map
const translations = {
  en, hi, bn, te, mr, ta, gu, ur, kn, or, ml, pa, as, mai, sat, ks, ne, sd, doi, kok, mni, brx, sa
}

const LanguageContext = createContext()

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर / كٲشُر' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي / सिन्धी' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी' },
  { code: 'mni', name: 'Manipuri', nativeName: 'ꯃꯩꯇꯩꯂꯣꯟ' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
]

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('sportlin-language')
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode)
    localStorage.setItem('sportlin-language', languageCode)
  }

  const t = (key) => {
    try {
      const keys = key.split('.')

      // Try current language first
      const languageData = translations[currentLanguage] || translations.en
      let value = languageData
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          value = undefined
          break
        }
      }

      // If found in current language, return it
      if (value !== undefined && value !== null) return value

      // Fallback: try English translations for missing keys
      let fallback = translations.en
      for (const k of keys) {
        if (fallback && typeof fallback === 'object' && k in fallback) {
          fallback = fallback[k]
        } else {
          fallback = undefined
          break
        }
      }

      return fallback || key
    } catch (error) {
      console.error('Translation error:', error)
      return key
    }
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
