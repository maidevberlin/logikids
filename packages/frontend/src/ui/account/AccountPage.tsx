import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '@/ui/common'
import { useUserData } from '@/features/UserData'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, Languages, Download, Trash2 } from 'lucide-react'

export default function AccountPage() {
  const { t, i18n } = useTranslation()
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
      breadcrumb={[
        { label: t('account.title', { defaultValue: 'My Account' }), path: '/account' }
      ]}
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

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="name">
                {t('settings.nameLabel', { defaultValue: "What's your name?" })}
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('settings.namePlaceholder', { defaultValue: 'Type your name here...' })}
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">
                  {t('settings.ageLabel', { defaultValue: 'How old are you?' })}
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 10)}
                  min="6"
                  max="18"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="grade">
                  {t('settings.gradeLabel', { defaultValue: 'What grade are you in?' })}
                </Label>
                <Select
                  value={grade.toString()}
                  onValueChange={(value) => setGrade(parseInt(value))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((g) => (
                      <SelectItem key={g} value={g.toString()}>
                        {t('onboarding.studentInfo.gradeValue', { grade: g, defaultValue: `Grade ${g}` })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="gender">
                {t('settings.gender.label', { defaultValue: 'Gender (optional)' })}
              </Label>
              <Select
                value={gender}
                onValueChange={(value) => setGender(value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">
                    {t('settings.gender.options.male', { defaultValue: 'Male' })}
                  </SelectItem>
                  <SelectItem value="female">
                    {t('settings.gender.options.female', { defaultValue: 'Female' })}
                  </SelectItem>
                  <SelectItem value="non-binary">
                    {t('settings.gender.options.non-binary', { defaultValue: 'Non-binary' })}
                  </SelectItem>
                  <SelectItem value="prefer-not-to-say">
                    {t('settings.gender.options.prefer-not-to-say', { defaultValue: 'Prefer not to say' })}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">
                <div className="flex items-center space-x-2">
                  <Languages className="w-4 h-4" />
                  <span>{t('settings.languageLabel', { defaultValue: 'Choose your language' })}</span>
                </div>
              </Label>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
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
