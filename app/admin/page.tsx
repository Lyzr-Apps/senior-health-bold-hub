'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { FloatingAssistant } from '@/components/FloatingAssistant'
import { MetricCard } from '@/components/MetricCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FaClipboardList,
  FaExclamationTriangle,
  FaFlag,
  FaVideo,
  FaChartPie,
  FaChartLine,
} from 'react-icons/fa'

export default function AdminDashboardPage() {
  // Mock data - in production, fetch from API
  const metrics = {
    totalAssessments: 1247,
    highRiskCount: 89,
    redFlagFrequency: 156,
    activeConsultations: 12,
  }

  const urgencyDistribution = {
    low: 685,
    moderate: 473,
    high: 89,
  }

  const dailyTrend = [
    { date: '2/1', count: 42 },
    { date: '2/2', count: 38 },
    { date: '2/3', count: 51 },
    { date: '2/4', count: 47 },
    { date: '2/5', count: 55 },
    { date: '2/6', count: 63 },
  ]

  const highRiskCases = [
    {
      id: '1001',
      date: '2026-02-06',
      patient_age: '45',
      urgency: 'High' as const,
      risk_score: 85,
      red_flags: 3,
    },
    {
      id: '1002',
      date: '2026-02-06',
      patient_age: '62',
      urgency: 'High' as const,
      risk_score: 78,
      red_flags: 2,
    },
    {
      id: '1003',
      date: '2026-02-05',
      patient_age: '38',
      urgency: 'High' as const,
      risk_score: 72,
      red_flags: 1,
    },
    {
      id: '1004',
      date: '2026-02-05',
      patient_age: '55',
      urgency: 'High' as const,
      risk_score: 81,
      red_flags: 4,
    },
  ]

  const totalDistribution =
    urgencyDistribution.low +
    urgencyDistribution.moderate +
    urgencyDistribution.high

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor system performance, user assessments, and key metrics.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Assessments"
            value={metrics.totalAssessments.toLocaleString()}
            icon={FaClipboardList}
            color="text-blue-500"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="High Risk Cases"
            value={metrics.highRiskCount}
            icon={FaExclamationTriangle}
            color="text-red-500"
            trend={{ value: -5, isPositive: true }}
          />
          <MetricCard
            title="Red Flag Detections"
            value={metrics.redFlagFrequency}
            icon={FaFlag}
            color="text-orange-500"
            trend={{ value: 8, isPositive: false }}
          />
          <MetricCard
            title="Active Consultations"
            value={metrics.activeConsultations}
            icon={FaVideo}
            color="text-teal-500"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Urgency Distribution Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaChartPie className="text-purple-500" />
                Urgency Level Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Low */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <span className="text-sm font-medium">Low Urgency</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {urgencyDistribution.low} (
                      {Math.round(
                        (urgencyDistribution.low / totalDistribution) * 100
                      )}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{
                        width: `${
                          (urgencyDistribution.low / totalDistribution) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Moderate */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded" />
                      <span className="text-sm font-medium">
                        Moderate Urgency
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {urgencyDistribution.moderate} (
                      {Math.round(
                        (urgencyDistribution.moderate / totalDistribution) * 100
                      )}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full"
                      style={{
                        width: `${
                          (urgencyDistribution.moderate / totalDistribution) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* High */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded" />
                      <span className="text-sm font-medium">High Urgency</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {urgencyDistribution.high} (
                      {Math.round(
                        (urgencyDistribution.high / totalDistribution) * 100
                      )}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full"
                      style={{
                        width: `${
                          (urgencyDistribution.high / totalDistribution) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Assessment Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaChartLine className="text-blue-500" />
                Daily Assessment Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {dailyTrend.map((day, index) => {
                  const maxCount = Math.max(...dailyTrend.map((d) => d.count))
                  const heightPercent = (day.count / maxCount) * 100

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col items-center justify-end h-48">
                        <span className="text-xs text-gray-600 mb-2">
                          {day.count}
                        </span>
                        <div
                          className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 mt-2">
                        {day.date}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* High Risk Cases Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent High-Risk Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Red Flags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highRiskCases.map((case_) => (
                  <TableRow key={case_.id}>
                    <TableCell className="font-medium">{case_.id}</TableCell>
                    <TableCell>
                      {new Date(case_.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{case_.patient_age}</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800 border-red-300">
                        {case_.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-red-600">
                        {case_.risk_score}/100
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{case_.red_flags}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <FloatingAssistant />
    </div>
  )
}
