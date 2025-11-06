import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'
import { useUserData } from '@/app/account'
import { useQuery } from '@tanstack/react-query'
import { logikids, SubjectsResponse } from '@/api/logikids'

export function ContinueLearningCard() {
  const { t } = useTranslation()
  const { data: userData } = useUserData()

  // Fetch subjects to get display names
  const { data: subjectsData } = useQuery<SubjectsResponse>({
    queryKey: ['subjects'],
    queryFn: ({ signal }) => logikids.getSubjects(undefined, signal),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  const lastTask = userData?.lastTask
  const hasLastTask = lastTask && lastTask.subject

  // Find subject and concept names
  let subjectName = ''
  let conceptName = ''

  if (hasLastTask && subjectsData) {
    const subject = subjectsData.subjects.find(s => s.id === lastTask.subject)
    if (subject) {
      // Use translation key for subject name
      subjectName = t(`subjects.${lastTask.subject}.label`, { defaultValue: subject.name })
      if (lastTask.concept && subject.concepts) {
        const concept = subject.concepts.find(c => c.id === lastTask.concept)
        if (concept) {
          conceptName = concept.name
        }
      }
    }
  }

  const linkTo = hasLastTask && lastTask.concept
    ? `/subjects/${lastTask.subject}/${lastTask.concept}/tasks`
    : hasLastTask
    ? `/subjects/${lastTask.subject}`
    : '/subjects'

  const title = hasLastTask && subjectName
    ? conceptName
      ? t('welcome.navigation.continueWith', { subject: subjectName, concept: conceptName })
      : t('welcome.navigation.continueWithSubject', { subject: subjectName })
    : t('welcome.navigation.startLearning')

  const description = hasLastTask
    ? t('welcome.navigation.continue.description', { defaultValue: 'Pick up where you left off' })
    : t('welcome.navigation.startLearning.description', { defaultValue: 'Choose a subject and begin your learning journey' })

  return (
    <Link to={linkTo} className="block md:col-span-3">
      <Card className="p-8 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-white hover:scale-[1.02] rounded-2xl">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-4 rounded-full">
            <GraduationCap className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-white/90 text-lg">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
