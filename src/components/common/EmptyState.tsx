// ============================================
// Petit Stay - EmptyState Component
// Reusable empty state display for pages with no data
// ============================================

import type { ReactNode } from 'react';
import '../../styles/components/empty-state.css';

// ----------------------------------------
// Types
// ----------------------------------------
interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

// ----------------------------------------
// Component
// ----------------------------------------
export function EmptyState({
    icon,
    title,
    description,
    action,
    className = '',
}: EmptyStateProps) {
    return (
        <div className={`empty-state ${className}`} role="status">
            {icon && (
                <div className="empty-state-icon" aria-hidden="true">
                    {icon}
                </div>
            )}
            <h3 className="empty-state-title">{title}</h3>
            {description && (
                <p className="empty-state-description">{description}</p>
            )}
            {action && (
                <div className="empty-state-action">
                    {action}
                </div>
            )}
        </div>
    );
}
