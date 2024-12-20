import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'


export function TaskHeader() {
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
        Task
      </h1>
    </>
  )
} 