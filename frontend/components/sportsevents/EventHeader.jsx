"use client"

import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export default function EventHeader({ searchQuery, setSearchQuery }) {
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
              Sports Events
            </h1>
            <p className="text-sm sm:text-base text-primary-light">
              Discover and register for upcoming sports events near you
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:max-w-md lg:max-w-lg mx-auto md:mx-0">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-popover-foreground z-1" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl bg-popover/10 backdrop-blur-sm border border-border/20 text-popover-foreground placeholder-popover-foreground/50 focus:bg-popover/20 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all text-sm sm:text-base"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
