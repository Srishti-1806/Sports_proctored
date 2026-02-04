'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '../supabase/client'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })
      if (error) throw error

      // If a user object is returned immediately, create a profiles row
      // with a generated unique public_id. Best-effort: if the user is null
      // (e.g. awaiting email confirmation), the profile creation can be
      // handled later when the user signs in.
      try {
        const userId = data?.user?.id
        if (userId) {
          // helper to slugify + random suffix
          const generatePublicId = (first, last) => {
            const base = `${(first || '')} ${(last || '')}`
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
              .slice(0, 24)
            const suffix = Math.random().toString(36).slice(2, 6)
            return `${base || 'user'}-${suffix}`
          }

          // attempt to ensure uniqueness
          let publicId = ''
          for (let i = 0; i < 6; i++) {
            const candidate = generatePublicId(metadata.first_name, metadata.last_name)
            const { data: exists } = await supabase.from('profiles').select('id').eq('public_id', candidate).limit(1)
            if (!exists || exists.length === 0) {
              publicId = candidate
              break
            }
          }
          if (!publicId) publicId = generatePublicId(metadata.first_name, metadata.last_name) + '-' + Date.now().toString().slice(-4)

          const dbProfile = {
            id: userId,
            full_name: `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim(),
            role: metadata.role || 'player',
            public_id: publicId,
          }

          await supabase.from('profiles').upsert(dbProfile)
        }
      } catch (e) {
        // non-fatal: don't block signup if profile creation fails
        console.error('Failed to create profile during signup:', e)
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      // Ensure local auth state is cleared immediately to avoid stale UI access
      setUser(null)
      setLoading(false)
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    supabase,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
