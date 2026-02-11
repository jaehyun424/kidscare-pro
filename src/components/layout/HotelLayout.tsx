// ============================================
// KidsCare Pro - Hotel Layout (Sidebar + Content)
// ============================================

import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { IconButton } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

// ----------------------------------------
// Icons
// ----------------------------------------
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const BookingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const LiveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
  </svg>
);

const SittersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ReportsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);

const SafetyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9,12 11,14 15,10" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ScanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="3" height="3" />
    <line x1="21" y1="14" x2="21" y2="21" />
    <line x1="14" y1="21" x2="21" y2="21" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ----------------------------------------
// Navigation Items
// ----------------------------------------


// ----------------------------------------
// Component
// ----------------------------------------
export function HotelLayout() {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation Items with translations
  const navItems = [
    { to: '/hotel', icon: <DashboardIcon />, labelKey: 'nav.dashboard', end: true },
    { to: '/hotel/bookings', icon: <BookingsIcon />, labelKey: 'nav.bookings' },
    { to: '/hotel/live', icon: <LiveIcon />, labelKey: 'nav.liveMonitor' },
    { to: '/hotel/sitters', icon: <SittersIcon />, labelKey: 'nav.sitterManagement' },
    { to: '/hotel/reports', icon: <ReportsIcon />, labelKey: 'nav.reports' },
    { to: '/hotel/scan', icon: <ScanIcon />, labelKey: 'nav.scanQR' },
    { to: '/hotel/safety', icon: <SafetyIcon />, labelKey: 'nav.safety' },
    { to: '/hotel/settings', icon: <SettingsIcon />, labelKey: 'nav.settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="hotel-layout">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileMenuOpen ? 'sidebar-mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">👶</span>
            {!sidebarCollapsed && <span className="logo-text">KidsCare<span className="text-gold">Pro</span></span>}
          </div>
          <IconButton
            icon={<MenuIcon />}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
            className="sidebar-toggle desktop-only"
          />
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="sidebar-nav-label">{t(item.labelKey)}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <IconButton
            icon={isDark ? <SunIcon /> : <MoonIcon />}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          />
          <LanguageSwitcher />
          <IconButton
            icon={<LogoutIcon />}
            onClick={handleSignOut}
            aria-label="Sign out"
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <IconButton
            icon={<MenuIcon />}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="mobile-menu-btn"
          />
          <div className="header-spacer" />
          <div className="header-user">
            <span className="header-user-name">{user?.profile.firstName} {user?.profile.lastName}</span>
            <Avatar name={`${user?.profile.firstName} ${user?.profile.lastName}`} size="sm" />
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// ----------------------------------------
// Styles
// ----------------------------------------
// Styles
const layoutStyles = `
.hotel-layout {
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--cream-100);
}

/* Sidebar - Deep Charcoal Theme */
.sidebar {
  width: 280px;
  background: var(--charcoal-900);
  border-right: 1px solid var(--charcoal-800);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: width var(--transition-base), transform var(--transition-base);
  color: var(--cream-100);
  box-shadow: 4px 0 24px rgba(0,0,0,0.2);
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-overlay {
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar-mobile-open {
    transform: translateX(0);
  }
  
  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 99;
  }
  
  .desktop-only {
    display: none;
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--charcoal-800);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.02em;
}

.sidebar-toggle {
  color: var(--charcoal-400);
}
.sidebar-toggle:hover {
  color: white;
  background: var(--charcoal-800);
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-sm);
  color: var(--charcoal-400);
  text-decoration: none;
  transition: all var(--transition-fast);
  margin-bottom: 0.25rem;
  font-family: var(--font-action);
  letter-spacing: 0.05em;
}

.sidebar-nav-item:hover {
  background: var(--charcoal-800);
  color: var(--cream-100);
}

.sidebar-nav-item-active {
  background: var(--charcoal-800);
  color: var(--gold-500);
  border-left: 3px solid var(--gold-500);
}

.sidebar-nav-icon {
  display: flex;
  flex-shrink: 0;
  width: 24px;
  justify-content: center;
}

.sidebar-nav-label {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.sidebar-collapsed .sidebar-nav-label {
  display: none;
}

.sidebar-collapsed .sidebar-nav-item {
  justify-content: center;
  padding: 0.875rem 0;
}

/* Sidebar Footer */
.sidebar-footer {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border-top: 1px solid var(--charcoal-800);
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left var(--transition-base);
  background-color: var(--cream-100);
}

.sidebar-collapsed + .main-content,
.hotel-layout:has(.sidebar-collapsed) .main-content {
  margin-left: 80px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}

/* Header */
.main-header {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid var(--cream-200);
  position: sticky;
  top: 0;
  z-index: 50;
  height: 72px;
}

.mobile-menu-btn {
  display: none;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }
}

.header-spacer {
  flex: 1;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 1rem;
  border-left: 1px solid var(--cream-200);
}

.header-user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--charcoal-900);
  font-family: var(--font-action);
}

@media (max-width: 480px) {
  .header-user-name {
    display: none;
  }
}

/* Page Content */
.page-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .page-content {
    padding: 1rem;
  }
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = layoutStyles;
  document.head.appendChild(styleSheet);
}
