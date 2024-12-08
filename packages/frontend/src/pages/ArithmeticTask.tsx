import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { ArithmeticOperation } from '../../../backend/src/types/task'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { TaskOption } from '../components/TaskOption'
import { useArithmeticTask } from '../hooks/useTask'

export default function ArithmeticTask() {
  const { operation } = useParams<{ operation?: ArithmeticOperation }>()
  const { task, hint, loading, error, requestHint } = useArithmeticTask(operation as ArithmeticOperation)

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorDisplay message={error} />

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

        {task && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {operation ? operation.charAt(0).toUpperCase() + operation.slice(1) : 'Arithmetic'} Task
            </h1>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{task.task}</h2>
              <div className="grid grid-cols-2 gap-4">
                {task.options.map((option: string, index: number) => (
                  <TaskOption
                    key={index}
                    option={option}
                    onSelect={() => {
                      // Handle answer selection
                    }}
                  />
                ))}
              </div>
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
        )}
      </div>
    </div>
  )
} 