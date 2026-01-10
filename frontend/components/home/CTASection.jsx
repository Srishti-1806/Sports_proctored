'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/context/AuthContext'

export default function CTASection({ onSignupClick, onLoginClick }) {
  const router = useRouter()
  const { user } = useAuth()

  const handleSignup = () => {
    if (user) {
      router.push('/profile')
    } else if (onSignupClick) {
      onSignupClick()
    }
  }

  const handleLogin = () => {
    if (user) {
      router.push('/profile')
    } else if (onLoginClick) {
      onLoginClick()
    }
  }

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-[var(--color-primary-deep)] to-[var(--color-primary-bright)]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative max-w-350 mx-auto text-center"
      >
        <h2 className="font-display text-6xl lg:text-8xl font-bold text-white mb-8">
          Build your network
        </h2>
        <p className="text-xl text-[var(--color-primary-light)] mb-12 max-w-2xl mx-auto">
          Join 25,000+ players and 1,200+ coaches connecting across India - every sport, every skill level.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignup}
            className="px-10 py-5 rounded-2xl bg-[var(--color-card)] text-[var(--color-primary)] font-bold text-lg shadow-2xl hover:shadow-3xl transition-shadow"
          >
            Get Started Free
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="px-10 py-5 rounded-2xl border-2 border-[var(--color-border)] text-white font-bold text-lg hover:bg-[var(--color-popover)]/10 transition-colors"
          >
            Sign In
          </motion.button>
        </div>
      </motion.div>
    </section>
  )
}
