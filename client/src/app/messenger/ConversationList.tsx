'use client'

import { useState, useEffect } from 'react'

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
}

export default function ConversationList({ onSelectConversation }: ConversationListProps) {
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

  if (loading) return <div className="p-4">Loading conversations...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="overflow-y-auto h-full">
      {conversations.map((conversation) => (
        <div
          key={conversation._id}
          className="p-4 border-b hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelectConversation(conversation._id)}
        >
          <h3 className="font-semibold">
            {conversation.participants[0].name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
          <p className="text-xs text-gray-400">
            {new Date(conversation.updatedAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}

