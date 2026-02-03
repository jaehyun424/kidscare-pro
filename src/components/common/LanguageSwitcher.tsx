// ============================================
// KidsCare Pro - Language Switcher Component
// ============================================

import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;

    const toggleLanguage = () => {
        const newLang = currentLang === 'ko' ? 'en' : 'ko';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            className="language-switcher"
            onClick={toggleLanguage}
            aria-label="Switch language"
        >
            {currentLang === 'ko' ? '🇺🇸 EN' : '🇰🇷 한국어'}
        </button>
    );
}

// Styles
const langStyles = `
.language-switcher {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--glass-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    color: var(--text-primary);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.language-switcher:hover {
    background: var(--glass-hover);
    border-color: var(--gold-500);
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = langStyles;
    document.head.appendChild(styleSheet);
}
