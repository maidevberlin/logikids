import { Link } from 'react-router-dom'
import {
  CalculatorIcon,
  Square3Stack3DIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  DivideIcon,
} from '@heroicons/react/24/outline'

const arithmeticTasks = [
  { name: 'Addition', path: '/learn/arithmetic/addition', icon: PlusIcon },
  { name: 'Subtraction', path: '/learn/arithmetic/subtraction', icon: MinusIcon },
  { name: 'Multiplication', path: '/learn/arithmetic/multiplication', icon: XMarkIcon },
  { name: 'Division', path: '/learn/arithmetic/division', icon: DivideIcon },
  { name: 'Random', path: '/learn/arithmetic', icon: CalculatorIcon },
]

const geometryTasks = [
  { name: 'Shapes', path: '/learn/geometry/shapes', icon: Square3Stack3DIcon },
  { name: 'Random', path: '/learn/geometry', icon: Square3Stack3DIcon },
]

function TaskCard({ name, path, Icon }: { name: string; path: string; Icon: any }) {
  return (
    <Link
      to={path}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <Icon className="h-12 w-12 text-indigo-600 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
    </Link>
  )
}

export default function Learn() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Choose Your Learning Path</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Arithmetic</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {arithmeticTasks.map((task) => (
              <TaskCard
                key={task.path}
                name={task.name}
                path={task.path}
                Icon={task.icon}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Geometry</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {geometryTasks.map((task) => (
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
    </div>
  )
} 