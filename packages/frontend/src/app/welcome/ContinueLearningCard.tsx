import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/app/common/ui/card'
import { GraduationCap } from 'lucide-react'
import { useUserData } from '@/app/user'
import { trpc } from '@/app/common/trpc'
import { getSubjectTheme } from '@/app/subjects'

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
  const iconBg = theme ? 'bg-white/20' : 'bg-primary/10'
  const iconColor = theme ? 'text-white' : 'text-primary'
  const cardBg = theme ? theme.colors.bg : 'bg-card'
  const cardHover = theme ? theme.colors.hover : 'hover:bg-card'
  const textColor = theme ? 'text-white' : 'text-foreground'
  const descColor = theme ? 'text-white/90' : 'text-muted-foreground'

  return (
    <Link to={linkTo} className="block">
      <Card
        className={`p-6 ${cardBg} ${cardHover} shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer ${textColor} hover:scale-[1.02] rounded-2xl h-full`}
      >
        <div className="flex flex-col items-center text-center space-y-3 h-full justify-center">
          <div className={`${iconBg} p-4 rounded-full`}>
            <SubjectIcon className={`w-8 h-8 ${iconColor}`} />
          </div>
          <h3 className={`text-xl font-bold ${textColor}`}>{title}</h3>
          <p className={descColor}>{description}</p>
        </div>
      </Card>
    </Link>
  )
}
