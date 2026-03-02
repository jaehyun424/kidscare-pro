// ============================================
// Petit Stay - Register Page (Hospitality Redesign)
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
import loginBg from '../../assets/login-bg.png';
import '../../styles/pages/register.css';

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
  </svg>
);

export default function RegisterPage() {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const { success, error } = useToast();
    const { t, i18n } = useTranslation();

    const ROLE_OPTIONS = [
        { value: 'parent', label: 'Guest Family' },
        { value: 'sitter', label: 'Childcare Specialist' },
        { value: 'hotel_staff', label: 'Hotel Partner' },
    ];

    const LANGUAGE_OPTIONS = [
        { value: 'en', label: 'English' },
        { value: 'ko', label: '한국어' },
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
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
        if (name === 'language') i18n.changeLanguage(value);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName.trim()) newErrors.firstName = t('validation.required');
        if (!formData.lastName.trim()) newErrors.lastName = t('validation.required');
        if (!formData.email) newErrors.email = t('validation.required');
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('validation.invalidEmail');
        if (!formData.password) newErrors.password = t('validation.required');
        else if (formData.password.length < 8) newErrors.password = t('validation.minChars', { count: 8 });
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('validation.passwordMismatch');
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
            success('Account Created', 'Welcome to the Petit Stay network.');

            const roleRedirects: Record<string, string> = {
                parent: '/parent',
                sitter: '/sitter',
                hotel_staff: '/hotel',
            };
            navigate(roleRedirects[formData.role] || '/login');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            error('Error', message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            {/* Visual Column (Left) */}
            <div className="register-visual" style={{ backgroundImage: `url(${loginBg})` }}>
                <div className="visual-overlay" />
                <div className="visual-content">
                    <h1 className="visual-title">Join the Standard of Excellence</h1>
                    <ul className="visual-list">
                        <li>• Exclusive Hotel Partnerships</li>
                        <li>• Vetted Childcare Specialists</li>
                        <li>• Comprehensive Liability Coverage</li>
                    </ul>
                </div>
            </div>

            {/* Form Column (Right) */}
            <div className="register-form-container">
                <div className="login-header">
                    <div className="brand-logo">
                        <span className="logo-icon">✨</span>
                        <span className="logo-text">Petit<span className="text-gold">Stay</span></span>
                    </div>
                    <LanguageSwitcher />
                </div>

                <div className="form-wrapper">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-serif text-charcoal-900">Request Membership</h2>
                        <p className="text-sm text-charcoal-500">Create your secure profile.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Given Name"
                                error={errors.firstName}
                                disabled={isLoading}
                            />
                            <Input
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Family Name"
                                error={errors.lastName}
                                disabled={isLoading}
                            />
                        </div>

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            error={errors.email}
                            disabled={isLoading}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="password-field-wrapper">
                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min 8 chars"
                                    error={errors.password}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            <Input
                                label="Confirm"
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm"
                                error={errors.confirmPassword}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Account Type"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                options={ROLE_OPTIONS}
                            />
                            <Select
                                label="Language"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                options={LANGUAGE_OPTIONS}
                            />
                        </div>

                        <div className="mt-4">
                            <Button
                                type="submit"
                                variant="gold"
                                fullWidth
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                SUBMIT APPLICATION
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-charcoal-500">
                            Already a member? <Link to="/login" className="text-charcoal-900 border-b border-gold-500 pb-0.5 hover:text-gold-600">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}
