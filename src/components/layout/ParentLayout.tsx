// ============================================
// Petit Stay - Parent App Layout (Bottom Nav)
// ============================================

import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { IconButton } from '../common/Button';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { NotificationBell } from '../common/NotificationBell';
import '../../styles/parent-layout.css';

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
// Component
// ----------------------------------------
export function ParentLayout() {
    const { isDark, toggleTheme } = useTheme();
    const { t } = useTranslation();

    // Navigation Items with translations
    const navItems = [
        { to: '/parent', icon: <HomeIcon />, labelKey: 'nav.home', end: true },
        { to: '/parent/book', icon: <BookIcon />, labelKey: 'nav.book' },
        { to: '/parent/history', icon: <HistoryIcon />, labelKey: 'nav.history' },
        { to: '/parent/profile', icon: <ProfileIcon />, labelKey: 'nav.profile' },
    ];

    return (
        <div className="parent-layout">
            {/* Header */}
            <header className="parent-header">
                <div className="parent-header-logo">
                    <span className="logo-icon">👶</span>
                    <span className="logo-text">Petit<span className="text-gold">Stay</span></span>
                </div>
                <div className="parent-header-right">
                    <NotificationBell />
                    <LanguageSwitcher />
                    <IconButton
                        icon={isDark ? <SunIcon /> : <MoonIcon />}
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    />
                </div>
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
                        <span className="bottom-nav-label">{t(item.labelKey)}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}

