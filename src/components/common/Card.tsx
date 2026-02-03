// ============================================
// KidsCare Pro - Card Component
// ============================================

import React from 'react';

// ----------------------------------------
// Types
// ----------------------------------------
interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'gold' | 'hover';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
    action?: React.ReactNode;
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
    subtitle?: string;
}

interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

// ----------------------------------------
// Components
// ----------------------------------------
export function Card({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    onClick,
}: CardProps) {
    const variantClass = variant === 'gold' ? 'card-gold' : '';
    const paddingClass = padding === 'none' ? 'p-0' : padding === 'sm' ? 'p-sm' : padding === 'lg' ? 'p-lg' : '';
    const clickableClass = onClick ? 'card-clickable' : '';

    const classes = [
        'card',
        variantClass,
        paddingClass,
        clickableClass,
        className,
    ].filter(Boolean).join(' ');

    const Component = onClick ? 'button' : 'div';

    return (
        <Component className={classes} onClick={onClick}>
            {children}
        </Component>
    );
}

export function CardHeader({ children, className = '', action }: CardHeaderProps) {
    return (
        <div className={`card-header ${className}`}>
            <div className="card-header-content">{children}</div>
            {action && <div className="card-header-action">{action}</div>}
        </div>
    );
}

export function CardTitle({ children, className = '', subtitle }: CardTitleProps) {
    return (
        <div className={className}>
            <h3 className="card-title">{children}</h3>
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
    );
}

export function CardBody({ children, className = '' }: CardBodyProps) {
    return <div className={`card-body ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return <div className={`card-footer ${className}`}>{children}</div>;
}

// Additional styles
const cardStyles = `
.p-0 { padding: 0 !important; }
.p-sm { padding: var(--space-4) !important; }
.p-lg { padding: var(--space-8) !important; }

.card-clickable {
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-family: inherit;
}

.card-clickable:hover {
  transform: translateY(-2px);
}

.card-header-content {
  flex: 1;
}

.card-header-action {
  flex-shrink: 0;
}

.card-subtitle {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-top: var(--space-1);
}

.card-body {
  margin-top: var(--space-4);
}

.card-footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = cardStyles;
    document.head.appendChild(styleSheet);
}
