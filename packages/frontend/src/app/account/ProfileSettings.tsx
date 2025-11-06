import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { NumberInput, GenderSelector, GradeSelector, LanguageSelector } from '@/app/common'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { User, Check, Loader2 } from 'lucide-react'
import type { UserSettings } from '@/data/core/types'

interface ProfileSettingsProps {
  settings: UserSettings
  onUpdate: (settings: Partial<UserSettings>) => Promise<void>
}

export function ProfileSettings({ settings, onUpdate }: ProfileSettingsProps) {
  const { t, i18n } = useTranslation('profile')

  const [name, setName] = useState('')
  const [age, setAge] = useState(10)
  const [grade, setGrade] = useState(5)
  const [gender, setGender] = useState('non-binary')
  const [language, setLanguage] = useState('en')
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)

  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const savedTimeoutRef = useRef<NodeJS.Timeout>()

  // Initialize form with current settings
  useEffect(() => {
    setName(settings.name || '')
    setAge(settings.age || 10)
    setGrade(settings.grade || 5)
    setGender(settings.gender || 'non-binary')
    setLanguage(settings.language || 'en')
  }, [settings])

  const autoSave = useCallback(async (updates: Partial<UserSettings>) => {
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
        console.error('Failed to save settings:', error)
      } finally {
        setIsSaving(false)
      }
    }, 500)
  }, [onUpdate, i18n])

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
      autoSave({ name: newName, age, grade, gender, language })
    }
  }

  const handleNameBlur = () => {
    setIsEditingName(false)
    if (name.trim()) {
      autoSave({ name, age, grade, gender, language })
    }
  }

  const handleAgeChange = (newAge: number) => {
    setAge(newAge)
    autoSave({ name, age: newAge, grade, gender, language })
  }

  const handleGradeChange = (newGrade: number) => {
    setGrade(newGrade)
    autoSave({ name, age, grade: newGrade, gender, language })
  }

  const handleGenderChange = (newGender: string) => {
    setGender(newGender)
    autoSave({ name, age, grade, gender: newGender, language })
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    autoSave({ name, age, grade, gender, language: newLanguage })
  }

  return (
    <Card className="p-8 bg-white shadow-md rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <User className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('account.profileSettings', { defaultValue: 'Profile Settings' })}
          </h2>
        </div>
        {/* Save status indicator */}
        <div className="flex items-center space-x-2">
          {isSaving && (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              <span className="text-sm text-gray-500">
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
          <Label className="block text-xl font-semibold text-gray-700 text-center">
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
              placeholder={t('settings.namePlaceholder', { defaultValue: 'Type your name here...' })}
              autoFocus
              className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-primary outline-none text-4xl text-center py-4 placeholder:text-gray-400 transition-colors"
            />
          ) : (
            <div
              onClick={() => setIsEditingName(true)}
              className="w-full bg-transparent text-4xl text-center py-4 cursor-pointer transition-colors hover:opacity-70"
            >
              {name || <span className="text-gray-400">{t('settings.namePlaceholder', { defaultValue: 'Type your name here...' })}</span>}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Age Section */}
        <div className="space-y-4">
          <Label className="block text-xl font-semibold text-gray-700 text-center">
            {t('settings.ageLabel', { defaultValue: 'How old are you?' })}
          </Label>
          <NumberInput
            value={age}
            onChange={handleAgeChange}
            min={6}
            max={18}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Grade Section */}
        <div className="space-y-4">
          <Label className="block text-xl font-semibold text-gray-700 text-center">
            {t('settings.gradeLabel', { defaultValue: 'What grade are you in?' })}
          </Label>
          <GradeSelector
            value={grade}
            onChange={handleGradeChange}
            age={age}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Gender Section */}
        <div className="space-y-4">
          <Label className="block text-xl font-semibold text-gray-700 text-center">
            {t('settings.gender.label', { defaultValue: 'Gender (optional)' })}
          </Label>
          <GenderSelector
            value={gender}
            onChange={handleGenderChange}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Language Section */}
        <div className="space-y-4">
          <Label className="block text-xl font-semibold text-gray-700 text-center">
            {t('settings.languageLabel', { defaultValue: 'Choose your language' })}
          </Label>
          <LanguageSelector
            value={language}
            onChange={handleLanguageChange}
          />
        </div>
      </div>
    </Card>
  )
}
