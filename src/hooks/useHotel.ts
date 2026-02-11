// ============================================
// KidsCare Pro - Hotel Hooks
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { DEMO_MODE } from './useDemo';
import { DEMO_HOTELS, type DemoHotelOption } from '../data/demo';
import { hotelService } from '../services/firestore';
import type { Hotel } from '../types';

// ----------------------------------------
// Hotel Detail Hook (for hotel staff)
// ----------------------------------------
export function useHotel(hotelId?: string) {
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (DEMO_MODE) {
            const timer = setTimeout(() => {
                // Provide a demo hotel object
                setHotel({
                    id: 'hotel-grand-hyatt',
                    name: 'Grand Hyatt Seoul',
                    nameI18n: { en: 'Grand Hyatt Seoul', ko: '그랜드 하얏트 서울', ja: 'グランドハイアットソウル', zh: '首尔君悦酒店' },
                    tier: 'luxury',
                    address: '322 Sowol-ro, Yongsan-gu, Seoul',
                    coordinates: { lat: 37.5398, lng: 126.9977 },
                    logo: '',
                    contactEmail: 'concierge@grandhyatt.com',
                    contactPhone: '+82-2-797-1234',
                    timezone: 'Asia/Seoul',
                    currency: 'KRW',
                    commission: 15,
                    settings: {
                        autoAssign: true,
                        requireGoldForInfant: true,
                        maxAdvanceBookingDays: 30,
                        minBookingHours: 2,
                        cancellationPolicy: 'moderate',
                    },
                    stats: {
                        totalBookings: 1247,
                        safetyDays: 127,
                        averageRating: 4.8,
                        thisMonthBookings: 89,
                        thisMonthRevenue: 42500000,
                    },
                    slaMetrics: {
                        responseRate: 98,
                        replacementRate: 2,
                        satisfactionRate: 96,
                    },
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date(),
                });
                setIsLoading(false);
            }, 400);
            return () => clearTimeout(timer);
        }

        if (!hotelId) {
            setIsLoading(false);
            return;
        }

        // Real-time subscription
        const unsubscribe = hotelService.subscribeToHotel(hotelId, (data) => {
            setHotel(data);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [hotelId]);

    const updateHotel = useCallback(async (data: Partial<Hotel>) => {
        if (!hotelId) return;
        if (DEMO_MODE) {
            setHotel((prev) => prev ? { ...prev, ...data } as Hotel : null);
            return;
        }
        await hotelService.updateHotelSettings(hotelId, data);
    }, [hotelId]);

    return { hotel, isLoading, updateHotel };
}

// ----------------------------------------
// Hotel List Hook (for parent booking selection)
// ----------------------------------------
export function useHotels() {
    const [hotels, setHotels] = useState<DemoHotelOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (DEMO_MODE) {
            const timer = setTimeout(() => {
                setHotels(DEMO_HOTELS);
                setIsLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        }

        // In real mode, would query all hotels
        // For now, return demo data as fallback
        setHotels(DEMO_HOTELS);
        setIsLoading(false);
    }, []);

    return { hotels, isLoading };
}
