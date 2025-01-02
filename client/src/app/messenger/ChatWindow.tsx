'use client'

import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'

interface Message {
  _id: string
  sender: {
    _id: string
    name: string
  }
  content: string
  createdAt: string
}

interface ChatWindowProps {
  conversationId: string
}

export default function ChatWindow({ conversationId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const socketRef = useRef<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/conversations/${conversationId}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) throw new Error('Failed to fetch messages')
        const data = await response.json()
        setMessages(data)
      } catch (err) {
        setError('Failed to load messages')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Socket.io setup
    socketRef.current = io(process.env.NEXT_PUBLIC_APP_BACKEND_URL as string, {
      query: { conversationId }
    })

    socketRef.current.on('receive message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMessage })
      })
      if (!response.ok) throw new Error('Failed to send message')
      setNewMessage('')
    } catch (err) {
      setError('Failed to send message')
    }
  }

  if (loading) return <div className="p-4">Loading messages...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message._id} className="mb-4">
            <p className="font-semibold">{message.sender.name}</p>
            <p>{message.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 border-t">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded w-full">
          Send
        </button>
      </form>
    </div>
  )
}

