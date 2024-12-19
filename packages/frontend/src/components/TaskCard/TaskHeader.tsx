import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface TaskHeaderProps {
  operation?: string
  type?: 'arithmetic' | 'geometry'
}

export function TaskHeader({ operation, type = 'arithmetic' }: TaskHeaderProps) {
  return (
    <>
      <Link
        to="/learn"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Learning Paths
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {operation 
          ? `${operation.charAt(0).toUpperCase() + operation.slice(1)} Task`
          : `${type.charAt(0).toUpperCase() + type.slice(1)} Task`}
      </h1>
    </>
  )
} 