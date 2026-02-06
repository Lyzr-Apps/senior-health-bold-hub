'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AssessmentFormData } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import { FaCheckCircle } from 'react-icons/fa'

const COMMON_CONDITIONS = [
  'Diabetes',
  'Hypertension',
  'Asthma',
  'Heart Disease',
  'Arthritis',
  'None',
]

interface AssessmentFormProps {
  onSubmit: (data: AssessmentFormData) => Promise<void>
  loading: boolean
}

export function AssessmentForm({ onSubmit, loading }: AssessmentFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<AssessmentFormData>({
    age: '',
    gender: '',
    symptoms: '',
    severity: 5,
    duration: '',
    conditions: [],
  })

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    await onSubmit(formData)
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.age && formData.gender
      case 2:
        return formData.symptoms.trim().length > 10
      case 3:
        return formData.duration && formData.conditions.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const handleConditionToggle = (condition: string) => {
    setFormData((prev) => {
      const isSelected = prev.conditions.includes(condition)
      let newConditions = isSelected
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition]

      // If "None" is selected, clear all others
      if (condition === 'None' && !isSelected) {
        newConditions = ['None']
      }
      // If another is selected while "None" is active, remove "None"
      else if (newConditions.includes('None') && condition !== 'None') {
        newConditions = newConditions.filter((c) => c !== 'None')
      }

      return { ...prev, conditions: newConditions }
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= num
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > num ? <FaCheckCircle /> : num}
              </div>
              {num < 4 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    step > num ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Demographics</span>
          <span>Symptoms</span>
          <span>Details</span>
          <span>Review</span>
        </div>
      </div>

      {/* Step 1: Demographics */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Tell Us About Yourself</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="120"
                value={formData.age}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, age: e.target.value }))
                }
                placeholder="Enter your age"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">
                    Female
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Symptoms */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Describe Your Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="symptoms">
              Please describe your symptoms in detail
            </Label>
            <Textarea
              id="symptoms"
              value={formData.symptoms}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, symptoms: e.target.value }))
              }
              placeholder="E.g., I have been experiencing chest pain that started this morning. The pain is sharp and occurs when I breathe deeply..."
              className="mt-2 min-h-[200px]"
            />
            <p className="text-sm text-gray-500 mt-2">
              Minimum 10 characters. Be as specific as possible.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Severity (1 = Mild, 10 = Severe)</Label>
              <div className="mt-4 px-2">
                <Slider
                  value={[formData.severity]}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, severity: value[0] }))
                  }
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Mild (1)</span>
                  <span className="font-bold text-lg text-blue-600">
                    {formData.severity}
                  </span>
                  <span>Severe (10)</span>
                </div>
              </div>
            </div>

            <div>
              <Label>How long have you had these symptoms?</Label>
              <RadioGroup
                value={formData.duration}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, duration: value }))
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hours" id="hours" />
                  <Label htmlFor="hours" className="cursor-pointer">
                    Less than 24 hours
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="days" id="days" />
                  <Label htmlFor="days" className="cursor-pointer">
                    1-7 days
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weeks" id="weeks" />
                  <Label htmlFor="weeks" className="cursor-pointer">
                    1-4 weeks
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="months" id="months" />
                  <Label htmlFor="months" className="cursor-pointer">
                    More than a month
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Existing Medical Conditions</Label>
              <div className="mt-2 space-y-2">
                {COMMON_CONDITIONS.map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={condition}
                      checked={formData.conditions.includes(condition)}
                      onCheckedChange={() => handleConditionToggle(condition)}
                    />
                    <Label htmlFor={condition} className="cursor-pointer">
                      {condition}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Review Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700">Demographics</h4>
              <p className="text-gray-600">
                Age: {formData.age}, Gender: {formData.gender}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Symptoms</h4>
              <p className="text-gray-600">{formData.symptoms}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">Details</h4>
              <p className="text-gray-600">
                Severity: {formData.severity}/10
                <br />
                Duration: {formData.duration}
                <br />
                Conditions: {formData.conditions.join(', ')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1 || loading}
        >
          Back
        </Button>

        {step < 4 ? (
          <Button onClick={handleNext} disabled={!isStepValid()}>
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Symptoms'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
