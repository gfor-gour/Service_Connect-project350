'use client'

import { useState, useEffect } from 'react'
import { User } from 'lucide-react'

interface Conversation {
  _id: string
  participants: {
    _id: string
    name: string
    email: string
  }[]
  lastMessage: string
  updatedAt: string
}

interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void
  selectedConversation: string | null
}

export default function ConversationList({ onSelectConversation, selectedConversation }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/conversations`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) throw new Error('Failed to fetch conversations')
        const data = await response.json()
        setConversations(data)
      } catch (err) {
        setError('Failed to load conversations')
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  if (loading) return <div className="p-4 text-center">Loading conversations...</div>
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>

  return (
    <div className="overflow-y-auto h-full">
      {conversations.map((conversation) => (
        <div
          key={conversation._id}
          className={`p-4 flex items-center gap-3 border-b hover:bg-gray-100 cursor-pointer transition-colors ${
            selectedConversation === conversation._id ? 'bg-gray-100' : ''
          }`}
          onClick={() => onSelectConversation(conversation._id)}
        >
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">
              {conversation.participants[0].name}
            </h3>
            <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
            <p className="text-xs text-gray-400">
              {new Date(conversation.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

