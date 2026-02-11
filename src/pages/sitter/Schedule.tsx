// Sitter Schedule Page

import { useTranslation } from 'react-i18next';
import { Card, CardBody } from '../../components/common/Card';
import { StatusBadge, TierBadge, SafetyBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useSitterBookings } from '../../hooks/useBookings';
import { useSitterStats } from '../../hooks/useSitters';

export default function Schedule() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const sitterId = user?.sitterInfo?.sitterId || user?.id;
    const { todaySessions, weekSchedule } = useSitterBookings(sitterId);
    const { stats } = useSitterStats(sitterId);

    return (
        <div className="sitter-schedule animate-fade-in">
            {/* Stats */}
            <div className="stats-row">
                <div className="stat-item">
                    <span className="stat-value">{stats.totalSessions}</span>
                    <span className="stat-label">{t('hotel.sessions')}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{stats.avgRating}</span>
                    <span className="stat-label">{t('common.rating')}</span>
                </div>
                <div className="stat-item gold">
                    <TierBadge tier={stats.tier} />
                </div>
            </div>

            <SafetyBadge days={stats.safetyDays} />

            {/* Today's Schedule */}
            <h2 className="section-title">{t('sitter.todaySchedule')}</h2>
            {todaySessions.length > 0 ? (
                <div className="sessions-list">
                    {todaySessions.map((session) => (
                        <Card key={session.id}>
                            <CardBody>
                                <div className="session-header">
                                    <span className="session-time">{session.time}</span>
                                    <StatusBadge status={session.status} />
                                </div>
                                <div className="session-info">
                                    <span>🏨 {session.hotel} - {t('common.room')} {session.room}</span>
                                    <span>👶 {session.children.join(', ')}</span>
                                </div>
                                <div className="session-actions">
                                    {session.status === 'confirmed' && (
                                        <Button variant="gold" fullWidth>{t('sitter.startSession')}</Button>
                                    )}
                                    {session.status === 'pending' && (
                                        <Button variant="secondary" fullWidth disabled>{t('status.pending')}</Button>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card><CardBody><p className="no-sessions">{t('sitter.noSessionsToday')}</p></CardBody></Card>
            )}

            {/* Week View */}
            <h2 className="section-title">{t('sitter.thisWeek')}</h2>
            <div className="week-grid">
                {weekSchedule.map((day, i) => (
                    <div key={i} className={`day-item ${day.sessions > 0 ? 'has-sessions' : ''}`}>
                        <span className="day-date">{day.date}</span>
                        <span className="day-count">{day.sessions > 0 ? day.sessions : '-'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Styles
const scheduleStyles = `
.sitter-schedule { max-width: 480px; margin: 0 auto; }

.stats-row {
  display: flex;
  justify-content: space-around;
  padding: var(--space-4);
  background: var(--glass-bg);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-4);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--primary-400);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.stat-item.gold { display: flex; align-items: center; }

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin: var(--space-6) 0 var(--space-4);
}

.sessions-list { display: flex; flex-direction: column; gap: var(--space-3); }

.session-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.session-time { font-weight: var(--font-semibold); }

.session-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
}

.no-sessions { text-align: center; color: var(--text-tertiary); }

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-2);
}

.day-item {
  text-align: center;
  padding: var(--space-3);
  background: var(--glass-bg);
  border-radius: var(--radius-md);
  opacity: 0.5;
}

.day-item.has-sessions { opacity: 1; }

.day-date { display: block; font-size: var(--text-xs); color: var(--text-tertiary); }
.day-count { display: block; font-size: var(--text-lg); font-weight: var(--font-bold); margin-top: var(--space-1); }

.has-sessions .day-count { color: var(--primary-400); }
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = scheduleStyles; document.head.appendChild(s);
}
