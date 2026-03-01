// ============================================
// KidsCare Pro - Tabs Component
// ============================================

import { useState } from 'react';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: number;
}

interface TabsProps {
    tabs: Tab[];
    activeTab?: string;
    onChange: (tabId: string) => void;
    variant?: 'default' | 'pills' | 'underline';
    fullWidth?: boolean;
    className?: string;
}

export function Tabs({
    tabs,
    activeTab,
    onChange,
    variant = 'default',
    fullWidth = false,
    className = '',
}: TabsProps) {
    const [internalActive, setInternalActive] = useState(tabs[0]?.id || '');
    const current = activeTab ?? internalActive;

    const handleChange = (tabId: string) => {
        setInternalActive(tabId);
        onChange(tabId);
    };

    return (
        <div
            className={`tabs tabs-${variant} ${fullWidth ? 'tabs-full' : ''} ${className}`}
            role="tablist"
        >
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    role="tab"
                    aria-selected={current === tab.id}
                    className={`tab-item ${current === tab.id ? 'tab-active' : ''}`}
                    onClick={() => handleChange(tab.id)}
                >
                    {tab.icon && <span className="tab-icon" aria-hidden="true">{tab.icon}</span>}
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                        <span className="tab-badge">{tab.badge}</span>
                    )}
                </button>
            ))}
        </div>
    );
}

interface TabPanelProps {
    id: string;
    activeTab: string;
    children: React.ReactNode;
}

export function TabPanel({ id, activeTab, children }: TabPanelProps) {
    if (id !== activeTab) return null;
    return (
        <div role="tabpanel" aria-labelledby={`tab-${id}`}>
            {children}
        </div>
    );
}
