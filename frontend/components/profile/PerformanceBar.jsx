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
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-[#3D52A0]" />}
          <span className="text-sm font-medium text-[#1a1a2e]">{label}</span>
        </div>
        <span className="text-sm font-bold text-[#3D52A0]">{value}%</span>
      </div>
      <div className="h-2 bg-[#EDE8F5] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-linear-to-r ${colors[color]} rounded-full`}
        />
      </div>
    </div>
  )
}
