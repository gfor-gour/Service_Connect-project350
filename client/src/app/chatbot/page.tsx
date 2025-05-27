"use client"
export const dynamic = "force-dynamic"
import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, User, Plus, X, Trash2, MessageSquare, AlertCircle } from "lucide-react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from "../components/Sidebar"

interface Message {
  _id?: string
  content: string
  sender: "bot" | "user"
  category?: string
  description?: string
  timestamp: Date
  sessionId?: string
}

interface PromptForm {
  category: string
  description: string
  question: string
}

interface ApiResponse {
  answer: string
  sessionId: string
  suggestions?: string[]
  error?: string
}

const allowedCategories = [
  { value: "electrician", label: "Electrician" },
  { value: "plumber", label: "Plumber" },
  { value: "technician", label: "Technician" },
  { value: "cleaner", label: "Cleaner" },
  { value: "mechanic", label: "Mechanic" },
  { value: "carpenter", label: "Carpenter" },
  { value: "babysitter", label: "Babysitter" },
]

// Custom Badge Component
const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span
    className={`inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-800 ${className}`}
  >
    {children}
  </span>
)

// Custom Alert Component
const Alert = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative w-full rounded-lg border border-red-200 bg-red-50 p-4 ${className}`} role="alert">
    <div className="flex">
      <AlertCircle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
      <div className="text-sm text-red-800">{children}</div>
    </div>
  </div>
)

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState<string>("")
  const [promptForm, setPromptForm] = useState<PromptForm>({
    category: "",
    description: "",
    question: "",
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const API_BASE_URL = process.env.NEXT_PUBLIC_APP_BACKEND_URL || "http://localhost:5000"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: Message = {
      content:
        "Hi, I am your local services assistant! I can help you find information about electricians, plumbers, technicians, cleaners, mechanics, carpenters, and babysitters. How can I assist you today? 😊",
      sender: "bot",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
    setSuggestions(["Find an electrician", "Need a plumber", "Looking for a cleaner", "Find a babysitter"])
  }, [])

  const handleQuickSend = async () => {
    if (!input.trim()) return
    await sendMessage(input)
  }

  const handleFormSend = async () => {
    if (!promptForm.category || !promptForm.description) {
      setError("Please fill in both category and description fields")
      return
    }

    const formattedQuestion = promptForm.question
      ? `${promptForm.question}`
      : "Please provide helpful information and recommendations."

    await sendMessage(formattedQuestion, promptForm.category, promptForm.description)

    // Reset form
    setPromptForm({ category: "", description: "", question: "" })
    setShowForm(false)
  }

  const sendMessage = async (messageContent: string, category?: string, description?: string) => {
    const userMessage: Message = {
      content: messageContent,
      sender: "user",
      category,
      description,
      timestamp: new Date(),
      sessionId,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)
    setError("")

    try {
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/api/generate/generate`, {
        question: messageContent,
        category,
        description,
        sessionId,
      })

      const { answer, sessionId: newSessionId, suggestions: newSuggestions } = response.data

      // Update session ID if it's new
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId)
      }

      const botMessage: Message = {
        content: answer || "Sorry, I did not understand that.",
        sender: "bot",
        timestamp: new Date(),
        sessionId: newSessionId || sessionId,
      }

      setMessages((prev) => [...prev, botMessage])

      if (newSuggestions) {
        setSuggestions(newSuggestions)
      }
    } catch (error: unknown) {
      console.error("Error:", error)
      const errorMessage = (error instanceof axios.AxiosError && error.response?.data?.error) || "Sorry, something went wrong. Please try again."

      setMessages((prev) => [
        ...prev,
        {
          content: errorMessage,
          sender: "bot",
          timestamp: new Date(),
        },
      ])
      setError(errorMessage)
    }

    setLoading(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const clearChat = async () => {
    if (!sessionId) {
      // If no session ID, just reset locally
      const welcomeMessage: Message = {
        content:
          "Hi, I'm your local services assistant! I can help you find information about electricians, plumbers, technicians, cleaners, mechanics, carpenters, and babysitters. How can I assist you today? 😊",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
      setSessionId("")
      setSuggestions(["Find an electrician", "Need a plumber", "Looking for a cleaner", "Find a babysitter"])
      return
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/generate/history`, {
        data: { sessionId },
      })

      // Reset to welcome message
      const welcomeMessage: Message = {
        content:
          "Hi, I'm your local services assistant! I can help you find information about electricians, plumbers, technicians, cleaners, mechanics, carpenters, and babysitters. How can I assist you today? 😊",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
      setSessionId("")
      setSuggestions(["Find an electrician", "Need a plumber", "Looking for a cleaner", "Find a babysitter"])
    } catch (error) {
      console.error("Error clearing chat:", error)
      setError("Failed to clear chat history")
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-2xl border border-gray-200">
            <CardHeader className="bg-gray-800 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-gray-800" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Local Services Assistant</CardTitle>
                    <p className="text-gray-300 text-sm">Ask about local service providers</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowForm(!showForm)}
                    className="bg-white text-gray-800 hover:bg-gray-100 border-white"
                  >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span className="ml-1 hidden sm:inline">{showForm ? "Cancel" : "Detailed Request"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearChat}
                    className="bg-white text-gray-800 hover:bg-gray-100 border-white"
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
                <div className="m-4">
                  <Alert>{error}</Alert>
                </div>
              )}

              {/* Form Section */}
              {showForm && (
                <div className="p-6 bg-gray-50 border-b">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Service Request</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Category *</label>
                      <Select
                        value={promptForm.category}
                        onValueChange={(value) => setPromptForm((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select a service category" />
                        </SelectTrigger>
                        <SelectContent>
                          {allowedCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Question</label>
                      <Input
                        value={promptForm.question}
                        onChange={(e) => setPromptForm((prev) => ({ ...prev, question: e.target.value }))}
                        placeholder="Any specific questions?"
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <Textarea
                      value={promptForm.description}
                      onChange={(e) => setPromptForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what you need help with..."
                      className="bg-white min-h-[100px]"
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={handleFormSend}
                      disabled={!promptForm.category || !promptForm.description || loading}
                      className="bg-gray-800 hover:bg-gray-700 text-white"
                    >
                      {loading ? "Sending..." : "Send Request"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowForm(false)
                        setError("")
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Messages Section */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-white">
                {messages.map((message, index) => (
                  <div
                    key={message._id || index}
                    className={`flex ${message.sender === "bot" ? "justify-start" : "justify-end"} gap-3`}
                  >
                    {message.sender === "bot" && (
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] ${
                        message.sender === "bot" ? "bg-gray-100 border border-gray-200" : "bg-gray-800"
                      } rounded-2xl px-4 py-3 shadow-sm`}
                    >
                      {message.category && (
                        <div className="mb-2">
                          <Badge className="bg-gray-200 text-gray-800">
                            {message.category.charAt(0).toUpperCase() + message.category.slice(1)}
                          </Badge>
                        </div>
                      )}
                      <p className={`${message.sender === "bot" ? "text-gray-800" : "text-white"} whitespace-pre-wrap`}>
                        {message.content}
                      </p>
                      {message.description && (
                        <p className="text-xs text-gray-500 mt-1 italic">{`"${message.description}"`}</p>
                      )}
                      <p className={`text-xs mt-1 ${message.sender === "bot" ? "text-gray-500" : "text-gray-300"}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>

                    {message.sender === "user" && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-300">
                        <User className="w-5 h-5 text-gray-800" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="max-w-[70%] bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Section */}
              {suggestions.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-b">
                  <p className="text-sm font-medium text-gray-700 mb-2">Suggested questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        disabled={loading}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Input Section */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleQuickSend()}
                    placeholder="Type a quick message..."
                    className="flex-1 bg-white border-gray-300 focus:border-gray-800"
                    disabled={loading}
                  />
                  <Button
                    onClick={handleQuickSend}
                    disabled={loading || !input.trim()}
                    className="bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Use the detailed form above for specific service requests, or type a quick message here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
