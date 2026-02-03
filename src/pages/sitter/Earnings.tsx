// Sitter Earnings Page
import React from 'react';
import { Card, CardBody } from '../../components/common/Card';

const EARNINGS_DATA = {
    thisMonth: 2450000,
    lastMonth: 2180000,
    pending: 350000,
    totalSessions: 14,
};

const RECENT_PAYMENTS = [
    { id: '1', date: 'Jan 15', hotel: 'Grand Hyatt Seoul', hours: 4, amount: 280000 },
    { id: '2', date: 'Jan 14', hotel: 'Grand Hyatt Seoul', hours: 3, amount: 210000 },
    { id: '3', date: 'Jan 12', hotel: 'Park Hyatt Busan', hours: 5, amount: 350000 },
    { id: '4', date: 'Jan 10', hotel: 'Grand Hyatt Seoul', hours: 4, amount: 280000 },
];

export default function Earnings() {
    const formatCurrency = (amount: number) => `₩${amount.toLocaleString()}`;

    return (
        <div className="earnings-page animate-fade-in">
            {/* Summary */}
            <Card className="earnings-summary" variant="gold">
                <CardBody>
                    <h3>This Month</h3>
                    <div className="earnings-amount">{formatCurrency(EARNINGS_DATA.thisMonth)}</div>
                    <div className="earnings-meta">
                        <span>{EARNINGS_DATA.totalSessions} sessions completed</span>
                        <span className="growth">+{Math.round((EARNINGS_DATA.thisMonth - EARNINGS_DATA.lastMonth) / EARNINGS_DATA.lastMonth * 100)}% vs last month</span>
                    </div>
                </CardBody>
            </Card>

            {/* Stats Row */}
            <div className="stats-row">
                <Card>
                    <CardBody>
                        <span className="stat-label">Pending</span>
                        <span className="stat-value pending">{formatCurrency(EARNINGS_DATA.pending)}</span>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <span className="stat-label">Last Month</span>
                        <span className="stat-value">{formatCurrency(EARNINGS_DATA.lastMonth)}</span>
                    </CardBody>
                </Card>
            </div>

            {/* Recent Payments */}
            <h2 className="section-title">Recent Payments</h2>
            <div className="payments-list">
                {RECENT_PAYMENTS.map((payment) => (
                    <Card key={payment.id}>
                        <CardBody>
                            <div className="payment-row">
                                <div className="payment-info">
                                    <span className="payment-date">{payment.date}</span>
                                    <span className="payment-hotel">{payment.hotel}</span>
                                    <span className="payment-hours">{payment.hours} hours</span>
                                </div>
                                <span className="payment-amount">{formatCurrency(payment.amount)}</span>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Styles
const earningsStyles = `
.earnings-page { max-width: 480px; margin: 0 auto; }

.earnings-summary { margin-bottom: var(--space-4); }
.earnings-summary h3 { font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--space-2); }
.earnings-amount { font-size: var(--text-4xl); font-weight: var(--font-bold); color: var(--gold-500); }
.earnings-meta { display: flex; justify-content: space-between; margin-top: var(--space-3); font-size: var(--text-sm); color: var(--text-tertiary); }
.growth { color: var(--success-500); }

.stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-6); }
.stat-label { display: block; font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase; }
.stat-value { display: block; font-size: var(--text-xl); font-weight: var(--font-bold); margin-top: var(--space-1); }
.stat-value.pending { color: var(--warning-500); }

.section-title { font-size: var(--text-lg); font-weight: var(--font-semibold); margin-bottom: var(--space-4); }

.payments-list { display: flex; flex-direction: column; gap: var(--space-3); }

.payment-row { display: flex; justify-content: space-between; align-items: center; }
.payment-info { display: flex; flex-direction: column; gap: var(--space-1); }
.payment-date { font-weight: var(--font-medium); }
.payment-hotel { font-size: var(--text-sm); color: var(--text-secondary); }
.payment-hours { font-size: var(--text-xs); color: var(--text-tertiary); }
.payment-amount { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--gold-500); }
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = earningsStyles; document.head.appendChild(s);
}
