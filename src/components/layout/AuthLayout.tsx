// ============================================
// KidsCare Pro - Auth Layout (Login/Register)
// ============================================


import { Outlet } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { IconButton } from '../common/Button';

// Icons
const SunIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
    </svg>
);

const MoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

// Component
export function AuthLayout() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="auth-layout">
            {/* Theme toggle */}
            <div className="auth-theme-toggle">
                <IconButton
                    icon={isDark ? <SunIcon /> : <MoonIcon />}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                />
            </div>

            {/* Content */}
            <div className="auth-content">
                <div className="auth-logo">
                    <span className="auth-logo-icon">👶</span>
                    <h1 className="auth-logo-text">
                        KidsCare<span className="text-gold">Pro</span>
                    </h1>
                    <p className="auth-logo-tagline">Premium Hotel Childcare Infrastructure</p>
                </div>

                <div className="auth-card">
                    <Outlet />
                </div>

                <footer className="auth-footer">
                    <p>© 2025 KidsCare Pro. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}