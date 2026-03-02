// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useParams: () => ({ bookingId: 'booking-upcoming' }) };
});

// Test with no upcoming booking
vi.mock('../../../hooks/useBookings', () => ({
    useParentBookings: () => ({
        upcomingBooking: null,
        recentSessions: [],
        history: [],
        isLoading: false,
        error: null,
        retry: vi.fn(),
    }),
}));

import { render, screen } from '../../../test/utils';
import QRDisplay from '../QRDisplay';

describe('QRDisplay - No booking', () => {
    it('renders empty state when no booking found', () => {
        render(<QRDisplay />);
        expect(screen.getByText('qr.noActiveBooking')).toBeTruthy();
    });

    it('renders no booking description', () => {
        render(<QRDisplay />);
        expect(screen.getByText('qr.noBooking')).toBeTruthy();
    });

    it('renders go back button', () => {
        render(<QRDisplay />);
        expect(screen.getByText('qr.goBack')).toBeTruthy();
    });
});

describe('QRDisplay - With booking', () => {
    beforeEach(() => {
        vi.doMock('../../../hooks/useBookings', () => ({
            useParentBookings: () => ({
                upcomingBooking: {
                    id: 'booking-upcoming',
                    confirmationCode: 'KCP-TONIGHT-123',
                    status: 'confirmed',
                    time: '18:00-22:00',
                    hotel: 'Grand Hyatt Seoul',
                    room: '2301',
                    sitter: { name: 'Kim Minjung', rating: 4.9 },
                    childrenIds: ['child-1'],
                },
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

    it('renders QR display title', async () => {
        const { default: QRDisplayWithBooking } = await import('../QRDisplay');
        render(<QRDisplayWithBooking />);
        expect(screen.getByText('qr.title')).toBeTruthy();
    });

    it('renders show to hotel instruction', async () => {
        const { default: QRDisplayWithBooking } = await import('../QRDisplay');
        render(<QRDisplayWithBooking />);
        expect(screen.getByText('qr.showToHotel')).toBeTruthy();
    });

    it('renders booking confirmation code', async () => {
        const { default: QRDisplayWithBooking } = await import('../QRDisplay');
        render(<QRDisplayWithBooking />);
        expect(screen.getByText('KCP-TONIGHT-123')).toBeTruthy();
    });

    it('renders hotel name', async () => {
        const { default: QRDisplayWithBooking } = await import('../QRDisplay');
        render(<QRDisplayWithBooking />);
        expect(screen.getByText('Grand Hyatt Seoul')).toBeTruthy();
    });

    it('renders room number', async () => {
        const { default: QRDisplayWithBooking } = await import('../QRDisplay');
        render(<QRDisplayWithBooking />);
        expect(screen.getByText('2301')).toBeTruthy();
    });

    it('renders time slot', async () => {
        const { default: QRDisplayWithBooking } = await import('../QRDisplay');
        render(<QRDisplayWithBooking />);
        expect(screen.getByText('18:00-22:00')).toBeTruthy();
    });

    it('renders booking detail labels', async () => {
        const { default: QRDisplayWithBooking } = await import('../QRDisplay');
        render(<QRDisplayWithBooking />);
        expect(screen.getByText('qr.bookingLabel')).toBeTruthy();
        expect(screen.getByText('qr.hotelLabel')).toBeTruthy();
        expect(screen.getByText('qr.roomLabel')).toBeTruthy();
        expect(screen.getByText('qr.timeLabel')).toBeTruthy();
    });

    it('renders go back button', async () => {
        const { default: QRDisplayWithBooking } = await import('../QRDisplay');
        render(<QRDisplayWithBooking />);
        expect(screen.getByText('qr.goBack')).toBeTruthy();
    });
});
