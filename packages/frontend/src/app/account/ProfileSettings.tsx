import { useState, useEffect, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { NumberInput, GenderSelector, GradeSelector, LanguageSelector } from '@/app/common'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
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
  const [saveMessage, setSaveMessage] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)

  // Initialize form with current settings
  useEffect(() => {
    setName(settings.name || '')
    setAge(settings.age || 10)
    setGrade(settings.grade || 5)
    setGender(settings.gender || 'non-binary')
    setLanguage(settings.language || 'en')
  }, [settings])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')

    try {
      await onUpdate({
        name,
        age,
        grade,
        gender,
        language
      })

      // Change i18n language
      if (language !== i18n.language) {
        await i18n.changeLanguage(language)
      }

      setSaveMessage(t('account.saved', { defaultValue: 'Changes saved successfully!' }))
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      setSaveMessage('Error saving changes')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="p-8 bg-white shadow-md rounded-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-primary/10 p-3 rounded-full">
          <User className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {t('account.profileSettings', { defaultValue: 'Profile Settings' })}
        </h2>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Name Section */}
        <div className="space-y-4">
          <Label className="block text-xl font-semibold text-gray-700 text-center">
            {t('settings.nameLabel', { defaultValue: "What's your name?" })}
          </Label>
          {isEditingName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingName(false)
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
            onChange={setAge}
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
            onChange={setGrade}
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
            onChange={setGender}
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
            onChange={setLanguage}
          />
        </div>

        {saveMessage && (
          <div className={`p-3 rounded-lg ${saveMessage.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {saveMessage}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSaving || !name.trim()}
        >
          {isSaving
            ? t('account.saving', { defaultValue: 'Saving...' })
            : t('account.saveButton', { defaultValue: 'Save Changes' })}
        </Button>
      </form>
    </Card>
  )
}
