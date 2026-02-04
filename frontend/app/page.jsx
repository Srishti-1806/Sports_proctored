'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import HeroSection from '@/components/home/HeroSection'
import BentoGrid from '@/components/home/BentoGrid'
import FeaturesSection from '@/components/home/FeaturesSection'
import CTASection from '@/components/home/CTASection'
import AuthModals from '@/components/home/AuthModals'
import SportsLoader from '@/components/home/SportsLoader'

function SearchParamsHandler({ setShowLogin, setShowSignup, setShowAuthAlert, user, loading }) {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Wait until auth loading finishes to avoid showing modals while session is being resolved
    if (loading) return

    // If user is authenticated, ensure any auth UI is closed and clear params
    if (user) {
      setShowLogin(false)
      setShowSignup(false)
      setShowAuthAlert(false)
      // remove auth-related query params
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.delete('redirected')
        url.searchParams.delete('signup')
        window.history.replaceState(null, '', url.toString())
      }
      return
    }

    // Check if user was redirected due to auth requirement
    if (searchParams.get('redirected') === 'true') {
      setShowAuthAlert(true)
      setShowLogin(true)

      // Hide alert after 5 seconds
      setTimeout(() => setShowAuthAlert(false), 5000)

      // remove redirected param so it doesn't re-trigger on reload
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.delete('redirected')
        window.history.replaceState(null, '', url.toString())
      }
    }

    // Open signup modal if requested via query param
    if (searchParams.get('signup') === 'true') {
      setShowSignup(true)
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.delete('signup')
        window.history.replaceState(null, '', url.toString())
      }
    }
  }, [searchParams, setShowLogin, setShowSignup, setShowAuthAlert, user, loading])

  return null
}

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showAuthAlert, setShowAuthAlert] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [loaderComplete, setLoaderComplete] = useState(false)
  const containerRef = useRef(null)
  const { user, loading } = useAuth()

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedHome')
    
    if (!hasVisited) {
      setShowLoader(true)
      sessionStorage.setItem('hasVisitedHome', 'true')
    } else {
      setLoaderComplete(true)
    }
  }, [])

  const handleLoaderComplete = () => {
    setLoaderComplete(true)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleModalClose = (action) => {
    if (action === 'switchToSignup') {
      setShowLogin(false)
      setShowSignup(true)
    } else if (action === 'switchToLogin') {
      setShowSignup(false)
      setShowLogin(true)
    } else {
      setShowLogin(false)
      setShowSignup(false)
    }
  }

  return (
    <div className="overflow-hidden bg-background" ref={containerRef}>
      {/* Sports Loader - Only on first visit */}
      {showLoader && <SportsLoader onComplete={handleLoaderComplete} />}

      {/* Main content - Only show after loader completes */}
      {loaderComplete && (
        <motion.div
          initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="min-h-screen"
        >
          {/* Search Params Handler */}
          <Suspense fallback={null}>
            <SearchParamsHandler 
          setShowLogin={setShowLogin}
          setShowSignup={setShowSignup}
          setShowAuthAlert={setShowAuthAlert}
          user={user}
          loading={loading}
        />
      </Suspense>

      {/* Auth Required Alert */}
      {showAuthAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top px-4 w-full max-w-md">
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-card shadow-2xl border border-border">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm sm:text-base text-foreground truncate">Authentication Required</p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Please sign in to access this page</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Bento Grid */}
      <section className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-350 mx-auto">
          <HeroSection />
          <BentoGrid onSignupClick={() => setShowSignup(true)} onLoginClick={() => setShowLogin(true)} />
        </div>
      </section>

      <FeaturesSection />

      <CTASection 
        onSignupClick={() => setShowSignup(true)}
        onLoginClick={() => setShowLogin(true)}
      />

      <AuthModals 
        showLogin={showLogin}
        showSignup={showSignup}
        onClose={handleModalClose}
      />
        </motion.div>
      )}
    </div>
  )
}

