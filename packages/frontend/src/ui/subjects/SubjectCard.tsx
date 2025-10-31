import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import {
  Calculator,
  Brain,
  Atom,
  Languages,
  Music,
  BookOpen
} from 'lucide-react'
import { Subject } from './types'

const subjectIcons: Record<string, typeof Calculator> = {
  math: Calculator,
  logic: Brain,
  physics: Atom,
  german: Languages,
  english: BookOpen,
  music: Music,
}

const subjectColors: Record<string, string> = {
  math: 'bg-blue-500 hover:bg-blue-600',
  logic: 'bg-purple-500 hover:bg-purple-600',
  physics: 'bg-emerald-500 hover:bg-emerald-600',
  german: 'bg-red-500 hover:bg-red-600',
  english: 'bg-amber-500 hover:bg-amber-600',
  music: 'bg-pink-500 hover:bg-pink-600',
}

export interface SubjectCardProps {
  subject: Subject
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const Icon = subjectIcons[subject.id] || BookOpen
  const colorClass = subjectColors[subject.id] || 'bg-gray-500 hover:bg-gray-600'

  return (
    <Link to={`/subjects/${subject.id}`}>
      <Card className="shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] h-full overflow-hidden rounded-2xl">
        <CardContent className={`p-8 text-white ${colorClass} transition-colors duration-300`}>
          <Icon className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold mb-2">{subject.name}</h2>
          <p className="text-white/90">{subject.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
