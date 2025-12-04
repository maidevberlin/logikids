import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/app/common/ui/card'
import { GradeSelector } from '@/app/common'
import { StudentInfo } from './types'
import { OnboardingActions } from './OnboardingActions'

export interface StudentInfoStepProps {
  onComplete: (info: StudentInfo) => void
}

type SubStep = 'name' | 'grade'

export function StudentInfoStep({ onComplete }: StudentInfoStepProps) {
  const { t } = useTranslation(['common', 'profile'])
  const [subStep, setSubStep] = useState<SubStep>('name')

  // Form state
  const [name, setName] = useState('')
  const [grade, setGrade] = useState(5)

  const handleNameNext = () => {
    if (name.trim()) {
      setSubStep('grade')
    }
  }

  const handleGradeComplete = () => {
    onComplete({
      name: name.trim(),
      grade,
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 bg-card shadow-lg rounded-2xl">
        <div className="space-y-8">
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-6">
            <div
              className={`h-2 w-16 rounded-full transition-colors ${subStep === 'name' ? 'bg-primary' : 'bg-muted'}`}
            />
            <div
              className={`h-2 w-16 rounded-full transition-colors ${subStep === 'grade' ? 'bg-primary' : 'bg-muted'}`}
            />
          </div>

          {/* Step 1: Name */}
          {subStep === 'name' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {t('onboarding.studentInfo.title')}
                </h2>
                <p className="text-muted-foreground">{t('onboarding.studentInfo.subtitle')}</p>
              </div>

              {/* Name Input */}
              <div className="space-y-3">
                <label className="block text-xl font-semibold text-foreground text-center">
                  {t('onboarding.studentInfo.nameLabel')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('onboarding.studentInfo.namePlaceholder')}
                  className="w-full bg-transparent border-0 border-b-2 border focus:border-primary outline-none text-4xl text-center py-4 placeholder:text-muted-foreground transition-colors"
                  autoFocus
                />
              </div>

              <OnboardingActions
                onContinue={handleNameNext}
                continueLabel={t('common.continue', { defaultValue: 'Continue' })}
                continueDisabled={!name.trim()}
              />
            </div>
          )}

          {/* Step 2: Grade */}
          {subStep === 'grade' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {t('onboarding.studentInfo.gradeLabel')}
                </h2>
                <p className="text-muted-foreground">
                  {t('onboarding.studentInfo.gradeDescription')}
                </p>
              </div>

              <GradeSelector value={grade} onChange={setGrade} />

              <OnboardingActions
                onContinue={handleGradeComplete}
                onBack={() => setSubStep('name')}
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
