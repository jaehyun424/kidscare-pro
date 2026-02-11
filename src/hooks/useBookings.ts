// ============================================
// KidsCare Pro - Booking Hooks
// Transparently switches between demo and Firestore data
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { DEMO_MODE } from './useDemo';
import {
    DEMO_HOTEL_BOOKINGS,
    DEMO_DASHBOARD_STATS,
    DEMO_UPCOMING_BOOKING,
    DEMO_HISTORY,
    DEMO_RECENT_SESSIONS,
    DEMO_TODAY_SESSIONS,
    DEMO_WEEK_SCHEDULE,
    type DemoBooking,
    type DemoUpcomingBooking,
    type DemoHistoryItem,
    type DemoRecentSession,
    type DemoSitterSession,
    type DemoWeekDay,
} from '../data/demo';
import { bookingService } from '../services/firestore';
import type { DashboardStats } from '../types';

// ----------------------------------------
// Hotel Bookings Hook
// ----------------------------------------
export function useHotelBookings(hotelId?: string) {
    const [bookings, setBookings] = useState<DemoBooking[]>([]);
    const [stats, setStats] = useState<DashboardStats>(DEMO_DASHBOARD_STATS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (DEMO_MODE) {
            const timer = setTimeout(() => {
                setBookings(DEMO_HOTEL_BOOKINGS);
                setStats(DEMO_DASHBOARD_STATS);
                setIsLoading(false);
            }, 600);
            return () => clearTimeout(timer);
        }

        if (!hotelId) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                const [fbBookings, fbStats] = await Promise.all([
                    bookingService.getHotelBookings(hotelId!),
                    bookingService.getBookingStats(hotelId!),
                ]);
                if (!cancelled) {
                    // Transform Firestore bookings to DemoBooking shape
                    const mapped: DemoBooking[] = fbBookings.map((b) => ({
                        id: b.id,
                        confirmationCode: b.confirmationCode,
                        date: b.schedule.date instanceof Date
                            ? b.schedule.date.toISOString().split('T')[0]
                            : String(b.schedule.date),
                        time: `${b.schedule.startTime} - ${b.schedule.endTime}`,
                        room: b.location.roomNumber || '',
                        parent: { name: b.parentId, phone: '' },
                        children: b.children.map((c) => ({ name: c.firstName, age: c.age })),
                        sitter: b.sitterId ? { name: b.sitterId, tier: 'silver' as const } : null,
                        status: b.status as DemoBooking['status'],
                        totalAmount: b.pricing.total,
                    }));
                    setBookings(mapped);
                    setStats(fbStats);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Failed to load hotel bookings:', err);
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [hotelId]);

    return { bookings, stats, isLoading };
}

// ----------------------------------------
// Parent Bookings Hook
// ----------------------------------------
export function useParentBookings(parentId?: string) {
    const [upcomingBooking, setUpcomingBooking] = useState<DemoUpcomingBooking | null>(null);
    const [history, setHistory] = useState<DemoHistoryItem[]>([]);
    const [recentSessions, setRecentSessions] = useState<DemoRecentSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (DEMO_MODE) {
            const timer = setTimeout(() => {
                setUpcomingBooking(DEMO_UPCOMING_BOOKING);
                setHistory(DEMO_HISTORY);
                setRecentSessions(DEMO_RECENT_SESSIONS);
                setIsLoading(false);
            }, 600);
            return () => clearTimeout(timer);
        }

        if (!parentId) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                const fbBookings = await bookingService.getParentBookings(parentId!);
                if (cancelled) return;

                // Find upcoming (confirmed, future)
                const upcoming = fbBookings.find((b) =>
                    b.status === 'confirmed' || b.status === 'pending'
                );

                if (upcoming) {
                    setUpcomingBooking({
                        id: upcoming.id,
                        confirmationCode: upcoming.confirmationCode,
                        dateKey: 'tonight',
                        time: `${upcoming.schedule.startTime} - ${upcoming.schedule.endTime}`,
                        hotel: upcoming.hotelId,
                        room: upcoming.location.roomNumber || '',
                        sitter: { name: upcoming.sitterId || '', rating: 0 },
                        childrenIds: upcoming.children.map((c) => c.childId),
                        status: upcoming.status as 'confirmed' | 'pending',
                    });
                }

                // Completed bookings → history
                const completed = fbBookings.filter((b) => b.status === 'completed');
                setHistory(completed.map((b) => ({
                    id: b.id,
                    date: b.schedule.date instanceof Date
                        ? b.schedule.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : String(b.schedule.date),
                    time: `${b.schedule.startTime}-${b.schedule.endTime}`,
                    hotel: b.hotelId,
                    sitter: b.sitterId || '',
                    duration: `${b.schedule.duration}h`,
                    amount: b.pricing.total,
                    rating: b.review?.rating || 0,
                    status: 'completed',
                })));

                setRecentSessions(completed.slice(0, 3).map((b) => ({
                    id: b.id,
                    date: b.schedule.date instanceof Date ? b.schedule.date : new Date(),
                    hotel: b.hotelId,
                    durationHours: b.schedule.duration,
                    rating: b.review?.rating || 0,
                })));

                setIsLoading(false);
            } catch (err) {
                console.error('Failed to load parent bookings:', err);
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [parentId]);

    return { upcomingBooking, history, recentSessions, isLoading };
}

// ----------------------------------------
// Sitter Bookings Hook
// ----------------------------------------
export function useSitterBookings(sitterId?: string) {
    const [todaySessions, setTodaySessions] = useState<DemoSitterSession[]>([]);
    const [weekSchedule, setWeekSchedule] = useState<DemoWeekDay[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (DEMO_MODE) {
            const timer = setTimeout(() => {
                setTodaySessions(DEMO_TODAY_SESSIONS);
                setWeekSchedule(DEMO_WEEK_SCHEDULE);
                setIsLoading(false);
            }, 600);
            return () => clearTimeout(timer);
        }

        if (!sitterId) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                const fbBookings = await bookingService.getSitterBookings(sitterId!);
                if (cancelled) return;

                const today = new Date().toISOString().split('T')[0];
                const todayBookings = fbBookings.filter((b) => {
                    const d = b.schedule.date instanceof Date
                        ? b.schedule.date.toISOString().split('T')[0]
                        : String(b.schedule.date);
                    return d === today;
                });

                setTodaySessions(todayBookings.map((b) => ({
                    id: b.id,
                    time: `${b.schedule.startTime} - ${b.schedule.endTime}`,
                    room: b.location.roomNumber || '',
                    hotel: b.hotelId,
                    children: b.children.map((c) => `${c.firstName} (${c.age})`),
                    status: b.status as 'confirmed' | 'pending' | 'in_progress',
                })));

                // Week schedule placeholder (would need more complex date logic)
                setWeekSchedule(DEMO_WEEK_SCHEDULE);
                setIsLoading(false);
            } catch (err) {
                console.error('Failed to load sitter bookings:', err);
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [sitterId]);

    const createBooking = useCallback(async (data: Record<string, unknown>) => {
        if (DEMO_MODE) {
            await new Promise((r) => setTimeout(r, 1000));
            return 'demo-booking-' + Date.now();
        }
        const booking = await bookingService.createBooking(data as never);
        return booking;
    }, []);

    return { todaySessions, weekSchedule, isLoading, createBooking };
}
