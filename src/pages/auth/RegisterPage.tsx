// ============================================
// KidsCare Pro - Register Page
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import type { UserRole } from '../../types';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const { success, error } = useToast();
    const { t, i18n } = useTranslation();

    const ROLE_OPTIONS = [
        { value: 'parent', label: '👨‍👩‍👧 ' + t('auth.parentGuardian') },
        { value: 'sitter', label: '👩‍🍼 ' + t('auth.sitter') },
        { value: 'hotel_staff', label: '🏨 ' + t('auth.hotelStaff') },
    ];

    const LANGUAGE_OPTIONS = [
        { value: 'en', label: '🇺🇸 English' },
        { value: 'ko', label: '🇰🇷 한국어' },
    ];

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'parent' as UserRole,
        language: i18n.language || 'en',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        // Change language when language select changes
        if (name === 'language') {
            i18n.changeLanguage(value);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = t('errors.required');
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = t('errors.required');
        }

        if (!formData.email) {
            newErrors.email = t('errors.required');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('errors.invalidEmail');
        }

        if (!formData.password) {
            newErrors.password = t('errors.required');
        } else if (formData.password.length < 8) {
            newErrors.password = t('auth.atLeast8Chars');
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('errors.passwordTooShort');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);
        try {
            await signUp(formData.email, formData.password, formData.role, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                preferredLanguage: formData.language as 'en' | 'ko' | 'ja' | 'zh',
            });

            success(t('auth.createAccount') + '!', t('auth.welcomeBack'));

            // Redirect based on role
            const roleRedirects: Record<string, string> = {
                parent: '/parent',
                sitter: '/sitter',
                hotel_staff: '/hotel',
            };
            navigate(roleRedirects[formData.role] || '/login');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : t('errors.unknownError');
            error(t('errors.unknownError'), message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-lang-switch">
                <LanguageSwitcher />
            </div>
            <h2 className="register-title">{t('auth.createAccount')}</h2>
            <p className="register-subtitle">{t('auth.joinToday')}</p>

            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-row">
                    <Input
                        label={t('auth.firstName')}
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        error={errors.firstName}
                    />
                    <Input
                        label={t('auth.lastName')}
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        error={errors.lastName}
                    />
                </div>

                <Input
                    label={t('auth.email')}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    error={errors.email}
                    autoComplete="email"
                />

                <Input
                    label={t('auth.password')}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('auth.atLeast8Chars')}
                    error={errors.password}
                    autoComplete="new-password"
                />

                <Input
                    label={t('auth.confirmPassword')}
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('auth.confirmYourPassword')}
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                />

                <Select
                    label={t('auth.iAmA')}
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    options={ROLE_OPTIONS}
                />

                <Select
                    label={t('auth.preferredLanguage')}
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    options={LANGUAGE_OPTIONS}
                />

                <Button
                    type="submit"
                    variant="gold"
                    fullWidth
                    isLoading={isLoading}
                >
                    {t('auth.createAccount')}
                </Button>
            </form>

            <p className="register-footer">
                {t('auth.hasAccount')} <Link to="/login">{t('auth.signIn')}</Link>
            </p>
        </div>
    );
}

// Styles
const registerStyles = `
.register-page {
  animation: fadeIn var(--transition-slow);
}

.register-lang-switch {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-4);
}

.register-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  text-align: center;
  margin-bottom: var(--space-2);
}

.register-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.register-footer {
  text-align: center;
  margin-top: var(--space-6);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.register-footer a {
  color: var(--gold-500);
  font-weight: var(--font-medium);
}

.register-footer a:hover {
  text-decoration: underline;
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = registerStyles;
    document.head.appendChild(styleSheet);
}
