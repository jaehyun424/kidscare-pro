// ============================================
// KidsCare Pro - Theme Context
// ============================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// ----------------------------------------
// Types
// ----------------------------------------
type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

interface ThemeProviderProps {
    children: React.ReactNode;
}

// ----------------------------------------
// Constants
// ----------------------------------------
const THEME_STORAGE_KEY = 'kidscare-theme';

// ----------------------------------------
// Context
// ----------------------------------------
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ----------------------------------------
// Provider
// ----------------------------------------
export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(() => {
        // Check localStorage first
        const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
        if (stored) return stored;

        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'dark'; // Default to dark for luxury feel
    });

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            const stored = localStorage.getItem(THEME_STORAGE_KEY);
            if (!stored) {
                setThemeState(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
    }, []);

    const value: ThemeContextType = {
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === 'dark',
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// ----------------------------------------
// Hook
// ----------------------------------------
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}
