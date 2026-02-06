'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HistoryItem, UrgencyLevel } from '@/lib/types'
import {
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaTrendUp,
  FaTrendDown,
  FaMinus,
} from 'react-icons/fa'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface HistoryTimelineProps {
  items: HistoryItem[]
}

export function HistoryTimeline({ items }: HistoryTimelineProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

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
        return <FaCheckCircle className="text-green-600" />
      case 'Moderate':
        return <FaExclamationCircle className="text-yellow-600" />
      case 'High':
        return <FaExclamationTriangle className="text-red-600" />
      default:
        return null
    }
  }

  const getTrendIndicator = (index: number) => {
    if (index === items.length - 1) return null // No trend for oldest item

    const current = items[index]
    const previous = items[index + 1]

    if (current.risk_score > previous.risk_score) {
      return {
        icon: <FaTrendUp className="text-red-500" />,
        label: 'Worsening',
        color: 'text-red-600',
      }
    } else if (current.risk_score < previous.risk_score) {
      return {
        icon: <FaTrendDown className="text-green-500" />,
        label: 'Improving',
        color: 'text-green-600',
      }
    } else {
      return {
        icon: <FaMinus className="text-gray-500" />,
        label: 'Stable',
        color: 'text-gray-600',
      }
    }
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">No assessment history yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Complete your first assessment to see your history here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isExpanded = expandedIds.has(item.id)
        const trend = getTrendIndicator(index)

        return (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getUrgencyIcon(item.urgency)}
                    <CardTitle className="text-lg">
                      Assessment from{' '}
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </CardTitle>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge className={getUrgencyColor(item.urgency)}>
                      {item.urgency} Urgency
                    </Badge>
                    <Badge variant="outline">{item.specialist}</Badge>
                    <Badge variant="outline">
                      Risk Score: {item.risk_score}/100
                    </Badge>
                    {trend && (
                      <div
                        className={`flex items-center gap-1 text-sm ${trend.color}`}
                      >
                        {trend.icon}
                        <span>{trend.label}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(item.id)}
                >
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-600 mb-4">{item.summary}</p>

              <Collapsible open={isExpanded}>
                <CollapsibleContent>
                  {item.details && (
                    <div className="border-t pt-4 space-y-4">
                      {item.details.red_flags &&
                        item.details.red_flags.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Red Flags Detected
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {item.details.red_flags.map((flag, i) => (
                                <li key={i}>{flag}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Explanation
                        </h4>
                        <p className="text-sm text-gray-700">
                          {item.details.explanation}
                        </p>
                      </div>

                      {item.details.actions && item.details.actions.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Recommended Actions
                          </h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                            {item.details.actions.map((action, i) => (
                              <li key={i}>{action}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
