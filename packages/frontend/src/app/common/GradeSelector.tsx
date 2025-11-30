import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SelectorButton } from '@/app/common/ui/SelectorButton'

interface GradeSelectorProps {
  value: number
  onChange: (value: number) => void
  age?: number
  showAllGrades?: boolean
  className?: string
}

export function GradeSelector({
  value,
  onChange,
  age,
  showAllGrades: initialShowAll = false,
  className = '',
}: GradeSelectorProps) {
  const { t } = useTranslation()
  const [showAllGrades, setShowAllGrades] = useState(initialShowAll)

  // Calculate expected grade range based on age (age - 6 +/- 1)
  const getFilteredGrades = () => {
    if (showAllGrades || !age) {
      return Array.from({ length: 13 }, (_, i) => i + 1)
    }
    const expectedGrade = age - 6
    const minGrade = Math.max(1, expectedGrade - 1)
    const maxGrade = Math.min(13, expectedGrade + 1)
    return Array.from({ length: maxGrade - minGrade + 1 }, (_, i) => minGrade + i)
  }

  const gradeOptions = getFilteredGrades()

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
          {gradeOptions.map((gradeOption) => (
            <SelectorButton
              key={gradeOption}
              value={gradeOption}
              isSelected={value === gradeOption}
              onChange={onChange}
              variant="grid"
            >
              {gradeOption}
            </SelectorButton>
          ))}
        </div>
      </div>

      {/* Toggle to show all grades (only if age is provided) */}
      {age && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowAllGrades(!showAllGrades)}
            className="text-sm text-muted-foreground hover:text-foreground underline transition-colors"
          >
            {showAllGrades
              ? t('onboarding.studentInfo.showRecommended', {
                  defaultValue: 'Show recommended grades',
                })
              : t('onboarding.studentInfo.showAllGrades', { defaultValue: 'Show all grades' })}
          </button>
        </div>
      )}
    </div>
  )
}
