import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { parseBackupCode, prepareImportData, useSync } from '@/app/user/sync'
import { useAuth } from '@/app/user'
import { Button } from '@/app/common/ui/button'
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react'

type PairStatus = 'loading' | 'existing_account' | 'importing' | 'success' | 'error'

export function PairPage() {
  const { t } = useTranslation('profile')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isAuthenticated, login, authLoading } = useAuth()
  const { sync } = useSync()
  const [status, setStatus] = useState<PairStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    const code = searchParams.get('code')
    if (!code) {
      setStatus('error')
      setError(t('account.pair.noCodeError'))
      return
    }

    // If user already has an account, show message
    if (isAuthenticated) {
      setStatus('existing_account')
      return
    }

    // Try to import
    void performImport(code)
  }, [authLoading, isAuthenticated, searchParams])

  const performImport = async (code: string) => {
    setStatus('importing')
    setError(null)

    try {
      const payload = parseBackupCode(code)
      await prepareImportData(payload)
      await login(payload.userId)

      try {
        await sync()
      } catch {
        // Sync failure is not critical
      }

      window.dispatchEvent(new Event('data-changed'))
      setStatus('success')

      // Redirect to home after brief delay
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : t('account.pair.importError'))
    }
  }

  const handleGoToAccount = () => {
    navigate('/account')
  }

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border rounded-xl p-8 text-center space-y-6">
        {(status === 'loading' || status === 'importing') && (
          <>
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
            <p className="text-lg">{t('account.pair.importing')}</p>
          </>
        )}

        {status === 'existing_account' && (
          <>
            <AlertTriangle className="w-12 h-12 mx-auto text-yellow-500" />
            <h1 className="text-xl font-semibold">{t('account.pair.existingAccountTitle')}</h1>
            <p className="text-muted-foreground">{t('account.pair.existingAccountMessage')}</p>
            <div className="space-y-2">
              <Button onClick={handleGoToAccount} className="w-full">
                {t('account.pair.goToAccount')}
              </Button>
              <Button onClick={handleGoHome} variant="outline" className="w-full">
                {t('account.pair.goHome')}
              </Button>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
            <h1 className="text-xl font-semibold">{t('account.pair.successTitle')}</h1>
            <p className="text-muted-foreground">{t('account.pair.successMessage')}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
            <h1 className="text-xl font-semibold">{t('account.pair.errorTitle')}</h1>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={handleGoHome} variant="outline" className="w-full">
              {t('account.pair.goHome')}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
