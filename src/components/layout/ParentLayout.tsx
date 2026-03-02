// ============================================
// Petit Stay - Parent App Layout (Bottom Nav)
// ============================================

import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Layers, Clock, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { IconButton } from '../common/Button';
import { BrandLogo } from '../common/BrandLogo';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { NotificationBell } from '../common/NotificationBell';
import '../../styles/parent-layout.css';

// ----------------------------------------
// Component
// ----------------------------------------
export function ParentLayout() {
    const { isDark, toggleTheme } = useTheme();
    const { t } = useTranslation();

    const navItems = [
        { to: '/parent', icon: <Home size={22} strokeWidth={1.75} />, labelKey: 'nav.home', end: true },
        { to: '/parent/book', icon: <Layers size={22} strokeWidth={1.75} />, labelKey: 'nav.book' },
        { to: '/parent/history', icon: <Clock size={22} strokeWidth={1.75} />, labelKey: 'nav.history' },
        { to: '/parent/profile', icon: <User size={22} strokeWidth={1.75} />, labelKey: 'nav.profile' },
    ];

    return (
        <div className="parent-layout">
            {/* Header */}
            <header className="parent-header">
                <div className="parent-header-logo">
                    <BrandLogo size="sm" />
                    <span className="logo-text">Petit<span className="text-gold">Stay</span></span>
                </div>
                <div className="parent-header-right">
                    <NotificationBell />
                    <LanguageSwitcher />
                    <IconButton
                        icon={isDark ? <Sun size={20} strokeWidth={1.75} /> : <Moon size={20} strokeWidth={1.75} />}
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
