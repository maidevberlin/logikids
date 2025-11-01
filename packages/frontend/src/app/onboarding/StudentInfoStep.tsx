import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { NumberInput, GenderSelector, GradeSelector } from '@/app/common'
import { StudentInfo } from './types'
import { OnboardingActions } from './OnboardingActions'

export interface StudentInfoStepProps {
  onComplete: (info: StudentInfo) => void
}

type SubStep = 'name-gender' | 'age' | 'grade'

export function StudentInfoStep({ onComplete }: StudentInfoStepProps) {
  const { t } = useTranslation(['common', 'profile'])
  const [subStep, setSubStep] = useState<SubStep>('name-gender')

  // Form state
  const [name, setName] = useState('')
  const [gender, setGender] = useState<string>('prefer-not-to-say')
  const [age, setAge] = useState(10)
  const [grade, setGrade] = useState(5)

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
                  {t('profile:settings.gender.label')}
                </label>
                <p className="text-sm text-gray-500 text-center">{t('onboarding.studentInfo.genderHint')}</p>
                <GenderSelector
                  value={gender}
                  onChange={setGender}
                />
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

              <GradeSelector
                value={grade}
                onChange={setGrade}
                age={age}
              />

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
