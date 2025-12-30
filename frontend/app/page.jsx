'use client'

import { useState, useRef, useEffect } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import HeroSection from '../components/home/HeroSection'
import BentoGrid from '../components/home/BentoGrid'
import FeaturesSection from '../components/home/FeaturesSection'
import CTASection from '../components/home/CTASection'
import AuthModals from '../components/home/AuthModals'

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showAuthAlert, setShowAuthAlert] = useState(false)
  const containerRef = useRef(null)
  const searchParams = useSearchParams()
  
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    // Check if user was redirected due to auth requirement
    if (searchParams.get('redirected') === 'true') {
      setShowAuthAlert(true)
      setShowLogin(true)
      
      // Hide alert after 5 seconds
      setTimeout(() => {
        setShowAuthAlert(false)
      }, 5000)
    }
    // Open signup modal if requested via query param
    if (searchParams.get('signup') === 'true') {
      setShowSignup(true)
    }
  }, [searchParams])

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
    <div className="overflow-hidden bg-[#fafbff]" ref={containerRef}>
      
      {/* Auth Required Alert */}
      {showAuthAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white shadow-2xl border border-[#ADBBDA]">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-[#1a1a2e]">Authentication Required</p>
              <p className="text-sm text-[#8697C4]">Please sign in to access this page</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Bento Grid */}
      <section className="relative min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-350 mx-auto">
          <HeroSection />
          <BentoGrid onSignupClick={() => setShowSignup(true)} />
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
    </div>
  )
}

