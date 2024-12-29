import { Subject } from '../../types/task'
import { BaseSelect, SelectOption } from './BaseSelect'

interface SubjectSelectProps {
  subject: Subject
  onSubjectChange: (subject: Subject) => void
}

const subjects: SelectOption<Subject>[] = [
  { value: 'math', label: 'Math', color: 'bg-blue-100 text-blue-800' },
  { value: 'logic', label: 'Logic', color: 'bg-purple-100 text-purple-800' },
]

export function SubjectSelect({ subject, onSubjectChange }: SubjectSelectProps) {
  return (
    <BaseSelect
      value={subject}
      options={subjects}
      onChange={onSubjectChange}
      align="left"
    />
  )
} 