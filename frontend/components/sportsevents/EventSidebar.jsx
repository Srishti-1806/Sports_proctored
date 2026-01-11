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
        className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-lg"
      >
        <h3 className="font-display font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
          <Filter className="w-4 h-4 text-primary-bright" />
          Filter Events
        </h3>
        <div className="space-y-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-colors duration-150 text-sm sm:text-base ${
                      activeFilter === filter.id
                        ? 'bg-linear-to-r from-primary-deep to-primary-bright text-primary-soft border border-primary-bright'
                        : 'text-primary-muted border border-transparent hover:bg-primary-soft hover:text-foreground hover:border-primary-bright dark:bg-transparent dark:text-popover-foreground dark:hover:bg-popover dark:hover:text-foreground dark:hover:border-primary-bright'
                  }`}
                >
                  <filter.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 group-hover:text-foreground dark:group-hover:text-foreground" />
                  <span className="font-medium truncate group-hover:text-foreground dark:group-hover:text-foreground">{filter.label}</span>
                </button>
              ))}
        </div>
      </motion.div>

      {/* Sport Categories */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 sm:p-5 rounded-2xl bg-card border border-border"
      >
        <h3 className="font-display font-bold text-foreground mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
          <Tag className="w-4 h-4 text-primary-bright" />
          Sports
        </h3>
        <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSport('all')}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 ease-in-out text-xs sm:text-sm font-medium ${
                  activeSport === 'all'
                    ? 'bg-linear-to-r from-primary-deep to-primary-bright text-primary-soft shadow-md border border-primary-bright'
                    : 'bg-primary-soft text-primary border border-transparent hover:bg-primary-deep hover:text-primary-soft hover:border-primary-bright hover:shadow-md dark:bg-transparent dark:text-popover-foreground dark:hover:bg-primary-deep/60 dark:hover:text-foreground dark:hover:border-primary-bright'
                }`}
              >
                <span className="whitespace-nowrap">All Sports</span>
              </button>
          {sportCategories.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setActiveSport(sport.label)}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors duration-200 ease-in-out text-xs sm:text-sm font-medium whitespace-nowrap ${
                    activeSport === sport.label
                      ? 'bg-linear-to-r from-primary-deep to-primary-bright text-primary-soft shadow-md border border-primary-bright'
                      : 'bg-primary-soft text-primary border border-transparent hover:bg-primary-deep hover:text-primary-soft hover:border-primary-bright hover:shadow-md dark:bg-transparent dark:text-popover-foreground dark:hover:bg-primary-deep/60 dark:hover:text-foreground dark:hover:border-primary-bright'
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
