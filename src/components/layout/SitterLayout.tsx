// ============================================
// KidsCare Pro - Sitter App Layout
// ============================================

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { IconButton } from '../common/Button';
import { TierBadge } from '../common/Badge';
import { useAuth } from '../../contexts/AuthContext';

// Icons (same pattern)
const CalendarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const ActiveIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,10" />
    </svg>
);

const EarningsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const ProfileIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const SunIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
    </svg>
);

const MoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

// Navigation Items
const navItems = [
    { to: '/sitter', icon: <CalendarIcon />, label: 'Schedule', end: true },
    { to: '/sitter/active', icon: <ActiveIcon />, label: 'Active' },
    { to: '/sitter/earnings', icon: <EarningsIcon />, label: 'Earnings' },
    { to: '/sitter/profile', icon: <ProfileIcon />, label: 'Profile' },
];

// Component
export function SitterLayout() {
    const { isDark, toggleTheme } = useTheme();
    const { user } = useAuth();

    return (
        <div className="sitter-layout">
            {/* Header */}
            <header className="sitter-header">
                <div className="sitter-header-left">
                    <span className="logo-icon">👶</span>
                    <span className="logo-text">KidsCare<span className="text-gold">Pro</span></span>
                </div>
                <div className="sitter-header-right">
                    <TierBadge tier="gold" showLabel={false} />
                    <IconButton
                        icon={isDark ? <SunIcon /> : <MoonIcon />}
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="sitter-content">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`
                        }
                    >
                        <span className="bottom-nav-icon">{item.icon}</span>
                        <span className="bottom-nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}

// Styles
const sitterLayoutStyles = `
.sitter-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.sitter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 50;
}

.sitter-header-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sitter-header-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.sitter-content {
  flex: 1;
  padding: var(--space-4);
  padding-bottom: calc(var(--space-4) + 70px);
  overflow-y: auto;
}

@media (min-width: 768px) {
  .sitter-layout {
    max-width: 480px;
    margin: 0 auto;
    box-shadow: var(--shadow-xl);
  }
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = sitterLayoutStyles;
    document.head.appendChild(styleSheet);
}
