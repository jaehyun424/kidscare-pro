import { useTranslation } from 'react-i18next';
import '../../styles/components/error-banner.css';

interface ErrorBannerProps {
  error: string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function ErrorBanner({ error, onRetry, onDismiss }: ErrorBannerProps) {
  const { t } = useTranslation();
  if (!error) return null;

  return (
    <div className="error-banner" role="alert">
      <div className="error-banner-content">
        <span className="error-banner-icon">&#x26A0;&#xFE0F;</span>
        <span className="error-banner-message">{error}</span>
      </div>
      <div className="error-banner-actions">
        {onRetry && (
          <button className="error-banner-retry" onClick={onRetry}>
            {t('common.retry', 'Retry')}
          </button>
        )}
        {onDismiss && (
          <button className="error-banner-dismiss" onClick={onDismiss} aria-label={t('common.dismiss', 'Dismiss')}>
            &#x2715;
          </button>
        )}
      </div>
    </div>
  );
}
