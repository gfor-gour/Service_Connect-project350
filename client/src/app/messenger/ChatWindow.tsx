"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import Image from "next/image";
import io, { Socket } from "socket.io-client";

interface Sender {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string | null;
}

interface Message {
  _id: string;
  sender: Sender | null;
  content: string;
  createdAt: string;
}

interface ChatWindowProps {
  conversationId: string;
  onBack: () => void;
  currentUserEmail: string;
}

export default function ChatWindow({
  conversationId,
  onBack,
  currentUserEmail,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/conversations/${conversationId}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();

        // Ensure messages is always an array with properly structured data
        const safeMessages: Message[] = Array.isArray(data)
          ? data
              .filter(
                (msg: unknown): msg is Record<string, unknown> =>
                  msg !== null &&
                  typeof msg === "object" &&
                  typeof (msg as Record<string, unknown>)._id === "string" &&
                  typeof (msg as Record<string, unknown>).content === "string"
              )
              .map((msg: Record<string, unknown>) => {
                const sender = msg.sender as
                  | Record<string, unknown>
                  | null
                  | undefined;

                return {
                  _id: msg._id as string,
                  sender: sender
                    ? {
                        _id: typeof sender._id === "string" ? sender._id : "",
                        name:
                          typeof sender.name === "string"
                            ? sender.name
                            : "Unknown User",
                        email:
                          typeof sender.email === "string" ? sender.email : "",
                        profilePicture:
                          typeof sender.profilePicture === "string"
                            ? sender.profilePicture
                            : null,
                      }
                    : null,
                  content: msg.content as string,
                  createdAt:
                    typeof msg.createdAt === "string"
                      ? msg.createdAt
                      : new Date().toISOString(),
                };
              })
          : [];

        setMessages(safeMessages);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setMessages([]);
        setError("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Initialize socket connection
    if (process.env.NEXT_PUBLIC_APP_BACKEND_URL) {
      socketRef.current = io(process.env.NEXT_PUBLIC_APP_BACKEND_URL, {
        query: { conversationId },
      });

      socketRef.current.on("receive message", (message: unknown) => {
        // Safely handle incoming socket message with proper type checking
        if (!message || typeof message !== "object") return;

        const msg = message as Record<string, unknown>;
        const sender = msg.sender as Record<string, unknown> | null | undefined;

        const safeMessage: Message = {
          _id: typeof msg._id === "string" ? msg._id : Date.now().toString(),
          sender: sender
            ? {
                _id: typeof sender._id === "string" ? sender._id : "",
                name:
                  typeof sender.name === "string"
                    ? sender.name
                    : "Unknown User",
                email: typeof sender.email === "string" ? sender.email : "",
                profilePicture:
                  typeof sender.profilePicture === "string"
                    ? sender.profilePicture
                    : null,
              }
            : null,
          content: typeof msg.content === "string" ? msg.content : "",
          createdAt:
            typeof msg.createdAt === "string"
              ? msg.createdAt
              : new Date().toISOString(),
        };

        setMessages((prev) => [...prev, safeMessage]);
      });

      socketRef.current.on("connect_error", (err: unknown) => {
        console.error("Socket connection error:", err);
      });
    }

    const pollInterval = setInterval(fetchMessages, 5000);

    return () => {
      socketRef.current?.disconnect();
      clearInterval(pollInterval);
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageContent = newMessage.trim();
    setNewMessage(""); // Clear immediately for better UX

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: messageContent }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send message");
      }

      setError(null);
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please try again.");
      setNewMessage(messageContent); // Restore message on error
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      return `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } catch {
      return "";
    }
  };

  const isCurrentUser = (senderEmail: string) => {
    return (
      senderEmail?.trim().toLowerCase() ===
      currentUserEmail?.trim().toLowerCase()
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white flex items-center p-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="mr-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="font-semibold text-lg">Chat</h2>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && (
          <div className="text-center text-gray-500">
            <div className="animate-pulse">Loading messages...</div>
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            💬 No messages to show. Start a conversation!
          </div>
        )}

        {!loading &&
          messages.length > 0 &&
          messages.map((msg) => {
            // Skip messages with invalid structure
            if (!msg || !msg._id || !msg.content || !msg.sender) {
              return null;
            }

            const messageIsFromCurrentUser = isCurrentUser(msg.sender.email);

            return (
              <div
                key={msg._id}
                className={`flex items-end ${
                  messageIsFromCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar for other users */}
                {!messageIsFromCurrentUser && (
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    {msg.sender.profilePicture ? (
                      <Image
                        src={msg.sender.profilePicture}
                        alt={msg.sender.name || "User"}
                        width={40}
                        height={40}
                        className="object-cover rounded-full"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          if (target.nextSibling) {
                            (target.nextSibling as HTMLElement).style.display =
                              "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold ${
                        msg.sender.profilePicture ? "hidden" : "flex"
                      }`}
                    >
                      {msg.sender.name
                        ? msg.sender.name.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`p-3 rounded-lg max-w-xs break-words ${
                    messageIsFromCurrentUser
                      ? "bg-gray-800 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.createdAt && (
                    <div
                      className={`text-xs mt-1 ${
                        messageIsFromCurrentUser
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="bg-white border-t border-gray-200">
        <form onSubmit={sendMessage} className="p-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Type your message..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="ml-2 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="px-4 pb-2">
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
