import { useTask } from '../hooks/useTask'
import { useSettings } from '../hooks/useSettings'
import { TaskCard } from '../components/TaskCard'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { useSearchParams } from 'react-router-dom'
import { Difficulty, Subject, taskDefaults } from '../types/task'

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <ErrorDisplay message={error} onRetry={nextTask} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {task && (
        <TaskCard
          isLoading={isLoading}
          task={task}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          difficulty={difficulty}
          subject={subject}
          onAnswerSelect={selectAnswer}
          onAnswerSubmit={checkAnswer}
          onNextTask={nextTask}
          onDifficultyChange={handleDifficultyChange}
          onSubjectChange={handleSubjectChange}
        />
      )}
    </div>
  )
} 