/**
 * Chat Service - Modular database operations for chat persistence
 * 
 * This service handles all CRUD operations for chat conversations and messages
 * using Supabase. It provides a clean API for the UI layer.
 */

import { createClient } from '../supabase/client'

// Create Supabase client instance
const supabase = createClient()

/**
 * Generate a conversation title from the first user message
 */
const generateTitle = (message) => {
  if (!message) return 'New Chat'
  const words = message.trim().split(' ')
  const title = words.slice(0, 6).join(' ')
  return words.length > 6 ? `${title}...` : title
}

/**
 * Format date for display
 */
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

export const chatService = {
  /**
   * Create a new conversation
   * @param {string} userId - User ID from auth
   * @param {string} firstMessage - Optional first message to generate title
   * @returns {Promise<Object>} Created conversation
   */
  async createConversation(userId, firstMessage = null) {
    const title = firstMessage ? generateTitle(firstMessage) : 'New Chat'
    
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({
        user_id: userId,
        title: title
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating conversation:', error)
      throw error
    }

    return data
  },

  /**
   * Get all conversations for a user
   * @param {string} userId - User ID
   * @param {number} limit - Max conversations to return
   * @returns {Promise<Array>} Array of conversations
   */
  async getConversations(userId, limit = 50) {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select(`
        id,
        title,
        created_at,
        updated_at,
        is_archived,
        messages:chat_messages(count)
      `)
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching conversations:', error)
      throw error
    }

    // Format dates for display
    return data.map(conv => ({
      ...conv,
      date: formatDate(conv.updated_at),
      preview: `${conv.messages[0]?.count || 0} messages`
    }))
  },

  /**
   * Get a single conversation with all messages
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Conversation with messages
   */
  async getConversationWithMessages(conversationId) {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select(`
        *,
        messages:chat_messages(
          id,
          role,
          content,
          created_at,
          metadata
        )
      `)
      .eq('id', conversationId)
      .single()

    if (error) {
      console.error('Error fetching conversation:', error)
      throw error
    }

    // Sort messages by created_at
    if (data.messages) {
      data.messages.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      )
    }

    return data
  },

  /**
   * Add a message to a conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} role - 'user' or 'assistant'
   * @param {string} content - Message content
   * @param {Object} metadata - Optional metadata
   * @returns {Promise<Object>} Created message
   */
  async addMessage(conversationId, role, content, metadata = null) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        metadata: metadata || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding message:', error)
      throw error
    }

    return data
  },

  /**
   * Update conversation title
   * @param {string} conversationId - Conversation ID
   * @param {string} title - New title
   */
  async updateTitle(conversationId, title) {
    const { error } = await supabase
      .from('chat_conversations')
      .update({ title })
      .eq('id', conversationId)

    if (error) {
      console.error('Error updating title:', error)
      throw error
    }
  },

  /**
   * Delete a conversation and all its messages
   * @param {string} conversationId - Conversation ID
   */
  async deleteConversation(conversationId) {
    const { error } = await supabase
      .from('chat_conversations')
      .delete()
      .eq('id', conversationId)

    if (error) {
      console.error('Error deleting conversation:', error)
      throw error
    }
  },

  /**
   * Archive a conversation (soft delete)
   * @param {string} conversationId - Conversation ID
   */
  async archiveConversation(conversationId) {
    const { error } = await supabase
      .from('chat_conversations')
      .update({ is_archived: true })
      .eq('id', conversationId)

    if (error) {
      console.error('Error archiving conversation:', error)
      throw error
    }
  },

  /**
   * Unarchive a conversation
   * @param {string} conversationId - Conversation ID
   */
  async unarchiveConversation(conversationId) {
    const { error } = await supabase
      .from('chat_conversations')
      .update({ is_archived: false })
      .eq('id', conversationId)

    if (error) {
      console.error('Error unarchiving conversation:', error)
      throw error
    }
  },

  /**
   * Search conversations by title or message content
   * @param {string} userId - User ID
   * @param {string} query - Search query
   * @returns {Promise<Array>} Matching conversations
   */
  async searchConversations(userId, query) {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select(`
        *,
        messages:chat_messages(*)
      `)
      .eq('user_id', userId)
      .ilike('title', `%${query}%`)

    if (error) {
      console.error('Error searching conversations:', error)
      throw error
    }

    return data
  },

  /**
   * Get message count for a conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<number>} Message count
   */
  async getMessageCount(conversationId) {
    const { count, error } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId)

    if (error) {
      console.error('Error getting message count:', error)
      throw error
    }

    return count
  },

  /**
   * Bulk create messages (useful for conversation imports)
   * @param {string} conversationId - Conversation ID
   * @param {Array} messages - Array of {role, content, metadata}
   * @returns {Promise<Array>} Created messages
   */
  async bulkAddMessages(conversationId, messages) {
    const messagesToInsert = messages.map(msg => ({
      conversation_id: conversationId,
      role: msg.role,
      content: msg.content,
      metadata: msg.metadata || {}
    }))

    const { data, error } = await supabase
      .from('chat_messages')
      .insert(messagesToInsert)
      .select()

    if (error) {
      console.error('Error bulk adding messages:', error)
      throw error
    }

    return data
  },

  /**
   * Export conversation to JSON
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Conversation data
   */
  async exportConversation(conversationId) {
    const conversation = await this.getConversationWithMessages(conversationId)
    return {
      title: conversation.title,
      created_at: conversation.created_at,
      messages: conversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        created_at: msg.created_at
      }))
    }
  }
}

export default chatService
