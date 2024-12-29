import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface TaskHeaderProps {
  backTo?: string
  backLabel?: string
  title?: string
}

export function TaskHeader({ 
  backTo = '/learn',
  backLabel = 'Back to Learning Paths',
  title = 'Task'
}: TaskHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        to={backTo}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" aria-hidden="true" />
        {backLabel}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">
        {title}
      </h1>
    </div>
  )
} 