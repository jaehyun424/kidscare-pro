// ============================================
// KidsCare Pro - Authentication Context
// With Demo Mode for Development
// ============================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, UserRole } from '../types';

// Demo mode - set to false and configure Firebase for production
const DEMO_MODE = true;

// Demo users for testing different roles
const DEMO_USERS: Record<string, User> = {
    'hotel': {
        id: 'demo-hotel-1',
        email: 'hotel@demo.com',
        role: 'hotel_staff',
        hotelId: 'hotel-grand-hyatt',
        profile: {
            firstName: 'Hotel',
            lastName: 'Manager',
            phone: '+82-2-797-1234',
            phoneVerified: true,
            preferredLanguage: 'en',
        },
        notifications: { push: true, email: true, sms: false },
        createdAt: new Date(),
        lastLoginAt: new Date(),
    },
    'parent': {
        id: 'demo-parent-1',
        email: 'parent@demo.com',
        role: 'parent',
        profile: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            phone: '+1-555-123-4567',
            phoneVerified: true,
            preferredLanguage: 'en',
        },
        parentInfo: {
            emergencyContact: 'John Johnson',
            emergencyPhone: '+1-555-987-6543',
        },
        notifications: { push: true, email: true, sms: true },
        createdAt: new Date(),
        lastLoginAt: new Date(),
    },
    'sitter': {
        id: 'demo-sitter-1',
        email: 'sitter@demo.com',
        role: 'sitter',
        hotelId: 'hotel-grand-hyatt',
        profile: {
            firstName: 'Minjung',
            lastName: 'Kim',
            phone: '+82-10-1234-5678',
            phoneVerified: true,
            preferredLanguage: 'ko',
            avatarUrl: '',
        },
        sitterInfo: {
            tier: 'gold',
            rating: 4.9,
            totalSessions: 247,
            safetyRecord: { incidentFreeDays: 365, lastIncidentDate: null, totalIncidents: 0 },
            certifications: [
                { name: 'CPR', issuedBy: 'Red Cross', issuedDate: new Date('2023-01-15'), expiryDate: new Date('2025-01-15'), verified: true },
                { name: 'First Aid', issuedBy: 'Red Cross', issuedDate: new Date('2023-01-15'), expiryDate: new Date('2025-01-15'), verified: true },
            ],
            languages: [
                { code: 'ko', name: 'Korean', proficiency: 'native' },
                { code: 'en', name: 'English', proficiency: 'fluent' },
                { code: 'ja', name: 'Japanese', proficiency: 'basic' },
            ],
            availability: [],
        },
        notifications: { push: true, email: true, sms: true },
        createdAt: new Date(),
        lastLoginAt: new Date(),
    },
};

// ----------------------------------------
// Types
// ----------------------------------------
interface AuthContextType {
    user: User | null;
    firebaseUser: unknown | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, role: UserRole, profile: SignUpProfile) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateUserProfile: (data: Partial<User['profile']>) => Promise<void>;
    demoLogin: (role: 'hotel' | 'parent' | 'sitter') => void;
}

interface SignUpProfile {
    firstName: string;
    lastName: string;
    phone?: string;
    preferredLanguage?: 'en' | 'ko' | 'ja' | 'zh';
}

interface AuthProviderProps {
    children: React.ReactNode;
}

// ----------------------------------------
// Context
// ----------------------------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----------------------------------------
// Provider
// ----------------------------------------
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<unknown | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize - check for saved demo session
    useEffect(() => {
        if (DEMO_MODE) {
            const savedRole = localStorage.getItem('demo-user-role') as 'hotel' | 'parent' | 'sitter' | null;
            if (savedRole && DEMO_USERS[savedRole]) {
                setUser(DEMO_USERS[savedRole]);
            }
            setIsLoading(false);
            return;
        }

        // Non-demo mode would use Firebase auth
        // For now, just set loading to false
        setIsLoading(false);
    }, []);

    // Demo login
    const demoLogin = useCallback((role: 'hotel' | 'parent' | 'sitter') => {
        const demoUser = DEMO_USERS[role];
        if (demoUser) {
            setUser(demoUser);
            localStorage.setItem('demo-user-role', role);
        }
    }, []);

    // Sign in
    const signIn = useCallback(async (email: string, password: string) => {
        setIsLoading(true);
        try {
            if (DEMO_MODE) {
                // In demo mode, check email pattern to determine role
                await new Promise((r) => setTimeout(r, 500)); // Simulate network delay

                if (email.includes('hotel')) {
                    demoLogin('hotel');
                } else if (email.includes('sitter')) {
                    demoLogin('sitter');
                } else {
                    demoLogin('parent');
                }
            } else {
                // Real Firebase sign in would go here
                throw new Error('Firebase not configured. Enable DEMO_MODE for testing.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [demoLogin]);

    // Sign up
    const signUp = useCallback(async (
        email: string,
        password: string,
        role: UserRole,
        profile: SignUpProfile
    ) => {
        setIsLoading(true);
        try {
            if (DEMO_MODE) {
                await new Promise((r) => setTimeout(r, 500));
                // Create temporary user
                const newUser: User = {
                    id: 'demo-new-' + Date.now(),
                    email,
                    role,
                    profile: {
                        firstName: profile.firstName,
                        lastName: profile.lastName,
                        phone: profile.phone || '',
                        phoneVerified: false,
                        preferredLanguage: profile.preferredLanguage || 'en',
                    },
                    notifications: { push: true, email: true, sms: false },
                    createdAt: new Date(),
                    lastLoginAt: new Date(),
                };
                setUser(newUser);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Sign out
    const signOut = useCallback(async () => {
        setIsLoading(true);
        try {
            if (DEMO_MODE) {
                await new Promise((r) => setTimeout(r, 300));
                localStorage.removeItem('demo-user-role');
            }
            setUser(null);
            setFirebaseUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Reset password
    const resetPassword = useCallback(async (email: string) => {
        if (DEMO_MODE) {
            await new Promise((r) => setTimeout(r, 500));
            console.log('Demo mode: Password reset email would be sent to', email);
            return;
        }
        throw new Error('Firebase not configured');
    }, []);

    // Update user profile
    const updateUserProfile = useCallback(async (data: Partial<User['profile']>) => {
        if (!user) return;

        if (DEMO_MODE) {
            await new Promise((r) => setTimeout(r, 300));
            setUser({ ...user, profile: { ...user.profile, ...data } });
            return;
        }
    }, [user]);

    const value: AuthContextType = {
        user,
        firebaseUser,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateUserProfile,
        demoLogin,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// ----------------------------------------
// Hook
// ----------------------------------------
export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

// ----------------------------------------
// Role-based hooks
// ----------------------------------------
export function useRequireAuth(allowedRoles?: UserRole[]) {
    const { user, isLoading, isAuthenticated } = useAuth();

    const isAuthorized = isAuthenticated && (
        !allowedRoles ||
        (user && allowedRoles.includes(user.role))
    );

    return {
        user,
        isLoading,
        isAuthenticated,
        isAuthorized,
    };
}

export function useHotelAuth() {
    return useRequireAuth(['hotel_staff', 'admin']);
}

export function useParentAuth() {
    return useRequireAuth(['parent']);
}

export function useSitterAuth() {
    return useRequireAuth(['sitter']);
}
