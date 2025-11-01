import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, NumberInput, GenderSelector, GradeSelector, LanguageSelector } from '@/ui/common'
import { useUserData } from '@/features/UserData'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { User, Download, Trash2 } from 'lucide-react'

export default function AccountPage() {
  const { t, i18n } = useTranslation('profile')
  const { data, updateSettings, exportData } = useUserData()

  const [name, setName] = useState('')
  const [age, setAge] = useState(10)
  const [grade, setGrade] = useState(5)
  const [gender, setGender] = useState('non-binary')
  const [language, setLanguage] = useState('en')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Initialize form with current data
  useEffect(() => {
    if (data) {
      setName(data.settings.name || '')
      setAge(data.settings.age || 10)
      setGrade(data.settings.grade || 5)
      setGender(data.settings.gender || 'non-binary')
      setLanguage(data.settings.language || 'en')
    }
  }, [data])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')

    try {
      await updateSettings({
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

  const handleExport = async () => {
    try {
      const json = await exportData()
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `logikids-data-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  const handleDelete = () => {
    if (window.confirm(t('account.deleteConfirm', {
      defaultValue: 'Are you sure you want to delete all your data? This cannot be undone.'
    }))) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <PageLayout
      showBack
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('account.title', { defaultValue: 'My Account' })}
          </h1>
          <p className="text-gray-600">
            {t('account.subtitle', { defaultValue: 'Manage your profile and preferences' })}
          </p>
        </div>

        {/* Profile Settings */}
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
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('settings.namePlaceholder', { defaultValue: 'Type your name here...' })}
                required
                className="w-full bg-transparent border-0 border-b-2 border-gray-300 focus:border-primary outline-none text-4xl text-center py-4 placeholder:text-gray-400 transition-colors"
              />
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

        {/* Data Management */}
        <Card className="p-8 bg-white shadow-md rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('account.dataManagement', { defaultValue: 'Data Management' })}
          </h2>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              {t('account.dataInfo', {
                defaultValue: 'Your data is stored securely on your device. You can export or delete it at any time.'
              })}
            </p>

            <Button
              onClick={handleExport}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('account.exportData', { defaultValue: 'Export My Data' })}
            </Button>

            <Button
              onClick={handleDelete}
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('account.deleteData', { defaultValue: 'Delete All Data' })}
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  )
}
