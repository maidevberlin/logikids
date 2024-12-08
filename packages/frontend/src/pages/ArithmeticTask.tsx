import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { ArithmeticOperation } from '../../../backend/src/types/task'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { useState } from 'react'
import { useArithmeticTask } from '../hooks/useTask'

export default function ArithmeticTask() {
  const { operation } = useParams<{ operation?: ArithmeticOperation }>()  
  const { task, hint, loading, error, requestHint } = useArithmeticTask(operation)

  const [answer, setAnswer] = useState<string>('')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleAnswerSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const correct = Number(answer) === task?.solution
    setIsCorrect(correct)
    setSelectedAnswer(answer)
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorDisplay message={error} />
  if (!task) return <div>No task found</div>

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/learn"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Learning Paths
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {operation ? operation.charAt(0).toUpperCase() + operation.slice(1) : 'Arithmetic'} Task
          </h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{task.task}</h2>
            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                  Your Answer
                </label>
                <input
                  type="number"
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your answer"
                  disabled={selectedAnswer !== null}
                />
              </div>
              <button
                type="submit"
                disabled={selectedAnswer !== null || !answer}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Submit Answer
              </button>
            </form>
            {selectedAnswer && (
              <div className={`mt-4 p-4 rounded-lg ${
                isCorrect 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                <p className="font-medium">
                  {isCorrect 
                    ? 'Correct! Well done!' 
                    : 'Not quite right. Try another question or ask for a hint.'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={requestHint}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Need a hint?
            </button>
            {hint && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                <p className="text-gray-800">{hint.hint}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 