'use client'

import { useState } from 'react'
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { callAIAgent } from '@/lib/aiAgent'
import { ChatMessage, AssistantResponse } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const ASSISTANT_AGENT_ID = '6985a4f5705117394b71194f'

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      const result = await callAIAgent(userMessage.content, ASSISTANT_AGENT_ID)

      let assistantContent = ''
      let redirectUrl: string | undefined

      if (result.success) {
        // Try to parse as AssistantResponse
        const responseData = result.response.result

        if (responseData.message) {
          assistantContent = responseData.message
        } else if (typeof responseData === 'string') {
          assistantContent = responseData
        } else {
          assistantContent = JSON.stringify(responseData)
        }

        if (responseData.redirect_url) {
          redirectUrl = responseData.redirect_url
        }
      } else {
        assistantContent =
          'Sorry, I encountered an error. Please try again or contact support.'
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Handle navigation if redirect_url is present
      if (redirectUrl) {
        setTimeout(() => {
          router.push(redirectUrl)
          setIsOpen(false)
        }, 1500)
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Network error. Please check your connection and try again.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg bg-cyan-500 hover:bg-cyan-600 z-50"
        size="icon"
        aria-label="Open chat assistant"
      >
        <FaComments className="text-xl text-white" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
      <CardHeader className="border-b bg-cyan-500 text-white rounded-t-lg flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <FaComments className="text-xl" />
          <CardTitle className="text-lg">App Assistant</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 text-white hover:bg-cyan-600"
        >
          <FaTimes />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <FaComments className="text-4xl mx-auto mb-2 text-gray-300" />
            <p className="text-sm">
              Ask me about using the app, navigating features, or finding
              information.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            </div>
          </div>
        )}
      </CardContent>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !inputValue.trim()}
            size="icon"
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
