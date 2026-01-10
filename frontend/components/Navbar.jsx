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
import ThemeToggle from './ThemeToggle'
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
      <div className=" px-2 sm:px-4 lg:px-6">
        <div className="hidden lg:grid grid-cols-[30%_45%_25%] items-center h-16 relative w-full">
          <div className="col-start-1 flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-deep to-primary-bright flex items-center justify-center"
              >
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">
                Sportlin
              </span>
            </Link>
          </div>

          <div className="col-start-2 flex items-center justify-center gap-1">
            {/* Desktop Navigation (centered) */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group flex items-center gap-0.5 px-3 py-2 rounded-xl transition-colors duration-300 relative ${isActive ? 'bg-linear-to-r from-primary-deep to-primary-bright text-white' : 'text-primary'}`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{link.label}</span>
                    {!isActive && (
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-primary-deep to-primary-bright group-hover:w-full transition-all duration-300 ease-out"></span>
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>

          <div className="col-start-3 flex items-center justify-end gap-3">
            {/* CTA Button or User Menu (right) */}
            <ThemeToggle />
            {user ? (
              <>
                {(() => {
                  const isProfileActive = pathname === '/profile'
                  return (
                    <Link href="/profile">
                      <div className={`group flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-colors duration-300 relative ${isProfileActive ? 'bg-linear-to-r from-primary-deep to-primary-bright text-white' : 'bg-card hover:bg-primary-soft dark:hover:bg-popover text-foreground'}`} aria-current={isProfileActive ? 'page' : undefined}>
                          <User className={`w-4 h-4 ${isProfileActive ? 'text-white' : 'text-foreground'}`} />
                          <span className={`font-medium text-sm ${isProfileActive ? '' : 'text-foreground'}`}>
                          {user.user_metadata?.first_name || user.email}
                        </span>
                        {!isProfileActive && (
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-primary-deep to-primary-bright group-hover:w-full transition-all duration-300 ease-out"></span>
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
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-primary-deep to-primary-bright text-white font-semibold text-sm shadow-lg transition-shadow duration-300 ${isSigningOut ? 'opacity-80 pointer-events-none' : 'hover:shadow-xl'}`}
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border-2 border-primary text-primary font-semibold text-sm hover:bg-primary-soft transition-colors duration-300"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/?signup=true">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-primary-deep to-primary-bright text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <Zap className="w-4 h-4" />
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>

        </div>

        {/* Mobile Header: logo left, controls right */}
        <div className="flex md:hidden items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-deep to-primary-bright flex items-center justify-center"
            >
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">
              Sportlin
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl bg-primary-soft text-primary"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100dvh' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-popover/10 border-t border-sidebar-border"
          >
            <div className="px-4 py-4 space-y-2">
              <div className="flex items-center justify-end">
                <ThemeToggle />
              </div>
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive
                          ? 'bg-linear-to-r from-primary-deep to-primary-bright text-white'
                          : 'text-primary hover:bg-primary-soft'
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </motion.div>
                  </Link>
                )
              })}
              {user && (
                <div className="border-t border-sidebar-border my-3" />
              )}
              {user ? (
                <>
                  {(() => {
                    const isProfileActive = pathname === '/profile'
                    return (
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <div className={`w-full group flex items-center gap-3 px-5 py-3 mt-4 rounded-xl ${isProfileActive ? 'bg-linear-to-r from-primary-deep to-primary-bright text-white' : 'bg-card hover:bg-primary-soft dark:hover:bg-popover text-foreground'}`} aria-current={isProfileActive ? 'page' : undefined}>
                          <User className={`w-5 h-5 ${isProfileActive ? 'text-white' : 'text-foreground'}`} />
                          <div className="flex-1 text-left">
                            <span className={`font-medium ${isProfileActive ? '' : 'text-foreground'}`}>
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
                    className={`w-full flex items-center justify-center gap-2 px-5 py-3 mt-3 rounded-xl bg-linear-to-r from-primary-deep to-primary-bright text-white font-semibold shadow-lg ${isSigningOut ? 'opacity-80 pointer-events-none' : ''}`}
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
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 mt-4 rounded-xl bg-card border-2 border-primary text-primary font-semibold"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </motion.button>
                  </Link>
                  <Link href="/?signup=true">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 mt-2 px-5 py-3 rounded-xl bg-linear-to-r from-primary-deep to-primary-bright text-white font-semibold shadow-lg"
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

