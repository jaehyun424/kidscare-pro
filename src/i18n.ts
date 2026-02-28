// ============================================
// KidsCare Pro - i18n Configuration
// English loaded synchronously, others lazy-loaded
// ============================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';

const resources = {
    en: { translation: en },
};

// Lazy-load non-English locales
const lazyLocales: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
    ko: () => import('./locales/ko.json'),
    ja: () => import('./locales/ja.json'),
    zh: () => import('./locales/zh.json'),
};

async function loadLocale(lng: string) {
    if (lng === 'en' || !lazyLocales[lng]) return;
    if (i18n.hasResourceBundle(lng, 'translation')) return;

    try {
        const module = await lazyLocales[lng]();
        i18n.addResourceBundle(lng, 'translation', module.default, true, true);
    } catch (err) {
        console.warn(`Failed to load locale: ${lng}`, err);
    }
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        },
    });

// Load the detected language if it's not English
const detectedLng = i18n.language?.split('-')[0];
if (detectedLng && detectedLng !== 'en') {
    loadLocale(detectedLng);
}

// Auto-load locale when language changes
i18n.on('languageChanged', (lng) => {
    const baseLng = lng.split('-')[0];
    loadLocale(baseLng);
});

export default i18n;
