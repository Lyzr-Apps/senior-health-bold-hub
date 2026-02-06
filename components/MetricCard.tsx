'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconType } from 'react-icons'
import { FaTrendUp, FaTrendDown } from 'react-icons/fa'

interface MetricCardProps {
  title: string
  value: string | number
  icon: IconType
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: string
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'text-blue-500',
}: MetricCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={`text-2xl ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm mt-2 ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? <FaTrendUp /> : <FaTrendDown />}
            <span>
              {trend.value > 0 ? '+' : ''}
              {trend.value}% from last week
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
