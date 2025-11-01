import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { Concept } from './types'
import { getSubjectNamespace } from '@/i18n/subjectNamespace'

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
  const { t } = useTranslation()
  const namespace = getSubjectNamespace(subject, concept.grade)

  // Get translated values with fallback to backend data
  const name = t(`${namespace}:concepts.${concept.id}.name`, { defaultValue: concept.name })
  const description = t(`${namespace}:concepts.${concept.id}.description`, { defaultValue: concept.description })

  return (
    <Link to={`/subjects/${subject}/${concept.id}/tasks`}>
      <Card className={`bg-white shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer h-full rounded-2xl ${
        isAdvanced ? 'ring-2 ring-orange-300 bg-orange-50/20' : ''
      }`}>
        <CardContent className="p-8 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 flex-1">
              {name}
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

          <p className="text-gray-600 mb-4 flex-1">{description}</p>

          <div className="flex items-center text-primary font-medium mt-auto pt-2">
            Start learning
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
