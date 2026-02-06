/**
 * Mock Agent Data for Development & Testing
 *
 * Use this when Lyzr API credits are exhausted or for testing UI without API calls.
 * Remove or disable this in production once credits are available.
 */

import { TriageResult } from './types'

/**
 * Generate mock triage result based on symptom severity
 */
export function getMockTriageResult(severity: number, symptoms: string): TriageResult {
  const hasChestPain = symptoms.toLowerCase().includes('chest')
  const hasSweating = symptoms.toLowerCase().includes('sweat')
  const hasBreathing = symptoms.toLowerCase().includes('breath')

  // High urgency if chest pain + other red flags
  const isHighUrgency = hasChestPain && (hasSweating || hasBreathing) || severity >= 8

  // Moderate if severity 5-7
  const isModerateUrgency = severity >= 5 && severity < 8 && !isHighUrgency

  const urgencyLevel = isHighUrgency ? 'High' : isModerateUrgency ? 'Moderate' : 'Low'
  const riskScore = isHighUrgency ? 85 : isModerateUrgency ? 55 : 25

  const redFlags: string[] = []
  if (hasChestPain && hasSweating) {
    redFlags.push('Chest pain with profuse sweating detected')
  }
  if (hasBreathing && severity >= 7) {
    redFlags.push('Severe breathing difficulty')
  }

  const specialist = hasChestPain ? 'Cardiology' :
                    symptoms.toLowerCase().includes('head') ? 'Neurology' :
                    symptoms.toLowerCase().includes('stomach') ? 'Gastroenterology' :
                    'General Practice'

  const actions: string[] = []
  if (urgencyLevel === 'High') {
    actions.push('Seek immediate emergency care - call 911 or go to nearest ER')
    actions.push('Do not drive yourself - call ambulance or have someone drive you')
    actions.push('Stay calm and rest until help arrives')
  } else if (urgencyLevel === 'Moderate') {
    actions.push('Schedule a video consultation with a doctor within 24 hours')
    actions.push('Monitor symptoms closely - if they worsen, seek immediate care')
    actions.push('Keep a symptom diary to share with your doctor')
  } else {
    actions.push('Monitor symptoms at home for 24-48 hours')
    actions.push('Rest and stay hydrated')
    actions.push('If symptoms persist or worsen, consult a healthcare provider')
  }

  const explanation = urgencyLevel === 'High'
    ? 'Based on your symptoms, we recommend immediate medical attention. The combination of symptoms you described may require urgent evaluation by healthcare professionals.'
    : urgencyLevel === 'Moderate'
    ? 'Your symptoms suggest you should speak with a healthcare provider soon. While not an emergency, professional medical guidance would be beneficial.'
    : 'Your symptoms appear to be manageable with home care at this time. Continue monitoring and seek care if your condition changes.'

  return {
    urgency_level: urgencyLevel,
    risk_score: riskScore,
    red_flags: redFlags,
    specialist,
    explanation,
    actions,
    disclaimer: 'This assessment is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult with a licensed healthcare provider for medical decisions. In case of emergency, call 911 immediately.'
  }
}

/**
 * Generate mock chatbot response based on message
 */
export function getMockChatbotResponse(message: string): {
  message: string
  action_type: 'navigation' | 'medical_redirect' | 'info'
  redirect_url?: string
} {
  const lowerMessage = message.toLowerCase()

  // Medical question redirect
  if (
    lowerMessage.includes('symptom') ||
    lowerMessage.includes('pain') ||
    lowerMessage.includes('sick') ||
    lowerMessage.includes('hurt') ||
    lowerMessage.includes('diagnos')
  ) {
    return {
      message: "I can help you with app navigation, but I cannot provide medical advice. For symptom assessment, please use our Symptom Assessment tool. Would you like me to take you there?",
      action_type: 'medical_redirect',
      redirect_url: '/assessment'
    }
  }

  // Video consultation
  if (lowerMessage.includes('video') || lowerMessage.includes('consultation') || lowerMessage.includes('doctor')) {
    return {
      message: "To book a video consultation with a doctor, you'll first need to complete a symptom assessment. After your assessment, if recommended, you'll see an option to 'Request Video Consultation' on your results page.",
      action_type: 'navigation',
      redirect_url: '/assessment'
    }
  }

  // Map/hospital
  if (lowerMessage.includes('map') || lowerMessage.includes('hospital') || lowerMessage.includes('emergency')) {
    return {
      message: "You can view nearby hospitals and their locations on our Map & ETA page. This feature shows the nearest medical facilities with real-time directions.",
      action_type: 'navigation',
      redirect_url: '/map'
    }
  }

  // History
  if (lowerMessage.includes('history') || lowerMessage.includes('past') || lowerMessage.includes('previous')) {
    return {
      message: "You can view your past assessments and track your health journey on the Symptom History page. This shows all your previous triage results and risk trends over time.",
      action_type: 'navigation',
      redirect_url: '/history'
    }
  }

  // How to use / start
  if (lowerMessage.includes('how') || lowerMessage.includes('start') || lowerMessage.includes('use')) {
    return {
      message: "To get started, click 'Start Assessment' to describe your symptoms. Our AI will analyze them and provide a risk assessment with recommended next steps. The process takes just a few minutes.",
      action_type: 'navigation',
      redirect_url: '/assessment'
    }
  }

  // Default
  return {
    message: "I can help you navigate the app! You can:\n• Start a symptom assessment\n• View nearby hospitals on the map\n• Check your assessment history\n• Learn how the platform works\n\nWhat would you like to do?",
    action_type: 'info'
  }
}
