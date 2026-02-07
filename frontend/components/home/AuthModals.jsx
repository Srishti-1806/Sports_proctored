'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ToastProvider'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function AuthModals({ showLogin, showSignup, onClose }) {
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    const prevPadding = html.style.paddingRight
    const lock = showLogin || showSignup

    if (lock) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      if (scrollbarWidth > 0) html.style.paddingRight = `${scrollbarWidth}px`
      html.style.overflow = 'hidden'
    } else {
      html.style.overflow = prevOverflow
      html.style.paddingRight = prevPadding
    }

    return () => {
      html.style.overflow = prevOverflow
      html.style.paddingRight = prevPadding
    }
  }, [showLogin, showSignup])

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  // Signup form state
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'player'
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signInError } = await signIn(loginData.email, loginData.password)
    
    if (signInError) {
      setError(signInError)
      setLoading(false)
    } else {
      setLoading(false)
      onClose()
      // Clear URL parameters after successful sign-in
      router.push('/')
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // Ensure full name is unique
    try {
      const supabase = createClient()
      const fullName = `${signupData.firstName.trim()} ${signupData.lastName.trim()}`
      const { data: existing, error: fetchErr } = await supabase.from('profiles').select('id').ilike('full_name', fullName)
      if (fetchErr) {
        console.error('Error checking existing profiles:', fetchErr)
      }
      if (existing && existing.length > 0) {
        setError('A user with this name already exists. Please use a different name.')
        setLoading(false)
        return
      }

    } catch (checkErr) {
      console.error('Error checking name uniqueness:', checkErr)
    }

    const { data, error: signUpError } = await signUp(
      signupData.email,
      signupData.password,
      {
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        role: signupData.role
      }
    )
    
    if (signUpError) {
      setError(signUpError)
      setLoading(false)
    } else {
      setLoading(false)
      // show confirmation toast
      toast?.show('A mail has been sent to you — please confirm your email to sign in.')
      onClose()
      // Clear URL parameters after successful sign-up
      router.push('/')
    }
  }

  return (
    <>
      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 h-dvh flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
            onClick={() => onClose()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md p-8 rounded-3xl bg-card shadow-2xl"
            >
              <button
                onClick={() => onClose()}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-primary-soft transition-colors"
              >
                <X className="w-5 h-5 text-primary-muted" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary-deep to-primary-bright flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">{t('auth.welcomeBack')}</h2>
                <p className="text-primary-muted mt-2">Continue your athletic journey</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('auth.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-muted" />
                    <input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary-bright focus:ring-2 focus:ring-primary-bright/20 outline-none transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('auth.password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-muted" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-border focus:border-primary-bright focus:ring-2 focus:ring-primary-bright/20 outline-none transition-all"
                      placeholder={t('auth.password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-primary-muted" />
                      ) : (
                        <Eye className="w-5 h-5 text-primary-muted" />
                      )}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-linear-to-r from-primary-deep to-primary-bright text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('auth.signingIn') : t('nav.signIn')}
                </motion.button>
              </form>

              <p className="text-center text-primary-muted mt-6 text-sm">
                {t('auth.dontHaveAccount')}{' '}
                <button
                  onClick={() => onClose('switchToSignup')}
                  className="text-primary font-semibold hover:underline"
                >
                  {t('auth.signUpHere')}
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signup Modal */}
      <AnimatePresence>
        {showSignup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 h-dvh flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
            onClick={() => onClose()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-card shadow-2xl max-h-[90vh] overflow-hidden my-8"
            >
              <button
                onClick={() => onClose()}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-primary-soft transition-colors"
              >
                <X className="w-5 h-5 text-primary-muted" />
              </button>

              <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 4rem)' }}>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary-deep to-primary-bright flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">{t('auth.joinSportlin')}</h2>
                  <p className="text-primary-muted mt-2">Start your journey to greatness</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">{t('auth.firstName')}</label>
                      <input
                        type="text"
                        required
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary-bright focus:ring-2 focus:ring-primary-bright/20 outline-none transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">{t('auth.lastName')}</label>
                      <input
                        type="text"
                        required
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary-bright focus:ring-2 focus:ring-primary-bright/20 outline-none transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-foreground mb-2">{t('auth.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-muted" />
                      <input
                        type="email"
                        required
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary-bright focus:ring-2 focus:ring-primary-bright/20 outline-none transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('auth.iAmA')}</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer hover:border-primary-bright transition-colors ${
                        signupData.role === 'player' ? 'border-primary-bright bg-primary-soft' : 'border-border'
                      }`}>
                        <input 
                          type="radio" 
                          name="role" 
                          value="player"
                          checked={signupData.role === 'player'}
                          onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                          className="hidden" 
                        />
                        <User className="w-5 h-5 text-primary-deep" />
                        <span className={`font-medium ${signupData.role === 'player' ? 'text-primary-deep' : 'text-foreground'}`}>{t('auth.player')}</span>
                      </label>
                      <label className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer hover:border-primary-bright transition-colors ${
                        signupData.role === 'coach' ? 'border-primary-bright bg-primary-soft' : 'border-border'
                      }`}>
                        <input 
                          type="radio" 
                          name="role" 
                          value="coach"
                          checked={signupData.role === 'coach'}
                          onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                          className="hidden" 
                        />
                        <Shield className="w-5 h-5 text-primary-deep" />
                        <span className={`font-medium ${signupData.role === 'coach' ? 'text-primary-deep' : 'text-foreground'}`}>{t('auth.coach')}</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">{t('auth.password')}</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-muted" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="w-full pl-12 pr-12 py-3 rounded-xl border border-border focus:border-primary-bright focus:ring-2 focus:ring-primary-bright/20 outline-none transition-all"
                        placeholder={t('auth.password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-primary-muted" />
                        ) : (
                          <Eye className="w-5 h-5 text-primary-muted" />
                        )}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-primary-deep to-primary-bright text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
                  </motion.button>
                </form>

                <p className="text-center text-primary-muted mt-6 text-sm">
                  {t('auth.alreadyHaveAccount')}{' '}
                  <button
                    onClick={() => onClose('switchToLogin')}
                    className="text-primary font-semibold hover:underline"
                  >
                    {t('auth.signInHere')}
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
