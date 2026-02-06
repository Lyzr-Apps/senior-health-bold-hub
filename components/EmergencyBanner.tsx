'use client'

import { FaExclamationTriangle } from 'react-icons/fa'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function EmergencyBanner() {
  return (
    <Alert className="border-red-500 bg-red-50 mb-6">
      <FaExclamationTriangle className="h-5 w-5 text-red-600" />
      <AlertDescription className="text-red-800 font-medium ml-2">
        <strong>EMERGENCY DISCLAIMER:</strong> If you are experiencing a
        life-threatening emergency, call 911 immediately. This tool does not
        replace emergency medical services or professional medical diagnosis.
      </AlertDescription>
    </Alert>
  )
}
