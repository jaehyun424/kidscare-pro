// ============================================
// KidsCare Pro - Live Monitor Page
// ============================================


import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { TierBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ChatPanel } from '../../components/common/ChatPanel';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton, SkeletonCircle, SkeletonText } from '../../components/common/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { useHotelSessions } from '../../hooks/useSessions';
import '../../styles/pages/hotel-live-monitor.css';

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
  const { t } = useTranslation();
  const { user } = useAuth();
  const { sessions, isLoading } = useHotelSessions(user?.hotelId);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState<{ id: string; name: string } | null>(null);

  const handleContactSitter = (sitterName: string) => {
    setChatTarget({ id: `sitter-${sitterName}`, name: sitterName });
    setChatOpen(true);
  };

  if (isLoading) {
    return (
      <div className="live-monitor-page animate-fade-in">
        <div className="page-header">
          <div>
            <Skeleton width="60%" height="2rem" />
            <Skeleton width="40%" height="1rem" className="mt-2" />
          </div>
          <Skeleton width="160px" height="40px" borderRadius="var(--radius-sm)" />
        </div>
        <div className="sessions-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card">
              <div className="flex gap-4 items-center">
                <SkeletonCircle size={48} />
                <div style={{ flex: 1 }}>
                  <Skeleton width="50%" height="1.25rem" />
                  <Skeleton width="30%" height="0.875rem" className="mt-2" />
                </div>
                <Skeleton width="60px" height="1rem" />
              </div>
              <div className="mt-4">
                <SkeletonText lines={3} />
              </div>
              <div className="flex gap-2 mt-4">
                <Skeleton width="120px" height="32px" borderRadius="var(--radius-sm)" />
                <Skeleton width="100px" height="32px" borderRadius="var(--radius-sm)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="live-monitor-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {t('nav.liveMonitor')}
            <span className="live-indicator" role="status" aria-label="Live monitoring active">
              <span className="live-dot" aria-hidden="true" />
              {t('hotel.live')}
            </span>
          </h1>
          <p className="page-subtitle">{t('hotel.activeSessionsNow', { count: sessions.length })}</p>
        </div>
        <Button variant="danger" icon={<AlertIcon />}>
          {t('hotel.emergencyProtocol')}
        </Button>
      </div>

      {sessions.length > 0 ? (
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
                  <div className="session-room">{t('common.room')} {session.room}</div>
                </div>
                <div className="session-time">
                  <span className="elapsed">{session.elapsed}</span>
                  <span className="last-update">{t('hotel.updated')} {session.lastUpdate}</span>
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
                  ⚡ {session.vitals.energy} {t('hotel.energy')}
                </span>
              </div>

              {/* Activity Timeline */}
              <div className="activity-timeline">
                <h4>{t('hotel.recentActivity')}</h4>
                {session.activities.slice(0, 3).map((activity, i) => (
                  <div key={i} className="activity-item">
                    <span className="activity-time">{activity.time}</span>
                    <span className="activity-text">{activity.activity}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="session-actions">
                <Button variant="ghost" size="sm" icon={<PhoneIcon />} onClick={() => handleContactSitter(session.sitter.name)}>
                  {t('hotel.contactSitter')}
                </Button>
                <Button variant="secondary" size="sm">
                  {t('hotel.viewDetails')}
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      ) : (
        <EmptyState
          icon="📡"
          title={t('hotel.noActiveSessions', 'No active sessions')}
          description={t('hotel.noActiveSessionsDesc', 'Active childcare sessions will appear here in real time.')}
        />
      )}

      {/* Chat Panel */}
      <ChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        otherUserId={chatTarget?.id}
        otherUserName={chatTarget?.name}
      />
    </div>
  );
}
