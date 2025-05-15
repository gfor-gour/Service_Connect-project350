'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'  // Import useRouter for navigation handling
import ChatWindow from '../ChatWindow'

export default function UserChat() {
  const { userId } = useParams()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()  // Use the router for navigation
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('')

  useEffect(() => {
    const getOrCreateConversation = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No token found')

        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/conversations/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to get or create conversation')
        
        const data = await response.json()
        setConversationId(data._id)
      } catch {
        setError('Failed to load conversation')
      } finally {
        setLoading(false)
      }
    }

    // Retrieve current user's email from localStorage or other method
    const email = localStorage.getItem('email') || ''
    setCurrentUserEmail(email)
    console.log('Current user email:', email)

    if (userId) {
      getOrCreateConversation()
    }
  }, [userId])

  const handleBack = () => {
    // Navigate back to previous page
    router.back()  // Use Next.js router to go back
  }

  if (loading) return <div className="p-4">Loading conversation...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!conversationId) return <div className="p-4">No conversation found</div>

  return (
    <ChatWindow
      conversationId={conversationId}
      onBack={handleBack}  // Pass the handleBack function to the ChatWindow
      currentUserEmail={currentUserEmail}  // Pass current user email to the ChatWindow
    />
  )
}
