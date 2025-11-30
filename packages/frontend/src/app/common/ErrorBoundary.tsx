import { Component, ErrorInfo, ReactNode } from 'react'
import { ErrorDisplay } from './ErrorDisplay.tsx'
import { createLogger } from '@/lib/logger.ts'

const logger = createLogger('ErrorBoundary')

export interface ErrorBoundaryProps {
  children: ReactNode
  showErrorDetails?: boolean
  fallbackMessage?: string
  showHomeButton?: boolean
  className?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service
    logger.error('Uncaught error', error, { errorInfo })
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    const {
      showErrorDetails = process.env.NODE_ENV === 'development',
      fallbackMessage = 'The application encountered an unexpected error.',
      showHomeButton = true,
      className,
    } = this.props

    if (this.state.hasError) {
      return (
        <div className={className}>
          <ErrorDisplay
            message={fallbackMessage}
            details={showErrorDetails ? this.state.error?.stack : undefined}
            onRetry={this.handleRetry}
            severity="fatal"
            standalone
            showHomeButton={showHomeButton}
          />
        </div>
      )
    }

    return this.props.children
  }
}
