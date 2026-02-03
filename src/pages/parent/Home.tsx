// ============================================
// KidsCare Pro - Parent Home Page
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/Badge';

const UPCOMING_BOOKING = {
    id: '1',
    confirmationCode: 'KCP-2025-0042',
    date: 'Tonight',
    time: '18:00 - 22:00',
    hotel: 'Grand Hyatt Seoul',
    room: '2305',
    sitter: { name: 'Kim Minjung', rating: 4.9 },
    children: ['Emma (5y)'],
    status: 'confirmed' as const,
};

const RECENT_SESSIONS = [
    { id: '1', date: 'Jan 10, 2025', hotel: 'Grand Hyatt Seoul', duration: '4 hours', rating: 5 },
    { id: '2', date: 'Dec 28, 2024', hotel: 'Park Hyatt Busan', duration: '3 hours', rating: 5 },
];

export default function Home() {
    return (
        <div className="parent-home animate-fade-in">
            {/* Welcome */}
            <div className="welcome-section">
                <h1>Good Evening, Sarah! 👋</h1>
                <p>Your childcare is handled with care.</p>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <Link to="/parent/book" className="quick-action-btn">
                    <span className="icon">📅</span>
                    <span>Book Now</span>
                </Link>
                <Link to="/parent/history" className="quick-action-btn">
                    <span className="icon">📋</span>
                    <span>History</span>
                </Link>
                <Link to="/parent/profile" className="quick-action-btn">
                    <span className="icon">👶</span>
                    <span>Children</span>
                </Link>
            </div>

            {/* Upcoming Booking */}
            {UPCOMING_BOOKING && (
                <Card className="upcoming-card" variant="gold">
                    <CardBody>
                        <div className="upcoming-header">
                            <h3>Upcoming Booking</h3>
                            <StatusBadge status={UPCOMING_BOOKING.status} />
                        </div>
                        <div className="upcoming-details">
                            <div className="detail-row">
                                <span>📅</span>
                                <span>{UPCOMING_BOOKING.date} • {UPCOMING_BOOKING.time}</span>
                            </div>
                            <div className="detail-row">
                                <span>🏨</span>
                                <span>{UPCOMING_BOOKING.hotel} - Room {UPCOMING_BOOKING.room}</span>
                            </div>
                            <div className="detail-row">
                                <span>👩‍🍼</span>
                                <span>{UPCOMING_BOOKING.sitter.name} ⭐ {UPCOMING_BOOKING.sitter.rating}</span>
                            </div>
                            <div className="detail-row">
                                <span>👶</span>
                                <span>{UPCOMING_BOOKING.children.join(', ')}</span>
                            </div>
                        </div>
                        <div className="upcoming-actions">
                            <Link to={`/parent/trust-checkin/${UPCOMING_BOOKING.id}`}>
                                <Button variant="gold" fullWidth>
                                    Trust Check-In
                                </Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Recent Sessions */}
            <div className="section">
                <h2 className="section-title">Recent Sessions</h2>
                {RECENT_SESSIONS.map((session) => (
                    <Card key={session.id} className="session-card">
                        <CardBody>
                            <div className="session-info">
                                <div>
                                    <span className="session-date">{session.date}</span>
                                    <span className="session-hotel">{session.hotel}</span>
                                </div>
                                <div className="session-meta">
                                    <span>{session.duration}</span>
                                    <span>{'⭐'.repeat(session.rating)}</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Styles
const homeStyles = `
.parent-home {
  padding-bottom: var(--space-6);
}

.welcome-section {
  margin-bottom: var(--space-6);
}

.welcome-section h1 {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-1);
}

.welcome-section p {
  color: var(--text-secondary);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--glass-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: var(--text-primary);
  transition: all var(--transition-fast);
}

.quick-action-btn:hover {
  background: var(--glass-border);
  transform: translateY(-2px);
}

.quick-action-btn .icon {
  font-size: 1.5rem;
}

.quick-action-btn span:last-child {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.upcoming-card {
  margin-bottom: var(--space-6);
}

.upcoming-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.upcoming-header h3 {
  font-weight: var(--font-semibold);
}

.upcoming-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.detail-row {
  display: flex;
  gap: var(--space-3);
  font-size: var(--text-sm);
}

.upcoming-actions {
  display: flex;
  gap: var(--space-3);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-4);
}

.session-card {
  margin-bottom: var(--space-3);
}

.session-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-date {
  display: block;
  font-weight: var(--font-medium);
}

.session-hotel {
  display: block;
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.session-meta {
  text-align: right;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = homeStyles; document.head.appendChild(s);
}
