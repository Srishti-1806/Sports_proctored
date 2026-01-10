"use client"

import { motion } from 'framer-motion'
import { Pencil } from 'lucide-react'

export default function SportsSection({ title, icon: Icon, children, onEdit, addButton, addLabel = "Add", compact }) {
  return (
    <div className={`bg-[var(--color-card)] rounded-3xl ${compact ? 'p-4' : 'p-6'} shadow-lg border border-[var(--color-border)] hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[var(--color-primary-deep)] to-[var(--color-primary-bright)] flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-display text-xl font-bold text-[var(--color-foreground)]">{title}</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className={`${addButton ? 'px-4 py-2 rounded-xl bg-linear-to-r from-[var(--color-primary-deep)] to-[var(--color-primary-bright)] text-white flex items-center gap-2' : 'p-2 rounded-xl hover:bg-[var(--color-primary-soft)] dark:hover:bg-[var(--color-popover)]'} transition-colors`}
        >
          {addButton ? (
            <span className="text-sm font-medium">{addLabel}</span>
          ) : (
            <Pencil className="w-4 h-4 text-[var(--color-muted-foreground,#8697C4)]" />
          )}
        </motion.button>
      </div>
      {children}
    </div>
  )
}
