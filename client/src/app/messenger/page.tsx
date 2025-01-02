'use client'

import { useState, useEffect } from 'react'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'
import Search from '../components/Search'

export default function Messenger() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            {showSearch ? 'Back to Conversations' : 'Search Users'}
          </button>
        </div>
        {showSearch ? (
          <Search onSelectUser={(userId: string) => {
            setSelectedConversation(userId)
            setShowSearch(false)
          }} />
        ) : (
          <ConversationList onSelectConversation={(conversationId: string) => setSelectedConversation(conversationId)} />
        )}
      </div>
      <div className="w-2/3">
        {selectedConversation ? (
          <ChatWindow conversationId={selectedConversation} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation or search for a user to start chatting
          </div>
        )}
      </div>
    </div>
  )
}

