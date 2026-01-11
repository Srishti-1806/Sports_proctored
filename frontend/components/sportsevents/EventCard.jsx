"use client"

import { motion } from 'framer-motion'
import { MapPin, Users, CheckCircle, Bookmark, ChevronRight } from 'lucide-react'

export default function EventCard({ event, index, onClick }) {
  // derive a date object (prefer ISO/raw if available)
  const dateSource = event.raw?.start_date || event.raw?.date_start || event.raw?.date || event.date
  const dateObj = dateSource ? new Date(dateSource) : new Date()
  const day = isNaN(dateObj) ? '' : dateObj.getDate()
  const month = isNaN(dateObj) ? '' : dateObj.toLocaleString('en-US', { month: 'short' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="p-4 sm:p-6 rounded-2xl bg-card border border-border hover:shadow-xl hover:border-primary-bright transition-all cursor-pointer group"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        {/* Date Badge */}
        <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary flex flex-col items-center justify-center text-white mr-3 dark:bg-primary-deep dark:text-white mb-3 sm:mb-0">
          <span className="text-xs sm:text-sm font-medium opacity-90">
            {day}
          </span>
          <span className="text-sm sm:text-base font-bold">
            {month}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 max-w-full">
                {event.isNew && (
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-[10px] sm:text-xs font-medium dark:bg-green-900 dark:text-green-200">
                    New
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full bg-primary-soft text-primary text-[10px] sm:text-xs font-medium dark:bg-white/6 dark:text-white dark:border dark:border-white/10`}>
                  {event.sport || event.raw?.sport}
                </span>
                {((event.type || event.raw?.type || event.raw?.category)) && (
                  <span className="px-2 py-0.5 rounded-full bg-primary-soft text-primary text-[10px] sm:text-xs font-medium dark:bg-white/6 dark:text-white dark:border dark:border-white/10">
                    {event.type || event.raw?.type || event.raw?.category}
                  </span>
                )}
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {event.title || event.raw?.event_name}
              </h3>
            </div>
            <div className="flex items-center gap-2 self-start">
              {event.isRegistered && (
                <span className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-green-100 text-green-600 text-[10px] sm:text-xs font-medium whitespace-nowrap dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="w-3 h-3" /> Registered
                </span>
              )}
              {event.isSaved && (
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-primary-bright fill-primary-bright shrink-0" />
              )}
            </div>
          </div>

          <p className="text-primary-muted text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
            {event.description || event.raw?.details}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-primary-muted">
            
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> 
              <span className="truncate">{event.location || [event.raw?.venue, event.raw?.location].filter(Boolean).join(', ')}</span>
            </span>

                {((event.raw?.teams_or_participants) || (event.raw?.teams)) && (
                  <span className="flex items-center gap-1 truncate max-w-full">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> <span className="truncate">{event.raw?.teams_or_participants || event.raw?.teams}</span>
                  </span>
                )}

                {((event.raw?.prize_money) || event.fee) && (
              <span className="flex items-center gap-1 font-medium text-primary truncate max-w-full">
                <span className="truncate">{event.fee || `${event.raw?.prize_money || ''}${event.raw?.prize_currency ? ' ' + event.raw.prize_currency : ''}`}</span>
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-primary-light group-hover:text-primary-bright group-hover:translate-x-1 transition-all shrink-0 self-center" />
      </div>
    </motion.div>
  )
}
