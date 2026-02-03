// ============================================
// KidsCare Pro - Live Monitor Page
// ============================================

import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { TierBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

const ACTIVE_SESSIONS = [
    {
        id: '1',
        sitter: { name: 'Park Sooyeon', tier: 'gold' as const },
        room: '1102',
        children: [{ name: 'Sota', age: 3 }, { name: 'Yui', age: 6 }],
        startTime: '19:00',
        elapsed: '2h 15m',
        lastUpdate: '2 min ago',
        activities: [
            { time: '21:10', activity: 'Playing with blocks', type: 'play' },
            { time: '20:30', activity: 'Snack time - Apple slices', type: 'food' },
            { time: '19:45', activity: 'Trust check-in completed', type: 'checkin' },
            { time: '19:00', activity: 'Session started', type: 'start' },
        ],
        vitals: { mood: 'happy', energy: 'high' },
    },
    {
        id: '2',
        sitter: { name: 'Lee Jihye', tier: 'silver' as const },
        room: '2201',
        children: [{ name: 'Mia', age: 5 }],
        startTime: '18:30',
        elapsed: '2h 45m',
        lastUpdate: '5 min ago',
        activities: [
            { time: '21:05', activity: 'Drawing and coloring', type: 'play' },
            { time: '20:00', activity: 'Snack time - Cookie', type: 'food' },
            { time: '18:45', activity: 'Trust check-in completed', type: 'checkin' },
            { time: '18:30', activity: 'Session started', type: 'start' },
        ],
        vitals: { mood: 'calm', energy: 'medium' },
    },
    {
        id: '3',
        sitter: { name: 'Choi Yuna', tier: 'gold' as const },
        room: '1508',
        children: [{ name: 'Noah', age: 7 }],
        startTime: '17:00',
        elapsed: '4h 15m',
        lastUpdate: '1 min ago',
        activities: [
            { time: '21:12', activity: 'Reading books', type: 'education' },
            { time: '20:00', activity: 'Dinner - Ordered room service', type: 'food' },
            { time: '19:00', activity: 'Homework assistance', type: 'education' },
            { time: '17:15', activity: 'Trust check-in completed', type: 'checkin' },
        ],
        vitals: { mood: 'focused', energy: 'medium' },
    },
];

// Icons
const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

const AlertIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

export default function LiveMonitor() {
    return (
        <div className="live-monitor-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        Live Monitor
                        <span className="live-indicator">
                            <span className="live-dot" />
                            LIVE
                        </span>
                    </h1>
                    <p className="page-subtitle">{ACTIVE_SESSIONS.length} active sessions right now</p>
                </div>
                <Button variant="danger" icon={<AlertIcon />}>
                    Emergency Protocol
                </Button>
            </div>

            <div className="sessions-grid">
                {ACTIVE_SESSIONS.map((session) => (
                    <Card key={session.id} className="session-card">
                        <CardHeader>
                            <div className="session-header">
                                <Avatar name={session.sitter.name} size="lg" variant={session.sitter.tier === 'gold' ? 'gold' : 'default'} />
                                <div className="session-info">
                                    <div className="session-sitter">
                                        <span className="sitter-name">{session.sitter.name}</span>
                                        <TierBadge tier={session.sitter.tier} />
                                    </div>
                                    <div className="session-room">Room {session.room}</div>
                                </div>
                                <div className="session-time">
                                    <span className="elapsed">{session.elapsed}</span>
                                    <span className="last-update">Updated {session.lastUpdate}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {/* Children */}
                            <div className="children-list">
                                {session.children.map((child, i) => (
                                    <div key={i} className="child-tag">
                                        👶 {child.name} ({child.age}y)
                                    </div>
                                ))}
                            </div>

                            {/* Vitals */}
                            <div className="vitals-row">
                                <span className="vital">
                                    😊 {session.vitals.mood}
                                </span>
                                <span className="vital">
                                    ⚡ {session.vitals.energy} energy
                                </span>
                            </div>

                            {/* Activity Timeline */}
                            <div className="activity-timeline">
                                <h4>Recent Activity</h4>
                                {session.activities.slice(0, 3).map((activity, i) => (
                                    <div key={i} className="activity-item">
                                        <span className="activity-time">{activity.time}</span>
                                        <span className="activity-text">{activity.activity}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="session-actions">
                                <Button variant="ghost" size="sm" icon={<PhoneIcon />}>
                                    Contact Sitter
                                </Button>
                                <Button variant="secondary" size="sm">
                                    View Details
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Styles
const liveMonitorStyles = `
.live-monitor-page {
  max-width: 1400px;
  margin: 0 auto;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: var(--space-3);
  padding: var(--space-1) var(--space-3);
  background: rgba(239, 68, 68, 0.15);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: var(--error-500);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: var(--error-500);
  border-radius: 50%;
  animation: pulse 2s ease infinite;
}

.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--space-6);
}

@media (max-width: 480px) {
  .sessions-grid {
    grid-template-columns: 1fr;
  }
}

.session-card {
  border: 2px solid var(--border-color);
  transition: border-color var(--transition-fast);
}

.session-card:hover {
  border-color: var(--primary-400);
}

.session-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.session-info {
  flex: 1;
}

.session-sitter {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.session-sitter .sitter-name {
  font-weight: var(--font-semibold);
}

.session-room {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.session-time {
  text-align: right;
}

.session-time .elapsed {
  display: block;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--primary-400);
}

.session-time .last-update {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.children-list {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin-bottom: var(--space-4);
}

.child-tag {
  padding: var(--space-1) var(--space-3);
  background: var(--glass-bg);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
}

.vitals-row {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.vital {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-transform: capitalize;
}

.activity-timeline {
  padding: var(--space-4);
  background: var(--glass-bg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
}

.activity-timeline h4 {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}

.activity-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--border-color);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-time {
  font-size: var(--text-xs);
  font-family: monospace;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.activity-text {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.session-actions {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = liveMonitorStyles;
    document.head.appendChild(styleSheet);
}
