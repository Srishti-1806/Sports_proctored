'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  User, 
  Users, 
  Bell, 
  MapPin, 
  MessageCircle, 
  Menu, 
  X,
  Trophy,
  Zap,
  LogOut
} from 'lucide-react'
import { useAuth } from '../lib/context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/coaches', label: 'Coaches', icon: Users },
    { href: '/players', label: 'Players', icon: User },
    { href: '/sportsevents', label: 'Events', icon: Bell },
    { href: '/stadiums', label: 'Venues', icon: MapPin },
    { href: '/chat', label: 'AI Coach', icon: MessageCircle },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-10 h-10 rounded-xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center"
            >
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">
              ATHLETIX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors duration-300 relative group"
                >
                  <link.icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-[#3D52A0] to-[#7091E6] group-hover:w-full transition-all duration-300 ease-out"></span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* CTA Button or User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/profile">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EDE8F5] hover:bg-[#E8E6F8] cursor-pointer">
                    <User className="w-4 h-4 text-[#3D52A0]" />
                    <span className="font-medium text-sm text-[#3D52A0]">
                      {user.user_metadata?.first_name || user.email}
                    </span>
                  </div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold text-sm shadow-lg shadow-[#7091E6]/30 hover:shadow-xl hover:shadow-[#7091E6]/40 transition-shadow duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </motion.button>
              </>
            ) : (
              <Link href="/?signup=true">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold text-sm shadow-lg shadow-[#7091E6]/30 hover:shadow-xl hover:shadow-[#7091E6]/40 transition-shadow duration-300"
                >
                  <Zap className="w-4 h-4" />
                  Get Started
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-[#EDE8F5] text-[#3D52A0]"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white/90 backdrop-blur-xl border-t border-[#ADBBDA]/30"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#3D52A0] hover:bg-[#EDE8F5] transition-colors"
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </motion.div>
                </Link>
              ))}
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    <div className="px-4 py-3 mt-4 rounded-xl bg-[#EDE8F5] hover:bg-[#E8E6F8]">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-[#3D52A0]" />
                        <span className="font-medium text-[#3D52A0]">
                          {user.user_metadata?.first_name || user.email}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold shadow-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </motion.button>
                </>
              ) : (
                <Link href="/?signup=true">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 mt-4 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold shadow-lg"
                  >
                    <Zap className="w-4 h-4" />
                    Get Started
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

