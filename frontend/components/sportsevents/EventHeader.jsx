"use client"

import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function EventHeader({ searchQuery, setSearchQuery, onOpenFilters }) {
  const { t } = useLanguage()
  
  return (
    <div className="bg-linear-to-r from-primary-deep to-primary-bright pt-6 sm:pt-8 pb-16 sm:pb-20 md:pb-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:gap-5 md:gap-6"
        >
          <div className="text-center md:text-left">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              {t('events.title')}
            </h1>
            <p className="text-sm sm:text-base text-primary-light">
              {t('events.subtitle')}
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 w-full md:max-w-md lg:max-w-lg mx-auto md:mx-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white z-10" />
              <input
                type="text"
                placeholder={t('events.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-12 py-2.5 sm:py-3 rounded-xl bg-popover/10 backdrop-blur-sm border border-border/20 text-popover-foreground placeholder-white/50 focus:bg-popover/20 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all text-sm sm:text-base"
              />
            </div>

            {/* Mobile filters button (visible on small/medium, hidden on lg+) */}
            {onOpenFilters && (
              <button
                onClick={onOpenFilters}
                className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white z-50 flex items-center justify-center"
                aria-label="Open filters"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 6H2"/><path d="M17 12H7"/><path d="M13 18H11"/></svg>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
