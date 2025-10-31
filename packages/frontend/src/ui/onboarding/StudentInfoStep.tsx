import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { NumberInput } from '@/ui/common'
import { StudentInfo } from './types'

export interface StudentInfoStepProps {
  onComplete: (info: StudentInfo) => void
}

type SubStep = 'name-gender' | 'age' | 'grade'

interface GenderOption {
  value: string
  symbol: string
  label: string
}

export function StudentInfoStep({ onComplete }: StudentInfoStepProps) {
  const { t } = useTranslation()
  const [subStep, setSubStep] = useState<SubStep>('name-gender')

  // Form state
  const [name, setName] = useState('')
  const [gender, setGender] = useState<string>('prefer-not-to-say')
  const [age, setAge] = useState(10)
  const [grade, setGrade] = useState(5)

  const genderOptions: GenderOption[] = [
    { value: 'male', symbol: '♂', label: t('settings.gender.options.male') },
    { value: 'female', symbol: '♀', label: t('settings.gender.options.female') },
    { value: 'non-binary', symbol: '⚧', label: t('settings.gender.options.non-binary') },
    { value: 'prefer-not-to-say', symbol: '🔒', label: t('settings.gender.options.prefer-not-to-say') },
  ]

  const gradeOptions = Array.from({ length: 13 }, (_, i) => i + 1) // Grades 1-13

  const handleNameGenderNext = () => {
    if (name.trim()) {
      setSubStep('age')
    }
  }

  const handleAgeNext = () => {
    setSubStep('grade')
  }

  const handleGradeComplete = () => {
    onComplete({
      name: name.trim(),
      age,
      grade,
      gender: gender === 'prefer-not-to-say' ? undefined : gender,
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 bg-white shadow-lg rounded-2xl">
        <div className="space-y-8">
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-6">
            <div className={`h-2 w-16 rounded-full transition-colors ${subStep === 'name-gender' ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`h-2 w-16 rounded-full transition-colors ${subStep === 'age' ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`h-2 w-16 rounded-full transition-colors ${subStep === 'grade' ? 'bg-blue-600' : 'bg-gray-300'}`} />
          </div>

          {/* Step 1: Name + Gender */}
          {subStep === 'name-gender' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('onboarding.studentInfo.title')}
                </h2>
                <p className="text-gray-600">{t('onboarding.studentInfo.subtitle')}</p>
              </div>

              {/* Name Input */}
              <div className="space-y-3">
                <label className="block text-xl font-semibold text-gray-700 text-center">
                  {t('onboarding.studentInfo.nameLabel')}
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('onboarding.studentInfo.namePlaceholder')}
                  className="h-16 text-2xl text-center rounded-xl"
                  autoFocus
                />
              </div>

              {/* Gender Selection */}
              <div className="space-y-3">
                <label className="block text-xl font-semibold text-gray-700 text-center">
                  {t('settings.gender.label')}
                </label>
                <p className="text-sm text-gray-500 text-center">{t('onboarding.studentInfo.genderHint')}</p>
                <div className="grid grid-cols-2 gap-4">
                  {genderOptions.map((option) => {
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setGender(option.value)}
                        className={`flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-200 ${
                          gender === option.value
                            ? 'bg-blue-50 shadow-md'
                            : 'bg-white shadow-xs hover:shadow-md'
                        }`}
                      >
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
                          gender === option.value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {option.symbol}
                        </div>
                        <span className={`text-base font-medium ${gender === option.value ? 'text-blue-600' : 'text-gray-700'}`}>
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button
                onClick={handleNameGenderNext}
                disabled={!name.trim()}
                className="w-full h-16 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-2xl"
                size="lg"
              >
                Continue <ChevronRight className="ml-2 w-6 h-6" />
              </Button>
            </div>
          )}

          {/* Step 2: Age */}
          {subStep === 'age' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('onboarding.studentInfo.ageLabel')}
                </h2>
                <p className="text-gray-600">{t('onboarding.studentInfo.ageHint')}</p>
              </div>

              <NumberInput
                value={age}
                onChange={setAge}
                min={6}
                max={18}
                className="my-12"
              />

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSubStep('name-gender')}
                  className="flex-1 h-16 text-lg rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={handleAgeNext}
                  className="flex-1 h-16 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-2xl"
                >
                  Continue <ChevronRight className="ml-2 w-6 h-6" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Grade */}
          {subStep === 'grade' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('onboarding.studentInfo.gradeLabel')}
                </h2>
                <p className="text-gray-600">{t('onboarding.studentInfo.gradeDescription')}</p>
              </div>

              <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto py-2">
                {gradeOptions.map((gradeOption) => (
                  <button
                    key={gradeOption}
                    type="button"
                    onClick={() => setGrade(gradeOption)}
                    className={`flex items-center justify-center h-20 rounded-2xl text-2xl font-bold transition-all duration-200 ${
                      grade === gradeOption
                        ? 'bg-blue-50 text-blue-600 shadow-md'
                        : 'bg-white text-gray-700 shadow-xs hover:shadow-md'
                    }`}
                  >
                    {gradeOption}
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSubStep('age')}
                  className="flex-1 h-16 text-lg rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={handleGradeComplete}
                  className="flex-1 h-16 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-2xl"
                >
                  {t('onboarding.studentInfo.create')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
