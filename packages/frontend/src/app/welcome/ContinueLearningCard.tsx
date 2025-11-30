import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/app/common/ui/card'
import { GraduationCap } from 'lucide-react'
import { useUserData } from '@/app/account'
import { trpc } from '@/api/trpc'
import { getSubjectTheme } from '@/app/common/subjectTheme'

export function ContinueLearningCard() {
  const { t } = useTranslation()
  const { data: userData } = useUserData()

  // Fetch subjects to get display names
  const { data: subjectsData } = trpc.subjects.getAll.useQuery(
    {},
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const lastTask = userData?.lastTask
  const hasLastTask = lastTask && lastTask.subject

  // Get subject theme for icon and colors
  const theme = hasLastTask ? getSubjectTheme(lastTask.subject) : null
  const SubjectIcon = theme?.icon || GraduationCap

  // Find subject and concept names
  let subjectName = ''
  let conceptName = ''

  if (hasLastTask && subjectsData) {
    const subject = subjectsData.subjects.find((s) => s.id === lastTask.subject)
    if (subject) {
      // Use translation key for subject name
      subjectName = t(`subjects.${lastTask.subject}.label`, { defaultValue: subject.name })
      if (lastTask.concept && subject.concepts) {
        const concept = subject.concepts.find((c) => c.id === lastTask.concept)
        if (concept) {
          conceptName = t(`subjects/${lastTask.subject}:concepts.${lastTask.concept}.name`, {
            defaultValue: concept.name,
          })
        }
      }
    }
  }

  const linkTo =
    hasLastTask && lastTask.concept
      ? `/subjects/${lastTask.subject}/${lastTask.concept}/tasks`
      : hasLastTask
        ? `/subjects/${lastTask.subject}`
        : '/subjects'

  const title =
    hasLastTask && subjectName
      ? conceptName
        ? t('welcome.navigation.continueWith', { subject: subjectName, concept: conceptName })
        : t('welcome.navigation.continueWithSubject', { subject: subjectName })
      : t('welcome.navigation.startLearning.title')

  const description = hasLastTask
    ? t('welcome.navigation.continue.description', { defaultValue: 'Pick up where you left off' })
    : t('welcome.navigation.startLearning.description', {
        defaultValue: 'Choose a subject and begin your learning journey',
      })

  // Use subject color if available, otherwise use primary
  const cardBg = theme ? theme.colors.bg : 'bg-primary'
  const cardHover = theme ? theme.colors.hover : 'hover:bg-primary/90'

  return (
    <Link to={linkTo} className="block md:col-span-3">
      <Card
        className={`p-8 ${cardBg} ${cardHover} shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-white hover:scale-[1.02] rounded-2xl`}
      >
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-4 rounded-full">
            <SubjectIcon className="w-12 h-12" />
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
