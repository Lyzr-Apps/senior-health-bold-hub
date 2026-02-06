'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { FloatingAssistant } from '@/components/FloatingAssistant'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FaVideo,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideoSlash,
  FaPhoneSlash,
  FaComments,
  FaExpand,
} from 'react-icons/fa'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export default function ConsultationPage() {
  const [sessionActive, setSessionActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [sessionTime, setSessionTime] = useState(0)
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: string; message: string; time: string }>
  >([])
  const [chatInput, setChatInput] = useState('')

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (sessionActive) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [sessionActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartSession = () => {
    setSessionActive(true)
    setChatMessages([
      {
        id: '1',
        sender: 'Dr. Smith',
        message: 'Hello! I can see your assessment. How are you feeling right now?',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ])
  }

  const handleEndSession = () => {
    setSessionActive(false)
    setSessionTime(0)
    setIsMuted(false)
    setIsVideoOff(false)
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      sender: 'You',
      message: chatInput,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setChatMessages((prev) => [...prev, newMessage])
    setChatInput('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Video Consultation
          </h1>
          <p className="text-gray-600">
            Connect with a healthcare provider via secure video call.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Container */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Video */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
                  {!sessionActive ? (
                    <div className="text-center">
                      <FaVideo className="text-6xl text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-6">
                        Video consultation not started
                      </p>
                      <Button
                        onClick={handleStartSession}
                        size="lg"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <FaVideo className="mr-2" />
                        Start Consultation
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-teal-900 flex items-center justify-center">
                        {isVideoOff ? (
                          <div className="text-center">
                            <FaVideoSlash className="text-6xl text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-300">Camera Off</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                              <span className="text-4xl text-white font-bold">
                                DS
                              </span>
                            </div>
                            <p className="text-white font-medium">
                              Dr. Smith
                            </p>
                            <p className="text-gray-300 text-sm">
                              General Practitioner
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Self View */}
                      <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                        {isVideoOff ? (
                          <FaVideoSlash className="text-3xl text-gray-500" />
                        ) : (
                          <div className="text-center">
                            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto">
                              <span className="text-xl text-white font-bold">
                                You
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Session Timer */}
                      <div className="absolute top-4 left-4 bg-black/50 px-4 py-2 rounded-lg">
                        <p className="text-white font-mono">
                          {formatTime(sessionTime)}
                        </p>
                      </div>

                      {/* Expand Button */}
                      <button className="absolute top-4 right-4 bg-black/50 p-3 rounded-lg hover:bg-black/70 transition-colors">
                        <FaExpand className="text-white" />
                      </button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Video Controls */}
            {sessionActive && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsMuted(!isMuted)}
                      className={isMuted ? 'bg-red-100' : ''}
                    >
                      {isMuted ? (
                        <FaMicrophoneSlash className="text-red-600" />
                      ) : (
                        <FaMicrophone />
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={isVideoOff ? 'bg-red-100' : ''}
                    >
                      {isVideoOff ? (
                        <FaVideoSlash className="text-red-600" />
                      ) : (
                        <FaVideo />
                      )}
                    </Button>

                    <Button
                      size="lg"
                      onClick={handleEndSession}
                      className="bg-red-500 hover:bg-red-600 px-8"
                    >
                      <FaPhoneSlash className="mr-2" />
                      End Call
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsChatOpen(!isChatOpen)}
                    >
                      <FaComments />
                    </Button>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isMuted ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    />
                    <span className="text-sm text-gray-600">
                      {isMuted ? 'Muted' : 'Unmuted'}
                    </span>
                    <span className="text-gray-400 mx-2">|</span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isVideoOff ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    />
                    <span className="text-sm text-gray-600">
                      {isVideoOff ? 'Camera Off' : 'Camera On'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaComments className="text-blue-500" />
                  Session Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!sessionActive ? (
                  <p className="text-gray-500 text-center py-8">
                    Chat will be available when consultation starts
                  </p>
                ) : (
                  <>
                    <div className="h-96 overflow-y-auto space-y-3 mb-4">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`${
                            msg.sender === 'You' ? 'text-right' : 'text-left'
                          }`}
                        >
                          <div
                            className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                              msg.sender === 'You'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm font-medium mb-1">
                              {msg.sender}
                            </p>
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSendMessage()
                        }}
                        placeholder="Type a message..."
                      />
                      <Button onClick={handleSendMessage}>Send</Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Provider Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Provider Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Dr. Sarah Smith</p>
                  <p className="text-gray-600">General Practitioner</p>
                </div>
                <div>
                  <p className="text-gray-600">
                    License: #MD-12345
                    <br />
                    Years of Experience: 12
                    <br />
                    Rating: 4.8/5.0
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <FloatingAssistant />
    </div>
  )
}
