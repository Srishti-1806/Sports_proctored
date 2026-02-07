'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Channel, MessageInput, MessageList, Thread, Window, Chat } from 'stream-chat-react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import 'stream-chat-react/dist/css/v2/index.css'
import '../../app/stream-chat.css'

export default function ChatWindow({ chatClient, channelId, otherUser, onBack }) {
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    const initChannel = async () => {
      try {
        const newChannel = chatClient.channel('messaging', channelId)
        await newChannel.watch()
        setChannel(newChannel)
      } catch (error) {
        console.error('Error initializing channel:', error)
      } finally {
        setLoading(false)
      }
    }

    if (chatClient && channelId) {
      initChannel()
    }

    return () => {
      if (channel) {
        channel.stopWatching()
      }
    }
  }, [chatClient, channelId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-bright" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Failed to load chat</p>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-primary-bright text-white hover:bg-primary-deep transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background [--stream-primary:#667eea] [--stream-accent:#764ba2]">
      {/* Custom Header */}
      <div className="bg-card/80 backdrop-blur-lg border-b border-border px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl hover:bg-primary-soft/80 transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-deep to-primary-bright overflow-hidden shrink-0 ring-2 ring-primary-bright/20">
              {otherUser.profile_picture ? (
                <img
                  src={otherUser.profile_picture}
                  alt={otherUser.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                  {otherUser.full_name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-foreground">
              {otherUser.full_name || 'Anonymous User'}
            </h2>
          </div>
        </div>
      </div>

      {/* Stream Chat UI with fixed container */}
      <div className={`flex-1 overflow-hidden relative ${theme === 'dark' ? 'dark' : ''}`}>
        <Chat client={chatClient} theme={theme === 'dark' ? 'str-chat__theme-dark' : 'str-chat__theme-light'}>
          <Channel channel={channel}>
            <Window>
              {/* Message list will fill available space; add bottom padding so fixed input
                  does not overlap reaction buttons near the bottom. */}
              <div className="h-full pb-28">
                <MessageList />
              </div>
            </Window>

            {/* Fixed input area (Tailwind) - keep inside Channel so MessageInput has context */}
            <div className="fixed left-1/2 bottom-6 transform -translate-x-1/2 w-7/12 max-w-6xl px-2 z-40">
              <div className="bg-card rounded-xl py-2 shadow-lg border border-border">
                <MessageInput />
              </div>
            </div>

            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  )
}