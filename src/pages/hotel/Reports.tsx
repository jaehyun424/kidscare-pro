// ============================================
// KidsCare Pro - Reports Page (Stub)
// ============================================

import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export default function Reports() {
    return (
        <div className="reports-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="page-subtitle">Performance metrics and business insights</p>
                </div>
                <Button variant="primary">Export Report</Button>
            </div>

            <div className="reports-grid">
                <Card>
                    <CardHeader>
                        <CardTitle subtitle="January 2025">Booking Summary</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="report-stat">
                            <span className="stat-number">156</span>
                            <span className="stat-label">Total Bookings</span>
                        </div>
                        <div className="report-stat">
                            <span className="stat-number">₩48.5M</span>
                            <span className="stat-label">Total Revenue</span>
                        </div>
                        <div className="report-stat">
                            <span className="stat-number">98.7%</span>
                            <span className="stat-label">Completion Rate</span>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle subtitle="Last 30 days">Sitter Performance</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="report-stat">
                            <span className="stat-number">4.87</span>
                            <span className="stat-label">Average Rating</span>
                        </div>
                        <div className="report-stat">
                            <span className="stat-number">12</span>
                            <span className="stat-label">Active Sitters</span>
                        </div>
                        <div className="report-stat">
                            <span className="stat-number">3.2 hrs</span>
                            <span className="stat-label">Avg Session Duration</span>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle subtitle="By nationality">Guest Demographics</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="demo-chart">
                            <div className="demo-bar" style={{ width: '60%', background: 'var(--primary-400)' }}>🇰🇷 Korean 36%</div>
                            <div className="demo-bar" style={{ width: '50%', background: 'var(--gold-500)' }}>🇺🇸 American 28%</div>
                            <div className="demo-bar" style={{ width: '40%', background: 'var(--success-500)' }}>🇯🇵 Japanese 22%</div>
                            <div className="demo-bar" style={{ width: '25%', background: 'var(--warning-500)' }}>🇨🇳 Chinese 14%</div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

// Styles
const reportStyles = `
.reports-page { max-width: 1400px; margin: 0 auto; }
.reports-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-6); }
.report-stat { display: flex; flex-direction: column; margin-bottom: var(--space-4); }
.stat-number { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--primary-400); }
.stat-label { font-size: var(--text-sm); color: var(--text-tertiary); }
.demo-chart { display: flex; flex-direction: column; gap: var(--space-2); }
.demo-bar { padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); color: white; font-size: var(--text-sm); }
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = reportStyles; document.head.appendChild(s);
}
