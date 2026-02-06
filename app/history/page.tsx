'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { FloatingAssistant } from '@/components/FloatingAssistant'
import { HistoryTimeline } from '@/components/HistoryTimeline'
import { HistoryItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { FaHistory, FaTrash } from 'react-icons/fa'

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])

  useEffect(() => {
    const storedHistory = localStorage.getItem('assessmentHistory')
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory)
        setHistoryItems(parsed)
      } catch (error) {
        console.error('Failed to parse history:', error)
      }
    }
  }, [])

  const handleClearHistory = () => {
    if (
      confirm(
        'Are you sure you want to clear all assessment history? This cannot be undone.'
      )
    ) {
      localStorage.removeItem('assessmentHistory')
      setHistoryItems([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FaHistory className="text-blue-500" />
              Assessment History
            </h1>
            <p className="text-gray-600">
              View your past symptom assessments and track your health trends.
            </p>
          </div>

          {historyItems.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearHistory}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <FaTrash className="mr-2" />
              Clear History
            </Button>
          )}
        </div>

        <HistoryTimeline items={historyItems} />
      </main>

      <FloatingAssistant />
    </div>
  )
}
