import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { Shield, Lock, Eye, UserX, Info } from 'lucide-react'

export interface ParentalConsentStepProps {
  onConsent: () => void
}

export function ParentalConsentStep({ onConsent }: ParentalConsentStepProps) {
  const { t } = useTranslation()
  const [consented, setConsented] = useState(false)

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 bg-white shadow-lg rounded-2xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          {t('onboarding.parentalConsent.title', { defaultValue: 'Welcome to LogiKids' })}
        </h1>

        <p className="text-gray-600 mb-6">
          {t('onboarding.parentalConsent.intro', {
            defaultValue: 'LogiKids uses AI to generate personalized learning tasks for your child.'
          })}
        </p>

        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {t('onboarding.parentalConsent.keyPointsTitle', { defaultValue: 'Key Points' })}
          </h2>

          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">
              {t('onboarding.parentalConsent.aiContent', {
                defaultValue: 'AI-generated educational content tailored to your child\'s age and grade'
              })}
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">
              {t('onboarding.parentalConsent.clientFirst', {
                defaultValue: 'All data is stored securely on your device. Optional encrypted backups to server only if you enable it.'
              })}
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">
              {t('onboarding.parentalConsent.compliance', {
                defaultValue: 'We comply with GDPR and AI Act regulations'
              })}
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <Eye className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">
              {t('onboarding.parentalConsent.ageAppropriate', {
                defaultValue: 'Age-appropriate content only'
              })}
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <UserX className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">
              {t('onboarding.parentalConsent.noSharing', {
                defaultValue: 'No data sharing with third parties'
              })}
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">
              {t('onboarding.parentalConsent.dataRights', {
                defaultValue: 'Right to access and delete data at any time'
              })}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={consented}
              onCheckedChange={(checked) => setConsented(checked === true)}
            />
            <label
              htmlFor="consent"
              className="text-sm font-medium text-gray-900 cursor-pointer"
            >
              {t('onboarding.parentalConsent.consentCheckbox', {
                defaultValue: 'I am a parent/guardian and have read the above information'
              })}
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm space-x-4">
            <a
              href="#"
              className="text-blue-600 hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              {t('onboarding.parentalConsent.privacyPolicy', { defaultValue: 'Privacy Policy' })}
            </a>
            <a
              href="#"
              className="text-blue-600 hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              {t('onboarding.parentalConsent.terms', { defaultValue: 'Terms of Service' })}
            </a>
          </div>

          <Button
            onClick={onConsent}
            disabled={!consented}
            size="lg"
          >
            {t('onboarding.parentalConsent.continue', { defaultValue: 'Continue' })}
          </Button>
        </div>
      </Card>
    </div>
  )
}
