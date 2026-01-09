"use client"

import { motion } from 'framer-motion'
import { Pencil } from 'lucide-react'

export default function SportsSection({ title, icon: Icon, children, onEdit, addButton, addLabel = "Add", compact }) {
  return (
    <div className={`bg-white rounded-3xl ${compact ? 'p-4' : 'p-6'} shadow-lg border border-[#EDE8F5] hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#1a1a2e]">{title}</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className={`${addButton ? 'px-4 py-2 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white flex items-center gap-2' : 'p-2 rounded-xl hover:bg-[#EDE8F5]'} transition-colors`}
        >
          {addButton ? (
            <span className="text-sm font-medium">{addLabel}</span>
          ) : (
            <Pencil className="w-4 h-4 text-[#8697C4]" />
          )}
        </motion.button>
      </div>
      {children}
    </div>
  )
}
