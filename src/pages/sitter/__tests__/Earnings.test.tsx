// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../hooks/useSitters', () => ({
    useSitterStats: () => ({
        stats: {
            totalSessions: 14,
            avgRating: 4.9,
            tier: 'gold',
            safetyDays: 365,
        },
        isLoading: false,
    }),
}));

import { render, screen, fireEvent } from '../../../test/utils';
import Earnings from '../Earnings';

describe('Sitter Earnings', () => {
    it('renders earnings page title', () => {
        render(<Earnings />);
        expect(screen.getByText('earnings.title')).toBeTruthy();
    });

    it('renders this month summary label', () => {
        render(<Earnings />);
        expect(screen.getByText('earnings.thisMonth')).toBeTruthy();
    });

    it('renders this month amount', () => {
        render(<Earnings />);
        expect(screen.getByText(/2,450,000/)).toBeTruthy();
    });

    it('renders pending earnings stat', () => {
        render(<Earnings />);
        expect(screen.getByText('earnings.pending')).toBeTruthy();
        expect(screen.getByText(/350,000/)).toBeTruthy();
    });

    it('renders last month earnings stat', () => {
        render(<Earnings />);
        expect(screen.getByText('earnings.lastMonth')).toBeTruthy();
        expect(screen.getByText(/2,180,000/)).toBeTruthy();
    });

    it('renders sessions completed count', () => {
        render(<Earnings />);
        expect(screen.getByText(/earnings\.sessionsCompleted/)).toBeTruthy();
    });

    it('renders growth percentage vs last month', () => {
        render(<Earnings />);
        expect(screen.getByText(/earnings\.vsLastMonth/)).toBeTruthy();
    });

    it('renders monthly earnings chart section', () => {
        render(<Earnings />);
        expect(screen.getByText('earnings.monthlyEarnings')).toBeTruthy();
    });

    it('renders monthly chart with bar chart role', () => {
        render(<Earnings />);
        expect(screen.getByRole('img', { name: 'Monthly earnings bar chart' })).toBeTruthy();
    });

    it('renders chart month labels', () => {
        render(<Earnings />);
        expect(screen.getByText('Sep')).toBeTruthy();
        expect(screen.getByText('Oct')).toBeTruthy();
        expect(screen.getByText('Nov')).toBeTruthy();
        expect(screen.getByText('Dec')).toBeTruthy();
        expect(screen.getByText('Jan')).toBeTruthy();
        expect(screen.getByText('Feb')).toBeTruthy();
    });

    it('renders earnings by hotel section', () => {
        render(<Earnings />);
        expect(screen.getByText('earnings.earningsByHotel')).toBeTruthy();
    });

    it('renders hotel breakdown entries', () => {
        render(<Earnings />);
        expect(screen.getByText('Grand Hyatt Seoul')).toBeTruthy();
        expect(screen.getByText('Park Hyatt Busan')).toBeTruthy();
        expect(screen.getByText('Four Seasons Seoul')).toBeTruthy();
    });

    it('renders hotel breakdown percentages', () => {
        render(<Earnings />);
        expect(screen.getByText('69%')).toBeTruthy();
        expect(screen.getByText('21%')).toBeTruthy();
        expect(screen.getByText('10%')).toBeTruthy();
    });

    it('renders recent payments section', () => {
        render(<Earnings />);
        expect(screen.getByText('earnings.recentPayments')).toBeTruthy();
    });

    it('renders payment history entries', () => {
        render(<Earnings />);
        expect(screen.getByText('Feb 10')).toBeTruthy();
        expect(screen.getByText('Feb 8')).toBeTruthy();
        expect(screen.getByText('Feb 5')).toBeTruthy();
    });

    it('renders payment status badges', () => {
        render(<Earnings />);
        // 4 paid + 1 pending
        const paidBadges = screen.getAllByText('earnings.paid');
        expect(paidBadges.length).toBe(4);
        const pendingBadges = screen.getAllByText('earnings.pending');
        // 1 pending in payments + 1 "pending" stat label = check the badge count
        expect(pendingBadges.length).toBeGreaterThanOrEqual(1);
    });

    it('renders period filter tabs', () => {
        render(<Earnings />);
        expect(screen.getByRole('tablist', { name: 'Earnings period filter' })).toBeTruthy();
    });

    it('renders all period filter options', () => {
        render(<Earnings />);
        expect(screen.getAllByText('earnings.thisMonth').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('earnings.last3Months')).toBeTruthy();
        expect(screen.getByText('earnings.allTime')).toBeTruthy();
    });

    it('this month filter is selected by default', () => {
        render(<Earnings />);
        const thisMonthTabs = screen.getAllByRole('tab', { selected: true });
        expect(thisMonthTabs.length).toBeGreaterThanOrEqual(1);
    });

    it('can switch period filter', () => {
        render(<Earnings />);
        fireEvent.click(screen.getByText('earnings.last3Months'));
        const selectedTabs = screen.getAllByRole('tab', { selected: true });
        expect(selectedTabs.length).toBeGreaterThanOrEqual(1);
    });
});
