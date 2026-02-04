'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check } from 'lucide-react'
import { useLanguage } from '../lib/context/LanguageContext'

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentLanguage, changeLanguage, languages } = useLanguage()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode)
    setIsOpen(false)
  }

  const currentLang = languages.find(lang => lang.code === currentLanguage)

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-soft dark:bg-popover text-primary dark:text-foreground hover:bg-primary-soft/80 dark:hover:bg-popover/80 transition-colors duration-300 border border-transparent hover:border-primary/20"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium text-sm hidden sm:inline">
          {currentLang?.nativeName || 'English'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-72 max-h-96 overflow-y-auto bg-card dark:bg-popover border border-sidebar-border rounded-xl shadow-2xl z-50"
          >
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Select Language
              </div>
              {languages.map((language) => {
                const isActive = currentLanguage === language.code
                return (
                  <motion.button
                    key={language.code}
                    whileHover={{ x: 4 }}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors duration-200 ${
                      isActive
                        ? 'bg-linear-to-r from-primary-deep to-primary-bright text-white'
                        : 'hover:bg-primary-soft dark:hover:bg-sidebar-accent text-foreground'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className={`font-medium text-sm ${isActive ? 'text-white' : ''}`}>
                        {language.nativeName}
                      </span>
                      <span className={`text-xs ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {language.name}
                      </span>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-white shrink-0" />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
