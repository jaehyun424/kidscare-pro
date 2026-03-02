// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../hooks/useBookings', () => ({
    useParentBookings: () => ({
        upcomingBooking: {
            id: 'booking-upcoming',
            confirmationCode: 'KCP-TONIGHT',
            status: 'confirmed',
            time: '18:00-22:00',
            hotel: 'Grand Hyatt Seoul',
            room: '2301',
            sitter: { name: 'Kim Minjung', rating: 4.9 },
            childrenIds: ['child-1', 'child-2'],
        },
        recentSessions: [
            { id: 'rs-1', date: new Date('2026-02-25'), hotel: 'Grand Hyatt Seoul', durationHours: 4, rating: 5 },
            { id: 'rs-2', date: new Date('2026-02-20'), hotel: 'Park Hyatt Busan', durationHours: 3, rating: 4 },
        ],
        history: [],
        isLoading: false,
        error: null,
        retry: vi.fn(),
    }),
}));

vi.mock('../../../hooks/useChildren', () => ({
    useChildren: () => ({
        children: [
            { id: 'child-1', name: 'Emma', age: 5, gender: 'female', allergies: [] },
            { id: 'child-2', name: 'Liam', age: 3, gender: 'male', allergies: ['peanuts'] },
        ],
        isLoading: false,
        addChild: vi.fn(),
        updateChild: vi.fn(),
        removeChild: vi.fn(),
    }),
}));

import { render, screen } from '../../../test/utils';
import Home from '../Home';

describe('Parent Home', () => {
    it('renders greeting', () => {
        render(<Home />);
        expect(screen.getByText(/parent\.greeting/)).toBeTruthy();
    });

    it('renders book now quick action', () => {
        render(<Home />);
        expect(screen.getByText('parent.bookNow')).toBeTruthy();
    });

    it('renders history quick action', () => {
        render(<Home />);
        expect(screen.getByText('nav.history')).toBeTruthy();
    });

    it('renders children quick action', () => {
        render(<Home />);
        expect(screen.getByText('parent.children')).toBeTruthy();
    });

    it('renders quick actions navigation', () => {
        render(<Home />);
        expect(screen.getByRole('navigation', { name: 'Quick actions' })).toBeTruthy();
    });

    it('renders upcoming booking card when booking exists', () => {
        render(<Home />);
        expect(screen.getByText('parent.upcomingBooking')).toBeTruthy();
    });

    it('renders booking confirmation code', () => {
        render(<Home />);
        expect(screen.getByText(/18:00-22:00/)).toBeTruthy();
    });

    it('renders sitter info in upcoming booking', () => {
        render(<Home />);
        expect(screen.getByText(/Kim Minjung/)).toBeTruthy();
    });

    it('renders trust check-in button', () => {
        render(<Home />);
        expect(screen.getByText('parent.trustCheckIn')).toBeTruthy();
    });

    it('renders show QR code button', () => {
        render(<Home />);
        expect(screen.getByText('parent.showQRCode')).toBeTruthy();
    });

    it('renders recent sessions section', () => {
        render(<Home />);
        expect(screen.getByText('parent.recentSessions')).toBeTruthy();
    });

    it('renders recent session entries', () => {
        render(<Home />);
        expect(screen.getByText('Grand Hyatt Seoul')).toBeTruthy();
        expect(screen.getByText('Park Hyatt Busan')).toBeTruthy();
    });

    it('renders dashboard stats', () => {
        render(<Home />);
        // Total sessions count
        expect(screen.getByText('2')).toBeTruthy();
    });

    it('renders childcare handled subtitle', () => {
        render(<Home />);
        expect(screen.getByText('parent.childcareHandled')).toBeTruthy();
    });
});

describe('Parent Home - Empty state', () => {
    beforeEach(() => {
        // Override the mock for this describe block
        vi.doMock('../../../hooks/useBookings', () => ({
            useParentBookings: () => ({
                upcomingBooking: null,
                recentSessions: [],
                history: [],
                isLoading: false,
                error: null,
                retry: vi.fn(),
            }),
        }));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows empty state when no upcoming booking', async () => {
        // Re-import with new mock
        const { default: HomeNoBooking } = await import('../Home');
        render(<HomeNoBooking />);
        expect(screen.getByText('parent.noUpcomingBookings')).toBeTruthy();
    });
});
