"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function EditModal({ isOpen, onClose, title, children, onSave, sectionData }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[var(--color-card)] rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[var(--color-popover)] transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-muted-foreground,#8697C4)]" />
            </button>

            <h2 className="font-display text-xl font-bold text-[var(--color-foreground)] mb-4">{title}</h2>

            {children}

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSave(sectionData)}
                className="flex-1 py-3 rounded-xl bg-linear-to-r from-[var(--color-primary-deep)] to-[var(--color-primary-bright)] text-white font-semibold shadow-lg"
              >
                Save
              </motion.button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-muted-foreground,#8697C4)] font-medium hover:bg-[var(--color-popover)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
