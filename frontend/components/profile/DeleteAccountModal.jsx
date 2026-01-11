"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/context/AuthContext'
import { useToast } from '../../components/ToastProvider'

export default function DeleteAccountModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, supabase } = useAuth()
  const toast = useToast()
  const router = useRouter()

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (!user) return
    if (!password) {
      toast?.show('Please enter your password')
      return
    }

    setLoading(true)
    try {
      // Re-authenticate to verify password
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password })
      if (signInError) {
        toast?.show(signInError.message || 'Incorrect password')
        setLoading(false)
        return
      }

      // Call server API to delete user and related data
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        toast?.show(body.error || 'Failed to delete account')
        setLoading(false)
        return
      }

      // Sign out locally and redirect
      try {
        await supabase.auth.signOut()
      } catch (e) {
        console.warn('signOut error', e)
      }

      toast?.show('Account deleted')
      onClose()
      router.push('/')
    } catch (e) {
      console.error(e)
      toast?.show('Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-2xl p-6 w-full max-w-lg mx-4">
        <h3 className="text-lg font-bold mb-2">Delete Account</h3>
        <p className="text-sm text-muted-foreground mb-4">This action is irreversible. Type your password to confirm account deletion.</p>

        <div className="mb-4">
          <label className="block text-sm text-primary-muted mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-xl border border-border" />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-muted">Cancel</button>
          <button onClick={handleConfirm} disabled={loading} className="px-4 py-2 rounded-xl bg-destructive text-white">{loading ? 'Deleting...' : 'Delete Account'}</button>
        </div>
      </div>
    </div>
  )
}
