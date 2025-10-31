import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { Concept } from './types'

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-50 text-green-700',
  medium: 'bg-amber-50 text-amber-700',
  hard: 'bg-red-50 text-red-700',
}

export interface ConceptCardProps {
  concept: Concept
  subject: string
  isAdvanced?: boolean
}

export function ConceptCard({ concept, subject, isAdvanced }: ConceptCardProps) {
  return (
    <Link to={`/subjects/${subject}/${concept.id}/tasks`}>
      <Card className={`bg-white shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer h-full rounded-2xl ${
        isAdvanced ? 'ring-2 ring-orange-300 bg-orange-50/20' : ''
      }`}>
        <CardContent className="p-8 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 flex-1">
              {concept.name}
            </h3>
            {isAdvanced && (
              <Badge className="ml-2 bg-orange-100 text-orange-800 rounded-lg">
                Advanced
              </Badge>
            )}
            {concept.difficulty && (
              <Badge className={`ml-2 rounded-lg ${difficultyColors[concept.difficulty]}`}>
                {concept.difficulty.charAt(0).toUpperCase() + concept.difficulty.slice(1)}
              </Badge>
            )}
          </div>

          <p className="text-gray-600 mb-4 flex-1">{concept.description}</p>

          {concept.learning_objectives && concept.learning_objectives.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Learning objectives:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {concept.learning_objectives.slice(0, 2).map((obj, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
                {concept.learning_objectives.length > 2 && (
                  <li className="text-gray-500 text-xs">
                    +{concept.learning_objectives.length - 2} more...
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="flex items-center text-primary font-medium mt-auto pt-2">
            Start learning
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
