/**
 * HealthNavigator AI - TypeScript Type Definitions
 */

// ============================================
// Triage Coordinator Manager Response Types
// ============================================

export type UrgencyLevel = 'Low' | 'Moderate' | 'High'

export interface TriageResult {
  urgency_level: UrgencyLevel
  risk_score: number // 0-100
  red_flags: string[]
  specialist: string
  explanation: string
  actions: string[]
  disclaimer: string
}

// ============================================
// App Assistant Chatbot Response Types
// ============================================

export type ActionType = 'navigation' | 'medical_redirect' | 'info'

export interface AssistantResponse {
  message: string
  action_type: ActionType
  redirect_url?: string
}

// ============================================
// Assessment Form Data Types
// ============================================

export interface AssessmentFormData {
  // Step 1: Demographics
  age: string
  gender: string

  // Step 2: Symptoms
  symptoms: string

  // Step 3: Details
  severity: number // 1-10
  duration: string
  conditions: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// ============================================
// History Types
// ============================================

export interface HistoryItem {
  id: string
  date: string
  urgency: UrgencyLevel
  summary: string
  risk_score: number
  specialist: string
  details?: TriageResult
}

// ============================================
// Admin Dashboard Types
// ============================================

export interface DashboardMetrics {
  total_assessments: number
  high_risk_count: number
  red_flag_frequency: number
  active_consultations: number
}

export interface UrgencyDistribution {
  low: number
  moderate: number
  high: number
}

export interface DailyTrend {
  date: string
  count: number
}

export interface HighRiskCase {
  id: string
  date: string
  patient_age: string
  urgency: UrgencyLevel
  risk_score: number
  red_flags: number
}
