'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  LogOut,
  LogIn
} from 'lucide-react'
import { useAuth } from '../lib/context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
      router.push('/') // Redirect to home page
    } catch (err) {
      console.error('Sign out error:', err)
    } finally {
      setIsSigningOut(false)
      setIsOpen(false)
    }
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
              Sportlin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-colors duration-300 relative ${isActive ? 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white' : 'text-[#3D52A0]'}`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{link.label}</span>
                    {!isActive && (
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-[#3D52A0] to-[#7091E6] group-hover:w-full transition-all duration-300 ease-out"></span>
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* CTA Button or User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {(() => {
                  const isProfileActive = pathname === '/profile'
                  return (
                    <Link href="/profile">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-colors duration-300 relative ${isProfileActive ? 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white' : 'bg-[#EDE8F5] hover:bg-[#E8E6F8] text-[#3D52A0]'}`} aria-current={isProfileActive ? 'page' : undefined}>
                        <User className={`w-4 h-4 ${isProfileActive ? 'text-white' : 'text-[#3D52A0]'}`} />
                        <span className={`font-medium text-sm ${isProfileActive ? '' : 'text-[#3D52A0]'}`}>
                          {user.user_metadata?.first_name || user.email}
                        </span>
                        {!isProfileActive && (
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-[#3D52A0] to-[#7091E6] group-hover:w-full transition-all duration-300 ease-out"></span>
                        )}
                      </div>
                    </Link>
                  )
                })()}
                <motion.button
                  whileHover={{ scale: isSigningOut ? 1 : 1.05 }}
                  whileTap={{ scale: isSigningOut ? 1 : 0.95 }}
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold text-sm shadow-lg shadow-[#7091E6]/30 transition-shadow duration-300 ${isSigningOut ? 'opacity-80 pointer-events-none' : 'hover:shadow-xl hover:shadow-[#7091E6]/40'}`}
                >
                  {isSigningOut ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </>
                  )}
                </motion.button>
              </>
            ) : (
              <>
                <Link href="/?redirected=true">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border-2 border-[#3D52A0] text-[#3D52A0] font-semibold text-sm hover:bg-[#EDE8F5] transition-colors duration-300"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </motion.button>
                </Link>
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
              </>
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
            animate={{ opacity: 1, height: '100dvh' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white/10 border-t border-[#ADBBDA]/30"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white'
                          : 'text-[#3D52A0] hover:bg-[#EDE8F5]'
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </motion.div>
                  </Link>
                )
              })}
              {user && (
                <div className="border-t border-[#ADBBDA]/30 my-3" />
              )}
              {user ? (
                <>
                  {(() => {
                    const isProfileActive = pathname === '/profile'
                    return (
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <div className={`w-full flex items-center gap-3 px-5 py-3 mt-4 rounded-xl ${isProfileActive ? 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white' : 'bg-[#EDE8F5] hover:bg-[#E8E6F8] text-[#3D52A0]'}`} aria-current={isProfileActive ? 'page' : undefined}>
                          <User className={`w-5 h-5 ${isProfileActive ? 'text-white' : 'text-[#3D52A0]'}`} />
                          <div className="flex-1 text-left">
                            <span className={`font-medium ${isProfileActive ? '' : 'text-[#3D52A0]'}`}>
                              {user.user_metadata?.first_name || user.email}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })()}
                  <motion.button
                    whileTap={{ scale: isSigningOut ? 1 : 0.98 }}
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3 mt-3 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold shadow-lg ${isSigningOut ? 'opacity-80 pointer-events-none' : ''}`}
                  >
                    {isSigningOut ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </>
                    )}
                  </motion.button>
                </>
              ) : (
                <>
                  <Link href="/?redirected=true">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 mt-4 rounded-xl bg-white border-2 border-[#3D52A0] text-[#3D52A0] font-semibold"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </motion.button>
                  </Link>
                  <Link href="/?signup=true">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 mt-2 px-5 py-3 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold shadow-lg"
                    >
                      <Zap className="w-4 h-4" />
                      Get Started
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

