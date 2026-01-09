'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../components/ToastProvider'
import { useAuth } from '../../lib/context/AuthContext'
import chatService from '../../lib/services/chatService'
import { 
  Send, 
  Mic, 
  MicOff,
  Sparkles, 
  User, 
  Bot,
  MoreVertical,
  Target,
  Dumbbell,
  Heart,
  Brain,
  Lightbulb,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Volume2,
  Plus,
  Menu,
  X
} from 'lucide-react'
import MarkdownOutput from '../../components/MarkdownOutput'

export default function ChatPage() {
  const { user } = useAuth()
  const toast = useToast()
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Welcome to Sportlin AI Coach! I'm here to help you with training advice, nutrition tips, performance optimization, and answer any sports-related questions. How can I assist you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.show('Copied to clipboard')
    } catch (err) {
      console.error('Copy failed', err)
      toast.show('Copy failed', { duration: 4000 })
    }
  }

  const quickActions = [
    { icon: Dumbbell, label: 'Training Plan', prompt: 'Create a weekly training plan for me' },
    { icon: Target, label: 'Set Goals', prompt: 'Help me set realistic fitness goals' },
    { icon: Heart, label: 'Nutrition Tips', prompt: 'What should I eat before a workout?' },
    { icon: Brain, label: 'Mental Coach', prompt: 'How can I improve my focus during games?' }
  ]

  const suggestedPrompts = [
    "What's the best warm-up routine before basketball?",
    "How do I prevent muscle injuries?",
    "Can you analyze my training schedule?",
    "Tips for improving my sprint speed",
    "How to recover faster after intense training?"
  ]

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load all conversations for sidebar
  const loadConversations = async () => {
    if (!user) return
    
    setIsLoadingConversations(true)
    try {
      const data = await chatService.getConversations(user.id)
      setConversations(data)
    } catch (error) {
      console.error('Failed to load conversations:', error)
      toast.show('Failed to load chat history', { duration: 3000 })
    } finally {
      setIsLoadingConversations(false)
    }
  }

  // Start a new conversation
  const startNewConversation = async () => {
    if (!user) {
      toast.show('Please sign in to save chats', { duration: 3000 })
      return
    }

    setCurrentConversation(null)
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: "Welcome to Sportlin AI Coach! How can I help you today?",
      timestamp: new Date()
    }])
    // Close sidebar on small screens so the user sees the new chat
    setIsSidebarOpen(false)
  }

  // Load a specific conversation
  const loadConversation = async (conversationId) => {
    if (!user) return

    try {
      const data = await chatService.getConversationWithMessages(conversationId)
      setCurrentConversation(data)
      
      // Convert DB messages to UI format
      const uiMessages = data.messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }))
      
      setMessages(uiMessages)
      setIsSidebarOpen(false) // Close sidebar on mobile
    } catch (error) {
      console.error('Failed to load conversation:', error)
      toast.show('Failed to load conversation', { duration: 3000 })
    }
  }

  // Delete a conversation
  const deleteConversation = async (conversationId, e) => {
    e?.stopPropagation()
    
    if (!confirm('Delete this conversation?')) return

    try {
      await chatService.deleteConversation(conversationId)
      
      // Remove from UI
      setConversations(prev => prev.filter(c => c.id !== conversationId))
      
      // Clear current if deleted
      if (currentConversation?.id === conversationId) {
        startNewConversation()
      }
      
      toast.show('Conversation deleted')
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      toast.show('Failed to delete conversation', { duration: 3000 })
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessageContent = input

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      // System message to define AI behavior and scope
      const systemMessage = {
        role: 'system',
        content: `You are Sportlin AI Coach, an expert sports performance assistant. You must ONLY answer questions and provide information related to sports, athletics, training, nutrition for athletes, injury prevention/recovery, mental preparation, and performance optimization.

        If the user asks about topics OUTSIDE the sports/athletics domain (for example politics, personal legal/medical diagnosis beyond general athlete-safe advice, programming unrelated to sports, or any other non-sports subject), you must politely refuse to answer on that topic. Respond with a short refusal such as: "I'm sorry — I can only help with sports and athletic performance topics. Please ask a question related to sports, training, or nutrition." Then invite them to return to the sports topic.

        Always be professional, concise, and prioritize athlete safety. When discussing injuries or medical concerns, recommend consulting qualified healthcare professionals for diagnosis and treatment.`
      }

      // Prepare messages for API (convert to simple format without timestamp/id)
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Add the new user message
      apiMessages.push({
        role: 'user',
        content: input
      })

      // Call Groq API
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          messages: [systemMessage, ...apiMessages] 
        })
      })

      const data = await response.json()

      if (data.error) {
        throw new Error('API Error')
      }

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.text,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

      // Save to database if user is logged in
      if (user) {
        try {
          // Create conversation if this is the first message
          let convId = currentConversation?.id
          
          if (!convId) {
            const newConv = await chatService.createConversation(user.id, userMessageContent)
            setCurrentConversation(newConv)
            convId = newConv.id
            
            // Refresh sidebar
            await loadConversations()
          }

          // Save both user and AI messages
          await chatService.addMessage(convId, 'user', userMessageContent)
          await chatService.addMessage(convId, 'assistant', data.text)

          // Update conversation list timestamp
          await loadConversations()
        } catch (dbError) {
          console.error('Failed to save to database:', dbError)
          // Don't show error to user - messages are still in memory
        }
      }
    } catch (error) {
      console.error('Error calling AI:', error)
      
      // Show error message to user
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please check your internet connection and try again.",
        timestamp: new Date(),
        isError: true
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (prompt) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date)
  }

  return (
    <div className="fixed inset-0 top-16 bg-[#fafbff] flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : '-100%'
        }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-80 bg-white border-r border-[#EDE8F5] h-full lg:transform-none!">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#EDE8F5] shrink-0">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between mb-3 lg:hidden">
            <h3 className="font-bold text-[#1a1a2e]">Chat History</h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-xl hover:bg-[#EDE8F5] text-[#3D52A0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-5 md:mt-0 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Conversation
          </motion.button>
        </div>

        {/* Conversation History */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-[#8697C4] uppercase tracking-wider mb-3">
            Recent Chats
          </h3>
          
          {isLoadingConversations ? (
            <div className="text-center text-[#8697C4] py-8">
              Loading chats...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-[#8697C4] py-8 text-sm">
              No conversations yet.<br />Start chatting to save your history!
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((chat) => (
                <motion.div
                  key={chat.id}
                  whileHover={{ x: 4 }}
                  onClick={() => loadConversation(chat.id)}
                  className={`p-3 rounded-xl hover:bg-[#EDE8F5] cursor-pointer transition-colors group relative ${
                    currentConversation?.id === chat.id ? 'bg-[#EDE8F5]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-medium text-[#1a1a2e] truncate">{chat.title}</h4>
                      <p className="text-sm text-[#8697C4] truncate">{chat.preview}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#ADBBDA]">{chat.date}</span>
                      <button
                        onClick={(e) => deleteConversation(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                        title="Delete conversation"
                      >
                        <MoreVertical className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Header - Fixed */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white border-b border-[#EDE8F5] shrink-0">
          {/* Left group: mobile button + title (keeps title left-aligned on phones) */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden rounded-xl hover:bg-[#EDE8F5] text-[#3D52A0] transition-colors mr-2"
              aria-label="Open chat history"
            >
              <MoreVertical className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-bold text-[#1a1a2e] text-sm sm:text-base truncate">Sportlin AI Coach</h2>
                <p className="text-xs sm:text-sm text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="hidden sm:inline">Online & Ready to Help</span>
                  <span className="sm:hidden">Online</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right-side placeholder (desktop controls) */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {/* kept empty for desktop actions; add controls here if needed */}
          </div>
        </div>

        {/* Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Quick Actions - Show only if few messages */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-6 sm:mb-8 px-4">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-[#1a1a2e] mb-2">
                  Your AI Sports Coach
                </h1>
                <p className="text-sm sm:text-base text-[#8697C4]">
                  Get personalized training advice, nutrition tips, and performance insights
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="p-3 sm:p-5 rounded-2xl bg-white border border-[#EDE8F5] hover:border-[#7091E6] hover:shadow-lg transition-all group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-[#EDE8F5] to-[#ADBBDA] group-hover:from-[#3D52A0] group-hover:to-[#7091E6] flex items-center justify-center mb-2 sm:mb-3 transition-all">
                      <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#3D52A0] group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-medium text-[#1a1a2e] text-xs sm:text-sm">{action.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#EDE8F5]/50 mx-2 sm:mx-0">
                <h3 className="font-medium text-[#1a1a2e] mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Lightbulb className="w-4 h-4 text-[#7091E6]" />
                  Try asking...
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(prompt)}
                      className="px-3 sm:px-4 py-2 rounded-xl bg-white text-xs sm:text-sm text-[#3D52A0] hover:bg-[#7091E6] hover:text-white transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 sm:gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`shrink-0 ${message.role === 'user' ? '' : ''}`}>
                  {message.role === 'assistant' ? (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-[#8697C4] to-[#ADBBDA] flex items-center justify-center text-white font-bold">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 rounded-2xl text-sm sm:text-base ${
                      message.role === 'assistant'
                        ? 'bg-white border border-[#EDE8F5] text-[#1a1a2e] rounded-tl-none'
                        : 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white rounded-tr-none'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <MarkdownOutput rawMarkdown={message.content} />
                    ) : (
                      <p className="leading-relaxed">{message.content}</p>
                    )}
                  </div>
                  
                  {/* Message Actions */}
                  <div className={`flex items-center gap-2 mt-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    <span className="text-xs text-[#ADBBDA]">{formatTime(message.timestamp)}</span>
                    {message.role === 'assistant' && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleCopy(message.content) }}
                        className="p-1 rounded hover:bg-[#EDE8F5] text-[#ADBBDA] hover:text-[#3D52A0] transition-colors"
                        title="Copy response"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 sm:gap-4"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="inline-block p-4 rounded-2xl rounded-tl-none bg-white border border-[#EDE8F5]">
                  <div className="flex items-center gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 rounded-full bg-[#7091E6]"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 rounded-full bg-[#7091E6]"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 rounded-full bg-[#7091E6]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed */}
        <div className="px-3 sm:px-4 py-3 sm:py-4 bg-white border-t border-[#EDE8F5] shrink-0">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="relative"
            >
              <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-2xl bg-[#EDE8F5]/50 border border-[#EDE8F5] focus-within:border-[#7091E6] focus-within:ring-2 focus-within:ring-[#7091E6]/20 transition-all">                
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about sports, training..."
                  className="flex-1 bg-transparent outline-none text-[#1a1a2e] placeholder-[#8697C4] text-sm sm:text-base px-2"
                />

                <motion.button
                  type="submit"
                  disabled={!input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 sm:p-3 rounded-xl transition-all ${
                    input.trim()
                      ? 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white shadow-lg'
                      : 'bg-[#ADBBDA]/30 text-[#ADBBDA]'
                  }`}
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>
            </form>

            <p className="text-center text-xs text-[#ADBBDA] mt-2 sm:mt-3 px-2">
              AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle would go here */}
    </div>
  )
}

