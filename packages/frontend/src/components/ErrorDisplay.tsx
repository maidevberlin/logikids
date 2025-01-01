import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaceFrownIcon, 
  ArrowPathIcon, 
  HomeIcon 
} from '@heroicons/react/24/outline';
import { Card } from './base/Card/Card';
import { Text } from './base/Typography/Text';
import { Button } from './base/Button/Button';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  isLoading?: boolean;
  /** If true, wraps the error in a full-screen centered layout with a Card */
  standalone?: boolean;
}

export function ErrorDisplay({ 
  message, 
  onRetry, 
  isLoading = false,
  standalone = false 
}: ErrorDisplayProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const content = (
    <div className="text-center space-y-6">
      <FaceFrownIcon className="h-16 w-16 mx-auto text-error-400" />
      <Text size="lg" color="error">{message}</Text>
      
      <div className="flex flex-col gap-4">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            fullWidth
            disabled={isLoading}
          >
            <span className="inline-flex items-center gap-2">
              <ArrowPathIcon className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? t('common.loading') : t('error.tryAgain')}
            </span>
          </Button>
        )}
        
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          fullWidth
          disabled={isLoading}
        >
          <span className="inline-flex items-center gap-2">
            <HomeIcon className="h-6 w-6" />
            {t('error.backToHome')}
          </span>
        </Button>
      </div>
    </div>
  );

  if (standalone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card variant="error" elevated className="p-8 max-w-md mx-auto">
          {content}
        </Card>
      </div>
    );
  }

  return content;
} 