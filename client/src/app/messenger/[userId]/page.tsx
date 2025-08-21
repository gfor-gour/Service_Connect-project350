"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatWindow from "../ChatWindow";

export default function UserChat() {
  const { userId } = useParams();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    const getOrCreateConversation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/conversations/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          setConversationId(null);
          return;
        }

        const data = await response.json();
        setConversationId(data?._id || null);
      } catch {
        setConversationId(null);
      } finally {
        setLoading(false);
      }
    };

    const email = localStorage.getItem("email") || "";
    setCurrentUserEmail(email);

    if (userId) getOrCreateConversation();
    else setLoading(false);
  }, [userId]);

  const handleBack = () => router.back();

  if (loading)
    return <div className="p-4 text-gray-600">Loading conversation...</div>;

  if (!conversationId)
    return (
      <div className="p-4 text-center text-gray-600">
        Start a conversation by sending someone a message!
      </div>
    );

  return (
    <ChatWindow
      conversationId={conversationId}
      onBack={handleBack}
      currentUserEmail={currentUserEmail}
    />
  );
}
