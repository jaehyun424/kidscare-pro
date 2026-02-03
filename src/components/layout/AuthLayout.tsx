// ============================================
// KidsCare Pro - Auth Layout (Login/Register)
// ============================================

import React from 'react';
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

// Styles
const authLayoutStyles = `
.auth-layout {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  position: relative;
}

.auth-theme-toggle {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
}

.auth-content {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-logo {
  text-align: center;
  margin-bottom: var(--space-8);
}

.auth-logo-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: var(--space-4);
  animation: bounce 2s ease infinite;
}

.auth-logo-text {
  font-family: var(--font-family-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-2);
}

.auth-logo-tagline {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.auth-card {
  width: 100%;
  background: var(--bg-card);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  animation: fadeInUp var(--transition-slow);
}

.auth-footer {
  margin-top: var(--space-8);
  text-align: center;
}

.auth-footer p {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = authLayoutStyles;
    document.head.appendChild(styleSheet);
}
