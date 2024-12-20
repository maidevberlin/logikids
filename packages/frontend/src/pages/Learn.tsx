import { Link } from 'react-router-dom'
import {
  CalculatorIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline'

const tasks = [
  { name: 'Arithmetic', path: '/learn/arithmetic', icon: CalculatorIcon },
  { name: 'Logic', path: '/learn/logic', icon: PuzzlePieceIcon },
]

function TaskCard({ name, path, Icon }: { name: string; path: string; Icon: any }) {
  return (
    <Link
      to={path}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <Icon className="h-12 w-12 text-primary-600 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
    </Link>
  )
}

export default function Learn() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1>Choose Your Learning Path</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.path}
              name={task.name}
              path={task.path}
              Icon={task.icon}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 