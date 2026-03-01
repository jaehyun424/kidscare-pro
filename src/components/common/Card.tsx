// ============================================
// KidsCare Pro - Card Component
// ============================================



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