// ============================================
// Petit Stay - Spinner Component
// ============================================



// ----------------------------------------
// Types
// ----------------------------------------
interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

// ----------------------------------------
// Component
// ----------------------------------------
export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
    const sizeMap = {
        sm: 16,
        md: 24,
        lg: 40,
    };

    const pixelSize = sizeMap[size];

    return (
        <div
            className={`spinner ${className}`}
            style={{ width: pixelSize, height: pixelSize }}
            role="status"
            aria-label="Loading"
        />
    );
}

// ----------------------------------------
// Full Page Spinner
// ----------------------------------------
export function PageSpinner() {
    return (
        <div className="page-spinner">
            <Spinner size="lg" />
        </div>
    );
}