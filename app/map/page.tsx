'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { FloatingAssistant } from '@/components/FloatingAssistant'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FaMapMarkerAlt, FaPhone, FaRoute, FaClock } from 'react-icons/fa'

export default function MapPage() {
  const [selectedHospital] = useState({
    name: 'City General Hospital',
    address: '123 Medical Center Dr, Springfield',
    distance: '2.3 miles',
    eta: '8 minutes',
    phone: '(555) 123-4567',
    type: 'Emergency & Urgent Care',
    coordinates: { lat: 40.7128, lng: -74.006 },
  })

  const handleCallHospital = () => {
    window.open(`tel:${selectedHospital.phone}`, '_self')
  }

  const handleStartNavigation = () => {
    // In production, integrate with Google Maps or similar
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      selectedHospital.address
    )}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nearby Healthcare Facilities
          </h1>
          <p className="text-gray-600">
            Find the nearest hospital or urgent care center based on your
            location.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] overflow-hidden">
              <CardContent className="p-0 h-full">
                {/* Map Placeholder */}
                <div className="relative w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-teal-100" />
                  <div className="relative z-10 text-center">
                    <FaMapMarkerAlt className="text-6xl text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium">
                      Interactive Map View
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Google Maps integration would display here
                    </p>

                    {/* Mock Map Markers */}
                    <div className="mt-8 space-y-2">
                      <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full">
                        <div className="w-3 h-3 bg-white rounded-full" />
                        Your Location
                      </div>
                      <br />
                      <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full">
                        <div className="w-3 h-3 bg-white rounded-full" />
                        {selectedHospital.name}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hospital Info Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  Nearest Facility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {selectedHospital.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedHospital.type}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                    <span className="text-gray-700">
                      {selectedHospital.address}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaRoute className="text-gray-400" />
                    <span className="text-gray-700">
                      {selectedHospital.distance} away
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-400" />
                    <span className="text-gray-700">
                      ETA: {selectedHospital.eta}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    <span className="text-gray-700">
                      {selectedHospital.phone}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleStartNavigation}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    size="lg"
                  >
                    <FaRoute className="mr-2" />
                    Start Navigation
                  </Button>

                  <Button
                    onClick={handleCallHospital}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <FaPhone className="mr-2" />
                    Call Hospital
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Facilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Other Nearby Facilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Urgent Care Plus', distance: '3.1 miles' },
                  { name: 'Memorial Hospital', distance: '4.5 miles' },
                  { name: 'QuickMed Clinic', distance: '5.2 miles' },
                ].map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <span className="text-gray-700">{facility.name}</span>
                    <span className="text-gray-500">{facility.distance}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <FloatingAssistant />
    </div>
  )
}
