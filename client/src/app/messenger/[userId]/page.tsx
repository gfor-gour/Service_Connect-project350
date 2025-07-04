'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ChatWindow from '../ChatWindow'

export default function UserChat() {
  const { userId } = useParams()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  // Remove error string state, we'll handle differently
  const router = useRouter()
  const [currentUserEmail, setCurrentUserEmail] = useState('')

  useEffect(() => {
    const getOrCreateConversation = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No token found')

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/conversations/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          // Instead of throwing error, just set conversationId null to show message
          setConversationId(null)
          return
        }

        const data = await response.json()
        setConversationId(data._id)
      } catch {
        // On catch error, just treat as no conversation found to show friendly message
        setConversationId(null)
      } finally {
        setLoading(false)
      }
    }

    const email = localStorage.getItem('email') || ''
    setCurrentUserEmail(email)

    if (userId) {
      getOrCreateConversation()
    } else {
      setLoading(false)
      setConversationId(null)
    }
  }, [userId])

  const handleBack = () => {
    router.back()
  }

  if (loading) return <div className="p-4">Loading conversation...</div>

  // Instead of showing error, show this friendly message if no conversationId
  if (!conversationId)
    return (
      <div className="p-4 text-center text-gray-600">
        Send someone a message to start chatting.
      </div>
    )

  return (
    <ChatWindow
      conversationId={conversationId}
      onBack={handleBack}
      currentUserEmail={currentUserEmail}
    />
  )
}
