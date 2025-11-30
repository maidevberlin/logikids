import { useState, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '@/app/common/ui/card'
import { Button } from '@/app/common/ui/button'
import { Label } from '@/app/common/ui/label'
import { Input } from '@/app/common/ui/input'
import { Upload, Camera, FileText, ArrowRight } from 'lucide-react'

// Lazy load heavy PDF component
const PDFImport = lazy(() => import('./PDFImport').then((m) => ({ default: m.PDFImport })))
import { QRScanner } from './QRScanner'
import { ManualImport } from './ManualImport'
import { useAuth } from '@/app/account'
import { Footer } from '@/app/common/Footer'
import { createLogger } from '@/lib/logger'
import { trpc } from '@/api/trpc'

const logger = createLogger('WelcomeChoicePage')

export function WelcomeChoicePage() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const { register } = useAuth()
  const [inviteCode, setInviteCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPDFImport, setShowPDFImport] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showManualImport, setShowManualImport] = useState(false)

  const checkInviteMutation = trpc.invites.check.useMutation()

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteCode.trim()) return

    setIsValidating(true)
    setError(null)

    try {
      // Check invite code validity first (optional - backend will validate too)
      const checkResult = await checkInviteMutation.mutateAsync({ code: inviteCode.trim() })

      if (!checkResult.valid) {
        setError(
          checkResult.reason ||
            t('welcomeChoice.newAccount.invalidCode', { defaultValue: 'Invalid invite code' })
        )
        setIsValidating(false)
        return
      }

      // Register user with backend (validates invite + creates account + returns JWT)
      await register(inviteCode.trim())

      // Navigate to onboarding
      navigate('/onboarding')
    } catch (err) {
      logger.error('Invite validation error', err as Error)
      setError(
        err instanceof Error
          ? err.message
          : t('welcomeChoice.newAccount.validationError', {
              defaultValue: 'Failed to validate invite code',
            })
      )
      setIsValidating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              {t('welcomeChoice.title', { defaultValue: 'Welcome to Logikids' })}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('welcomeChoice.subtitle', { defaultValue: 'Choose how you want to get started' })}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Invite Code */}
            <Card className="p-8 bg-white shadow-lg rounded-2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {t('welcomeChoice.newAccount.title', { defaultValue: 'I Have an Invite Code' })}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('welcomeChoice.newAccount.description', {
                      defaultValue: 'Start fresh with a new account',
                    })}
                  </p>
                </div>

                <form onSubmit={handleInviteSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="invite-code" className="text-base font-medium">
                      {t('welcomeChoice.newAccount.inviteLabel', { defaultValue: 'Invite Code' })}
                    </Label>
                    <Input
                      id="invite-code"
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder={t('welcomeChoice.newAccount.invitePlaceholder', {
                        defaultValue: 'Enter your invite code',
                      })}
                      className="text-lg py-6 text-center font-mono uppercase"
                      disabled={isValidating}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!inviteCode.trim() || isValidating}
                  >
                    {isValidating
                      ? t('welcomeChoice.newAccount.validating', { defaultValue: 'Validating...' })
                      : t('welcomeChoice.newAccount.continue', { defaultValue: 'Continue' })}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </div>
            </Card>

            {/* Right: Import Options */}
            <Card className="p-8 bg-white shadow-lg rounded-2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {t('welcomeChoice.import.title', { defaultValue: 'Import Existing Account' })}
                  </h2>
                  <p className="text-muted-foreground">
                    {t('welcomeChoice.import.description', {
                      defaultValue: 'Restore from your recovery kit',
                    })}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Upload PDF */}
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="lg"
                    onClick={() => setShowPDFImport(true)}
                  >
                    <Upload className="w-5 h-5 mr-3" />
                    {t('welcomeChoice.import.uploadPDF', {
                      defaultValue: 'Upload Recovery Kit PDF',
                    })}
                  </Button>

                  {/* Scan QR Code */}
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="lg"
                    onClick={() => setShowQRScanner(true)}
                  >
                    <Camera className="w-5 h-5 mr-3" />
                    {t('welcomeChoice.import.scanQR', { defaultValue: 'Scan QR Code with Camera' })}
                  </Button>

                  {/* Manual Code */}
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="lg"
                    onClick={() => setShowManualImport(true)}
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    {t('welcomeChoice.import.manualCode', {
                      defaultValue: 'Enter Backup Code Manually',
                    })}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Import Dialogs */}
          {showPDFImport && (
            <Suspense
              fallback={
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg">Loading...</div>
                </div>
              }
            >
              <PDFImport
                onClose={() => setShowPDFImport(false)}
                onSuccess={() => {
                  // Navigate to onboarding - it will redirect to home if account data is complete
                  navigate('/onboarding', { replace: true })
                }}
              />
            </Suspense>
          )}

          {showQRScanner && (
            <QRScanner
              onClose={() => setShowQRScanner(false)}
              onSuccess={() => {
                // Navigate to onboarding - it will redirect to home if account data is complete
                navigate('/onboarding', { replace: true })
              }}
            />
          )}

          {showManualImport && (
            <ManualImport
              onClose={() => setShowManualImport(false)}
              onSuccess={() => {
                // Navigate to onboarding - it will redirect to home if account data is complete
                navigate('/onboarding', { replace: true })
              }}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
