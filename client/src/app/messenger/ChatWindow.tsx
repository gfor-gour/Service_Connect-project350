"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import io, { Socket } from "socket.io-client";

interface Message {
  _id: string;
  sender: { _id: string; email: string; name: string };
  content: string;
  createdAt: string;
}

interface ChatWindowProps {
  conversationId: string;
  onBack: () => void;
  currentUserEmail: string;
}

export default function ChatWindow({ conversationId, onBack, currentUserEmail }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null); // Specify Socket type here
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/conversations/${conversationId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        setMessages(data);
        setError(null); // Clear any previous errors related to messages
      } catch {
        // Don't set error on fetch failure — just silently fail and keep messages empty
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    socketRef.current = io(process.env.NEXT_PUBLIC_APP_BACKEND_URL as string, { query: { conversationId } });
    socketRef.current.on("receive message", (message: Message) => {
      setMessages((prev) => [...prev, message]); // Add new message to the list
    });

    // Auto-poll every 5 seconds for new messages (fallback mechanism)
    const pollInterval = setInterval(fetchMessages, 5000); // Poll every 5 seconds

    return () => {
      socketRef.current?.disconnect();
      clearInterval(pollInterval); // Clear polling when component unmounts
    };
  }, [conversationId]);

  // Scroll to bottom when messages are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ content: newMessage }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");
      setNewMessage(""); // Clear the input after sending
      setError(null); // Clear any send errors on success
    } catch {
      setError("Failed to send message"); // Show error only on send failure
    }
  };

  // Helper function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white flex items-center p-4 border-b border-gray-200">
        <button onClick={onBack} className="mr-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="font-semibold text-lg">Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && <div>Loading messages...</div>}

        {!loading && messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            💬 No messages to show. Send someone a message to start chatting!
          </div>
        )}

        {/* Show send errors only */}
        {error && !loading && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        {messages.map((msg) => {
          const isCurrentUser =
            msg.sender.email.trim().toLowerCase() === currentUserEmail.trim().toLowerCase();
          return (
            <div key={msg._id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-3 rounded-lg ${
                  isCurrentUser ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
                }`}
              >
                {msg.content}
                <div className="text-xs text-gray-500 mt-1">{formatTime(msg.createdAt)}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-full"
          placeholder="Type your message..."
        />
        <button type="submit" className="ml-2 p-2 bg-gray-800 text-white rounded-full">
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
