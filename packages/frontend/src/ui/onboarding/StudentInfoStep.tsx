import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mars, Venus, ShieldQuestion } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { NumberInput } from '@/ui/common'
import { StudentInfo } from './types'
import { OnboardingActions } from './OnboardingActions'

export interface StudentInfoStepProps {
  onComplete: (info: StudentInfo) => void
}

type SubStep = 'name-gender' | 'age' | 'grade'

interface GenderOption {
  value: string
  icon: React.ComponentType<{ className?: string }>
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
  const [showAllGrades, setShowAllGrades] = useState(false)

  // Custom icon component for non-binary (overlaid Mars + Venus)
  const NonBinaryIcon = ({ className }: { className?: string }) => (
    <div className="relative w-full h-full flex items-center justify-center">
      <Mars className={`absolute ${className}`} style={{ transform: 'translate(2px, -4px)' }} />
      <Venus className={`absolute ${className}`} style={{ transform: 'translate(-1px, 3px)' }} />
    </div>
  )

  const genderOptions: GenderOption[] = [
    { value: 'male', icon: Mars, label: t('settings.gender.options.male') },
    { value: 'female', icon: Venus, label: t('settings.gender.options.female') },
    { value: 'non-binary', icon: NonBinaryIcon, label: t('settings.gender.options.non-binary') },
    { value: 'prefer-not-to-say', icon: ShieldQuestion, label: t('settings.gender.options.prefer-not-to-say') },
  ]

  // Calculate expected grade range based on age (age - 6 +/- 1)
  const getFilteredGrades = () => {
    if (showAllGrades) {
      return Array.from({ length: 13 }, (_, i) => i + 1)
    }
    const expectedGrade = age - 6
    const minGrade = Math.max(1, expectedGrade - 1)
    const maxGrade = Math.min(13, expectedGrade + 1)
    return Array.from({ length: maxGrade - minGrade + 1 }, (_, i) => minGrade + i)
  }

  const gradeOptions = getFilteredGrades()

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
            <div className={`h-2 w-16 rounded-full transition-colors ${subStep === 'name-gender' ? 'bg-primary' : 'bg-gray-300'}`} />
            <div className={`h-2 w-16 rounded-full transition-colors ${subStep === 'age' ? 'bg-primary' : 'bg-gray-300'}`} />
            <div className={`h-2 w-16 rounded-full transition-colors ${subStep === 'grade' ? 'bg-primary' : 'bg-gray-300'}`} />
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
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('onboarding.studentInfo.namePlaceholder')}
                  className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-primary outline-none text-4xl text-center py-4 placeholder:text-gray-400 transition-colors"
                  autoFocus
                />
              </div>

              {/* Gender Selection */}
              <div className="space-y-4">
                <label className="block text-xl font-semibold text-gray-700 text-center">
                  {t('settings.gender.label')}
                </label>
                <p className="text-sm text-gray-500 text-center">{t('onboarding.studentInfo.genderHint')}</p>
                <div className="flex justify-center gap-6">
                  {genderOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setGender(option.value)}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className={`flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200 ${
                            gender === option.value
                              ? 'bg-primary text-white shadow-md scale-110'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-105'
                          }`}
                        >
                          <Icon className="w-8 h-8" />
                        </div>
                        <span className="text-xs text-gray-700 text-center max-w-[80px]">
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <OnboardingActions
                onContinue={handleNameGenderNext}
                continueLabel={t('common.continue', { defaultValue: 'Continue' })}
                continueDisabled={!name.trim()}
              />
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

              <OnboardingActions
                onContinue={handleAgeNext}
                onBack={() => setSubStep('name-gender')}
                continueLabel={t('common.continue', { defaultValue: 'Continue' })}
              />
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

              <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
                  {gradeOptions.map((gradeOption) => (
                    <button
                      key={gradeOption}
                      type="button"
                      onClick={() => setGrade(gradeOption)}
                      className={`flex items-center justify-center h-24 rounded-2xl text-3xl font-bold border transition-all duration-300 ${
                        grade === gradeOption
                          ? 'bg-primary text-white border-primary shadow-md scale-105'
                          : 'bg-white text-gray-900 border-gray-200 shadow-xs hover:shadow-md hover:scale-[1.02]'
                      }`}
                    >
                      {gradeOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle to show all grades */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowAllGrades(!showAllGrades)}
                  className="text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
                >
                  {showAllGrades
                    ? t('onboarding.studentInfo.showRecommended', { defaultValue: 'Show recommended grades' })
                    : t('onboarding.studentInfo.showAllGrades', { defaultValue: 'Show all grades' })}
                </button>
              </div>

              <OnboardingActions
                onContinue={handleGradeComplete}
                onBack={() => setSubStep('age')}
                continueLabel={t('onboarding.studentInfo.create')}
                continueIcon={false}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
