import { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getSubjectNamespace } from '@/i18n/subjectNamespace'
import { getSubjectTheme } from '@/app/common/subjectTheme'
import { SubjectList } from './SubjectList'
import { ConceptList } from './ConceptList'
import { UnifiedSubjectConceptSelectorProps } from './types'

export function SubjectConceptSelector({
  subject,
  concept,
  subjects,
  onConceptChange,
}: UnifiedSubjectConceptSelectorProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [previewSubject, setPreviewSubject] = useState(subject)

  // Find current subject and its concepts
  const currentSubject = useMemo(
    () => subjects.find((s) => s.id === subject),
    [subjects, subject]
  )

  // Get concepts for the preview subject (or current subject)
  const displayedConcepts = useMemo(() => {
    const targetSubject = subjects.find((s) => s.id === previewSubject)
    return targetSubject?.concepts ?? []
  }, [subjects, previewSubject])

  // Reset preview when opening
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)
    if (open) {
      setPreviewSubject(subject)
    }
  }, [subject])

  // Handle subject click in left column
  const handleSubjectClick = useCallback((subjectId: string) => {
    setPreviewSubject(subjectId)
  }, [])

  // Handle subject hover in left column - no-op, only click changes preview
  const handleSubjectHover = useCallback((_subjectId: string) => {
    // Do nothing - concepts only change on click
  }, [])

  // Handle concept click in right column
  const handleConceptClick = useCallback((conceptId: string) => {
    // Pass both concept and subject (use preview subject if it changed)
    const targetSubject = previewSubject !== subject ? previewSubject : subject
    onConceptChange(conceptId, targetSubject)
    // Close popover
    setIsOpen(false)
  }, [previewSubject, subject, onConceptChange])

  const theme = getSubjectTheme(subject)
  const SubjectIcon = theme.icon

  // Get concept display name
  const conceptDisplayName = useMemo(() => {
    if (!concept || concept === 'random') {
      return t('task.randomConcept')
    }
    const conceptObj = currentSubject?.concepts?.find((c) => c.id === concept)
    if (!conceptObj) return concept
    const namespace = getSubjectNamespace(subject, conceptObj.grade)
    return t(`${namespace}:concepts.${concept}.name`, {
      defaultValue: conceptObj.name,
    })
  }, [concept, currentSubject, subject, t])

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-xl border-0 shadow-none hover:opacity-80 h-auto"
          aria-label={t('task.selectSubjectConcept')}
        >
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border-0 ${theme.colors.badge}`}>
            <SubjectIcon className="w-4 h-4" />
            {/* Desktop: Show full text */}
            <span className="hidden sm:inline">
              {t(`subjects.${subject}.label`, { defaultValue: currentSubject?.name || subject })}
              {' • '}
              {conceptDisplayName}
            </span>
            {/* Mobile: Show only subject name */}
            <span className="sm:hidden">
              {t(`subjects.${subject}.label`, { defaultValue: currentSubject?.name || subject })}
            </span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] sm:w-[480px] lg:w-[560px] p-3 sm:p-4 rounded-2xl"
        align="center"
      >
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {/* Left column: Subjects */}
          <SubjectList
            subjects={subjects}
            currentSubject={subject}
            previewSubject={previewSubject}
            onSubjectClick={handleSubjectClick}
            onSubjectHover={handleSubjectHover}
          />

          {/* Divider */}
          <Separator orientation="vertical" className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" />

          {/* Right column: Concepts */}
          <ConceptList
            subject={previewSubject}
            concepts={displayedConcepts}
            currentConcept={concept}
            onConceptClick={handleConceptClick}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
