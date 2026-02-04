'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'

export default function SportsLoader({ onComplete }) {
  const [visible, setVisible] = useState(true)
  const { resolvedTheme, systemTheme } = useTheme()

  useEffect(() => {
    // Keep loader visible briefly, then fade out
    const timer = setTimeout(() => {
      setVisible(false)
      // wait for exit animation to finish
      setTimeout(() => onComplete?.(), 400)
    }, 1800)

    return () => clearTimeout(timer)
  }, [onComplete])

  const theme = resolvedTheme || systemTheme || 'light'
  const isDark = theme === 'dark'

  const containerClass = `fixed inset-0 z-50 flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`
  const imgClass = "w-48 md:w-72 lg:w-96 xl:w-[28rem] h-auto"

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={containerClass}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <img src="/loader.gif" alt="Loading" className={imgClass} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
