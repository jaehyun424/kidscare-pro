// ============================================
// Petit Stay - Error Boundary
// ============================================

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    isChunkError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, isChunkError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        const isChunkError =
            error.message.includes('Failed to fetch dynamically imported module') ||
            error.message.includes('Loading chunk') ||
            error.message.includes('ChunkLoadError');
        return { hasError: true, error, isChunkError };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, isChunkError: false });
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="error-boundary-fallback">
                    <div className="error-boundary-content">
                        <div className="error-boundary-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h2>{this.state.isChunkError ? 'Update Available' : 'Something went wrong'}</h2>
                        <p>
                            {this.state.isChunkError
                                ? 'A new version is available. Please reload to get the latest updates.'
                                : 'An unexpected error occurred. Please try again.'}
                        </p>
                        {this.state.error && !this.state.isChunkError && (
                            <pre className="error-boundary-detail">
                                {this.state.error.message}
                            </pre>
                        )}
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                            <button
                                className="error-boundary-btn"
                                onClick={this.state.isChunkError ? this.handleReload : this.handleReset}
                            >
                                {this.state.isChunkError ? 'Reload Page' : 'Try Again'}
                            </button>
                            {!this.state.isChunkError && (
                                <button
                                    className="error-boundary-btn"
                                    onClick={this.handleReload}
                                    style={{ background: 'var(--charcoal-700)' }}
                                >
                                    Reload Page
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
