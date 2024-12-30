import { useTranslation } from 'react-i18next'
import { Subject } from '../../types/task'
import { BaseSelect, SelectOption } from './BaseSelect'

interface SubjectSelectProps {
  subject: Subject
  onSubjectChange: (subject: Subject) => void
}

export function SubjectSelect({ subject, onSubjectChange }: SubjectSelectProps) {
  const { t } = useTranslation()

  const subjects: SelectOption<Subject>[] = [
    { value: 'math', label: t('subjects.math'), color: 'bg-blue-100 text-blue-800' },
    { value: 'logic', label: t('subjects.logic'), color: 'bg-purple-100 text-purple-800' },
  ]

  return (
    <BaseSelect
      value={subject}
      options={subjects}
      onChange={onSubjectChange}
      align="left"
    />
  )
} 