import { Component, ErrorInfo, ReactNode } from 'react'
import { Alert } from '@/components/ui/alert'
import { Card } from '@/components/ui/card'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="max-w-md w-full p-8 shadow-md rounded-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>
            <Alert className="mb-4">
              <p className="text-sm text-gray-700">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </Alert>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
