import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

// A component that throws
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
    if (shouldThrow) {
        throw new Error('Test error');
    }
    return <div>Working fine</div>;
}

describe('ErrorBoundary', () => {
    // Suppress console.error for expected errors in these tests
    const originalError = console.error;
    beforeAll(() => {
        console.error = vi.fn();
    });
    afterAll(() => {
        console.error = originalError;
    });

    it('renders children when no error', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow={false} />
            </ErrorBoundary>
        );
        expect(screen.getByText('Working fine')).toBeInTheDocument();
    });

    it('shows fallback UI when child throws', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText(/Test error/)).toBeInTheDocument();
    });

    it('shows try again button', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent shouldThrow={true} />
            </ErrorBoundary>
        );

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();

        // Click "Try Again" - it resets internal error state
        fireEvent.click(screen.getByText('Try Again'));
    });

    it('renders custom fallback when provided', () => {
        const customFallback = <div>Custom error page</div>;
        render(
            <ErrorBoundary fallback={customFallback}>
                <ThrowingComponent shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText('Custom error page')).toBeInTheDocument();
    });
});
