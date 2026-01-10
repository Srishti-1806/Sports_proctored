"use client"

import { motion } from 'framer-motion'
import { Clock, MapPin, Users, CheckCircle, Bookmark, ChevronRight } from 'lucide-react'

export default function EventCard({ event, index, onClick }) {
  // derive a date object (prefer ISO/raw if available)
  const dateSource = event.raw?.date_start || event.raw?.date || event.date
  const dateObj = dateSource ? new Date(dateSource) : new Date()
  const day = isNaN(dateObj) ? '' : dateObj.getDate()
  const month = isNaN(dateObj) ? '' : dateObj.toLocaleString('en-US', { month: 'short' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="p-4 sm:p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:shadow-xl hover:border-[var(--color-primary-bright)] transition-all cursor-pointer group"
    >
      <div className="flex flex-row sm:items-start gap-3 sm:gap-4">
        {/* Date Badge */}
        <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[var(--color-primary)] flex flex-col items-center justify-center text-white mx-auto sm:mx-0">
          <span className="text-xs sm:text-sm font-medium opacity-90">
            {day}
          </span>
          <span className="text-sm sm:text-base font-bold">
            {month}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                {event.isNew && (
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-[10px] sm:text-xs font-medium">
                    New
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-[10px] sm:text-xs font-medium`}>
                  {event.sport}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-[10px] sm:text-xs font-medium">
                  {event.type}
                </span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                {event.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 self-start">
              {event.isRegistered && (
                <span className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full bg-green-100 text-green-600 text-[10px] sm:text-xs font-medium whitespace-nowrap">
                  <CheckCircle className="w-3 h-3" /> Registered
                </span>
              )}
              {event.isSaved && (
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary-bright)] fill-[var(--color-primary-bright)] shrink-0" />
              )}
            </div>
          </div>

          <p className="text-[var(--color-primary-muted)] text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[var(--color-primary-muted)]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> 
              <span className="truncate">{event.time}</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> 
              <span className="truncate">{event.location}</span>
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> {event.participants}/{event.maxParticipants}
            </span>
            <span className="flex items-center gap-1 font-medium text-[var(--color-primary)] whitespace-nowrap">
              {event.fee}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="hidden sm:block w-5 h-5 text-[var(--color-primary-light)] group-hover:text-[var(--color-primary-bright)] group-hover:translate-x-1 transition-all shrink-0 self-center" />
      </div>
    </motion.div>
  )
}
