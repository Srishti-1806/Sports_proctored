"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X, CalendarDays, Clock, MapPin, Users, Trophy, Target, Medal, CheckCircle, ArrowRight, Bookmark, Share2, ExternalLink } from 'lucide-react'

export default function EventDetailModal({ event, onClose }) {
  if (!event) return null

  const prizes = Array.isArray(event.prizes) ? event.prizes : [];
  const requirements = Array.isArray(event.requirements) ? event.requirements : [];
  const participants = Number.isFinite(Number(event.participants)) ? Number(event.participants) : 0;
  const maxParticipants = Number.isFinite(Number(event.maxParticipants)) && Number(event.maxParticipants) > 0 ? Number(event.maxParticipants) : Math.max(1, participants);
  const sportColor = event.sportColor || 'bg-gray-500';

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
          className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="shrink-0 p-4 sm:p-6 bg-linear-to-r from-[#3D52A0] to-[#7091E6] rounded-t-2xl sm:rounded-t-3xl">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span className={`px-2.5 sm:px-3 py-1 rounded-full ${sportColor} text-white text-xs sm:text-sm font-medium`}>
                {event.sport || 'Sport'}
              </span>
              <span className="px-2.5 sm:px-3 py-1 rounded-full bg-white/20 text-white text-xs sm:text-sm font-medium">
                {event.type}
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white pr-8">{event.title}</h2>
            <p className="text-white/80 mt-1 sm:mt-2 text-sm sm:text-base">{event.organizer}</p>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#ADBBDA] scrollbar-track-transparent hover:scrollbar-thumb-[#7091E6] scrollbar-thumb-rounded-full">
            {/* Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-xl bg-[#EDE8F5]">
                <div className="flex items-center gap-2 text-[#3D52A0] mb-1">
                  <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Date</span>
                </div>
                <p className="font-semibold text-[#1a1a2e] text-sm sm:text-base">{event.date}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#EDE8F5]">
                <div className="flex items-center gap-2 text-[#3D52A0] mb-1">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Time</span>
                </div>
                <p className="font-semibold text-[#1a1a2e] text-sm sm:text-base">{event.time}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#EDE8F5] sm:col-span-2">
                <div className="flex items-center gap-2 text-[#3D52A0] mb-1">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Location</span>
                </div>
                <p className="font-semibold text-[#1a1a2e] text-sm sm:text-base">{event.location}</p>
                <p className="text-xs sm:text-sm text-[#8697C4]">{event.address}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-[#EDE8F5] sm:col-span-2">
                <div className="flex items-center gap-2 text-[#3D52A0] mb-1">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">Participants</span>
                </div>
                <p className="font-semibold text-[#1a1a2e] text-sm sm:text-base">
                  {participants}/{maxParticipants}
                </p>
                <div className="mt-2 h-2 rounded-full bg-[#ADBBDA] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#3D52A0] to-[#7091E6]"
                    style={{ width: `${Math.min(100, Math.max(0, (participants / maxParticipants) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-display font-bold text-[#1a1a2e] mb-2 text-sm sm:text-base">About This Event</h3>
              <p className="text-[#8697C4] leading-relaxed text-xs sm:text-sm">{event.description}</p>
            </div>

            {/* Prizes */}
            <div>
              <h3 className="font-display font-bold text-[#1a1a2e] mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#7091E6]" />
                Prizes & Rewards
              </h3>
              <div className="flex flex-wrap gap-2">
                {prizes.map((prize, index) => (
                  <span 
                    key={index}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-linear-to-r from-yellow-100 to-orange-100 text-orange-700 font-medium text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
                  >
                    <Medal className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> 
                    <span className="truncate">{prize}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="font-display font-bold text-[#1a1a2e] mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#7091E6]" />
                Requirements
              </h3>
              <div className="flex flex-wrap gap-2">
                {requirements.map((req, index) => (
                  <span 
                    key={index}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#EDE8F5] text-[#3D52A0] font-medium text-xs sm:text-sm whitespace-nowrap"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Fee */}
            <div className="p-3 sm:p-4 rounded-xl bg-linear-to-r from-[#EDE8F5] to-[#ADBBDA]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[#8697C4] text-xs sm:text-sm">Registration Fee</span>
                <p className="font-display text-xl sm:text-2xl font-bold text-[#3D52A0]">{event.fee}</p>
              </div>
              {event.isRegistered ? (
                <span className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-xl bg-green-500 text-white font-semibold text-sm sm:text-base whitespace-nowrap">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Registered
                </span>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold shadow-lg text-sm sm:text-base whitespace-nowrap"
                >
                  Register Now <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </motion.button>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-[#ADBBDA] text-[#3D52A0] font-medium hover:bg-[#EDE8F5] transition-colors text-xs sm:text-sm">
                <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${event.isSaved ? 'fill-[#3D52A0]' : ''}`} />
                <span className="hidden sm:inline">{event.isSaved ? 'Saved' : 'Save'}</span>
              </button>
              <button className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-[#ADBBDA] text-[#3D52A0] font-medium hover:bg-[#EDE8F5] transition-colors text-xs sm:text-sm">
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-[#ADBBDA] text-[#3D52A0] font-medium hover:bg-[#EDE8F5] transition-colors text-xs sm:text-sm">
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Website</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
