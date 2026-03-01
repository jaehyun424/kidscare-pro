// ============================================
// KidsCare Pro - Skeleton Loading Components
// ============================================



// ----------------------------------------
// Types
// ----------------------------------------
interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    className?: string;
}

interface SkeletonTextProps {
    lines?: number;
    className?: string;
}

interface SkeletonCircleProps {
    size?: number;
    className?: string;
}

// ----------------------------------------
// Skeleton
// ----------------------------------------
export function Skeleton({
    width = '100%',
    height = '1rem',
    borderRadius = 'var(--radius-md)',
    className = '',
}: SkeletonProps) {
    const style: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius,
    };

    return <div className={`skeleton ${className}`} style={style} aria-hidden="true" />;
}

// ----------------------------------------
// Skeleton Text
// ----------------------------------------
export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
    return (
        <div className={`skeleton-text ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    width={i === lines - 1 ? '70%' : '100%'}
                    height="0.875rem"
                    className="skeleton-line"
                />
            ))}
        </div>
    );
}

// ----------------------------------------
// Skeleton Circle
// ----------------------------------------
export function SkeletonCircle({ size = 40, className = '' }: SkeletonCircleProps) {
    return (
        <Skeleton
            width={size}
            height={size}
            borderRadius="50%"
            className={className}
        />
    );
}

// ----------------------------------------
// Card Skeleton
// ----------------------------------------
export function CardSkeleton() {
    return (
        <div className="card">
            <div className="flex gap-4">
                <SkeletonCircle size={48} />
                <div style={{ flex: 1 }}>
                    <Skeleton width="60%" height="1.25rem" />
                    <Skeleton width="40%" height="0.875rem" className="mt-2" />
                </div>
            </div>
            <div className="mt-4">
                <SkeletonText lines={2} />
            </div>
        </div>
    );
}