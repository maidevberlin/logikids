import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { GradeSelector, LanguageSelector } from '@/app/common'
import { Card } from '@/app/common/ui/card'
import { Label } from '@/app/common/ui/label'
import { User, Check, Loader2 } from 'lucide-react'
import type { UserSettings } from '@/app/user/types'
import { createLogger } from '@/app/common/logger'
import { Language, DEFAULT_LANGUAGE } from '@logikids/content/schema'

const logger = createLogger('ProfileSettings')

interface ProfileSettingsProps {
  settings: UserSettings
  onUpdate: (settings: Partial<UserSettings>) => Promise<void>
}

export function ProfileSettings({ settings, onUpdate }: ProfileSettingsProps) {
  const { t, i18n } = useTranslation('profile')

  const [name, setName] = useState('')
  const [grade, setGrade] = useState(5)
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)

  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const savedTimeoutRef = useRef<NodeJS.Timeout>()

  // Initialize form with current settings
  useEffect(() => {
    setName(settings.name || '')
    setGrade(settings.grade || 5)
    setLanguage(settings.language || DEFAULT_LANGUAGE)
  }, [settings])

  const autoSave = useCallback(
    async (updates: Partial<UserSettings>) => {
      // Clear any pending save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current)
      }

      // Debounce save by 500ms
      saveTimeoutRef.current = setTimeout(async () => {
        setIsSaving(true)
        setShowSaved(false)

        try {
          await onUpdate(updates)

          // Change i18n language if needed
          if (updates.language && updates.language !== i18n.language) {
            await i18n.changeLanguage(updates.language)
          }

          setShowSaved(true)
          savedTimeoutRef.current = setTimeout(() => {
            setShowSaved(false)
          }, 2000)
        } catch (error) {
          logger.error('Failed to save settings', error as Error)
        } finally {
          setIsSaving(false)
        }
      }, 500)
    },
    [onUpdate, i18n]
  )

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current)
    }
  }, [])

  const handleNameChange = (newName: string) => {
    setName(newName)
    if (newName.trim()) {
      void autoSave({ name: newName, grade, language })
    }
  }

  const handleNameBlur = () => {
    setIsEditingName(false)
    if (name.trim()) {
      autoSave({ name, grade, language })
    }
  }

  const handleGradeChange = (newGrade: number) => {
    setGrade(newGrade)
    autoSave({ name, grade: newGrade, language })
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    autoSave({ name, grade, language: newLanguage })
  }

  return (
    <Card className="p-8 bg-white shadow-md rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <User className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('account.profileSettings', { defaultValue: 'Profile Settings' })}
          </h2>
        </div>
        {/* Save status indicator */}
        <div className="flex items-center space-x-2">
          {isSaving && (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t('account.saving', { defaultValue: 'Saving...' })}
              </span>
            </>
          )}
          {showSaved && (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">
                {t('account.saved', { defaultValue: 'Saved' })}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Name Section */}
        <div className="space-y-4">
          <Label className="block text-xl font-semibold text-foreground text-center">
            {t('settings.nameLabel', { defaultValue: "What's your name?" })}
          </Label>
          {isEditingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNameBlur()
                }
              }}
              placeholder={t('settings.namePlaceholder', {
                defaultValue: 'Type your name here...',
              })}
              autoFocus
              className="w-full bg-transparent border-0 border-b-2 border focus:border-primary outline-none text-4xl text-center py-4 placeholder:text-muted-foreground transition-colors"
            />
          ) : (
            <div
              onClick={() => setIsEditingName(true)}
              className="w-full bg-transparent text-4xl text-center py-4 cursor-pointer transition-colors hover:opacity-70"
            >
              {name || (
                <span className="text-muted-foreground">
                  {t('settings.namePlaceholder', { defaultValue: 'Type your name here...' })}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Grade Section */}
        <div className="space-y-4">
          <Label className="block text-xl font-semibold text-foreground text-center">
            {t('settings.gradeLabel', { defaultValue: 'What grade are you in?' })}
          </Label>
          <GradeSelector value={grade} onChange={handleGradeChange} />
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Language Section */}
        <div className="space-y-4">
          <Label className="block text-xl font-semibold text-foreground text-center">
            {t('settings.languageLabel', { defaultValue: 'Choose your language' })}
          </Label>
          <LanguageSelector value={language} onChange={handleLanguageChange} />
        </div>
      </div>
    </Card>
  )
}
