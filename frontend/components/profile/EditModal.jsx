"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function EditModal({ isOpen, onClose, title, children, onSave, sectionData }) {
  const { t } = useLanguage()
  
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
            className="relative w-full max-w-lg bg-card rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-popover transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <h2 className="font-display text-xl font-bold text-foreground mb-4">{title}</h2>

            {children}

            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSave(sectionData)}
                className="flex-1 py-3 rounded-xl bg-linear-to-r from-primary-deep to-primary-bright text-white font-semibold shadow-lg"
              >
                {t('profile.save')}
              </motion.button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-border text-muted-foreground font-medium hover:bg-popover transition-colors"
              >
                {t('profile.cancel')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
