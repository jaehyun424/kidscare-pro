// ============================================
// KidsCare Pro - Login Page (Hospitality Redesign)
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import loginBg from '../../assets/login-bg.png';

// Demo accounts for testing
const DEMO_ACCOUNTS = [
  { email: 'hotel@demo.com', password: 'demo1234', roleKey: 'hotelStaff', label: 'Concierge' },
  { email: 'parent@demo.com', password: 'demo1234', roleKey: 'parent', label: 'Guest' },
  { email: 'sitter@demo.com', password: 'demo1234', roleKey: 'sitter', label: 'Specialist' },
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
    if (!email) newErrors.email = t('auth.email') + ' is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = t('auth.password') + ' is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';
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
        const message = err instanceof Error ? err.message : 'Authentication failed';
      error('Access Denied', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="login-container">
      {/* Client Access Column (Left - Image) */}
      <div className="login-visual">
        <div className="visual-overlay" />
        <div className="visual-content">
          <h1 className="visual-quote">"Uncompromising care for your most important guests."</h1>
          <p className="visual-author">— KidsCare Pro Hospitality Standard</p>
        </div>
      </div>

      {/* Login Form Column (Right) */}
      <div className="login-form-container">
        <div className="login-header">
          <div className="brand-logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">KidsCare<span className="text-gold">Pro</span></span>
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
            />

            <Input
              label="Secure Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="mt-4">
              <Button
                type="submit"
                variant="primary" // Deep Charcoal
                fullWidth
                isLoading={isLoading}
              >
                AUTHENTICATE
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
            <p>© 2026 KidsCare Pro. Tokyo • Seoul • Singapore.</p>
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          min-height: 100vh;
          background-color: var(--cream-100);
        }

        .login-visual {
            display: none;
        }

        @media (min-width: 1024px) {
            .login-visual {
                display: flex;
                flex: 1;
                background-image: url(${loginBg});
                background-size: cover;
                background-position: center;
                position: relative;
                flex-direction: column;
                justify-content: flex-end;
                padding: 4rem;
            }
        }
        
        .visual-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(15,15,15,0.9) 0%, rgba(15,15,15,0.4) 50%, rgba(15,15,15,0.1) 100%);
        }
        
        .visual-content {
            position: relative;
            z-index: 10;
            max-width: 600px;
        }
        
        .visual-quote {
            font-family: var(--font-serif);
            font-size: 2.5rem;
            color: white;
            line-height: 1.2;
            margin-bottom: 1.5rem;
            text-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .visual-author {
            font-family: var(--font-action);
            color: var(--gold-400);
            font-size: 0.875rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .login-form-container {
            flex: 1;
            max-width: 100%;
            display: flex;
            flex-direction: column;
            padding: 2rem;
            background-color: var(--cream-50);
            position: relative;
            box-shadow: -10px 0 40px rgba(0,0,0,0.05);
        }
        
        @media (min-width: 1024px) {
            .login-form-container {
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
            max-width: 400px;
            width: 100%;
            margin: 0 auto;
        }
        
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-8 { margin-top: 2rem; }
        .pt-6 { padding-top: 1.5rem; }
        .pb-0.5 { padding-bottom: 0.125rem; }
        
        .demo-btn {
            background: white;
            border: 1px solid var(--cream-300);
            padding: 0.75rem;
            border-radius: var(--radius-sm);
            transition: all 0.2s;
            color: var(--charcoal-600);
        }
        .demo-btn:hover {
            border-color: var(--gold-500);
            color: var(--gold-600);
            background: var(--cream-100);
        }
        
        .login-footer {
            text-align: center;
            font-size: 0.75rem;
            color: var(--charcoal-400);
            margin-top: auto;
            font-family: var(--font-action);
            letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
