import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/app/common/ui/card'
import { getSubjectTheme } from './subjectTheme'
import { SubjectInfo } from './types'
import { formatGradeRange } from '@/app/common/formatGrade'

export interface SubjectCardProps {
  subject: SubjectInfo & { isDisabledForGrade?: boolean }
  disabled?: boolean
  minGrade?: number
  showGradeRange?: boolean
}

export function SubjectCard({
  subject,
  disabled,
  minGrade,
  showGradeRange = true,
}: SubjectCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = getSubjectTheme(subject.id)
  const Icon = theme.icon
  const { bg, hover } = theme.colors

  const gradeRangeText = formatGradeRange(subject.minGrade, subject.maxGrade, t)

  const handleClick = () => {
    if (disabled) return

    if (subject.isDisabledForGrade) {
      // Navigate with showAll state for out-of-grade subjects
      navigate(`/subjects/${subject.id}`, { state: { showAll: true } })
    } else {
      // Normal navigation
      navigate(`/subjects/${subject.id}`)
    }
  }

  return (
    <Card
      className={`shadow-md transition-all duration-300 h-full overflow-hidden rounded-2xl ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-lg cursor-pointer hover:scale-[1.02]'
      }`}
      onClick={handleClick}
    >
      <CardContent
        className={`h-full p-8 text-white ${bg} ${disabled ? '' : hover} transition-colors duration-300`}
      >
        <Icon className="w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          {t(`subjects.${subject.id}.label`, { defaultValue: subject.name })}
        </h2>
        <p className="text-white/90 mb-3">
          {t(`subjects.${subject.id}.description`, { defaultValue: subject.description })}
        </p>
        {showGradeRange && gradeRangeText && (
          <p className="text-white/80 text-sm font-medium">{gradeRangeText}</p>
        )}
        {subject.isDisabledForGrade && minGrade && (
          <p className="text-white/80 text-sm mt-2 italic">
            {t('subjects.availableFromGrade', {
              grade: minGrade,
              defaultValue: `Available from grade ${minGrade}`,
            })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
