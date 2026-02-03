// ============================================
// KidsCare Pro - Parent App Layout (Bottom Nav)
// ============================================

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { IconButton } from '../common/Button';

// ----------------------------------------
// Icons
// ----------------------------------------
const HomeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
);

const BookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
);

const HistoryIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
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
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
    </svg>
);

const MoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

// ----------------------------------------
// Navigation Items
// ----------------------------------------
const navItems = [
    { to: '/parent', icon: <HomeIcon />, label: 'Home', end: true },
    { to: '/parent/book', icon: <BookIcon />, label: 'Book' },
    { to: '/parent/history', icon: <HistoryIcon />, label: 'History' },
    { to: '/parent/profile', icon: <ProfileIcon />, label: 'Profile' },
];

// ----------------------------------------
// Component
// ----------------------------------------
export function ParentLayout() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="parent-layout">
            {/* Header */}
            <header className="parent-header">
                <div className="parent-header-logo">
                    <span className="logo-icon">👶</span>
                    <span className="logo-text">KidsCare<span className="text-gold">Pro</span></span>
                </div>
                <IconButton
                    icon={isDark ? <SunIcon /> : <MoonIcon />}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                />
            </header>

            {/* Main Content */}
            <main className="parent-content">
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

// ----------------------------------------
// Styles
// ----------------------------------------
const parentLayoutStyles = `
.parent-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

/* Header */
.parent-header {
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

.parent-header-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Content */
.parent-content {
  flex: 1;
  padding: var(--space-4);
  padding-bottom: calc(var(--space-4) + 70px);
  overflow-y: auto;
}

/* Bottom Navigation */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: var(--space-2) 0;
  padding-bottom: max(var(--space-2), env(safe-area-inset-bottom));
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-4);
  color: var(--text-tertiary);
  text-decoration: none;
  transition: color var(--transition-fast);
  border-radius: var(--radius-lg);
}

.bottom-nav-item:hover {
  color: var(--text-secondary);
}

.bottom-nav-item-active {
  color: var(--primary-400);
}

.bottom-nav-icon {
  display: flex;
}

.bottom-nav-label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

@media (min-width: 768px) {
  .parent-layout {
    max-width: 480px;
    margin: 0 auto;
    box-shadow: var(--shadow-xl);
  }
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = parentLayoutStyles;
    document.head.appendChild(styleSheet);
}
