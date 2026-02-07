// ============================================
// KidsCare Pro - Register Page (Hospitality Redesign)
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

export default function RegisterPage() {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const { success, error } = useToast();
    const { i18n } = useTranslation();

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
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
        if (name === 'language') i18n.changeLanguage(value);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'Required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Required';
        if (!formData.email) newErrors.email = 'Required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.password) newErrors.password = 'Required';
        else if (formData.password.length < 8) newErrors.password = 'Min 8 chars';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
            success('Account Created', 'Welcome to the KidsCare Pro network.');

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
            <div className="register-visual">
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
                        <span className="logo-text">KidsCare<span className="text-gold">Pro</span></span>
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
                            />
                            <Input
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Family Name"
                                error={errors.lastName}
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
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Min 8 chars"
                                error={errors.password}
                            />
                            <Input
                                label="Confirm"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm"
                                error={errors.confirmPassword}
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

            <style>{`
                .register-container {
                    display: flex;
                    min-height: 100vh;
                    background-color: var(--cream-100);
                }

                .register-visual {
                    display: none;
                }

                @media (min-width: 1024px) {
                    .register-visual {
                        display: flex;
                        flex: 1;
                        background-image: url(${loginBg});
                        background-size: cover;
                        background-position: center;
                        position: relative;
                        flex-direction: column;
                        justify-content: center;
                        padding: 4rem;
                    }
                }

                .visual-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to right, rgba(28,28,28,0.9) 0%, rgba(28,28,28,0.7) 100%);
                }

                .visual-content {
                    position: relative;
                    z-index: 10;
                    max-width: 500px;
                    color: white;
                }

                .visual-title {
                    font-family: var(--font-serif);
                    font-size: 3rem;
                    margin-bottom: 2rem;
                    line-height: 1.1;
                }

                .visual-list {
                    list-style: none;
                    padding: 0;
                }

                .visual-list li {
                    font-family: var(--font-action);
                    font-size: 1rem;
                    margin-bottom: 1rem;
                    letter-spacing: 0.05em;
                    color: var(--cream-200);
                }

                .register-form-container {
                    flex: 1;
                    max-width: 100%;
                    display: flex;
                    flex-direction: column;
                    padding: 2rem;
                    background-color: white;
                    overflow-y: auto;
                }

                @media (min-width: 1024px) {
                    .register-form-container {
                        max-width: 600px;
                    }
                }

                .login-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                
                .brand-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-family: var(--font-serif);
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .form-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    max-width: 480px;
                    width: 100%;
                    margin: 0 auto;
                }

                .gap-4 { gap: 1rem; }
                .grid { display: grid; }
                .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
                .mb-6 { margin-bottom: 1.5rem; }
                .mt-4 { margin-top: 1rem; }
                .mt-6 { margin-top: 1.5rem; }
            `}</style>
        </div>
    );
}
