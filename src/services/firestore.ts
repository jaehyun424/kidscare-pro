// ============================================
// KidsCare Pro - Firestore Service
// Database operations for all entities
// ============================================

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore';

import { db } from './firebase';
import type {
    Booking,
    CareSession,
    Sitter,
    Child,
    Hotel,
} from '../types';

// Define ActivityLog and Review inline since they're not in types
interface ActivityLog {
    id: string;
    sessionId: string;
    type: string;
    description: string;
    timestamp: Date;
    mediaUrl?: string;
}

interface Review {
    id: string;
    bookingId: string;
    parentId: string;
    sitterId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
}

// ----------------------------------------
// Collection References
// ----------------------------------------
const COLLECTIONS = {
    users: 'users',
    hotels: 'hotels',
    bookings: 'bookings',
    sessions: 'sessions',
    children: 'children',
    activityLogs: 'activityLogs',
    reviews: 'reviews',
    sitters: 'sitters',
} as const;

// ----------------------------------------
// Helper Functions
// ----------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertTimestamps = <T extends Record<string, any>>(data: T): T => {
    const converted = { ...data };
    for (const key in converted) {
        const value = converted[key];
        if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
            converted[key] = value.toDate();
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            converted[key] = convertTimestamps(value);
        }
    }
    return converted;
};

// ----------------------------------------
// Booking Service
// ----------------------------------------
export const bookingService = {
    // Get all bookings for a hotel
    async getHotelBookings(hotelId: string): Promise<Booking[]> {
        const q = query(
            collection(db, COLLECTIONS.bookings),
            where('hotelId', '==', hotelId),
            orderBy('scheduledStart', 'desc'),
            limit(100)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as Booking[];
    },

    // Get bookings for a parent
    async getParentBookings(parentId: string): Promise<Booking[]> {
        const q = query(
            collection(db, COLLECTIONS.bookings),
            where('parentId', '==', parentId),
            orderBy('scheduledStart', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as Booking[];
    },

    // Get bookings for a sitter
    async getSitterBookings(sitterId: string): Promise<Booking[]> {
        const q = query(
            collection(db, COLLECTIONS.bookings),
            where('sitterId', '==', sitterId),
            orderBy('scheduledStart', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as Booking[];
    },

    // Create a new booking
    async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const bookingRef = doc(collection(db, COLLECTIONS.bookings));
        await setDoc(bookingRef, {
            ...booking,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return bookingRef.id;
    },

    // Update booking status
    async updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.bookings, bookingId), {
            status,
            updatedAt: serverTimestamp(),
        });
    },

    // Listen to booking changes (real-time)
    subscribeToBooking(bookingId: string, callback: (booking: Booking | null) => void) {
        return onSnapshot(doc(db, COLLECTIONS.bookings, bookingId), (doc) => {
            if (doc.exists()) {
                callback({ id: doc.id, ...convertTimestamps(doc.data()) } as Booking);
            } else {
                callback(null);
            }
        });
    },
};

// ----------------------------------------
// Session Service
// ----------------------------------------
export const sessionService = {
    // Get active session for a booking
    async getActiveSession(bookingId: string): Promise<CareSession | null> {
        const q = query(
            collection(db, COLLECTIONS.sessions),
            where('bookingId', '==', bookingId),
            where('status', '==', 'in_progress')
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...convertTimestamps(doc.data()) } as CareSession;
    },

    // Start a session
    async startSession(session: Omit<CareSession, 'id'>): Promise<string> {
        const sessionRef = doc(collection(db, COLLECTIONS.sessions));
        await setDoc(sessionRef, {
            ...session,
            startTime: serverTimestamp(),
        });
        return sessionRef.id;
    },

    // End a session
    async endSession(sessionId: string, notes?: string): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.sessions, sessionId), {
            status: 'completed',
            endTime: serverTimestamp(),
            notes: notes || '',
        });
    },

    // Subscribe to session updates (real-time)
    subscribeToSession(sessionId: string, callback: (session: CareSession | null) => void) {
        return onSnapshot(doc(db, COLLECTIONS.sessions, sessionId), (doc) => {
            if (doc.exists()) {
                callback({ id: doc.id, ...convertTimestamps(doc.data()) } as CareSession);
            } else {
                callback(null);
            }
        });
    },
};

// ----------------------------------------
// Activity Log Service
// ----------------------------------------
export const activityService = {
    // Get activity logs for a session
    async getSessionActivities(sessionId: string): Promise<ActivityLog[]> {
        const q = query(
            collection(db, COLLECTIONS.activityLogs),
            where('sessionId', '==', sessionId),
            orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as ActivityLog[];
    },

    // Log an activity
    async logActivity(activity: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<string> {
        const activityRef = doc(collection(db, COLLECTIONS.activityLogs));
        await setDoc(activityRef, {
            ...activity,
            timestamp: serverTimestamp(),
        });
        return activityRef.id;
    },

    // Subscribe to activity updates (real-time)
    subscribeToActivities(sessionId: string, callback: (activities: ActivityLog[]) => void) {
        const q = query(
            collection(db, COLLECTIONS.activityLogs),
            where('sessionId', '==', sessionId),
            orderBy('timestamp', 'desc'),
            limit(50)
        );
        return onSnapshot(q, (snapshot) => {
            const activities = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...convertTimestamps(doc.data()),
            })) as ActivityLog[];
            callback(activities);
        });
    },
};

// ----------------------------------------
// Sitter Service
// ----------------------------------------
export const sitterService = {
    // Get all sitters for a hotel
    async getHotelSitters(hotelId: string): Promise<Sitter[]> {
        const q = query(
            collection(db, COLLECTIONS.users),
            where('role', '==', 'sitter'),
            where('hotelId', '==', hotelId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as unknown as Sitter[];
    },

    // Get sitter by ID
    async getSitter(sitterId: string): Promise<Sitter | null> {
        const docSnap = await getDoc(doc(db, COLLECTIONS.users, sitterId));
        if (!docSnap.exists()) return null;
        return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as unknown as Sitter;
    },
};

// ----------------------------------------
// Children Service
// ----------------------------------------
export const childrenService = {
    // Get children for a parent
    async getParentChildren(parentId: string): Promise<Child[]> {
        const q = query(
            collection(db, COLLECTIONS.children),
            where('parentId', '==', parentId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as Child[];
    },

    // Add a child
    async addChild(child: Omit<Child, 'id'>): Promise<string> {
        const childRef = doc(collection(db, COLLECTIONS.children));
        await setDoc(childRef, child);
        return childRef.id;
    },

    // Update child info
    async updateChild(childId: string, data: Partial<Child>): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.children, childId), data);
    },

    // Delete a child
    async deleteChild(childId: string): Promise<void> {
        await deleteDoc(doc(db, COLLECTIONS.children, childId));
    },
};

// ----------------------------------------
// Review Service
// ----------------------------------------
export const reviewService = {
    // Get reviews for a sitter
    async getSitterReviews(sitterId: string): Promise<Review[]> {
        const q = query(
            collection(db, COLLECTIONS.reviews),
            where('sitterId', '==', sitterId),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...convertTimestamps(doc.data()),
        })) as Review[];
    },

    // Create a review
    async createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
        const reviewRef = doc(collection(db, COLLECTIONS.reviews));
        await setDoc(reviewRef, {
            ...review,
            createdAt: serverTimestamp(),
        });
        return reviewRef.id;
    },
};

// ----------------------------------------
// Hotel Service
// ----------------------------------------
export const hotelService = {
    // Get hotel by ID
    async getHotel(hotelId: string): Promise<Hotel | null> {
        const docSnap = await getDoc(doc(db, COLLECTIONS.hotels, hotelId));
        if (!docSnap.exists()) return null;
        return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as Hotel;
    },

    // Update hotel settings
    async updateHotelSettings(hotelId: string, settings: Partial<Hotel>): Promise<void> {
        await updateDoc(doc(db, COLLECTIONS.hotels, hotelId), {
            ...settings,
            updatedAt: serverTimestamp(),
        });
    },
};
