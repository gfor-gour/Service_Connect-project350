"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import ChatWindow from "../ChatWindow";

export default function UserChat() {
  const { userId } = useParams();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const getOrCreateConversation = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/conversations/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar onToggle={setIsSidebarCollapsed} />
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
          } px-4 md:px-0 md:pt-14`}
        >
          <div className="p-4 text-gray-600">Loading conversation...</div>
        </div>
      </div>
    );

  if (!conversationId)
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar onToggle={setIsSidebarCollapsed} />
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
          } px-4 md:px-0 md:pt-14`}
        >
          <div className="p-4 text-center text-gray-600">
            Start a conversation by sending someone a message!
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onToggle={setIsSidebarCollapsed} />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        } md:pt-14`}
      >
        <ChatWindow
          conversationId={conversationId}
          onBack={handleBack}
          currentUserEmail={currentUserEmail}
        />
      </div>
    </div>
  );
}
