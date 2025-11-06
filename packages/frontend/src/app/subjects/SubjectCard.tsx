import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { getSubjectTheme } from '@/app/common/subjectTheme'
import { Subject } from './types'

export interface SubjectCardProps {
  subject: Subject
  disabled?: boolean
  minGrade?: number
  showGradeRange?: boolean
}

export function SubjectCard({ subject, disabled = false, minGrade, showGradeRange = true }: SubjectCardProps) {
  const { t } = useTranslation()
  const theme = getSubjectTheme(subject.id)
  const Icon = theme.icon
  const { bg, hover } = theme.colors

  // Format grade range display
  const gradeRangeText = subject.minGrade && subject.maxGrade
    ? subject.minGrade === subject.maxGrade
      ? t('subjects.grade', { grade: subject.minGrade, defaultValue: `Grade ${subject.minGrade}` })
      : t('subjects.gradeRange', {
          minGrade: subject.minGrade,
          maxGrade: subject.maxGrade,
          defaultValue: `Grades ${subject.minGrade}-${subject.maxGrade}`
        })
    : null

  const content = (
    <Card className={`shadow-md transition-all duration-300 h-full overflow-hidden rounded-2xl ${
      disabled
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:shadow-lg cursor-pointer hover:scale-[1.02]'
    }`}>
      <CardContent className={`h-full p-8 text-white ${bg} ${
        disabled ? '' : hover
      } transition-colors duration-300`}>
        <Icon className="w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">
          {t(`subjects.${subject.id}.label`, { defaultValue: subject.name })}
        </h2>
        <p className="text-white/90 mb-3">
          {t(`subjects.${subject.id}.description`, { defaultValue: subject.description })}
        </p>
        {showGradeRange && gradeRangeText && (
          <p className="text-white/80 text-sm font-medium">
            {gradeRangeText}
          </p>
        )}
        {disabled && minGrade && (
          <p className="text-white/80 text-sm mt-2 italic">
            {t('subjects.availableFromGrade', { grade: minGrade, defaultValue: `Available from grade ${minGrade}` })}
          </p>
        )}
      </CardContent>
    </Card>
  )

  if (disabled) {
    return content
  }

  return (
    <Link to={`/subjects/${subject.id}`}>
      {content}
    </Link>
  )
}
