// ============================================
// KidsCare Pro - Empty State Component
// ============================================

import React from 'react';
import { Button } from './Button';

// ----------------------------------------
// Types
// ----------------------------------------
interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
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
        <div className={`empty-state ${className}`}>
            {icon && <div className="empty-state-icon">{icon}</div>}
            <h3 className="empty-state-title">{title}</h3>
            {description && <p className="empty-state-description">{description}</p>}
            {action && (
                <Button variant="primary" onClick={action.onClick} className="empty-state-action">
                    {action.label}
                </Button>
            )}
        </div>
    );
}

// Additional styles
const emptyStateStyles = `
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-12) var(--space-6);
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: var(--space-4);
  opacity: 0.5;
}

.empty-state-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.empty-state-description {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  max-width: 300px;
  margin-bottom: var(--space-6);
}

.empty-state-action {
  margin-top: var(--space-4);
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = emptyStateStyles;
    document.head.appendChild(styleSheet);
}
