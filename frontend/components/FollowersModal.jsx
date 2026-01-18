'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function FollowersModal({ isOpen, onClose, users, type, loading }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md max-h-[80vh] rounded-3xl bg-card shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {type === 'followers' ? (
                    <Users className="w-5 h-5 text-primary-bright" />
                  ) : (
                    <UserPlus className="w-5 h-5 text-primary-bright" />
                  )}
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {type === 'followers' ? 'Followers' : 'Following'}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    ({users?.length || 0})
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-primary-soft transition-colors"
                >
                  <X className="w-5 h-5 text-primary-muted" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary-bright border-t-transparent rounded-full animate-spin" />
                </div>
              ) : users && users.length > 0 ? (
                <div className="space-y-3">
                  {users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/${user.role === 'coach' ? 'coaches' : 'players'}/${user.id}`}
                      onClick={onClose}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-popover hover:bg-primary-soft transition-colors cursor-pointer"
                      >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-deep to-primary-bright overflow-hidden shrink-0">
                          {user.profile_picture ? (
                            <img
                              src={user.profile_picture}
                              alt={user.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                              {user.full_name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {user.full_name || 'Anonymous User'}
                          </h3>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground truncate">
                              {user.position || user.athletic_stats?.primarySport || user.role}
                            </p>
                            {user.role && (
                              <span className="px-2 py-0.5 rounded-full bg-primary-bright/10 text-primary-bright text-xs font-medium">
                                {user.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-primary-soft flex items-center justify-center mx-auto mb-4">
                    {type === 'followers' ? (
                      <Users className="w-8 h-8 text-primary-muted" />
                    ) : (
                      <UserPlus className="w-8 h-8 text-primary-muted" />
                    )}
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    No {type} yet
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {type === 'followers'
                      ? 'No one is following you yet'
                      : 'You are not following anyone yet'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
