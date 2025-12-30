"use client"

import { motion } from 'framer-motion'
import { Calendar, CheckCircle, Trophy, Bookmark } from 'lucide-react'

export default function StatsBar() {
  const stats = [
    { icon: Calendar, label: 'Total Events', value: '24' },
    { icon: CheckCircle, label: 'Registered', value: '3' },
    { icon: Trophy, label: 'Completed', value: '12' },
    { icon: Bookmark, label: 'Saved', value: '5' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EDE8F5] shadow-sm hover:shadow-md transition-shadow"
        >
          <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#7091E6] mb-2" />
          <p className="font-display text-xl sm:text-2xl font-bold text-[#1a1a2e]">{stat.value}</p>
          <p className="text-xs sm:text-sm text-[#8697C4] truncate">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  )
}
