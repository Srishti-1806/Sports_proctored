'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { StreamChat } from 'stream-chat'
import { useAuth } from './AuthContext'

const ChatContext = createContext({})

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}

export const ChatProvider = ({ children }) => {
  const [chatClient, setChatClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    let isActive = true
    
    const initChat = async () => {
      if (!user) {
        setChatClient(null)
        setLoading(false)
        return
      }

      try {
        // Get token from API
        const response = await fetch('/api/stream-token')
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Stream token API error:', errorData)
          throw new Error(errorData.error || 'Failed to get chat token')
        }

        const { token, apiKey, userId } = await response.json()

        if (!isActive) return

        // Initialize Stream Chat client
        const client = StreamChat.getInstance(apiKey)

        // Connect user
        await client.connectUser(
          {
            id: userId,
          },
          token
        )

        if (isActive) {
          setChatClient(client)
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
        if (isActive) {
          setChatClient(null)
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    initChat()

    // Cleanup on unmount or user change
    return () => {
      isActive = false
      if (chatClient) {
        chatClient.disconnectUser().catch(err => console.error('Error disconnecting:', err))
        setChatClient(null)
      }
    }
  }, [user])

  const value = {
    chatClient,
    loading,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
