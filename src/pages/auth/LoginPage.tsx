// ============================================
// KidsCare Pro - Login Page
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';

// Demo accounts for testing
const DEMO_ACCOUNTS = [
  { email: 'hotel@demo.com', password: 'demo1234', roleKey: 'hotelStaff', icon: '🏨' },
  { email: 'parent@demo.com', password: 'demo1234', roleKey: 'parent', icon: '👨‍👩‍👧' },
  { email: 'sitter@demo.com', password: 'demo1234', roleKey: 'sitter', icon: '👩‍🍼' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { success, error } = useToast();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = t('auth.email') + ' is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = t('auth.password') + ' is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await signIn(email, password);
      success(t('auth.welcomeBack') + '!', 'You have been signed in successfully.');

      // Redirect based on role (will be handled by ProtectedRoute)
      if (email.includes('hotel')) {
        navigate('/hotel');
      } else if (email.includes('parent')) {
        navigate('/parent');
      } else if (email.includes('sitter')) {
        navigate('/sitter');
      } else {
        navigate('/hotel');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('errors.unknownError');
      error(t('auth.signIn') + ' failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="login-page">
      <div className="login-lang-switch">
        <LanguageSwitcher />
      </div>
      <h2 className="login-title">{t('auth.welcomeBack')}</h2>
      <p className="login-subtitle">{t('auth.signInToContinue')}</p>

      <form onSubmit={handleSubmit} className="login-form">
        <Input
          label={t('auth.email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.enterEmail')}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label={t('auth.password')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.enterPassword')}
          error={errors.password}
          autoComplete="current-password"
        />

        <Button
          type="submit"
          variant="gold"
          fullWidth
          isLoading={isLoading}
        >
          {t('auth.signIn')}
        </Button>
      </form>

      <div className="login-divider">
        <span>{t('auth.demoAccounts')}</span>
      </div>

      <div className="demo-accounts">
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.email}
            type="button"
            className="demo-account-btn"
            onClick={() => handleDemoLogin(account.email, account.password)}
          >
            <span className="demo-account-icon">{account.icon}</span>
            <span className="demo-account-role">{t(`auth.${account.roleKey}`)}</span>
          </button>
        ))}
      </div>

      <p className="login-footer">
        {t('auth.noAccount')} <Link to="/register">{t('auth.signUp')}</Link>
      </p>
    </div>
  );
}

// Styles
const loginStyles = `
.login-page {
  animation: fadeIn var(--transition-slow);
}

.login-lang-switch {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-4);
}

.login-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  text-align: center;
  margin-bottom: var(--space-2);
}

.login-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.login-divider {
  display: flex;
  align-items: center;
  margin: var(--space-6) 0;
}

.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-color);
}

.login-divider span {
  padding: 0 var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.demo-accounts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.demo-account-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--glass-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.demo-account-btn:hover {
  background: var(--glass-border);
  border-color: var(--primary-400);
}

.demo-account-icon {
  font-size: 1.5rem;
}

.demo-account-role {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.login-footer {
  text-align: center;
  margin-top: var(--space-6);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.login-footer a {
  color: var(--gold-500);
  font-weight: var(--font-medium);
}

.login-footer a:hover {
  text-decoration: underline;
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = loginStyles;
  document.head.appendChild(styleSheet);
}
