import { NextRequest, NextResponse } from 'next/server'
import parseLLMJson from '@/lib/jsonParser'
import { getMockTriageResult, getMockChatbotResponse } from '@/lib/mockAgentData'

const LYZR_API_URL = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/'
const LYZR_API_KEY = process.env.LYZR_API_KEY || ''

// Development mode: set to true to use mock data instead of API calls
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

// Agent IDs from workflow_state.json
const TRIAGE_MANAGER_ID = '6985a4dae2c0086a4fc43be0'
const CHATBOT_ASSISTANT_ID = '6985a4f5705117394b71194f'

// Types
interface NormalizedAgentResponse {
  status: 'success' | 'error'
  result: Record<string, any>
  message?: string
  metadata?: {
    agent_name?: string
    timestamp?: string
    [key: string]: any
  }
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Handle mock responses when credits are exhausted or in dev mode
function handleMockResponse(agent_id: string, message: string, user_id?: string, session_id?: string) {
  const finalUserId = user_id || `user-${generateUUID()}`
  const finalSessionId = session_id || `${agent_id}-${generateUUID().substring(0, 12)}`

  // Parse message for triage manager
  if (agent_id === TRIAGE_MANAGER_ID) {
    try {
      // Try to parse as JSON first (from AssessmentForm)
      const data = typeof message === 'string' ? JSON.parse(message) : message
      const mockResult = getMockTriageResult(data.severity || 5, data.symptoms || message)

      return NextResponse.json({
        success: true,
        response: {
          status: 'success',
          result: mockResult,
          message: 'Mock triage assessment generated (API credits exhausted)',
          metadata: {
            agent_name: 'Triage Coordinator Manager (Mock)',
            timestamp: new Date().toISOString(),
            mock_data: true,
          },
        },
        agent_id,
        user_id: finalUserId,
        session_id: finalSessionId,
        timestamp: new Date().toISOString(),
      })
    } catch {
      // If JSON parse fails, use default values
      const mockResult = getMockTriageResult(5, message)
      return NextResponse.json({
        success: true,
        response: {
          status: 'success',
          result: mockResult,
          message: 'Mock triage assessment generated (API credits exhausted)',
          metadata: {
            agent_name: 'Triage Coordinator Manager (Mock)',
            timestamp: new Date().toISOString(),
            mock_data: true,
          },
        },
        agent_id,
        user_id: finalUserId,
        session_id: finalSessionId,
        timestamp: new Date().toISOString(),
      })
    }
  }

  // Handle chatbot assistant
  if (agent_id === CHATBOT_ASSISTANT_ID) {
    const mockResult = getMockChatbotResponse(message)

    return NextResponse.json({
      success: true,
      response: {
        status: 'success',
        result: mockResult,
        message: mockResult.message,
        metadata: {
          agent_name: 'App Assistant Chatbot (Mock)',
          timestamp: new Date().toISOString(),
          mock_data: true,
        },
      },
      agent_id,
      user_id: finalUserId,
      session_id: finalSessionId,
      timestamp: new Date().toISOString(),
    })
  }

  // Default mock response for unknown agents
  return NextResponse.json({
    success: true,
    response: {
      status: 'success',
      result: { message: 'Mock response - API credits exhausted' },
      message: 'Mock response generated',
      metadata: {
        agent_name: 'Mock Agent',
        timestamp: new Date().toISOString(),
        mock_data: true,
      },
    },
    agent_id,
    user_id: finalUserId,
    session_id: finalSessionId,
    timestamp: new Date().toISOString(),
  })
}

function normalizeResponse(parsed: any): NormalizedAgentResponse {
  if (!parsed) {
    return {
      status: 'error',
      result: {},
      message: 'Empty response from agent',
    }
  }

  if (typeof parsed === 'string') {
    return {
      status: 'success',
      result: { text: parsed },
      message: parsed,
    }
  }

  if (typeof parsed !== 'object') {
    return {
      status: 'success',
      result: { value: parsed },
      message: String(parsed),
    }
  }

  if ('status' in parsed && 'result' in parsed) {
    return {
      status: parsed.status === 'error' ? 'error' : 'success',
      result: parsed.result || {},
      message: parsed.message,
      metadata: parsed.metadata,
    }
  }

  if ('status' in parsed) {
    const { status, message, metadata, ...rest } = parsed
    return {
      status: status === 'error' ? 'error' : 'success',
      result: Object.keys(rest).length > 0 ? rest : {},
      message,
      metadata,
    }
  }

  if ('result' in parsed) {
    return {
      status: 'success',
      result: parsed.result,
      message: parsed.message,
      metadata: parsed.metadata,
    }
  }

  if ('message' in parsed && typeof parsed.message === 'string') {
    return {
      status: 'success',
      result: { text: parsed.message },
      message: parsed.message,
    }
  }

  if ('response' in parsed) {
    return normalizeResponse(parsed.response)
  }

  return {
    status: 'success',
    result: parsed,
    message: undefined,
    metadata: undefined,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, agent_id, user_id, session_id, assets } = body

    if (!message || !agent_id) {
      return NextResponse.json(
        {
          success: false,
          response: {
            status: 'error',
            result: {},
            message: 'message and agent_id are required',
          },
          error: 'message and agent_id are required',
        },
        { status: 400 }
      )
    }

    // Handle mock data mode or missing API key
    if (USE_MOCK_DATA || !LYZR_API_KEY) {
      return handleMockResponse(agent_id, message, user_id, session_id)
    }

    const finalUserId = user_id || `user-${generateUUID()}`
    const finalSessionId = session_id || `${agent_id}-${generateUUID().substring(0, 12)}`

    const payload: Record<string, any> = {
      message,
      agent_id,
      user_id: finalUserId,
      session_id: finalSessionId,
    }

    if (assets && assets.length > 0) {
      payload.assets = assets
    }

    const response = await fetch(LYZR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    const rawText = await response.text()

    if (response.ok) {
      const parsed = parseLLMJson(rawText)

      if (parsed?.success === false && parsed?.error) {
        return NextResponse.json({
          success: false,
          response: {
            status: 'error',
            result: {},
            message: parsed.error,
          },
          error: parsed.error,
          raw_response: rawText,
        })
      }

      const normalized = normalizeResponse(parsed)

      return NextResponse.json({
        success: true,
        response: normalized,
        agent_id,
        user_id: finalUserId,
        session_id: finalSessionId,
        timestamp: new Date().toISOString(),
        raw_response: rawText,
      })
    } else {
      let errorMsg = `API returned status ${response.status}`
      let isCreditsExhausted = false

      try {
        const errorData = parseLLMJson(rawText) || JSON.parse(rawText)
        errorMsg = errorData?.error || errorData?.message || errorData?.detail || errorMsg

        // Check if credits exhausted
        if (response.status === 429 || errorMsg.toLowerCase().includes('credits exhausted')) {
          isCreditsExhausted = true
        }
      } catch {}

      // Automatically fall back to mock data when credits exhausted
      if (isCreditsExhausted) {
        console.log('Credits exhausted - falling back to mock data')
        return handleMockResponse(agent_id, message, user_id, session_id)
      }

      return NextResponse.json(
        {
          success: false,
          response: {
            status: 'error',
            result: {},
            message: errorMsg,
          },
          error: errorMsg,
          raw_response: rawText,
        },
        { status: response.status }
      )
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json(
      {
        success: false,
        response: {
          status: 'error',
          result: {},
          message: errorMsg,
        },
        error: errorMsg,
      },
      { status: 500 }
    )
  }
}
