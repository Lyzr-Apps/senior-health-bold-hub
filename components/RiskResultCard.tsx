'use client'

import { TriageResult, UrgencyLevel } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import {
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaVideo,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa'

interface RiskResultCardProps {
  result: TriageResult
}

export function RiskResultCard({ result }: RiskResultCardProps) {
  const getUrgencyColor = (level: UrgencyLevel) => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getUrgencyIcon = (level: UrgencyLevel) => {
    switch (level) {
      case 'Low':
        return <FaCheckCircle className="text-2xl" />
      case 'Moderate':
        return <FaExclamationCircle className="text-2xl" />
      case 'High':
        return <FaExclamationTriangle className="text-2xl" />
      default:
        return null
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Urgency Badge */}
      <Card className={`${getUrgencyColor(result.urgency_level)} border-2`}>
        <CardHeader>
          <div className="flex items-center gap-4">
            {getUrgencyIcon(result.urgency_level)}
            <div>
              <CardTitle className="text-2xl">
                Urgency Level: {result.urgency_level}
              </CardTitle>
              <p className="text-sm opacity-80 mt-1">
                Based on AI analysis of your symptoms
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Risk Score */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className={`text-6xl font-bold ${getRiskScoreColor(
                result.risk_score
              )}`}
            >
              {result.risk_score}
              <span className="text-3xl">/100</span>
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    result.risk_score >= 70
                      ? 'bg-red-500'
                      : result.risk_score >= 40
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${result.risk_score}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Red Flags Alert */}
      {result.red_flags && result.red_flags.length > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <FaExclamationTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="ml-2">
            <h4 className="font-bold text-red-800 mb-2">
              Red Flags Detected ({result.red_flags.length})
            </h4>
            <ul className="list-disc list-inside space-y-1 text-red-700">
              {result.red_flags.map((flag, index) => (
                <li key={index}>{flag}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Specialist Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Specialist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge className="text-lg px-4 py-2 bg-blue-500">
              {result.specialist}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            {result.actions &&
              result.actions.map((action, index) => (
                <li key={index} className="text-gray-700">
                  {action}
                </li>
              ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/map">
          <Button className="w-full bg-blue-500 hover:bg-blue-600" size="lg">
            <FaMapMarkerAlt className="mr-2" />
            Find Nearest Hospital
          </Button>
        </Link>
        <Link href="/consultation">
          <Button
            className="w-full bg-teal-500 hover:bg-teal-600"
            size="lg"
          >
            <FaVideo className="mr-2" />
            Request Video Consultation
          </Button>
        </Link>
      </div>

      {/* Disclaimer */}
      <Card className="bg-gray-50 border-gray-300">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600 italic">{result.disclaimer}</p>
        </CardContent>
      </Card>
    </div>
  )
}
