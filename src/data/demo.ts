// ============================================
// KidsCare Pro - Consolidated Demo Data
// Single source of truth for all demo/mock data
// ============================================

import type { DashboardStats } from '../types';

// ----------------------------------------
// Hotel Dashboard Stats
// ----------------------------------------
export const DEMO_DASHBOARD_STATS: DashboardStats = {
    todayBookings: 12,
    activeNow: 3,
    completedToday: 8,
    todayRevenue: 4850000,
    safetyDays: 127,
    pendingBookings: 4,
};

// ----------------------------------------
// Hotel Bookings (used by Dashboard + Bookings page)
// ----------------------------------------
export interface DemoBooking {
    id: string;
    confirmationCode: string;
    date: string;
    time: string;
    room: string;
    parent: { name: string; phone: string };
    children: { name: string; age: number; allergies?: string[] }[];
    sitter: { name: string; tier: 'gold' | 'silver' } | null;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    totalAmount: number;
}

export const DEMO_HOTEL_BOOKINGS: DemoBooking[] = [
    {
        id: '1',
        confirmationCode: 'KCP-2025-0042',
        date: '2025-01-15',
        time: '18:00 - 22:00',
        room: '2305',
        parent: { name: 'Sarah Johnson', phone: '+1 555-0123' },
        children: [{ name: 'Emma', age: 5, allergies: ['peanuts'] }],
        sitter: { name: 'Kim Minjung', tier: 'gold' },
        status: 'confirmed',
        totalAmount: 280000,
    },
    {
        id: '2',
        confirmationCode: 'KCP-2025-0043',
        date: '2025-01-15',
        time: '19:00 - 23:00',
        room: '1102',
        parent: { name: 'Tanaka Yuki', phone: '+81 90-1234-5678' },
        children: [{ name: 'Sota', age: 3 }, { name: 'Yui', age: 6 }],
        sitter: { name: 'Park Sooyeon', tier: 'gold' },
        status: 'in_progress',
        totalAmount: 420000,
    },
    {
        id: '3',
        confirmationCode: 'KCP-2025-0044',
        date: '2025-01-15',
        time: '20:00 - 24:00',
        room: '3501',
        parent: { name: 'Michael Chen', phone: '+86 138-0000-0000' },
        children: [{ name: 'Lucas', age: 4 }],
        sitter: null,
        status: 'pending',
        totalAmount: 280000,
    },
    {
        id: '4',
        confirmationCode: 'KCP-2025-0045',
        date: '2025-01-14',
        time: '17:00 - 21:00',
        room: '2108',
        parent: { name: 'Emily Davis', phone: '+1 555-0456' },
        children: [{ name: 'Oliver', age: 7 }],
        sitter: { name: 'Lee Jihye', tier: 'silver' },
        status: 'completed',
        totalAmount: 280000,
    },
];

// ----------------------------------------
// Active Sessions (used by Dashboard + LiveMonitor)
// ----------------------------------------
export interface DemoActiveSession {
    id: string;
    sitter: { name: string; avatar: string | null; tier: 'gold' | 'silver' };
    room: string;
    children: { name: string; age: number }[];
    childrenText: string;
    startTime: string;
    elapsed: string;
    lastUpdate: string;
    lastActivity: string;
    activities: { time: string; activity: string; type: string }[];
    vitals: { mood: string; energy: string };
    status: 'active';
}

export const DEMO_ACTIVE_SESSIONS: DemoActiveSession[] = [
    {
        id: '1',
        sitter: { name: 'Park Sooyeon', avatar: null, tier: 'gold' },
        room: '1102',
        children: [{ name: 'Sota', age: 3 }, { name: 'Yui', age: 6 }],
        childrenText: 'Sota (3), Yui (6)',
        startTime: '19:00',
        elapsed: '2h 15m',
        lastUpdate: '2 min ago',
        lastActivity: 'Playing with blocks',
        activities: [
            { time: '21:10', activity: 'Playing with blocks', type: 'play' },
            { time: '20:30', activity: 'Snack time - Apple slices', type: 'food' },
            { time: '19:45', activity: 'Trust check-in completed', type: 'checkin' },
            { time: '19:00', activity: 'Session started', type: 'start' },
        ],
        vitals: { mood: 'happy', energy: 'high' },
        status: 'active',
    },
    {
        id: '2',
        sitter: { name: 'Lee Jihye', avatar: null, tier: 'silver' },
        room: '2201',
        children: [{ name: 'Mia', age: 5 }],
        childrenText: 'Mia (5)',
        startTime: '18:30',
        elapsed: '2h 45m',
        lastUpdate: '5 min ago',
        lastActivity: 'Drawing and coloring',
        activities: [
            { time: '21:05', activity: 'Drawing and coloring', type: 'play' },
            { time: '20:00', activity: 'Snack time - Cookie', type: 'food' },
            { time: '18:45', activity: 'Trust check-in completed', type: 'checkin' },
            { time: '18:30', activity: 'Session started', type: 'start' },
        ],
        vitals: { mood: 'calm', energy: 'medium' },
        status: 'active',
    },
    {
        id: '3',
        sitter: { name: 'Choi Yuna', avatar: null, tier: 'gold' },
        room: '1508',
        children: [{ name: 'Noah', age: 7 }],
        childrenText: 'Noah (7)',
        startTime: '17:00',
        elapsed: '4h 15m',
        lastUpdate: '1 min ago',
        lastActivity: 'Reading books',
        activities: [
            { time: '21:12', activity: 'Reading books', type: 'education' },
            { time: '20:00', activity: 'Dinner - Ordered room service', type: 'food' },
            { time: '19:00', activity: 'Homework assistance', type: 'education' },
            { time: '17:15', activity: 'Trust check-in completed', type: 'checkin' },
        ],
        vitals: { mood: 'focused', energy: 'medium' },
        status: 'active',
    },
];

// ----------------------------------------
// Sitters (used by SitterManagement)
// ----------------------------------------
export interface DemoSitter {
    id: string;
    name: string;
    tier: 'gold' | 'silver';
    rating: number;
    sessionsCompleted: number;
    languages: string[];
    certifications: string[];
    availability: string;
    hourlyRate: number;
    safetyDays: number;
}

export const DEMO_SITTERS: DemoSitter[] = [
    {
        id: '1',
        name: 'Kim Minjung',
        tier: 'gold',
        rating: 4.9,
        sessionsCompleted: 247,
        languages: ['Korean', 'English', 'Japanese'],
        certifications: ['CPR', 'First Aid', 'Child Psychology'],
        availability: 'Available',
        hourlyRate: 45000,
        safetyDays: 365,
    },
    {
        id: '2',
        name: 'Park Sooyeon',
        tier: 'gold',
        rating: 4.8,
        sessionsCompleted: 189,
        languages: ['Korean', 'English'],
        certifications: ['CPR', 'First Aid'],
        availability: 'In Session',
        hourlyRate: 45000,
        safetyDays: 280,
    },
    {
        id: '3',
        name: 'Lee Jihye',
        tier: 'silver',
        rating: 4.7,
        sessionsCompleted: 95,
        languages: ['Korean', 'Chinese'],
        certifications: ['CPR', 'First Aid'],
        availability: 'Available',
        hourlyRate: 35000,
        safetyDays: 95,
    },
    {
        id: '4',
        name: 'Choi Yuna',
        tier: 'gold',
        rating: 4.9,
        sessionsCompleted: 312,
        languages: ['Korean', 'English', 'Chinese'],
        certifications: ['CPR', 'First Aid', 'Child Development'],
        availability: 'In Session',
        hourlyRate: 50000,
        safetyDays: 450,
    },
];

// ----------------------------------------
// Hotels (used by Parent Booking)
// ----------------------------------------
export interface DemoHotelOption {
    value: string;
    label: string;
}

export const DEMO_HOTELS: DemoHotelOption[] = [
    { value: 'grand-hyatt-seoul', label: 'Grand Hyatt Seoul' },
    { value: 'park-hyatt-busan', label: 'Park Hyatt Busan' },
    { value: 'four-seasons-seoul', label: 'Four Seasons Seoul' },
];

// ----------------------------------------
// Children (used by Parent Booking + Home)
// ----------------------------------------
export interface DemoChild {
    id: string;
    name: string;
    age: number;
    allergies: string[];
    gender: 'male' | 'female' | 'other';
}

export const DEMO_CHILDREN: DemoChild[] = [
    { id: '1', name: 'Emma', age: 5, allergies: ['peanuts'], gender: 'female' },
];

// ----------------------------------------
// Parent Upcoming Booking (used by Parent Home)
// ----------------------------------------
export interface DemoUpcomingBooking {
    id: string;
    confirmationCode: string;
    dateKey: string;
    time: string;
    hotel: string;
    room: string;
    sitter: { name: string; rating: number };
    childrenIds: string[];
    status: 'confirmed' | 'pending';
}

export const DEMO_UPCOMING_BOOKING: DemoUpcomingBooking = {
    id: '1',
    confirmationCode: 'KCP-2025-0042',
    dateKey: 'tonight',
    time: '18:00 - 22:00',
    hotel: 'Grand Hyatt Seoul',
    room: '2305',
    sitter: { name: 'Kim Minjung', rating: 4.9 },
    childrenIds: ['1'],
    status: 'confirmed',
};

// ----------------------------------------
// Parent History (used by Parent History)
// ----------------------------------------
export interface DemoHistoryItem {
    id: string;
    date: string;
    time: string;
    hotel: string;
    sitter: string;
    duration: string;
    amount: number;
    rating: number;
    status: 'completed' | 'cancelled';
}

export const DEMO_HISTORY: DemoHistoryItem[] = [
    { id: '1', date: 'Jan 15, 2025', time: '18:00-22:00', hotel: 'Grand Hyatt Seoul', sitter: 'Kim Minjung', duration: '4h', amount: 280000, rating: 5, status: 'completed' },
    { id: '2', date: 'Jan 10, 2025', time: '19:00-23:00', hotel: 'Grand Hyatt Seoul', sitter: 'Park Sooyeon', duration: '4h', amount: 280000, rating: 5, status: 'completed' },
    { id: '3', date: 'Dec 28, 2024', time: '20:00-23:00', hotel: 'Park Hyatt Busan', sitter: 'Lee Jihye', duration: '3h', amount: 210000, rating: 4, status: 'completed' },
];

// ----------------------------------------
// Parent Recent Sessions (used by Parent Home)
// ----------------------------------------
export interface DemoRecentSession {
    id: string;
    date: Date;
    hotel: string;
    durationHours: number;
    rating: number;
}

export const DEMO_RECENT_SESSIONS: DemoRecentSession[] = [
    { id: '1', date: new Date('2025-01-10'), hotel: 'Grand Hyatt Seoul', durationHours: 4, rating: 5 },
    { id: '2', date: new Date('2024-12-28'), hotel: 'Park Hyatt Busan', durationHours: 3, rating: 5 },
];

// ----------------------------------------
// LiveStatus Activity Logs (used by Parent LiveStatus)
// ----------------------------------------
export interface DemoActivityLog {
    id: string;
    timestamp: Date;
    type: 'photo' | 'meal' | 'status' | 'checkin' | 'note';
    content: string;
    metadata: { photoUrl?: string; subtext?: string; mood?: string };
}

export const DEMO_LIVE_STATUS_LOGS: DemoActivityLog[] = [
    {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: 'photo',
        content: 'Having a great time painting!',
        metadata: { photoUrl: 'https://images.unsplash.com/photo-1596464716127-f9a87ae63648?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    },
    {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: 'meal',
        content: 'Snack Time',
        metadata: { subtext: 'Sliced apples and juice' },
    },
    {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        type: 'status',
        content: 'Building a block castle',
        metadata: { mood: '🏰' },
    },
    {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        type: 'checkin',
        content: 'Trust Check-in Verified',
        metadata: { subtext: 'Handover complete' },
    },
];

// ----------------------------------------
// LiveStatus Session Info
// ----------------------------------------
export interface DemoLiveSession {
    sitterId: string;
    sitterName: string;
    sitterTier: 'gold' | 'silver';
    sitterLanguages: string;
    elapsedTime: string;
}

export const DEMO_LIVE_SESSION: DemoLiveSession = {
    sitterId: 'demo-sitter-1',
    sitterName: 'Kim Minjung',
    sitterTier: 'gold',
    sitterLanguages: 'English/Korean',
    elapsedTime: '2h 15m',
};

// ----------------------------------------
// Sitter Schedule (used by Sitter Schedule)
// ----------------------------------------
export interface DemoSitterSession {
    id: string;
    time: string;
    room: string;
    hotel: string;
    children: string[];
    status: 'confirmed' | 'pending' | 'in_progress';
}

export const DEMO_TODAY_SESSIONS: DemoSitterSession[] = [
    { id: '1', time: '19:00 - 23:00', room: '1102', hotel: 'Grand Hyatt', children: ['Sota (3)', 'Yui (6)'], status: 'confirmed' },
    { id: '2', time: '20:00 - 24:00', room: '3501', hotel: 'Grand Hyatt', children: ['Lucas (4)'], status: 'pending' },
];

export interface DemoWeekDay {
    date: string;
    sessions: number;
}

export const DEMO_WEEK_SCHEDULE: DemoWeekDay[] = [
    { date: 'Mon 20', sessions: 2 },
    { date: 'Tue 21', sessions: 1 },
    { date: 'Wed 22', sessions: 0 },
    { date: 'Thu 23', sessions: 2 },
    { date: 'Fri 24', sessions: 3 },
    { date: 'Sat 25', sessions: 4 },
    { date: 'Sun 26', sessions: 2 },
];

// ----------------------------------------
// Sitter Stats (used by Sitter Schedule + Profile)
// ----------------------------------------
export interface DemoSitterStats {
    totalSessions: number;
    avgRating: number;
    safetyDays: number;
    onTimeRate: string;
    tier: 'gold' | 'silver';
}

export const DEMO_SITTER_STATS: DemoSitterStats = {
    totalSessions: 247,
    avgRating: 4.9,
    safetyDays: 365,
    onTimeRate: '98%',
    tier: 'gold',
};

// ----------------------------------------
// Sitter Active Session (used by Sitter ActiveSession)
// ----------------------------------------
export interface DemoChecklistItem {
    id: string;
    label: string;
    completed: boolean;
}

export const DEMO_CHECKLIST_ITEMS: DemoChecklistItem[] = [
    { id: '1', label: 'Pre-session: Wash hands', completed: true },
    { id: '2', label: 'Verify child identity with photo', completed: true },
    { id: '3', label: 'Review allergies & medical info', completed: true },
    { id: '4', label: 'Check emergency contact info', completed: true },
    { id: '5', label: 'First activity started', completed: false },
    { id: '6', label: 'Snack served (if applicable)', completed: false },
    { id: '7', label: 'Document any incidents', completed: false },
];

export interface DemoActiveSessionInfo {
    room: string;
    children: string;
    parent: string;
    endTime: string;
    elapsedTime: string;
}

export const DEMO_ACTIVE_SESSION_INFO: DemoActiveSessionInfo = {
    room: '1102',
    children: 'Sota (3), Yui (6)',
    parent: 'Tanaka Yuki',
    endTime: '23:00',
    elapsedTime: '2h 15m',
};

// ----------------------------------------
// Sitter Profile (used by Sitter Profile)
// ----------------------------------------
export interface DemoSitterProfile {
    name: string;
    tier: 'gold' | 'silver';
    rating: number;
    reviewCount: number;
    totalSessions: number;
    safetyDays: number;
    onTimeRate: string;
    certifications: string[];
    languages: { flag: string; name: string; level: string }[];
}

export const DEMO_SITTER_PROFILE: DemoSitterProfile = {
    name: 'Kim Minjung',
    tier: 'gold',
    rating: 4.9,
    reviewCount: 247,
    totalSessions: 247,
    safetyDays: 365,
    onTimeRate: '98%',
    certifications: ['CPR Certified', 'First Aid', 'Child Psychology', 'Background Checked'],
    languages: [
        { flag: '🇰🇷', name: 'Korean', level: 'Native' },
        { flag: '🇺🇸', name: 'English', level: 'Fluent' },
        { flag: '🇯🇵', name: 'Japanese', level: 'Basic' },
    ],
};

// ----------------------------------------
// Notifications (demo)
// ----------------------------------------
export interface DemoNotification {
    id: string;
    type: string;
    title: string;
    body: string;
    read: boolean;
    createdAt: Date;
}

export const DEMO_NOTIFICATIONS: DemoNotification[] = [
    { id: '1', type: 'booking_confirmed', title: 'Booking Confirmed', body: 'Your booking KCP-2025-0042 has been confirmed.', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 30) },
    { id: '2', type: 'sitter_assigned', title: 'Sitter Assigned', body: 'Kim Minjung has been assigned to your booking.', read: false, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: '3', type: 'care_completed', title: 'Session Complete', body: 'The care session has been completed. Please leave a review.', read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
];

// ----------------------------------------
// Incidents (demo)
// ----------------------------------------
export interface DemoIncident {
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    summary: string;
    status: 'open' | 'investigating' | 'resolved' | 'closed';
    reportedAt: Date;
    sitterName: string;
    childName: string;
}

export const DEMO_INCIDENTS: DemoIncident[] = [
    {
        id: '1',
        severity: 'low',
        category: 'injury',
        summary: 'Minor scratch while playing in the kids room.',
        status: 'resolved',
        reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        sitterName: 'Lee Jihye',
        childName: 'Oliver',
    },
    {
        id: '2',
        severity: 'low',
        category: 'complaint',
        summary: 'Parent requested earlier end time.',
        status: 'closed',
        reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
        sitterName: 'Park Sooyeon',
        childName: 'Mia',
    },
];
