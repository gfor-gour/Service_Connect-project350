'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ChatWindow from '../ChatWindow'

export default function UserChat() {
  const { userId } = useParams()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getOrCreateConversation = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/conversations/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) throw new Error('Failed to get or create conversation')
        const data = await response.json()
        setConversationId(data._id)
      } catch (err) {
        setError('Failed to load conversation')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      getOrCreateConversation()
    }
  }, [userId])

  if (loading) return <div className="p-4">Loading conversation...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!conversationId) return <div className="p-4">No conversation found</div>

  return <ChatWindow conversationId={conversationId} />
}

