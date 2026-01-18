'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'
import { useAuth } from '../lib/context/AuthContext'
import { useToast } from './ToastProvider'

export default function FollowButton({ targetUserId, targetUserName, initialFollowing = false, onFollowChange }) {
  const { user } = useAuth()
  const toast = useToast()
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  // Check follow status on mount
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !targetUserId) {
        setCheckingStatus(false)
        return
      }

      try {
        const response = await fetch(`/api/follow?targetUserId=${targetUserId}`)
        if (response.ok) {
          const data = await response.json()
          setIsFollowing(data.isFollowing)
        }
      } catch (error) {
        console.error('Error checking follow status:', error)
      } finally {
        setCheckingStatus(false)
      }
    }

    checkFollowStatus()
  }, [user, targetUserId])

  const handleFollowToggle = async () => {
    if (!user) {
      toast?.show('Please sign in to follow users')
      return
    }

    if (user.id === targetUserId) {
      toast?.show('You cannot follow yourself')
      return
    }

    setLoading(true)

    try {
      const action = isFollowing ? 'unfollow' : 'follow'
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, action })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update follow status')
      }

      const data = await response.json()
      setIsFollowing(action === 'follow')
      
      toast?.show(
        action === 'follow' 
          ? `You are now following ${targetUserName || 'this user'}` 
          : `Unfollowed ${targetUserName || 'this user'}`
      )

      // Notify parent component of change
      if (onFollowChange) {
        onFollowChange(action === 'follow', data.followersCount)
      }
    } catch (error) {
      console.error('Error toggling follow:', error)
      toast?.show(error.message || 'Failed to update follow status')
    } finally {
      setLoading(false)
    }
  }

  // Don't show button for own profile
  if (user?.id === targetUserId) {
    return null
  }

  if (checkingStatus) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-muted-foreground cursor-not-allowed"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">Loading...</span>
      </button>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.05 }}
      whileTap={{ scale: loading ? 1 : 0.95 }}
      onClick={handleFollowToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        isFollowing
          ? 'bg-card border border-border text-foreground hover:bg-muted'
          : 'bg-linear-to-r from-primary-deep to-primary-bright text-white shadow-lg hover:shadow-xl'
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{isFollowing ? 'Unfollowing...' : 'Following...'}</span>
        </>
      ) : (
        <>
          {isFollowing ? (
            <>
              <UserMinus className="w-4 h-4" />
              <span>Following</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Follow</span>
            </>
          )}
        </>
      )}
    </motion.button>
  )
}
