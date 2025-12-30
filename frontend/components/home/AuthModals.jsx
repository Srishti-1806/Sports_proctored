'use client'

import { useState } from 'react'
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
import { useAuth } from '../../lib/context/AuthContext'
import { useToast } from '../../components/ToastProvider'
import { useRouter } from 'next/navigation'

export default function AuthModals({ showLogin, showSignup, onClose }) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()
  const router = useRouter()
  const toast = useToast()

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
      router.refresh()
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

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
      router.refresh()
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => onClose()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl"
            >
              <button
                onClick={() => onClose()}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[#EDE8F5] transition-colors"
              >
                <X className="w-5 h-5 text-[#8697C4]" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-display text-2xl font-bold text-[#1a1a2e]">Welcome Back</h2>
                <p className="text-[#8697C4] mt-2">Continue your athletic journey</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8697C4]" />
                    <input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] focus:ring-2 focus:ring-[#7091E6]/20 outline-none transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8697C4]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] focus:ring-2 focus:ring-[#7091E6]/20 outline-none transition-all"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-[#8697C4]" />
                      ) : (
                        <Eye className="w-5 h-5 text-[#8697C4]" />
                      )}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold shadow-lg shadow-[#7091E6]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </motion.button>
              </form>

              <p className="text-center text-[#8697C4] mt-6 text-sm">
                New to ATHLETIX?{' '}
                <button
                  onClick={() => onClose('switchToSignup')}
                  className="text-[#3D52A0] font-semibold hover:underline"
                >
                  Create account
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => onClose()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-hidden"
            >
              <button
                onClick={() => onClose()}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[#EDE8F5] transition-colors"
              >
                <X className="w-5 h-5 text-[#8697C4]" />
              </button>

              <div className="p-8 overflow-y-auto max-h-[90vh]">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-[#1a1a2e]">Join ATHLETIX</h2>
                  <p className="text-[#8697C4] mt-2">Start your journey to greatness</p>
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
                      <label className="block text-sm font-medium text-[#1a1a2e] mb-2">First Name</label>
                      <input
                        type="text"
                        required
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] focus:ring-2 focus:ring-[#7091E6]/20 outline-none transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Last Name</label>
                      <input
                        type="text"
                        required
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] focus:ring-2 focus:ring-[#7091E6]/20 outline-none transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8697C4]" />
                      <input
                        type="email"
                        required
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] focus:ring-2 focus:ring-[#7091E6]/20 outline-none transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a1a2e] mb-2">I am a</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer hover:border-[#7091E6] transition-colors ${
                        signupData.role === 'player' ? 'border-[#7091E6] bg-[#EDE8F5]' : 'border-[#ADBBDA]'
                      }`}>
                        <input 
                          type="radio" 
                          name="role" 
                          value="player"
                          checked={signupData.role === 'player'}
                          onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                          className="hidden" 
                        />
                        <User className="w-5 h-5 text-[#3D52A0]" />
                        <span className="font-medium text-[#1a1a2e]">Player</span>
                      </label>
                      <label className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer hover:border-[#7091E6] transition-colors ${
                        signupData.role === 'coach' ? 'border-[#7091E6] bg-[#EDE8F5]' : 'border-[#ADBBDA]'
                      }`}>
                        <input 
                          type="radio" 
                          name="role" 
                          value="coach"
                          checked={signupData.role === 'coach'}
                          onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                          className="hidden" 
                        />
                        <Shield className="w-5 h-5 text-[#3D52A0]" />
                        <span className="font-medium text-[#1a1a2e]">Coach</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8697C4]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="w-full pl-12 pr-12 py-3 rounded-xl border border-[#ADBBDA] focus:border-[#7091E6] focus:ring-2 focus:ring-[#7091E6]/20 outline-none transition-all"
                        placeholder="Create password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-[#8697C4]" />
                        ) : (
                          <Eye className="w-5 h-5 text-[#8697C4]" />
                        )}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold shadow-lg shadow-[#7091E6]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </motion.button>
                </form>

                <p className="text-center text-[#8697C4] mt-6 text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => onClose('switchToLogin')}
                    className="text-[#3D52A0] font-semibold hover:underline"
                  >
                    Sign in
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
