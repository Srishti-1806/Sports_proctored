'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff,
  Sparkles, 
  User, 
  Bot,
  MoreVertical,
  Trash2,
  Download,
  Settings,
  ChevronRight,
  Zap,
  Target,
  Trophy,
  Dumbbell,
  Activity,
  Heart,
  Brain,
  Lightbulb,
  HelpCircle,
  ArrowUp,
  Loader2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Volume2,
  X,
  Plus,
  Clock,
  Star
} from 'lucide-react'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Welcome to ATHLETIX AI Coach! I'm here to help you with training advice, nutrition tips, performance optimization, and answer any sports-related questions. How can I assist you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

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

  const conversationHistory = [
    { id: 1, title: 'Training Plan Discussion', date: 'Today', preview: 'Weekly workout schedule...' },
    { id: 2, title: 'Nutrition Advice', date: 'Yesterday', preview: 'Pre-game meal suggestions...' },
    { id: 3, title: 'Injury Prevention', date: 'Dec 27', preview: 'Stretching techniques...' },
    { id: 4, title: 'Mental Preparation', date: 'Dec 25', preview: 'Visualization exercises...' }
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on your training goals, I'd recommend focusing on compound exercises like squats, deadlifts, and bench press for maximum strength gains. These exercises work multiple muscle groups simultaneously, making your workouts more efficient. Would you like me to create a detailed workout plan?",
        "For optimal performance, I suggest incorporating both high-intensity interval training (HIIT) and steady-state cardio into your routine. HIIT is excellent for improving your VO2 max and explosive power, while steady-state cardio helps build endurance. What's your current cardio routine like?",
        "Recovery is just as important as training! Make sure you're getting 7-9 hours of quality sleep, staying hydrated, and including rest days in your schedule. Active recovery like light stretching or yoga can also help reduce muscle soreness. Want me to share some recovery techniques?",
        "Nutrition plays a crucial role in athletic performance. For your goals, I recommend consuming protein within 30 minutes of your workout for optimal muscle recovery. Complex carbohydrates before training will provide sustained energy. Should I break down a sample meal plan for you?"
      ]

      const aiMessage = {
        id: Date.now(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
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
    <div className="min-h-screen bg-[#fafbff] flex">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-80 bg-white border-r border-[#EDE8F5]">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#EDE8F5]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white font-semibold shadow-lg"
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
          <div className="space-y-2">
            {conversationHistory.map((chat) => (
              <motion.div
                key={chat.id}
                whileHover={{ x: 4 }}
                className="p-3 rounded-xl hover:bg-[#EDE8F5] cursor-pointer transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#1a1a2e] truncate">{chat.title}</h4>
                    <p className="text-sm text-[#8697C4] truncate">{chat.preview}</p>
                  </div>
                  <span className="text-xs text-[#ADBBDA] ml-2">{chat.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#EDE8F5]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EDE8F5]">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center text-white font-bold">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#1a1a2e]">Alex Rivera</p>
              <p className="text-xs text-[#8697C4]">Pro Athlete Plan</p>
            </div>
            <Settings className="w-5 h-5 text-[#8697C4] cursor-pointer hover:text-[#3D52A0]" />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-h-screen">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EDE8F5]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-[#1a1a2e]">ATHLETIX AI Coach</h2>
              <p className="text-sm text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Online & Ready to Help
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-[#EDE8F5] text-[#8697C4] transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl hover:bg-[#EDE8F5] text-[#8697C4] transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Quick Actions - Show only if few messages */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 rounded-3xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">
                  Your AI Sports Coach
                </h1>
                <p className="text-[#8697C4]">
                  Get personalized training advice, nutrition tips, and performance insights
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="p-5 rounded-2xl bg-white border border-[#EDE8F5] hover:border-[#7091E6] hover:shadow-lg transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#EDE8F5] to-[#ADBBDA] group-hover:from-[#3D52A0] group-hover:to-[#7091E6] flex items-center justify-center mb-3 transition-all">
                      <action.icon className="w-6 h-6 text-[#3D52A0] group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-medium text-[#1a1a2e]">{action.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-[#EDE8F5]/50">
                <h3 className="font-medium text-[#1a1a2e] mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#7091E6]" />
                  Try asking...
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(prompt)}
                      className="px-4 py-2 rounded-xl bg-white text-sm text-[#3D52A0] hover:bg-[#7091E6] hover:text-white transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`shrink-0 ${message.role === 'user' ? '' : ''}`}>
                  {message.role === 'assistant' ? (
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#8697C4] to-[#ADBBDA] flex items-center justify-center text-white font-bold">
                      AR
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`inline-block max-w-[85%] p-4 rounded-2xl ${
                      message.role === 'assistant'
                        ? 'bg-white border border-[#EDE8F5] text-[#1a1a2e] rounded-tl-none'
                        : 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white rounded-tr-none'
                    }`}
                  >
                    <p className="leading-relaxed">{message.content}</p>
                  </div>
                  
                  {/* Message Actions */}
                  <div className={`flex items-center gap-2 mt-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    <span className="text-xs text-[#ADBBDA]">{formatTime(message.timestamp)}</span>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-1">
                        <button className="p-1 rounded hover:bg-[#EDE8F5] text-[#ADBBDA] hover:text-[#3D52A0] transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#EDE8F5] text-[#ADBBDA] hover:text-[#3D52A0] transition-colors">
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#EDE8F5] text-[#ADBBDA] hover:text-green-500 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#EDE8F5] text-[#ADBBDA] hover:text-red-500 transition-colors">
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
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
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center">
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

        {/* Input Area */}
        <div className="px-4 py-4 bg-white border-t border-[#EDE8F5]">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="relative"
            >
              <div className="flex items-center gap-3 p-2 rounded-2xl bg-[#EDE8F5]/50 border border-[#EDE8F5] focus-within:border-[#7091E6] focus-within:ring-2 focus-within:ring-[#7091E6]/20 transition-all">
                <button
                  type="button"
                  onClick={() => setIsListening(!isListening)}
                  className={`p-3 rounded-xl transition-colors ${
                    isListening 
                      ? 'bg-red-100 text-red-500' 
                      : 'hover:bg-[#ADBBDA]/30 text-[#8697C4]'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about sports, training, nutrition..."
                  className="flex-1 bg-transparent outline-none text-[#1a1a2e] placeholder-[#8697C4]"
                />

                <motion.button
                  type="submit"
                  disabled={!input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-xl transition-all ${
                    input.trim()
                      ? 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white shadow-lg'
                      : 'bg-[#ADBBDA]/30 text-[#ADBBDA]'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </form>

            <p className="text-center text-xs text-[#ADBBDA] mt-3">
              AI Coach can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle would go here */}
    </div>
  )
}

