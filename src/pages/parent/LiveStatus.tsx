// Parent Live Status Page
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { TierBadge } from '../../components/common/Badge';

export default function LiveStatus() {
    const { bookingId } = useParams();

    return (
        <div className="live-status animate-fade-in">
            {/* Status Banner */}
            <div className="status-banner">
                <div className="status-indicator">
                    <span className="pulse-dot" />
                    <span>Session Active</span>
                </div>
                <div className="elapsed-time">2h 15m</div>
            </div>

            {/* Sitter Info */}
            <Card className="sitter-card">
                <CardBody>
                    <div className="sitter-header">
                        <Avatar name="Kim Minjung" size="lg" variant="gold" />
                        <div className="sitter-info">
                            <h3>Kim Minjung</h3>
                            <TierBadge tier="gold" />
                            <span className="rating">⭐ 4.9 Rating</span>
                        </div>
                        <Button variant="gold" size="sm">Call</Button>
                    </div>
                </CardBody>
            </Card>

            {/* Current Status */}
            <Card>
                <CardBody>
                    <h3 className="section-title">Current Activity</h3>
                    <div className="current-activity">
                        <span className="activity-icon">🎨</span>
                        <div className="activity-info">
                            <span className="activity-name">Arts & Crafts</span>
                            <span className="activity-time">Since 9:30 PM</span>
                        </div>
                    </div>
                    <div className="mood-status">
                        <span>😊 Happy</span>
                        <span>⚡ High Energy</span>
                    </div>
                </CardBody>
            </Card>

            {/* Activity Timeline */}
            <Card>
                <CardBody>
                    <h3 className="section-title">Activity Timeline</h3>
                    <div className="timeline">
                        {[
                            { time: '9:30 PM', activity: 'Started arts & crafts', icon: '🎨' },
                            { time: '9:00 PM', activity: 'Snack time - Apple slices', icon: '🍎' },
                            { time: '8:30 PM', activity: 'Playing with blocks', icon: '🧱' },
                            { time: '7:45 PM', activity: 'Trust check-in completed', icon: '✅' },
                            { time: '7:00 PM', activity: 'Session started', icon: '🚀' },
                        ].map((item, i) => (
                            <div key={i} className="timeline-item">
                                <span className="timeline-icon">{item.icon}</span>
                                <div className="timeline-content">
                                    <span className="timeline-activity">{item.activity}</span>
                                    <span className="timeline-time">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Emergency Actions */}
            <div className="emergency-actions">
                <Button variant="danger" fullWidth>
                    🚨 Emergency Contact
                </Button>
                <Link to="/parent">
                    <Button variant="secondary" fullWidth>
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}

// Styles
const liveStyles = `
.live-status { max-width: 480px; margin: 0 auto; }

.status-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1));
  border: 1px solid var(--success-500);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-4);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: var(--font-semibold);
  color: var(--success-500);
}

.pulse-dot {
  width: 12px;
  height: 12px;
  background: var(--success-500);
  border-radius: 50%;
  animation: pulse 2s ease infinite;
}

.elapsed-time {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--success-500);
}

.sitter-card { margin-bottom: var(--space-4); }

.sitter-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.sitter-info { flex: 1; }
.sitter-info h3 { font-weight: var(--font-semibold); }
.sitter-info .rating { display: block; font-size: var(--text-sm); color: var(--text-tertiary); }

.section-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: var(--space-4);
}

.current-activity {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.activity-icon { font-size: 2.5rem; }
.activity-name { display: block; font-size: var(--text-lg); font-weight: var(--font-semibold); }
.activity-time { font-size: var(--text-sm); color: var(--text-tertiary); }

.mood-status {
  display: flex;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
}

.timeline-icon { font-size: 1.25rem; }
.timeline-content { flex: 1; display: flex; justify-content: space-between; }
.timeline-activity { font-size: var(--text-sm); }
.timeline-time { font-size: var(--text-xs); color: var(--text-tertiary); }

.emergency-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-6);
}
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = liveStyles; document.head.appendChild(s);
}
