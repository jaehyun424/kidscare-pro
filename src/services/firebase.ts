// ============================================
// Petit Stay - Firebase Configuration
// Real Firebase Integration
// ============================================

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let auth: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let storage: any;

if (firebaseConfig.apiKey) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);

        // Connect to emulators in development (optional)
        if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
            connectAuthEmulator(auth, 'http://localhost:9099');
            connectFirestoreEmulator(db, 'localhost', 8080);
            connectStorageEmulator(storage, 'localhost', 9199);
        }

        // Load Analytics only in production
        if (import.meta.env.PROD && typeof window !== 'undefined' && firebaseConfig.measurementId) {
            import('firebase/analytics').then(({ getAnalytics }) => {
                getAnalytics(app);
            }).catch(() => {
                // Analytics is optional - silently ignore failures
            });
        }
    } catch (error) {
        console.warn('Firebase initialization failed:', error);
        // Mock services to prevent crash
        auth = { currentUser: null };
        db = {};
        storage = {};
    }
} else {
    console.warn('Firebase configuration missing. Using mock services.');
    // Mock services to prevent crash
    auth = { currentUser: null };
    db = {};
    storage = {};
}

export { auth, db, storage };
export default app;
