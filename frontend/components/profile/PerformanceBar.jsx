"use client"

import { motion } from 'framer-motion'

export default function PerformanceBar({ label, value, icon: Icon, color }) {
  const colors = {
    blue: 'from-blue-500 to-cyan-400',
    red: 'from-red-500 to-pink-500',
    green: 'from-green-500 to-emerald-400',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-yellow-400'
  }
  // Allow passing either a preset key (e.g. 'blue') or a raw Tailwind gradient string
  const gradient = colors[color] || color || colors.blue
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary-bright" />}
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <span className="text-sm font-bold text-primary-bright">{value}%</span>
      </div>
      <div className="h-2 bg-primary-light rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-linear-to-r ${gradient} rounded-full`}
        />
      </div>
    </div>
  )
}
