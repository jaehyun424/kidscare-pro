// ============================================
// KidsCare Pro - Reports & Analytics Page
// ============================================

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { TierBadge, SafetyBadge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { useHotelBookings } from '../../hooks/useBookings';
import { useHotelSessions } from '../../hooks/useSessions';
import { useHotelSitters } from '../../hooks/useSitters';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/pages/hotel-reports.css';

// ----------------------------------------
// Types
// ----------------------------------------
type Period = 'this_week' | 'this_month' | 'last_month';

interface RevenueDataPoint {
    label: string;
    revenue: number;
    bookings: number;
}

// ----------------------------------------
// Icons
// ----------------------------------------
const DownloadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7,10 12,15 17,10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const CurrencyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const LiveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20,6 9,17 4,12" />
    </svg>
);

// ----------------------------------------
// Demo Revenue Data
// ----------------------------------------
const DEMO_REVENUE_WEEK: RevenueDataPoint[] = [
    { label: 'Mon', revenue: 4200000, bookings: 8 },
    { label: 'Tue', revenue: 3800000, bookings: 7 },
    { label: 'Wed', revenue: 5100000, bookings: 10 },
    { label: 'Thu', revenue: 4600000, bookings: 9 },
    { label: 'Fri', revenue: 6200000, bookings: 12 },
    { label: 'Sat', revenue: 7800000, bookings: 15 },
    { label: 'Sun', revenue: 6500000, bookings: 13 },
];

const DEMO_REVENUE_THIS_MONTH: RevenueDataPoint[] = [
    { label: 'Wk 1', revenue: 28500000, bookings: 52 },
    { label: 'Wk 2', revenue: 31200000, bookings: 58 },
    { label: 'Wk 3', revenue: 26800000, bookings: 48 },
    { label: 'Wk 4', revenue: 33500000, bookings: 62 },
];

const DEMO_REVENUE_LAST_MONTH: RevenueDataPoint[] = [
    { label: 'Wk 1', revenue: 24300000, bookings: 44 },
    { label: 'Wk 2', revenue: 27600000, bookings: 50 },
    { label: 'Wk 3', revenue: 29100000, bookings: 54 },
    { label: 'Wk 4', revenue: 25800000, bookings: 46 },
];

const PERIOD_LABELS: Record<Period, string> = {
    this_week: 'This Week',
    this_month: 'This Month',
    last_month: 'Last Month',
};

// ----------------------------------------
// Stat Card Component
// ----------------------------------------
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    subValue?: string;
    color: 'primary' | 'gold' | 'success' | 'warning';
}

function StatCard({ icon, label, value, subValue, color }: StatCardProps) {
    const colorClasses: Record<string, string> = {
        primary: 'rpt-stat-card-primary',
        gold: 'rpt-stat-card-gold',
        success: 'rpt-stat-card-success',
        warning: 'rpt-stat-card-warning',
    };

    return (
        <div className={`rpt-stat-card ${colorClasses[color]}`} role="group" aria-label={label}>
            <div className="rpt-stat-card-icon" aria-hidden="true">{icon}</div>
            <div className="rpt-stat-card-content">
                <div className="rpt-stat-card-value">{value}</div>
                <div className="rpt-stat-card-label">{label}</div>
                {subValue && <div className="rpt-stat-card-sub">{subValue}</div>}
            </div>
        </div>
    );
}

// ----------------------------------------
// Main Component
// ----------------------------------------
export default function Reports() {
    const { user } = useAuth();
    const { bookings, stats, isLoading: bookingsLoading } = useHotelBookings(user?.hotelId);
    const { sessions, isLoading: sessionsLoading } = useHotelSessions(user?.hotelId);
    const { sitters, isLoading: sittersLoading } = useHotelSitters(user?.hotelId);
    const { success } = useToast();

    const [period, setPeriod] = useState<Period>('this_week');

    const isLoading = bookingsLoading || sessionsLoading || sittersLoading;

    // Revenue chart data based on selected period
    const chartData = useMemo<RevenueDataPoint[]>(() => {
        switch (period) {
            case 'this_week':
                return DEMO_REVENUE_WEEK;
            case 'this_month':
                return DEMO_REVENUE_THIS_MONTH;
            case 'last_month':
                return DEMO_REVENUE_LAST_MONTH;
        }
    }, [period]);

    const maxRevenue = useMemo(() => {
        return Math.max(...chartData.map((d) => d.revenue));
    }, [chartData]);

    const totalChartRevenue = useMemo(() => {
        return chartData.reduce((sum, d) => sum + d.revenue, 0);
    }, [chartData]);

    const totalChartBookings = useMemo(() => {
        return chartData.reduce((sum, d) => sum + d.bookings, 0);
    }, [chartData]);

    // Booking stats derived from hook data
    const completionRate = useMemo(() => {
        if (bookings.length === 0) return 0;
        const completed = bookings.filter((b) => b.status === 'completed').length;
        return Math.round((completed / bookings.length) * 100);
    }, [bookings]);

    // Sitter averages
    const avgRating = useMemo(() => {
        if (sitters.length === 0) return 0;
        const total = sitters.reduce((sum, s) => sum + s.rating, 0);
        return (total / sitters.length).toFixed(2);
    }, [sitters]);

    // Format helpers
    const formatCurrency = (amount: number) => `\u20A9${amount.toLocaleString()}`;

    const formatCompact = (amount: number) => {
        if (amount >= 1000000) {
            return `\u20A9${(amount / 1000000).toFixed(1)}M`;
        }
        if (amount >= 1000) {
            return `\u20A9${(amount / 1000).toFixed(0)}K`;
        }
        return `\u20A9${amount.toLocaleString()}`;
    };

    // Export handler
    const handleExport = () => {
        success('Export Started', 'Your report is being generated as PDF.');
    };

    // ----------------------------------------
    // Loading State
    // ----------------------------------------
    if (isLoading) {
        return (
            <div className="reports-page animate-fade-in">
                <div className="page-header">
                    <div>
                        <Skeleton width="260px" height="2rem" />
                        <Skeleton width="200px" height="1rem" />
                    </div>
                    <Skeleton width="140px" height="40px" />
                </div>
                <div className="rpt-period-tabs">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} width="110px" height="36px" />
                    ))}
                </div>
                <div className="rpt-stats-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} height="120px" />
                    ))}
                </div>
                <div className="rpt-main-grid">
                    <Skeleton height="340px" />
                    <Skeleton height="340px" />
                </div>
            </div>
        );
    }

    // ----------------------------------------
    // Render
    // ----------------------------------------
    return (
        <div className="reports-page animate-fade-in">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="page-subtitle">Performance metrics and business insights</p>
                </div>
                <Button variant="gold" icon={<DownloadIcon />} onClick={handleExport}>
                    Export Report
                </Button>
            </div>

            {/* Period Selector */}
            <div className="rpt-period-tabs" role="tablist" aria-label="Report period">
                {(['this_week', 'this_month', 'last_month'] as Period[]).map((p) => (
                    <button
                        key={p}
                        role="tab"
                        aria-selected={period === p}
                        className={`rpt-period-tab ${period === p ? 'rpt-period-tab-active' : ''}`}
                        onClick={() => setPeriod(p)}
                    >
                        {PERIOD_LABELS[p]}
                    </button>
                ))}
            </div>

            {/* Booking Summary Cards */}
            <div className="rpt-stats-grid">
                <StatCard
                    icon={<CalendarIcon />}
                    label="Total Bookings"
                    value={stats.todayBookings}
                    subValue={`${stats.pendingBookings} pending`}
                    color="primary"
                />
                <StatCard
                    icon={<LiveIcon />}
                    label="Active Sessions"
                    value={sessions.length}
                    subValue="In progress now"
                    color="warning"
                />
                <StatCard
                    icon={<CheckIcon />}
                    label="Completion Rate"
                    value={`${completionRate}%`}
                    subValue={`${stats.completedToday} completed today`}
                    color="success"
                />
                <StatCard
                    icon={<CurrencyIcon />}
                    label="Today's Revenue"
                    value={formatCurrency(stats.todayRevenue)}
                    subValue={`${stats.safetyDays} days without incident`}
                    color="gold"
                />
            </div>

            {/* Main Content Grid */}
            <div className="rpt-main-grid">
                {/* Revenue Chart */}
                <Card className="animate-fade-in-up stagger-1">
                    <CardHeader>
                        <CardTitle subtitle={`${PERIOD_LABELS[period]} \u2014 ${totalChartBookings} bookings`}>
                            Revenue Overview
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="rpt-chart-summary">
                            <div className="rpt-chart-total">
                                <span className="rpt-chart-total-label">Total Revenue</span>
                                <span className="rpt-chart-total-value">{formatCompact(totalChartRevenue)}</span>
                            </div>
                            <div className="rpt-chart-total">
                                <span className="rpt-chart-total-label">Bookings</span>
                                <span className="rpt-chart-total-value">{totalChartBookings}</span>
                            </div>
                            <div className="rpt-chart-total">
                                <span className="rpt-chart-total-label">Avg / Day</span>
                                <span className="rpt-chart-total-value">
                                    {formatCompact(Math.round(totalChartRevenue / chartData.length))}
                                </span>
                            </div>
                        </div>
                        <div className="rpt-bar-chart">
                            {chartData.map((d) => {
                                const heightPct = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
                                return (
                                    <div key={d.label} className="rpt-bar-col">
                                        <div className="rpt-bar-value">{formatCompact(d.revenue)}</div>
                                        <div className="rpt-bar-track">
                                            <div
                                                className="rpt-bar-fill"
                                                style={{ height: `${heightPct}%` }}
                                            />
                                        </div>
                                        <div className="rpt-bar-label">{d.label}</div>
                                        <div className="rpt-bar-bookings">{d.bookings} bkgs</div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardBody>
                </Card>

                {/* Sitter Performance Table */}
                <Card className="animate-fade-in-up stagger-2">
                    <CardHeader>
                        <CardTitle subtitle={`${sitters.length} sitters \u2014 Avg rating ${avgRating}`}>
                            Sitter Performance
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="rpt-table-wrapper">
                            <table className="rpt-table">
                                <thead>
                                    <tr>
                                        <th>Sitter</th>
                                        <th>Tier</th>
                                        <th>Rating</th>
                                        <th>Sessions</th>
                                        <th>Safety</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sitters.map((sitter) => (
                                        <tr key={sitter.id}>
                                            <td>
                                                <span className="rpt-sitter-name">{sitter.name}</span>
                                            </td>
                                            <td>
                                                <TierBadge tier={sitter.tier} />
                                            </td>
                                            <td>
                                                <span className="rpt-rating-cell">
                                                    <span className="rpt-rating-star">&#9733;</span>
                                                    {sitter.rating.toFixed(1)}
                                                </span>
                                            </td>
                                            <td>{sitter.sessionsCompleted}</td>
                                            <td>
                                                <SafetyBadge days={sitter.safetyDays} />
                                            </td>
                                        </tr>
                                    ))}
                                    {sitters.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="rpt-table-empty">
                                                No sitter data available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
