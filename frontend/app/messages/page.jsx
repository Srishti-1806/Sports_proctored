'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/context/AuthContext'
import { useChat } from '../../lib/context/ChatContext'
import { createClient } from '../../lib/supabase/client'
import { motion } from 'framer-motion'
import { MessageCircle, Users, Search, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ChatWindow from '../../components/chat/ChatWindow'
import { useLanguage } from '../../lib/context/LanguageContext'

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth()
  const { chatClient, loading: chatLoading } = useChat()
  const { t } = useLanguage()
  const router = useRouter()
  const supabase = createClient()

  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [channelId, setChannelId] = useState(null)

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push('/')
      return
    }

    if (user) {
      fetchContacts()
    }
  }, [user, authLoading, router])

  const fetchContacts = async () => {
    try {
      // Fetch all user profiles except current user
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, profile_picture, role, position')
        .neq('id', user.id)
        .limit(100)

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError)
        return
      }

      setContacts(profiles || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartChat = async (otherUser) => {
    try {
      // Create or get channel
      const response = await fetch('/api/stream-channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otherUserId: otherUser.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create channel')
      }

      const { channelId: newChannelId } = await response.json()
      
      setSelectedUser(otherUser)
      setChannelId(newChannelId)
    } catch (error) {
      console.error('Error starting chat:', error)
      alert(t('messages.startChatFailed'))
    }
  }

  const handleBackToList = () => {
    setSelectedUser(null)
    setChannelId(null)
  }

  const filteredContacts = contacts.filter(contact =>
    contact.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-bright mx-auto mb-4" />
          <p className="text-muted-foreground">{t('messages.checkingAuth')}</p>
        </div>
      </div>
    )
  }

  // Redirect handled in useEffect, but show nothing if not authenticated
  if (!user) {
    return null
  }

  if (chatLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-bright mx-auto mb-4" />
          <p className="text-muted-foreground">{t('messages.loadingChat')}</p>
        </div>
      </div>
    )
  }

  if (!chatClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t('messages.unavailableTitle')}</h2>
          <p className="text-muted-foreground">{t('messages.unavailableBody')}</p>
        </div>
      </div>
    )
  }

  // Show chat window if user is selected
  if (selectedUser && channelId) {
    return (
      <ChatWindow
        chatClient={chatClient}
        channelId={channelId}
        otherUser={selectedUser}
        onBack={handleBackToList}
      />
    )
  }

  // Show contacts list
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-primary-soft/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-primary-bright/10">
              <MessageCircle className="w-8 h-8 text-primary-bright" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">{t('messages.title')}</h1>
              <p className="text-muted-foreground">{t('messages.subtitle')}</p>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('messages.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary-bright/50 transition-all"
            />
          </div>
        </motion.div>

        {/* Contacts List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl shadow-lg border border-border overflow-hidden"
        >
          {filteredContacts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t('messages.noContactsTitle')}</h3>
              <p className="text-muted-foreground mb-6">
                {contacts.length === 0
                  ? t('messages.noUsersAvailable')
                  : t('messages.noContactsMatch')}
              </p>
              {contacts.length === 0 && (
                <button
                  onClick={() => router.push('/players')}
                  className="px-6 py-3 rounded-xl bg-primary-bright text-white font-semibold hover:bg-primary-deep transition-colors"
                >
                  {t('messages.findPlayers')}
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleStartChat(contact)}
                  className="flex items-center gap-4 p-4 hover:bg-primary-soft/50 cursor-pointer transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary-deep to-primary-bright overflow-hidden shrink-0">
                    {contact.profile_picture ? (
                      <img
                        src={contact.profile_picture}
                        alt={contact.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                        {contact.full_name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {contact.full_name || t('messages.anonymousUser')}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground truncate">
                        {contact.position || contact.role}
                      </p>
                      {contact.role && (
                        <span className="px-2 py-0.5 rounded-full bg-primary-bright/10 text-primary-bright text-xs font-medium">
                          {contact.role}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chat Icon */}
                  <MessageCircle className="w-5 h-5 text-primary-muted shrink-0" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
