import { Link } from 'react-router-dom'

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full transform transition-all hover:scale-105">
        <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">Welcome to Logikids</h1>
        <p className="text-gray-600 text-center text-lg">Start your journey into the exciting world of mathematics and logical thinking!</p>
        <Link
          to="/learn"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Start Learning
        </Link>
      </div>
    </div>
  )
} 