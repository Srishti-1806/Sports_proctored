"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X, CalendarDays, MapPin, Users, Trophy, Medal, CheckCircle, ArrowRight, Bookmark, Share2 } from 'lucide-react'
import { useToast } from '@/components/ToastProvider'

export default function EventDetailModal({ event, onClose, onToggleSave }) {
  if (!event) return null

  const toast = useToast()

  const handleShare = async () => {
    try {
      const shareUrl = new URL(window.location.href)
      shareUrl.searchParams.set('event', event.id)
      const urlStr = shareUrl.toString()

      if (navigator.share) {
        await navigator.share({ title: event.title, text: event.description || '', url: urlStr })
        toast?.show('Shared')
        return
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(urlStr)
        toast?.show('Link copied to clipboard')
        return
      }

      // fallback copy
      const textarea = document.createElement('textarea')
      textarea.value = urlStr
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
      toast?.show('Link copied to clipboard')
    } catch (err) {
      console.error('Share failed', err)
      toast?.show('Could not share')
    }
  }

  const prizes = Array.isArray(event.prizes) ? event.prizes : (event.raw?.prizes ? event.raw.prizes : []);
  const requirements = Array.isArray(event.requirements) ? event.requirements : (event.raw?.requirements ? event.raw.requirements : []);
  // derive participant info: prefer numeric when available, otherwise fall back to descriptive string
  const participantsRaw = event.participants ?? event.raw?.participants ?? event.raw?.teams_or_participants ?? event.raw?.teams
  const participants = Number.isFinite(Number(participantsRaw)) ? Number(participantsRaw) : null;
  const maxParticipantsRaw = event.maxParticipants ?? event.raw?.maxParticipants
  const maxParticipants = Number.isFinite(Number(maxParticipantsRaw)) && Number(maxParticipantsRaw) > 0 ? Number(maxParticipantsRaw) : (participants ? Math.max(1, participants) : null);
  const participantsText = participants !== null ? `${participants}` : (typeof participantsRaw === 'string' ? participantsRaw : '—')
  const sportColor = event.sportColor || 'bg-gray-500';

  // prize / fee text
  const prizeText = event.fee || (event.raw?.prize_money ? `${event.raw.prize_money}${event.raw.prize_currency ? ' ' + event.raw.prize_currency : ''}` : (event.raw?.total_matches_or_events || ''))

  // date range
  const startDate = event.date || event.raw?.start_date
  const endDate = event.raw?.end_date
  const dateDisplay = startDate ? (endDate ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}` : new Date(startDate).toLocaleDateString()) : 'TBD'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
          <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-full sm:max-w-2xl h-full sm:h-auto bg-card rounded-2xl shadow-2xl sm:max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="shrink-0 p-4 sm:p-6 bg-linear-to-r from-primary-deep to-primary-bright relative rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-xl bg-popover/10 hover:bg-popover/20 transition-colors text-popover-foreground z-30"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Desktop header actions removed — actions shown in sticky footer for consistency */}

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span className={`px-2.5 sm:px-3 py-1 rounded-full ${sportColor} text-white text-xs sm:text-sm font-medium`}>
                {event.sport || 'Sport'}
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white pr-8">{event.title}</h2>
            <p className="text-white/80 mt-1 sm:mt-2 text-sm sm:text-base">{event.organizer}</p>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-light scrollbar-track-transparent hover:scrollbar-thumb-primary-bright scrollbar-thumb-rounded-full" style={{ paddingBottom: 112 }}>
            {/* Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-xl bg-primary-soft dark:bg-popover/10">
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">Date</span>
                  </div>
                  <p className="font-semibold text-foreground text-sm sm:text-base">{dateDisplay}</p>
              </div>
              {/* Time removed per design change */}
              <div className="p-3 sm:p-4 rounded-xl bg-primary-soft dark:bg-popover/10 sm:col-span-2">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Location</span>
                </div>
                  <p className="font-semibold text-foreground text-sm sm:text-base">{event.location || [event.raw?.venue, event.raw?.location].filter(Boolean).join(', ')}</p>
                  <p className="text-xs sm:text-sm text-primary-muted">{event.address || event.raw?.venue || ''}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-primary-soft dark:bg-popover/10 sm:col-span-2">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Participants</span>
                </div>
                  <p className="font-semibold text-foreground text-sm sm:text-base">
                    {participants !== null ? `${participants}/${maxParticipants ?? '—'}` : participantsText}
                  </p>
                  {participants !== null && maxParticipants !== null && (
                    <div className="mt-2 h-2 rounded-full bg-primary-light overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-primary-deep to-primary-bright"
                        style={{ width: `${Math.min(100, Math.max(0, (participants / maxParticipants) * 100))}%` }}
                      />
                    </div>
                  )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-display font-bold text-foreground mb-2 text-sm sm:text-base">About This Event</h3>
              <p className="text-primary-muted leading-relaxed text-xs sm:text-sm">{event.description}</p>
            </div>

            {/* Prizes */}
            <div>
              <h3 className="font-display font-bold text-foreground mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-primary-bright" />
                Prizes & Rewards
              </h3>
              <div className="flex flex-wrap gap-2">
                {prizes.length > 0 ? prizes.map((prize, index) => (
                  <span 
                    key={index}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-linear-to-r from-yellow-100 to-orange-100 text-orange-700 font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
                  >
                    <Medal className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> 
                    <span className="truncate">{prize}</span>
                  </span>
                )) : (
                  (prizeText) ? (
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-linear-to-r from-yellow-100 to-orange-100 text-orange-700 font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                      <Medal className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span className="truncate">{prizeText}</span>
                    </span>
                  ) : (
                    <span className="text-primary-muted text-sm">No prize information available</span>
                  )
                )}
              </div>
            </div>
            
          </div>

          {/* Bottom actions - sticky on small screens */}
          <div className="sticky bottom-0 left-0 right-0 z-20 p-3 bg-card border-t border-border">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onToggleSave && onToggleSave(event.id)}
                className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-border text-primary font-medium hover:bg-primary-soft dark:hover:bg-popover transition-colors text-sm"
              >
                <Bookmark className={`w-4 h-4 ${event.isSaved ? 'fill-primary' : ''}`} />
                <span>{event.isSaved ? 'Saved' : 'Save'}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-border text-primary font-medium hover:bg-primary-soft dark:hover:bg-popover transition-colors text-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
