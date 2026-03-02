// ============================================
// Petit Stay - Sitter App Layout
// ============================================

import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, DollarSign, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { IconButton } from '../common/Button';
import { TierBadge } from '../common/Badge';
import { BrandLogo } from '../common/BrandLogo';
import { useAuth } from '../../contexts/AuthContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { NotificationBell } from '../common/NotificationBell';
import { PageTransition } from '../common/PageTransition';
import { AnimatePresence } from 'framer-motion';
import '../../styles/sitter-layout.css';

// Component
export function SitterLayout() {
    const { isDark, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const location = useLocation();
    useAuth(); // Keep auth context active

    const navItems = [
        { to: '/sitter', icon: <Calendar size={22} strokeWidth={1.75} />, labelKey: 'nav.schedule', end: true },
        { to: '/sitter/active', icon: <Clock size={22} strokeWidth={1.75} />, labelKey: 'nav.active' },
        { to: '/sitter/earnings', icon: <DollarSign size={22} strokeWidth={1.75} />, labelKey: 'nav.earnings' },
        { to: '/sitter/profile', icon: <User size={22} strokeWidth={1.75} />, labelKey: 'nav.profile' },
    ];

    return (
        <div className="sitter-layout">
            {/* Header */}
            <header className="sitter-header">
                <div className="sitter-header-left">
                    <BrandLogo size="sm" />
                    <span className="logo-text">Petit<span className="text-gold">Stay</span></span>
                </div>
                <div className="sitter-header-right">
                    <TierBadge tier="gold" showLabel={false} />
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
            <main className="sitter-content">
                <AnimatePresence mode="wait">
                    <PageTransition key={location.pathname}>
                        <Outlet />
                    </PageTransition>
                </AnimatePresence>
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
