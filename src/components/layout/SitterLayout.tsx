// ============================================
// Petit Stay - Sitter App Layout
// ============================================


import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { IconButton } from '../common/Button';
import { TierBadge } from '../common/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { NotificationBell } from '../common/NotificationBell';
import '../../styles/sitter-layout.css';

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

// Component
export function SitterLayout() {
    const { isDark, toggleTheme } = useTheme();
    const { t } = useTranslation();
    useAuth(); // Keep auth context active

    // Navigation Items with translations
    const navItems = [
        { to: '/sitter', icon: <CalendarIcon />, labelKey: 'nav.schedule', end: true },
        { to: '/sitter/active', icon: <ActiveIcon />, labelKey: 'nav.active' },
        { to: '/sitter/earnings', icon: <EarningsIcon />, labelKey: 'nav.earnings' },
        { to: '/sitter/profile', icon: <ProfileIcon />, labelKey: 'nav.profile' },
    ];

    return (
        <div className="sitter-layout">
            {/* Header */}
            <header className="sitter-header">
                <div className="sitter-header-left">
                    <span className="logo-icon">👶</span>
                    <span className="logo-text">Petit<span className="text-gold">Stay</span></span>
                </div>
                <div className="sitter-header-right">
                    <TierBadge tier="gold" showLabel={false} />
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
                        <span className="bottom-nav-label">{t(item.labelKey)}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}

