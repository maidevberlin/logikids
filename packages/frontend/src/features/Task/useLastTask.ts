import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TaskRequest } from '../../api/logikids'

const STORAGE_KEY = 'logikids_last_task'

interface LastTask {
  subject: string
  concept: string
}

export function useLastTask(taskDefaults: Pick<TaskRequest, 'subject' | 'concept'>) {
  const [searchParams, setSearchParams] = useSearchParams()

  // Load last used subject and concept from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const { subject, concept } = JSON.parse(stored) as LastTask
        // Only set if not already in URL params
        if (!searchParams.has('subject') && !searchParams.has('concept')) {
          setSearchParams(prev => {
            const newParams = new URLSearchParams(prev)
            newParams.set('subject', subject)
            newParams.set('concept', concept)
            return newParams
          })
        }
      }
    } catch (error) {
      console.warn('Could not load last task settings:', error)
    }
  }, [])

  // Store subject and concept when they change
  const storeLastTask = (subject: string, concept: string) => {
    if (subject !== taskDefaults.subject || concept !== taskDefaults.concept) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ subject, concept }))
      } catch (error) {
        console.warn('Could not save task settings:', error)
      }
    }
  }

  return { storeLastTask }
} 