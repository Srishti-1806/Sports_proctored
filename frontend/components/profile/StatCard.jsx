"use client"

import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      transition={{ type: "spring", stiffness: 300 }}
      className={`w-22 h-22 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 p-1 rounded-xl sm:rounded-2xl bg-linear-to-br ${color} flex flex-col items-center justify-center shadow-md`}
    >
      <Icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
      <div className="text-lg md:text-2xl font-bold text-white">{value}</div>
      <div className="text-[10px] sm:text-xs text-white/80 uppercase tracking-wide text-center leading-tight">{label}</div>
    </motion.div>
  )
}
