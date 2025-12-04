import { SelectorButton } from '@/app/common/ui/SelectorButton'

interface GradeSelectorProps {
  value: number
  onChange: (value: number) => void
  className?: string
}

export function GradeSelector({ value, onChange, className = '' }: GradeSelectorProps) {
  const gradeOptions = Array.from({ length: 13 }, (_, i) => i + 1)

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
    </div>
  )
}
