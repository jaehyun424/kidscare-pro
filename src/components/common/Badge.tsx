// ============================================
// KidsCare Pro - Badge Component
// ============================================


import { useTranslation } from 'react-i18next';
// ----------------------------------------
// Types
// ----------------------------------------
type BadgeVariant = 'primary' | 'gold' | 'success' | 'warning' | 'error' | 'neutral';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    icon?: React.ReactNode;
    className?: string;
}

interface StatusBadgeProps {
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'active' | 'emergency';
}

interface TierBadgeProps {
    tier: 'gold' | 'silver';
    showLabel?: boolean;
}

// ----------------------------------------
// Badge Component
// ----------------------------------------
export function Badge({
    children,
    variant = 'neutral',
    size = 'md',
    icon,
    className = '',
}: BadgeProps) {
    const classes = [
        'badge',
        `badge-${variant}`,
        size === 'sm' ? 'badge-sm' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <span className={classes}>
            {icon && <span className="badge-icon">{icon}</span>}
            {children}
        </span>
    );
}

// ----------------------------------------
// Status Badge
// ----------------------------------------
const statusConfig: Record<StatusBadgeProps['status'], { variant: BadgeVariant; labelKey: string }> = {
    pending: { variant: 'warning', labelKey: 'status.pending' },
    confirmed: { variant: 'primary', labelKey: 'status.confirmed' },
    in_progress: { variant: 'primary', labelKey: 'status.inProgress' },
    active: { variant: 'success', labelKey: 'status.active' },
    completed: { variant: 'success', labelKey: 'status.completed' },
    cancelled: { variant: 'neutral', labelKey: 'status.cancelled' },
    no_show: { variant: 'error', labelKey: 'status.noShow' },
    emergency: { variant: 'error', labelKey: 'status.emergency' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const { t } = useTranslation();
    const config = statusConfig[status];

    return (
        <Badge variant={config.variant}>
            <span className={`status-dot status-dot-${config.variant === 'success' ? 'success' : config.variant === 'error' ? 'error' : config.variant === 'warning' ? 'warning' : 'neutral'}`} />
            {t(config.labelKey)}
        </Badge>
    );
}

// ----------------------------------------
// Tier Badge
// ----------------------------------------
export function TierBadge({ tier, showLabel = true }: TierBadgeProps) {
    const isGold = tier === 'gold';

    return (
        <span className={`badge-tier-${tier}`}>
            {isGold ? '★' : '☆'}
            {showLabel && <span style={{ marginLeft: '4px' }}>{isGold ? 'GOLD' : 'SILVER'}</span>}
        </span>
    );
}

// ----------------------------------------
// Safety Record Badge
// ----------------------------------------
interface SafetyBadgeProps {
    days: number;
}

export function SafetyBadge({ days }: SafetyBadgeProps) {
    const { t } = useTranslation();
    return (
        <div className="safety-badge">
            <span className="safety-badge-icon">🛡️</span>
            <span className="safety-badge-text">
                <strong style={{ marginRight: '4px' }}>{days}</strong>
                {t('hotel.daysWithoutIncident').replace('{{count}}', '')}
            </span>
        </div>
    );
}

// Additional styles
const badgeStyles = `
.badge-sm {
  font-size: 0.625rem;
  padding: 0.125rem 0.5rem;
}

.badge-icon {
  display: flex;
  margin-right: 0.25rem;
}

.safety-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--success-500);
}

.safety-badge-icon {
  font-size: 1rem;
}

.safety-badge-text strong {
  font-weight: var(--font-bold);
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = badgeStyles;
    document.head.appendChild(styleSheet);
}
