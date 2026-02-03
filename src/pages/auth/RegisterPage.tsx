// ============================================
// KidsCare Pro - Register Page
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import type { UserRole } from '../../types';

const ROLE_OPTIONS = [
    { value: 'parent', label: '👨‍👩‍👧 Parent / Guardian' },
    { value: 'sitter', label: '👩‍🍼 Babysitter' },
    { value: 'hotel_staff', label: '🏨 Hotel Staff' },
];

const LANGUAGE_OPTIONS = [
    { value: 'en', label: '🇺🇸 English' },
    { value: 'ko', label: '🇰🇷 한국어' },
    { value: 'ja', label: '🇯🇵 日本語' },
    { value: 'zh', label: '🇨🇳 中文' },
];

export default function RegisterPage() {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const { success, error } = useToast();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'parent' as UserRole,
        language: 'en',
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
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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

            success('Account created!', 'Welcome to KidsCare Pro.');

            // Redirect based on role
            const roleRedirects: Record<string, string> = {
                parent: '/parent',
                sitter: '/sitter',
                hotel_staff: '/hotel',
            };
            navigate(roleRedirects[formData.role] || '/login');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to create account';
            error('Registration failed', message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page">
            <h2 className="register-title">Create Account</h2>
            <p className="register-subtitle">Join KidsCare Pro today</p>

            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-row">
                    <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        error={errors.firstName}
                    />
                    <Input
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        error={errors.lastName}
                    />
                </div>

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    error={errors.email}
                    autoComplete="email"
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    error={errors.password}
                    autoComplete="new-password"
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                />

                <Select
                    label="I am a..."
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    options={ROLE_OPTIONS}
                />

                <Select
                    label="Preferred Language"
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
                    Create Account
                </Button>
            </form>

            <p className="register-footer">
                Already have an account? <Link to="/login">Sign in</Link>
            </p>
        </div>
    );
}

// Styles
const registerStyles = `
.register-page {
  animation: fadeIn var(--transition-slow);
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
