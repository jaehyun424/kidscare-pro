// ============================================
// Petit Stay - Auth Layout (Login/Register)
// ============================================

import { Outlet } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { IconButton } from '../common/Button';
import { BrandLogo } from '../common/BrandLogo';

// Component
export function AuthLayout() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="auth-layout">
            {/* Theme toggle */}
            <div className="auth-theme-toggle">
                <IconButton
                    icon={isDark ? <Sun size={20} strokeWidth={1.75} /> : <Moon size={20} strokeWidth={1.75} />}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                />
            </div>

            {/* Content */}
            <div className="auth-content">
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <BrandLogo size="lg" />
                    </div>
                    <h1 className="auth-logo-text">
                        Petit<span className="text-gold">Stay</span>
                    </h1>
                    <p className="auth-logo-tagline">Premium Hotel Childcare Infrastructure</p>
                </div>

                <div className="auth-card">
                    <Outlet />
                </div>

                <footer className="auth-footer">
                    <p>&copy; 2025 Petit Stay. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
