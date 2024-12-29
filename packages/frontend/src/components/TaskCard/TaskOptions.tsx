import { Difficulty, Subject } from '../../types/task'
import { DifficultySelect } from '../TaskOptions/DifficultySelect'
import { SubjectSelect } from '../TaskOptions/SubjectSelect'
import { flex, spacing } from '../base/styles'
import { cn } from '../base/styles/utils'

interface TaskOptionsProps {
  difficulty: Difficulty
  subject: Subject
  onDifficultyChange: (difficulty: Difficulty) => void
  onSubjectChange: (subject: Subject) => void
}

export function TaskOptions({
  difficulty,
  subject,
  onDifficultyChange,
  onSubjectChange,
}: TaskOptionsProps) {
  return (
    <div className={cn(
      flex.end,
      spacing.margin.md
    )}>
      <div className={cn(
        flex.start,
        flex.gap.sm
      )}>
        <div className="w-36">
          <SubjectSelect
            subject={subject}
            onSubjectChange={onSubjectChange}
          />
        </div>
        <div className="w-36">
          <DifficultySelect
            difficulty={difficulty}
            onDifficultyChange={onDifficultyChange}
          />
        </div>
      </div>
    </div>
  )
} 