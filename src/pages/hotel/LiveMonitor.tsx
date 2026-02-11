// ============================================
// KidsCare Pro - Live Monitor Page
// ============================================


import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { TierBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useHotelSessions } from '../../hooks/useSessions';

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
  const { user } = useAuth();
  const { sessions } = useHotelSessions(user?.hotelId);

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
          <p className="page-subtitle">{sessions.length} active sessions right now</p>
        </div>
        <Button variant="danger" icon={<AlertIcon />}>
          Emergency Protocol
        </Button>
      </div>

      <div className="sessions-grid">
        {sessions.map((session) => (
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
  max-width: 1600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--cream-300);
}

.page-title {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--charcoal-900);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: var(--error-50);
  border: 1px solid var(--error-200);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--error-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-sans);
}

.live-dot {
  width: 6px;
  height: 6px;
  background: var(--error-500);
  border-radius: 50%;
  animation: pulse 2s ease infinite;
}

.page-subtitle {
  color: var(--charcoal-600);
  font-size: 1.125rem;
}

.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

@media (max-width: 640px) {
  .sessions-grid {
    grid-template-columns: 1fr;
  }
}

/* Session Card - Paper Style */
.session-card {
  background: white !important;
  border: 1px solid var(--cream-300) !important;
  transition: all 0.3s ease;
  height: 100%;
}

.session-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--gold-300) !important;
}

.session-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.session-info {
  flex: 1;
}

.session-sitter {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sitter-name {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--charcoal-900);
}

.session-room {
  font-size: 0.875rem;
  color: var(--charcoal-500);
  margin-top: 0.25rem;
}

.session-time {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.session-time .elapsed {
  display: block;
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gold-600);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.session-time .last-update {
  font-size: 0.75rem;
  color: var(--charcoal-400);
  font-weight: 500;
}

/* Children Tags */
.children-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.child-tag {
  padding: 0.25rem 0.75rem;
  background: var(--cream-100);
  border: 1px solid var(--cream-300);
  border-radius: 9999px;
  font-size: 0.875rem;
  color: var(--charcoal-700);
  font-weight: 500;
}

/* Vitals */
.vitals-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--cream-50);
  border-radius: var(--radius-sm);
  border: 1px dashed var(--cream-200);
}

.vital {
  font-size: 0.875rem;
  color: var(--charcoal-700);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: capitalize;
}

/* Timeline */
.activity-timeline {
  margin-bottom: 1.5rem;
}

.activity-timeline h4 {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--charcoal-400);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--cream-200);
  position: relative;
}

.activity-item::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  width: 4px;
  height: 4px;
  background: var(--cream-300);
  border-radius: 50%;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-time {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--charcoal-500);
  flex-shrink: 0;
  width: 50px;
}

.activity-text {
  font-size: 0.9rem;
  color: var(--charcoal-800);
}

/* Actions */
.session-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  border-top: 1px solid var(--cream-200);
  padding-top: 1rem;
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = liveMonitorStyles;
  document.head.appendChild(styleSheet);
}
