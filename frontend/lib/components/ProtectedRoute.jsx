'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/?redirected=true')
    }
  }, [user, loading, router])

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbff]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-[#8697C4] font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render children (will redirect)
  if (!user) {
    return null
  }

  // User is authenticated, render the protected content
  return children
}
