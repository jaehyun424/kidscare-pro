// ============================================
// KidsCare Pro - Demo Mode Detection
// Shared utility for all hooks
// ============================================

import { auth } from '../services/firebase';

// Mirror the same logic used in AuthContext.tsx
// In production, only explicit VITE_DEMO_MODE=true enables demo mode.
const isMockAuth = !auth || !auth.app;
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' ||
    (import.meta.env.DEV && isMockAuth);
