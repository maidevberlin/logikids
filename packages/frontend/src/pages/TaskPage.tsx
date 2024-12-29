import { useTask } from '../hooks/useTask'
import { useSettings } from '../hooks/useSettings'
import { TaskCard } from '../components/TaskCard'
import { useSearchParams } from 'react-router-dom'
import { Difficulty, Subject, taskDefaults, Task } from '../types/task'

export default function TaskPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { settings } = useSettings()
  const difficulty = (searchParams.get('difficulty') ?? taskDefaults.difficulty) as Difficulty
  const subject = (searchParams.get('subject') ?? taskDefaults.subject) as Subject
  
  const { 
    task, 
    isLoading,
    error,
    selectedAnswer,
    isCorrect,
    checkAnswer,
    selectAnswer,
    nextTask
  } = useTask({ age: settings.age, difficulty, subject })

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('difficulty', newDifficulty)
      return newParams
    })
  }

  const handleSubjectChange = (newSubject: Subject) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('subject', newSubject)
      return newParams
    })
  }

  return (
    <div className="space-y-4">
      <TaskCard
        isLoading={isLoading}
        task={task ?? {} as Task}
        selectedAnswer={selectedAnswer}
        isCorrect={isCorrect}
        difficulty={difficulty}
        subject={subject}
        error={error}
        onAnswerSelect={selectAnswer}
        onAnswerSubmit={checkAnswer}
        onNextTask={nextTask}
        onDifficultyChange={handleDifficultyChange}
        onSubjectChange={handleSubjectChange}
      />
    </div>
  )
} 