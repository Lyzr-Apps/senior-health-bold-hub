'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { FloatingAssistant } from '@/components/FloatingAssistant'
import { RiskResultCard } from '@/components/RiskResultCard'
import { TriageResult } from '@/lib/types'
import { Loader2 } from 'lucide-react'

export default function ResultsPage() {
  const [result, setResult] = useState<TriageResult | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedResult = sessionStorage.getItem('triageResult')

    if (!storedResult) {
      // No result found, redirect to assessment
      router.push('/assessment')
      return
    }

    try {
      const parsedResult = JSON.parse(storedResult)

      // Transform the result to match TriageResult interface
      const triageResult: TriageResult = {
        urgency_level:
          parsedResult.urgency_level ||
          parsedResult.urgency ||
          parsedResult.level ||
          'Moderate',
        risk_score:
          parsedResult.risk_score || parsedResult.score || parsedResult.risk || 50,
        red_flags:
          parsedResult.red_flags || parsedResult.redFlags || parsedResult.flags || [],
        specialist:
          parsedResult.specialist ||
          parsedResult.recommended_specialist ||
          parsedResult.specialization ||
          'General Practice',
        explanation:
          parsedResult.explanation ||
          parsedResult.reasoning ||
          parsedResult.assessment ||
          parsedResult.message ||
          'Assessment completed. Please review the recommendations.',
        actions:
          parsedResult.actions ||
          parsedResult.recommendations ||
          parsedResult.next_steps || [
            'Follow recommended care pathway',
            'Monitor symptoms',
            'Seek medical attention if symptoms worsen',
          ],
        disclaimer:
          parsedResult.disclaimer ||
          'This assessment is for informational purposes only and does not constitute medical advice. Always consult with a healthcare professional for medical concerns.',
      }

      setResult(triageResult)

      // Save to history
      const historyItem = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        urgency: triageResult.urgency_level,
        summary: triageResult.explanation.substring(0, 100) + '...',
        risk_score: triageResult.risk_score,
        specialist: triageResult.specialist,
        details: triageResult,
      }

      const existingHistory = JSON.parse(
        localStorage.getItem('assessmentHistory') || '[]'
      )
      localStorage.setItem(
        'assessmentHistory',
        JSON.stringify([historyItem, ...existingHistory])
      )
    } catch (error) {
      console.error('Failed to parse triage result:', error)
      router.push('/assessment')
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Assessment Results
          </h1>
          <p className="text-gray-600">
            Review your personalized triage assessment and recommended actions.
          </p>
        </div>

        <RiskResultCard result={result} />
      </main>

      <FloatingAssistant />
    </div>
  )
}
