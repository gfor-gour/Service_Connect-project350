"use client";
export const dynamic = "force-dynamic";
import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  User,
  Plus,
  X,
  Trash2,
  MessageSquare,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "../components/Sidebar";

interface Message {
  _id?: string;
  content: string;
  sender: "bot" | "user";
  category?: string;
  description?: string;
  timestamp: Date;
  sessionId?: string;
}

interface PromptForm {
  category: string;
  description: string;
  question: string;
}

interface ApiResponse {
  answer: string;
  sessionId: string;
  suggestions?: string[];
  error?: string;
}

const allowedCategories = [
  { value: "electrician", label: "Electrician" },
  { value: "plumber", label: "Plumber" },
  { value: "technician", label: "Technician" },
  { value: "cleaner", label: "Cleaner" },
  { value: "mechanic", label: "Mechanic" },
  { value: "carpenter", label: "Carpenter" },
  { value: "babysitter", label: "Babysitter" },
];

// Custom Badge Component
const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 ${className}`}
  >
    {children}
  </span>
);

// Custom Alert Component
const Alert = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative w-full rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}
    role="alert"
  >
    <div className="flex">
      <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
      <div className="text-sm text-red-700">{children}</div>
    </div>
  </div>
);

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [promptForm, setPromptForm] = useState<PromptForm>({
    category: "",
    description: "",
    question: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      content:
        "Hi! I'm your AI assistant for local services. I can help you find trusted electricians, plumbers, technicians, cleaners, mechanics, carpenters, and babysitters in your area. What service do you need today? ✨",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setSuggestions([
      "Find an electrician",
      "Need a plumber",
      "Looking for a cleaner",
      "Find a babysitter",
    ]);
  }, []);

  const handleQuickSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
  };

  const handleFormSend = async () => {
    if (!promptForm.category || !promptForm.description) {
      setError("Please fill in both category and description fields");
      return;
    }

    const formattedQuestion = promptForm.question
      ? `${promptForm.question}`
      : "Please provide helpful information and recommendations.";

    await sendMessage(
      formattedQuestion,
      promptForm.category,
      promptForm.description
    );

    // Reset form
    setPromptForm({ category: "", description: "", question: "" });
    setShowForm(false);
  };

  const sendMessage = async (
    messageContent: string,
    category?: string,
    description?: string
  ) => {
    const userMessage: Message = {
      content: messageContent,
      sender: "user",
      category,
      description,
      timestamp: new Date(),
      sessionId,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await axios.post<ApiResponse>(
        `${API_BASE_URL}/api/generate/generate`,
        {
          question: messageContent,
          category,
          description,
          sessionId,
        }
      );

      const {
        answer,
        sessionId: newSessionId,
        suggestions: newSuggestions,
      } = response.data;

      // Update session ID if it's new
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId);
      }

      const botMessage: Message = {
        content: answer || "Sorry, I did not understand that.",
        sender: "bot",
        timestamp: new Date(),
        sessionId: newSessionId || sessionId,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (newSuggestions) {
        setSuggestions(newSuggestions);
      }
    } catch (error: unknown) {
      console.error("Error:", error);
      const errorMessage =
        (error instanceof axios.AxiosError && error.response?.data?.error) ||
        "Sorry, something went wrong. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          content: errorMessage,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setError(errorMessage);
    }

    setLoading(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const clearChat = async () => {
    if (!sessionId) {
      // If no session ID, just reset locally
      const welcomeMessage: Message = {
        content:
          "Hi! I'm your AI assistant for local services. I can help you find trusted electricians, plumbers, technicians, cleaners, mechanics, carpenters, and babysitters in your area. What service do you need today? ✨",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      setSessionId("");
      setSuggestions([
        "Find an electrician",
        "Need a plumber",
        "Looking for a cleaner",
        "Find a babysitter",
      ]);
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/generate/history`, {
        data: { sessionId },
      });

      // Reset to welcome message
      const welcomeMessage: Message = {
        content:
          "Hi! I'm your AI assistant for local services. I can help you find trusted electricians, plumbers, technicians, cleaners, mechanics, carpenters, and babysitters in your area. What service do you need today? ✨",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      setSessionId("");
      setSuggestions([
        "Find an electrician",
        "Need a plumber",
        "Looking for a cleaner",
        "Find a babysitter",
      ]);
    } catch (error) {
      console.error("Error clearing chat:", error);
      setError("Failed to clear chat history");
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar onToggle={setIsSidebarCollapsed} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out px-4 md:px-0 md:pt-14 ${
          isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        <div className="py-4 md:p-8 w-full max-w-none">
          <div className="w-full space-y-6 md:space-y-8">
            <Card className="bg-white shadow-xl border-slate-200 overflow-hidden">
              <CardHeader className="bg-gray-800 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Bot className="w-7 h-7 text-gray-800" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">
                        AI Services Assistant
                      </CardTitle>
                      <p className="text-gray-100 text-sm">
                        Your trusted local services companion
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowForm(!showForm)}
                      className="bg-white text-gray-800 hover:bg-gray-50 border-white shadow-sm"
                    >
                      {showForm ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span className="ml-1 hidden sm:inline">
                        {showForm ? "Cancel" : "Detailed Request"}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearChat}
                      className="bg-white text-gray-800 hover:bg-gray-50 border-white shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="ml-1 hidden sm:inline">Clear</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Error Alert */}
                {error && (
                  <div className="m-6">
                    <Alert>{error}</Alert>
                  </div>
                )}

                {showForm && (
                  <div className="p-6 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-gray-500" />
                      <h3 className="text-lg font-semibold text-slate-900">
                        Detailed Service Request
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Service Category *
                        </label>
                        <Select
                          value={promptForm.category}
                          onValueChange={(value) =>
                            setPromptForm((prev) => ({
                              ...prev,
                              category: value,
                            }))
                          }
                        >
                          <SelectTrigger className="bg-white border-slate-300">
                            <SelectValue placeholder="Select a service category" />
                          </SelectTrigger>
                          <SelectContent>
                            {allowedCategories.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Additional Question
                        </label>
                        <Input
                          value={promptForm.question}
                          onChange={(e) =>
                            setPromptForm((prev) => ({
                              ...prev,
                              question: e.target.value,
                            }))
                          }
                          placeholder="Any specific questions?"
                          className="bg-white border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description *
                      </label>
                      <Textarea
                        value={promptForm.description}
                        onChange={(e) =>
                          setPromptForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe what you need help with..."
                        className="bg-white border-slate-300 min-h-[100px]"
                      />
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Button
                        onClick={handleFormSend}
                        disabled={
                          !promptForm.category ||
                          !promptForm.description ||
                          loading
                        }
                        className="bg-gray-800 hover:bg-gray-900 text-white shadow-sm"
                      >
                        {loading ? "Sending..." : "Send Request"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowForm(false);
                          setError("");
                        }}
                        className="border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-white">
                  {messages.map((message, index) => (
                    <div
                      key={message._id || index}
                      className={`flex ${
                        message.sender === "bot"
                          ? "justify-start"
                          : "justify-end"
                      } gap-3`}
                    >
                      {message.sender === "bot" && (
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}

                      <div
                        className={`max-w-[75%] ${
                          message.sender === "bot"
                            ? "bg-slate-100 border border-slate-200 shadow-sm"
                            : "bg-gray-800 shadow-sm"
                        } rounded-2xl px-4 py-3`}
                      >
                        {message.category && (
                          <div className="mb-2">
                            <Badge>
                              {message.category.charAt(0).toUpperCase() +
                                message.category.slice(1)}
                            </Badge>
                          </div>
                        )}
                        <p
                          className={`${
                            message.sender === "bot"
                              ? "text-slate-800"
                              : "text-white"
                          } whitespace-pre-wrap leading-relaxed`}
                        >
                          {message.content}
                        </p>
                        {message.description && (
                          <p
                            className={`text-xs mt-2 italic ${
                              message.sender === "bot"
                                ? "text-slate-600"
                                : "text-gray-100"
                            }`}
                          >
                            &quot;{message.description}&quot;
                          </p>
                        )}
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === "bot"
                              ? "text-slate-500"
                              : "text-gray-100"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>

                      {message.sender === "user" && (
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 border border-slate-300">
                          <User className="w-5 h-5 text-slate-600" />
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start gap-3">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                        <Bot className="w-5 h-5 text-white animate-pulse" />
                      </div>
                      <div className="max-w-[75%] bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {suggestions.length > 0 && (
                  <div className="p-4 bg-slate-50 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      Quick suggestions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          disabled={loading}
                          className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-6 border-t border-slate-200 bg-white">
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !e.shiftKey && handleQuickSend()
                      }
                      placeholder="Type your message here..."
                      className="flex-1 bg-white border-slate-300 focus:border-gray-500 shadow-sm"
                      disabled={loading}
                    />
                    <Button
                      onClick={handleQuickSend}
                      disabled={loading || !input.trim()}
                      className="bg-gray-700 hover:bg-gray-800 text-white shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Use the detailed form above for specific service requests,
                    or type a quick message here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
