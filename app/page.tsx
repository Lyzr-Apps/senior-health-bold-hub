'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/Header'
import { EmergencyBanner } from '@/components/EmergencyBanner'
import { FloatingAssistant } from '@/components/FloatingAssistant'
import {
  FaHeartbeat,
  FaClipboardList,
  FaStethoscope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaLock,
  FaCheckCircle,
} from 'react-icons/fa'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <EmergencyBanner />

        {/* Hero Section */}
        <section className="text-center py-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl shadow-xl mb-16">
          <div className="max-w-3xl mx-auto px-6">
            <h1 className="text-5xl font-bold text-white mb-6">
              Your Intelligent Healthcare Triage Assistant
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Get instant risk assessment, specialist recommendations, and
              guidance on your next steps - all powered by advanced AI.
            </p>
            <Link href="/assessment">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
              >
                <FaHeartbeat className="mr-2 text-xl" />
                Start Symptom Assessment
              </Button>
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <FaClipboardList className="text-3xl text-blue-600" />
                </div>
                <CardTitle className="text-lg">1. Describe Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tell us about your symptoms, severity, and medical history in
                  a simple form.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <FaStethoscope className="text-3xl text-teal-600" />
                </div>
                <CardTitle className="text-lg">2. AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our AI analyzes your input, detects red flags, and calculates
                  risk scores.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <FaMapMarkerAlt className="text-3xl text-purple-600" />
                </div>
                <CardTitle className="text-lg">3. Get Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive urgency level, specialist suggestions, and action
                  plans tailored to you.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <FaHeartbeat className="text-3xl text-green-600" />
                </div>
                <CardTitle className="text-lg">4. Take Action</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Find nearby hospitals, schedule consultations, or get
                  immediate guidance.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Trust & Security */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Trust & Security
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="mx-auto bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <FaShieldAlt className="text-4xl text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">HIPAA Compliant</h3>
              <p className="text-gray-600">
                Your health data is protected under HIPAA regulations.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <FaLock className="text-4xl text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">GDPR Certified</h3>
              <p className="text-gray-600">
                We meet the highest European privacy standards.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <FaCheckCircle className="text-4xl text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">SOC 2 Audited</h3>
              <p className="text-gray-600">
                Independently verified security controls and processes.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Take control of your health with intelligent guidance in minutes.
          </p>
          <Link href="/assessment">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
            >
              Begin Symptom Assessment
            </Button>
          </Link>
        </section>
      </main>

      <FloatingAssistant />
    </div>
  )
}
