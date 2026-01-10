"use client"

import { motion } from 'framer-motion'
import { Filter, Tag } from 'lucide-react'

export default function EventSidebar({ 
  filters, 
  activeFilter, 
  setActiveFilter,
  sportCategories,
  activeSport,
  setActiveSport
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-4 sm:p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-lg"
      >
        <h3 className="font-display font-bold text-[var(--color-foreground)] mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
          <Filter className="w-4 h-4 text-[var(--color-primary-bright)]" />
          Filter Events
        </h3>
        <div className="space-y-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all text-sm sm:text-base ${
                  activeFilter === filter.id
                    ? 'bg-linear-to-r from-[var(--color-primary-deep)] to-[var(--color-primary-bright)] text-white'
                    : 'hover:bg-[var(--color-primary-soft)] text-[var(--color-primary-muted)]'
              }`}
            >
              <filter.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="font-medium truncate">{filter.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Sport Categories */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 sm:p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)]"
      >
        <h3 className="font-display font-bold text-[var(--color-foreground)] mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
          <Tag className="w-4 h-4 text-[var(--color-primary-bright)]" />
          Sports
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSport('all')}
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium ${
              activeSport === 'all'
                ? 'bg-linear-to-r from-[var(--color-primary-deep)] to-[var(--color-primary-bright)] text-white'
                : 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
            }`}
          >
            <span className="whitespace-nowrap">All Sports</span>
          </button>
          {sportCategories.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setActiveSport(sport.label)}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium whitespace-nowrap ${
                activeSport === sport.label
                  ? 'bg-linear-to-r from-[var(--color-primary-deep)] to-[var(--color-primary-bright)] text-white'
                  : 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
              }`}
            >
              {sport.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
