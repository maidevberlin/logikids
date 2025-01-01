import { Component, ErrorInfo, ReactNode } from 'react'
import { ErrorDisplay } from './ErrorDisplay/ErrorDisplay'

interface Props {
  children: ReactNode
  /** Whether to show error details (like stack trace) in production */
  showErrorDetails?: boolean
  /** Custom error message */
  fallbackMessage?: string
  /** Whether to show the home button */
  showHomeButton?: boolean
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    const { 
      showErrorDetails = process.env.NODE_ENV === 'development',
      fallbackMessage = 'The application encountered an unexpected error.',
      showHomeButton = true
    } = this.props

    if (this.state.hasError) {
      return (
        <ErrorDisplay 
          message={fallbackMessage}
          details={showErrorDetails ? this.state.error?.stack : undefined}
          onRetry={this.handleRetry}
          severity="fatal"
          standalone
          showHomeButton={showHomeButton}
        />
      )
    }

    return this.props.children
  }
} 