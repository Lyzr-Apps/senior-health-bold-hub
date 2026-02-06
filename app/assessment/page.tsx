'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { EmergencyBanner } from '@/components/EmergencyBanner'
import { FloatingAssistant } from '@/components/FloatingAssistant'
import { AssessmentForm } from '@/components/AssessmentForm'
import { AssessmentFormData } from '@/lib/types'
import { callAIAgent } from '@/lib/aiAgent'

const TRIAGE_MANAGER_ID = '6985a4dae2c0086a4fc43be0'

export default function AssessmentPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (formData: AssessmentFormData) => {
    setLoading(true)
    setError(null)

    try {
      // Construct message for triage manager
      const message = `Patient Assessment:
Age: ${formData.age}
Gender: ${formData.gender}
Symptoms: ${formData.symptoms}
Severity: ${formData.severity}/10
Duration: ${formData.duration}
Medical Conditions: ${formData.conditions.join(', ')}

Please analyze and provide triage assessment.`

      const result = await callAIAgent(message, TRIAGE_MANAGER_ID)

      if (result.success) {
        // Store result in sessionStorage for results page
        sessionStorage.setItem(
          'triageResult',
          JSON.stringify(result.response.result)
        )
        sessionStorage.setItem('assessmentData', JSON.stringify(formData))

        // Navigate to results page
        router.push('/results')
      } else {
        setError(
          result.error || 'Failed to analyze symptoms. Please try again.'
        )
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <EmergencyBanner />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Symptom Assessment
          </h1>
          <p className="text-gray-600">
            Complete the following steps to receive your personalized health
            assessment.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <AssessmentForm onSubmit={handleSubmit} loading={loading} />
      </main>

      <FloatingAssistant />
    </div>
  )
}
