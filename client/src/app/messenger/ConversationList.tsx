"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Participant {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string | null;
}

interface Conversation {
  _id: string;
  participants: (Participant | null)[];
  lastMessage: string;
  updatedAt: string;
}

interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversation: string | null;
}

export default function ConversationList({
  onSelectConversation,
  selectedConversation,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);

    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/conversations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch conversations");

        const data = await response.json();

        // Safely process conversations data
        const safeConversations: Conversation[] = Array.isArray(data)
          ? data
              .filter(
                (conv: unknown): conv is Record<string, unknown> =>
                  conv !== null &&
                  typeof conv === "object" &&
                  typeof (conv as Record<string, unknown>)._id === "string"
              )
              .map((conv: Record<string, unknown>) => ({
                _id: conv._id as string,
                participants: Array.isArray(conv.participants)
                  ? (conv.participants as unknown[])
                      .filter(
                        (p): p is Participant =>
                          p !== null &&
                          typeof p === "object" &&
                          typeof (p as Record<string, unknown>)._id === "string"
                      )
                      .map((p: unknown) => {
                        const participant = p as Record<string, unknown>;
                        return {
                          _id: participant._id as string,
                          name:
                            typeof participant.name === "string"
                              ? participant.name
                              : "Unknown User",
                          email:
                            typeof participant.email === "string"
                              ? participant.email
                              : "",
                          profilePicture:
                            typeof participant.profilePicture === "string"
                              ? participant.profilePicture
                              : null,
                        };
                      })
                  : [],
                lastMessage:
                  typeof conv.lastMessage === "string" ? conv.lastMessage : "",
                updatedAt:
                  typeof conv.updatedAt === "string"
                    ? conv.updatedAt
                    : new Date().toISOString(),
              }))
          : [];

        setConversations(safeConversations);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
        setError("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const getOtherParticipant = (
    conversation: Conversation
  ): Participant | null => {
    if (!conversation.participants || conversation.participants.length === 0) {
      return null;
    }

    // Find the other participant (not the current user)
    const otherParticipant = conversation.participants.find(
      (participant) => participant && participant._id !== userId
    );

    return otherParticipant || null;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Just now";

      const now = new Date();
      const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

      if (diffInHours < 24) {
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (diffInHours < 168) {
        // Less than a week
        return date.toLocaleDateString([], { weekday: "short" });
      } else {
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
      }
    } catch {
      return "Just now";
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse text-gray-500">
          Loading conversations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Try again
        </button>
      </div>
    );
  }

  const validConversations = conversations.filter(
    (conversation) =>
      conversation &&
      conversation._id &&
      conversation.participants &&
      conversation.participants.length > 0
  );

  return (
    <div className="overflow-y-auto h-full">
      {validConversations.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <div className="mb-2">📭</div>
          <div>No conversations available</div>
          <div className="text-xs mt-1">
            Start a conversation to see it here
          </div>
        </div>
      ) : (
        validConversations.map((conversation) => {
          const otherParticipant = getOtherParticipant(conversation);

          // Skip conversations where we can't find the other participant
          if (!otherParticipant) {
            return null;
          }

          return (
            <div
              key={conversation._id}
              className={`p-4 flex items-center gap-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedConversation === conversation._id
                  ? "bg-blue-50 border-blue-200"
                  : "border-gray-200"
              }`}
              onClick={() => onSelectConversation(conversation._id)}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative">
                {otherParticipant.profilePicture ? (
                  <Image
                    src={otherParticipant.profilePicture}
                    alt={otherParticipant.name || "User"}
                    width={48}
                    height={48}
                    className="object-cover rounded-full"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const sibling = target.nextSibling as HTMLElement | null;
                      if (sibling) {
                        sibling.style.display = "flex";
                      }
                    }}
                  />
                ) : null}
                <div
                  className={`absolute inset-0 w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-semibold ${
                    otherParticipant.profilePicture ? "hidden" : "flex"
                  }`}
                >
                  {otherParticipant.name
                    ? otherParticipant.name.charAt(0).toUpperCase()
                    : "?"}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold truncate text-gray-900">
                    {otherParticipant.name || "Unknown User"}
                  </h3>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {formatDate(conversation.updatedAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.lastMessage || "No messages yet"}
                </p>
              </div>

              {/* Unread indicator (you can add logic for this later) */}
              {selectedConversation === conversation._id && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
