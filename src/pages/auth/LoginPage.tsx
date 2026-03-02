// ============================================
// Petit Stay - Login Page (Hospitality Redesign)
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import loginBg from '../../assets/login-bg.png';
import '../../styles/pages/login.css';

// Demo accounts for testing
const DEMO_ACCOUNTS = [
  { email: 'hotel@demo.com', password: 'demo1234', roleKey: 'hotelStaff', label: 'Concierge' },
  { email: 'parent@demo.com', password: 'demo1234', roleKey: 'parent', label: 'Guest' },
  { email: 'sitter@demo.com', password: 'demo1234', roleKey: 'sitter', label: 'Specialist' },
];

// Firebase error code to friendly message mapping
function mapFirebaseError(err: unknown, t: (key: string, defaultValue: string) => string): string {
  if (!(err instanceof Error)) return t('errors.unknownError', 'Authentication failed');
  const code = (err as { code?: string }).code || err.message;
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return t('errors.invalidCredentials', 'Invalid email or password');
    case 'auth/too-many-requests':
      return t('errors.tooManyRequests', 'Too many attempts. Please try again later.');
    case 'auth/network-request-failed':
      return t('errors.networkError', 'Network error. Please try again.');
    case 'auth/user-disabled':
      return t('errors.userDisabled', 'This account has been disabled.');
    default:
      return err.message || t('errors.unknownError', 'Authentication failed');
  }
}


export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { success, error } = useToast();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = t('auth.email') + ' is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = t('errors.invalidEmail', 'Invalid email format');
    if (!password) newErrors.password = t('auth.password') + ' is required';
    else if (password.length < 6) newErrors.password = t('errors.passwordTooShort', 'Minimum 6 characters');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await signIn(email, password);
      success('Welcome Back', 'Access granted to hospitality console.');

      if (email.includes('hotel')) navigate('/hotel');
      else if (email.includes('parent')) navigate('/parent');
      else if (email.includes('sitter')) navigate('/sitter');
      else navigate('/hotel');
    } catch (err: unknown) {
      error('Access Denied', mapFirebaseError(err, t));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="login-container login-page">
      {/* Client Access Column (Left - Image) */}
      <div className="login-visual" style={{ backgroundImage: `url(${loginBg})` }}>
        <div className="visual-overlay" />
        <div className="visual-content">
          <h1 className="visual-quote">"Uncompromising care for your most important guests."</h1>
          <p className="visual-author">— Petit Stay Hospitality Standard</p>
        </div>
      </div>

      {/* Login Form Column (Right) */}
      <div className="login-form-container">
        <div className="login-header">
          <div className="brand-logo">
            <span className="logo-text">Petit<span className="text-gold">Stay</span></span>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="form-wrapper">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif mb-2">Concierge Access</h2>
            <p className="text-charcoal-500">Please authenticate to access the console.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email Access ID"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@hotel.com"
              error={errors.email}
              autoComplete="email"
              disabled={isLoading}
            />

            <div className="password-field-wrapper">
              <Input
                label="Secure Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.password}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} strokeWidth={1.75} /> : <Eye size={20} strokeWidth={1.75} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
              <Link to="/forgot-password" className="forgot-password-link">
                {t('auth.forgotPassword', 'Forgot password?')}
              </Link>
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 border-t border-cream-300 pt-6">
            <p className="text-xs text-charcoal-400 text-center uppercase tracking-widest mb-4">Quick Access Simulation</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  className="demo-btn"
                  onClick={() => handleDemoLogin(account.email, account.password)}
                  disabled={isLoading}
                >
                  <span className="font-semibold text-xs">{account.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-charcoal-500">
              Not a partner hotel yet? <Link to="/register" className="text-charcoal-900 border-b border-gold-500 pb-0.5 hover:text-gold-600">Request Partnership</Link>
            </p>
          </div>
        </div>

        <div className="login-footer">
            <p>© 2026 Petit Stay. Tokyo • Seoul • Singapore.</p>
        </div>
      </div>
    </div>
  );
}
