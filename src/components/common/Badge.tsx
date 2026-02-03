// ============================================
// KidsCare Pro - Badge Component
// ============================================



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
const statusConfig: Record<StatusBadgeProps['status'], { variant: BadgeVariant; label: string }> = {
    pending: { variant: 'warning', label: 'Pending' },
    confirmed: { variant: 'primary', label: 'Confirmed' },
    in_progress: { variant: 'primary', label: 'In Progress' },
    active: { variant: 'success', label: 'Active' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'neutral', label: 'Cancelled' },
    no_show: { variant: 'error', label: 'No Show' },
    emergency: { variant: 'error', label: 'Emergency' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Badge variant={config.variant}>
            <span className={`status-dot status-dot-${config.variant === 'success' ? 'success' : config.variant === 'error' ? 'error' : config.variant === 'warning' ? 'warning' : 'neutral'}`} />
            {config.label}
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
    return (
        <div className="safety-badge">
            <span className="safety-badge-icon">🛡️</span>
            <span className="safety-badge-text">
                <strong>{days}</strong> days safe
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
