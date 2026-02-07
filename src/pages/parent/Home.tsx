// ============================================
// KidsCare Pro - Parent Home Page
// ============================================

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/Badge';



export default function Home() {
  const { t, i18n } = useTranslation();

  const UPCOMING_BOOKING = {
    id: '1',
    confirmationCode: 'KCP-2025-0042',
    dateKey: 'tonight',
    time: '18:00 - 22:00',
    hotel: 'Grand Hyatt Seoul',
    room: '2305',
    sitter: { name: 'Kim Minjung', rating: 4.9 },
    children: ['Emma (' + t('common.yearsOld', { count: 5 }) + ')'],
    status: 'confirmed' as const,
  };

  const RECENT_SESSIONS = [
    {
      id: '1',
      date: new Date('2025-01-10'),
      hotel: 'Grand Hyatt Seoul',
      duration: t('common.hours', { count: 4 }), // Requires plural handling or simple string replacement
      rating: 5
    },
    {
      id: '2',
      date: new Date('2024-12-28'),
      hotel: 'Park Hyatt Busan',
      duration: t('common.hours', { count: 3 }),
      rating: 5
    },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  // Get time of day for greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('parent.morning');
    if (hour < 18) return t('parent.afternoon');
    return t('parent.evening');
  };

  return (
    <div className="parent-home animate-fade-in">
      {/* Welcome */}
      <div className="welcome-section">
        <h1>{t('parent.greeting', { timeOfDay: getTimeOfDay(), name: 'Sarah' })} 👋</h1>
        <p>{t('parent.childcareHandled')}</p>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/parent/book" className="quick-action-btn">
          <span className="icon">📅</span>
          <span>{t('parent.bookNow')}</span>
        </Link>
        <Link to="/parent/history" className="quick-action-btn">
          <span className="icon">📋</span>
          <span>{t('nav.history')}</span>
        </Link>
        <Link to="/parent/profile" className="quick-action-btn">
          <span className="icon">👶</span>
          <span>{t('parent.children')}</span>
        </Link>
      </div>

      {/* Upcoming Booking */}
      {UPCOMING_BOOKING && (
        <Card className="upcoming-card" variant="gold">
          <CardBody>
            <div className="upcoming-header">
              <h3>{t('parent.upcomingBooking')}</h3>
              <StatusBadge status={UPCOMING_BOOKING.status} />
            </div>
            <div className="upcoming-details">
              <span>📅</span>
              <span>{t('parent.tonight')} • {UPCOMING_BOOKING.time}</span>
              <div className="detail-row">
                <span>🏨</span>
                <span>{UPCOMING_BOOKING.hotel} - {t('common.room')} {UPCOMING_BOOKING.room}</span>
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
                  {t('parent.trustCheckIn')}
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Recent Sessions */}
      <div className="section">
        <h2 className="section-title">{t('parent.recentSessions')}</h2>
        {RECENT_SESSIONS.map((session) => (
          <Card key={session.id} className="session-card">
            <CardBody>
              <div className="session-info">
                <div>
                  <span className="session-date">{formatDate(session.date)}</span>
                  <span className="session-hotel">{session.hotel}</span>
                </div>
                <div className="session-meta">
                  <span>{session.duration.replace('hours', t('common.hours1', { defaultValue: 'hours' }))}</span>
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
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.welcome-section {
  margin-bottom: 3rem;
  text-align: center;
}

.welcome-section h1 {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--charcoal-900);
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: var(--charcoal-600);
  font-size: 1.125rem;
}

/* Quick Actions - Paper Buttons */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  background: white;
  border: 1px solid var(--cream-300);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--charcoal-900);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.quick-action-btn:hover {
  transform: translateY(-4px);
  border-color: var(--gold-300);
  box-shadow: var(--shadow-gold);
}

.quick-action-btn .icon {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.quick-action-btn span:last-child {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--charcoal-700);
}

/* Upcoming Card - Gold Accent */
.upcoming-card {
  margin-bottom: 3rem;
  border: 1px solid var(--gold-200) !important;
  background: linear-gradient(to bottom right, #FFFAF0, #FFF) !important;
  position: relative;
  overflow: hidden;
}

.upcoming-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--gold-500);
}

.upcoming-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--gold-200);
}

.upcoming-header h3 {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--charcoal-900);
  margin: 0;
}

.upcoming-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: var(--charcoal-700);
}

.detail-row span:first-child {
  font-size: 1.1rem;
  width: 24px;
  text-align: center;
}

.upcoming-actions {
  margin-top: 1rem;
}

/* Section Titles */
.section-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--charcoal-900);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--cream-300);
}

/* Recent Sessions */
.session-card {
  margin-bottom: 1rem;
  background: white !important;
  border: 1px solid var(--cream-300) !important;
  transition: all 0.2s;
}

.session-card:hover {
  background: var(--cream-50) !important;
  border-color: var(--cream-400) !important;
}

.session-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.session-date {
  display: block;
  font-weight: 600;
  color: var(--charcoal-900);
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.session-hotel {
  display: block;
  font-size: 0.875rem;
  color: var(--charcoal-500);
}

.session-meta {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.session-meta span:first-child {
  font-size: 0.875rem;
  color: var(--charcoal-600);
  font-weight: 500;
}

.session-meta span:last-child {
  font-size: 0.8rem;
}
`;

if (typeof document !== 'undefined') {
  const s = document.createElement('style'); s.textContent = homeStyles; document.head.appendChild(s);
}
