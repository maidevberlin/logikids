import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageLayout, NumberInput, GenderSelector, GradeSelector, LanguageSelector } from '@/app/common'
import { useUserData } from '@/app/account'
import { RecoveryKit } from './RecoveryKit'
import { QRDisplay } from './QRDisplay'
import { ExportData } from './ExportData'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { User, Trash2, Database } from 'lucide-react'

export default function AccountPage() {
  const { t, i18n } = useTranslation('profile')
  const { data, updateSettings } = useUserData()

  const [name, setName] = useState('')
  const [age, setAge] = useState(10)
  const [grade, setGrade] = useState(5)
  const [gender, setGender] = useState('non-binary')
  const [language, setLanguage] = useState('en')
  const [syncEnabled, setSyncEnabled] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)

  // Format last sync timestamp
  const formatLastSync = (timestamp?: number) => {
    if (!timestamp) {
      return t('account.neverSynced', { defaultValue: 'Never' })
    }

    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) {
      return t('account.justNow', { defaultValue: 'Just now' })
    } else if (minutes < 60) {
      return t('account.minutesAgo', { defaultValue: '{{count}} minutes ago', count: minutes })
    } else if (hours < 24) {
      return t('account.hoursAgo', { defaultValue: '{{count}} hours ago', count: hours })
    } else if (days < 7) {
      return t('account.daysAgo', { defaultValue: '{{count}} days ago', count: days })
    } else {
      return new Date(timestamp).toLocaleDateString()
    }
  }

  // Initialize form with current data
  useEffect(() => {
    if (data) {
      setName(data.settings.name || '')
      setAge(data.settings.age || 10)
      setGrade(data.settings.grade || 5)
      setGender(data.settings.gender || 'non-binary')
      setLanguage(data.settings.language || 'en')
      setSyncEnabled(data.settings.syncEnabled || false)
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


  const handleSyncToggle = async (checked: boolean) => {
    setSyncEnabled(checked)
    try {
      await updateSettings({ syncEnabled: checked })
    } catch (error) {
      console.error('Failed to update sync setting:', error)
      // Revert on error
      setSyncEnabled(!checked)
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
      showHome
      showStats
      showAccount
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

        {/* Data Management */}
        <Card className="p-8 bg-white shadow-md rounded-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('account.dataManagement', { defaultValue: 'Data Management' })}
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              {t('account.dataInfo', {
                defaultValue: 'Your data is stored securely on your device. You can export or delete it at any time.'
              })}
            </p>

            {/* Export Data - Always available */}
            <ExportData />

            <div className="border-t border-gray-200 pt-4" />

            {/* Cloud Backup Toggle */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex-1">
                <Label htmlFor="sync-enabled" className="text-base font-semibold text-gray-900 cursor-pointer block">
                  {t('settings.syncLabel', { defaultValue: 'Cloud Backup' })}
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {t('settings.syncDescription', { defaultValue: 'Automatically backup your data to the cloud' })}
                </p>
                {data?.lastSyncTimestamp && (
                  <p className="text-xs text-gray-500 mt-1">
                    {t('account.lastSynced', { defaultValue: 'Last synced: {{time}}', time: formatLastSync(data.lastSyncTimestamp) })}
                  </p>
                )}
              </div>
              <Switch
                id="sync-enabled"
                checked={syncEnabled}
                onCheckedChange={handleSyncToggle}
              />
            </div>

            {/* Recovery Kit & QR Code - Only show when cloud backup is enabled */}
            {syncEnabled && (
              <>
                <RecoveryKit />

                <div className="border-t border-gray-200 pt-4">
                  <QRDisplay />
                </div>
              </>
            )}

            <div className="border-t border-gray-200 pt-4" />

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
