'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
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
  onBack?: () => void
  currentUserId?: string
}

export default function ChatWindow({ conversationId, onBack, currentUserId }: ChatWindowProps) {
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

  if (loading) return <div className="p-4 text-center">Loading messages...</div>
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center p-4 border-b border-gray-200">
        <button onClick={onBack} className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="font-semibold">Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => {
          const isSender = message.sender._id === currentUserId
          return (
            <div 
              key={message._id} 
              className={`mb-4 flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%]`}>
                {!isSender && (
                  <p className="text-sm text-gray-600 mb-1">{message.sender.name}</p>
                )}
                <div 
                  className={`p-3 rounded-2xl ${
                    isSender 
                      ? 'bg-blue-500 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-900 rounded-tl-none'
                  }`}
                >
                  <p>{message.content}</p>
                </div>
                <p className={`text-xs text-gray-400 mt-1 ${isSender ? 'text-right' : 'text-left'}`}>
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

