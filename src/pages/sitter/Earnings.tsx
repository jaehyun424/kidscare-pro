// ============================================
// KidsCare Pro - Sitter Earnings Page
// ============================================

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSitterStats } from '../../hooks/useSitters';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';

// ----------------------------------------
// Demo Data
// ----------------------------------------
const DEMO_EARNINGS = {
    thisMonth: 2450000,
    lastMonth: 2180000,
    pending: 350000,
    totalSessions: 14,
};

const DEMO_MONTHLY_CHART = [
    { month: 'Sep', amount: 1800000 },
    { month: 'Oct', amount: 2100000 },
    { month: 'Nov', amount: 1950000 },
    { month: 'Dec', amount: 2400000 },
    { month: 'Jan', amount: 2180000 },
    { month: 'Feb', amount: 2450000 },
];

const DEMO_RECENT_PAYMENTS: Payment[] = [
    { id: '1', date: 'Feb 10', hotel: 'Grand Hyatt Seoul', hours: 4, amount: 280000, status: 'paid' },
    { id: '2', date: 'Feb 8', hotel: 'Grand Hyatt Seoul', hours: 3, amount: 210000, status: 'paid' },
    { id: '3', date: 'Feb 5', hotel: 'Park Hyatt Busan', hours: 5, amount: 350000, status: 'paid' },
    { id: '4', date: 'Feb 3', hotel: 'Grand Hyatt Seoul', hours: 4, amount: 280000, status: 'paid' },
    { id: '5', date: 'Feb 1', hotel: 'Four Seasons Seoul', hours: 3, amount: 225000, status: 'pending' },
];

const DEMO_HOTEL_BREAKDOWN = [
    { hotel: 'Grand Hyatt Seoul', sessions: 9, amount: 1680000, percentage: 69 },
    { hotel: 'Park Hyatt Busan', sessions: 3, amount: 525000, percentage: 21 },
    { hotel: 'Four Seasons Seoul', sessions: 2, amount: 245000, percentage: 10 },
];

// ----------------------------------------
// Types
// ----------------------------------------
type PeriodFilter = 'this_month' | 'last_3_months' | 'all_time';

interface Payment {
    id: string;
    date: string;
    hotel: string;
    hours: number;
    amount: number;
    status: 'paid' | 'pending';
}

// ----------------------------------------
// Helpers
// ----------------------------------------
const formatCurrency = (amount: number) => `₩${amount.toLocaleString()}`;

const growthPercent = (current: number, previous: number) =>
    Math.round(((current - previous) / previous) * 100);

// ----------------------------------------
// Component
// ----------------------------------------
export default function Earnings() {
    const { user } = useAuth();
    const sitterId = user?.sitterInfo?.sitterId;
    const { stats, isLoading } = useSitterStats(sitterId);

    const [period, setPeriod] = useState<PeriodFilter>('this_month');

    const growth = growthPercent(DEMO_EARNINGS.thisMonth, DEMO_EARNINGS.lastMonth);
    const maxChartAmount = Math.max(...DEMO_MONTHLY_CHART.map((m) => m.amount));

    // ---- Loading State ----
    if (isLoading) {
        return (
            <div className="earnings-page animate-fade-in">
                <Skeleton height="160px" borderRadius="var(--radius-2xl)" />
                <div className="stats-row" style={{ marginTop: 'var(--space-4)' }}>
                    <Skeleton height="80px" borderRadius="var(--radius-xl)" />
                    <Skeleton height="80px" borderRadius="var(--radius-xl)" />
                </div>
                <Skeleton height="260px" borderRadius="var(--radius-xl)" className="mt-4" />
                <Skeleton height="180px" borderRadius="var(--radius-xl)" className="mt-4" />
                <Skeleton height="240px" borderRadius="var(--radius-xl)" className="mt-4" />
            </div>
        );
    }

    return (
        <div className="earnings-page animate-fade-in">
            {/* ---- Header + Period Filter ---- */}
            <div className="earnings-header">
                <h1 className="earnings-page-title">Earnings</h1>
                <div className="period-filter">
                    <Button
                        variant={period === 'this_month' ? 'gold' : 'ghost'}
                        size="sm"
                        onClick={() => setPeriod('this_month')}
                    >
                        This Month
                    </Button>
                    <Button
                        variant={period === 'last_3_months' ? 'gold' : 'ghost'}
                        size="sm"
                        onClick={() => setPeriod('last_3_months')}
                    >
                        Last 3 Months
                    </Button>
                    <Button
                        variant={period === 'all_time' ? 'gold' : 'ghost'}
                        size="sm"
                        onClick={() => setPeriod('all_time')}
                    >
                        All Time
                    </Button>
                </div>
            </div>

            {/* ---- Monthly Summary Card ---- */}
            <Card className="earnings-summary" variant="gold">
                <CardBody>
                    <h3 className="earnings-summary-label">This Month</h3>
                    <div className="earnings-amount">{formatCurrency(DEMO_EARNINGS.thisMonth)}</div>
                    <div className="earnings-meta">
                        <span className="earnings-sessions">
                            {stats?.totalSessions ?? DEMO_EARNINGS.totalSessions} sessions completed
                        </span>
                        <span className={`earnings-growth ${growth >= 0 ? 'positive' : 'negative'}`}>
                            {growth >= 0 ? '+' : ''}{growth}% vs last month
                        </span>
                    </div>
                </CardBody>
            </Card>

            {/* ---- Stats Row ---- */}
            <div className="stats-row">
                <Card>
                    <CardBody>
                        <span className="stat-label">Pending</span>
                        <span className="stat-value stat-pending">{formatCurrency(DEMO_EARNINGS.pending)}</span>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <span className="stat-label">Last Month</span>
                        <span className="stat-value">{formatCurrency(DEMO_EARNINGS.lastMonth)}</span>
                    </CardBody>
                </Card>
            </div>

            {/* ---- Monthly Earnings Bar Chart ---- */}
            <Card className="chart-card">
                <CardHeader>
                    <CardTitle>Monthly Earnings</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="chart-container">
                        {DEMO_MONTHLY_CHART.map((item, index) => {
                            const isCurrentMonth = index === DEMO_MONTHLY_CHART.length - 1;
                            const heightPercent = (item.amount / maxChartAmount) * 100;
                            return (
                                <div key={item.month} className="chart-bar-wrapper">
                                    <span className="chart-amount">
                                        {formatCurrency(item.amount / 10000)}만
                                    </span>
                                    <div
                                        className={`chart-bar ${isCurrentMonth ? 'chart-bar-current' : 'chart-bar-default'}`}
                                        style={{ height: `${heightPercent}%` }}
                                    />
                                    <span className={`chart-label ${isCurrentMonth ? 'chart-label-current' : ''}`}>
                                        {item.month}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </CardBody>
            </Card>

            {/* ---- Hotel Breakdown ---- */}
            <Card className="breakdown-card">
                <CardHeader>
                    <CardTitle>Earnings by Hotel</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="hotel-breakdown-list">
                        {DEMO_HOTEL_BREAKDOWN.map((hotel) => (
                            <div key={hotel.hotel} className="hotel-breakdown-row">
                                <div className="hotel-breakdown-info">
                                    <span className="hotel-breakdown-name">{hotel.hotel}</span>
                                    <span className="hotel-breakdown-sessions">{hotel.sessions} sessions</span>
                                </div>
                                <div className="hotel-breakdown-right">
                                    <span className="hotel-breakdown-amount">{formatCurrency(hotel.amount)}</span>
                                    <div className="hotel-breakdown-bar-track">
                                        <div
                                            className="hotel-breakdown-bar-fill"
                                            style={{ width: `${hotel.percentage}%` }}
                                        />
                                    </div>
                                    <span className="hotel-breakdown-pct">{hotel.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* ---- Recent Payments ---- */}
            <Card className="payments-card">
                <CardHeader>
                    <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="payments-list">
                        {DEMO_RECENT_PAYMENTS.map((payment) => (
                            <div key={payment.id} className="payment-row">
                                <div className="payment-info">
                                    <span className="payment-date">{payment.date}</span>
                                    <span className="payment-hotel">{payment.hotel}</span>
                                    <span className="payment-hours">{payment.hours} hours</span>
                                </div>
                                <div className="payment-right">
                                    <span className="payment-amount">{formatCurrency(payment.amount)}</span>
                                    <Badge
                                        variant={payment.status === 'paid' ? 'success' : 'warning'}
                                        size="sm"
                                    >
                                        {payment.status === 'paid' ? 'Paid' : 'Pending'}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

// ============================================
// Styles
// ============================================
const earningsStyles = `
/* Page Layout */
.earnings-page {
    max-width: 600px;
    margin: 0 auto;
    padding-bottom: var(--space-8);
}

/* Header */
.earnings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
    flex-wrap: wrap;
    gap: var(--space-3);
}

.earnings-page-title {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
}

.period-filter {
    display: flex;
    gap: var(--space-2);
}

/* Summary Card */
.earnings-summary {
    margin-bottom: var(--space-4);
}

.earnings-summary-label {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-bottom: var(--space-2);
    font-weight: var(--font-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.earnings-amount {
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    color: var(--gold-500);
    line-height: 1.1;
}

.earnings-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--space-3);
    font-size: var(--text-sm);
    color: var(--text-tertiary);
    flex-wrap: wrap;
    gap: var(--space-2);
}

.earnings-growth.positive {
    color: var(--success-500);
    font-weight: var(--font-medium);
}

.earnings-growth.negative {
    color: var(--warning-500);
    font-weight: var(--font-medium);
}

/* Stats Row */
.stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
}

.stat-label {
    display: block;
    font-size: var(--text-xs);
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: var(--font-medium);
}

.stat-value {
    display: block;
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    margin-top: var(--space-1);
}

.stat-pending {
    color: var(--warning-500);
}

/* Chart Card */
.chart-card {
    margin-bottom: var(--space-6);
}

.chart-container {
    display: flex;
    align-items: flex-end;
    gap: var(--space-3);
    height: 200px;
    padding-top: var(--space-4);
}

.chart-bar-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    height: 100%;
    justify-content: flex-end;
}

.chart-bar {
    width: 100%;
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    min-height: 4px;
    transition: height 0.3s ease;
}

.chart-bar-default {
    background: var(--primary-400);
    opacity: 0.6;
}

.chart-bar-current {
    background: var(--gold-500);
    opacity: 1;
}

.chart-label {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
}

.chart-label-current {
    color: var(--gold-500);
    font-weight: var(--font-semibold);
}

.chart-amount {
    font-size: var(--text-xs);
    color: var(--text-secondary);
    white-space: nowrap;
}

/* Hotel Breakdown */
.breakdown-card {
    margin-bottom: var(--space-6);
}

.hotel-breakdown-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}

.hotel-breakdown-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-4);
}

.hotel-breakdown-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 0;
    flex-shrink: 1;
}

.hotel-breakdown-name {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.hotel-breakdown-sessions {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
}

.hotel-breakdown-right {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-shrink: 0;
}

.hotel-breakdown-amount {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--gold-500);
    white-space: nowrap;
}

.hotel-breakdown-bar-track {
    width: 60px;
    height: 6px;
    background: var(--glass-bg);
    border-radius: var(--radius-md);
    overflow: hidden;
}

.hotel-breakdown-bar-fill {
    height: 100%;
    background: var(--gold-500);
    border-radius: var(--radius-md);
    transition: width 0.3s ease;
}

.hotel-breakdown-pct {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
    min-width: 28px;
    text-align: right;
}

/* Payments */
.payments-card {
    margin-bottom: var(--space-4);
}

.payments-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

.payment-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--space-3);
    border-bottom: 1px solid var(--border-color);
}

.payment-row:last-child {
    padding-bottom: 0;
    border-bottom: none;
}

.payment-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
}

.payment-date {
    font-weight: var(--font-medium);
    font-size: var(--text-sm);
}

.payment-hotel {
    font-size: var(--text-sm);
    color: var(--text-secondary);
}

.payment-hours {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
}

.payment-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-1);
}

.payment-amount {
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
    color: var(--gold-500);
}

/* Utility */
.mt-4 {
    margin-top: var(--space-4);
}
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.textContent = earningsStyles;
    document.head.appendChild(s);
}
