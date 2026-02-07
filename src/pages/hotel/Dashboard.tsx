// ============================================
// KidsCare Pro - Hotel Dashboard
// ============================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, StatusBadge, TierBadge, SafetyBadge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Skeleton } from '../../components/common/Skeleton';

// ----------------------------------------
// Demo Data
// ----------------------------------------
const DEMO_STATS = {
  todayBookings: 12,
  activeNow: 3,
  completedToday: 8,
  todayRevenue: 4850000,
  safetyDays: 127,
  pendingBookings: 4,
};

const DEMO_TODAY_BOOKINGS = [
  {
    id: '1',
    confirmationCode: 'KCP-2025-0042',
    time: '18:00 - 22:00',
    room: '2305',
    parent: 'Sarah Johnson',
    children: [{ name: 'Emma', age: 5 }],
    sitter: { name: 'Kim Minjung', tier: 'gold' as const },
    status: 'confirmed' as const,
  },
  {
    id: '2',
    confirmationCode: 'KCP-2025-0043',
    time: '19:00 - 23:00',
    room: '1102',
    parent: 'Tanaka Yuki',
    children: [{ name: 'Sota', age: 3 }, { name: 'Yui', age: 6 }],
    sitter: { name: 'Park Sooyeon', tier: 'gold' as const },
    status: 'in_progress' as const,
  },
  {
    id: '3',
    confirmationCode: 'KCP-2025-0044',
    time: '20:00 - 24:00',
    room: '3501',
    parent: 'Michael Chen',
    children: [{ name: 'Lucas', age: 4 }],
    sitter: null,
    status: 'pending' as const,
  },
];

const DEMO_ACTIVE_SESSIONS = [
  {
    id: '1',
    sitter: { name: 'Park Sooyeon', avatar: null, tier: 'gold' as const },
    room: '1102',
    children: 'Sota (3), Yui (6)',
    startTime: '19:00',
    elapsed: '2h 15m',
    lastActivity: 'Playing with blocks',
    status: 'active' as const,
  },
  {
    id: '2',
    sitter: { name: 'Lee Jihye', avatar: null, tier: 'silver' as const },
    room: '2201',
    children: 'Mia (5)',
    startTime: '18:30',
    elapsed: '2h 45m',
    lastActivity: 'Snack time',
    status: 'active' as const,
  },
  {
    id: '3',
    sitter: { name: 'Choi Yuna', avatar: null, tier: 'gold' as const },
    room: '1508',
    children: 'Noah (7)',
    startTime: '17:00',
    elapsed: '4h 15m',
    lastActivity: 'Reading books',
    status: 'active' as const,
  },
];

// ----------------------------------------
// Icons
// ----------------------------------------
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
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

const CurrencyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </svg>
);

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
  const colorClasses = {
    primary: 'stat-card-primary',
    gold: 'stat-card-gold',
    success: 'stat-card-success',
    warning: 'stat-card-warning',
  };

  return (
    <div className={`stat-card ${colorClasses[color]}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
        {subValue && <div className="stat-card-sub">{subValue}</div>}
      </div>
    </div>
  );
}

// ----------------------------------------
// Main Component
// ----------------------------------------
export default function Dashboard() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="dashboard animate-fade-in">
        <div className="dashboard-header">
          <Skeleton width="200px" height="2rem" />
          <Skeleton width="120px" height="40px" />
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="100px" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard animate-fade-in">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">{t('nav.dashboard')}</h1>
          <p className="dashboard-subtitle">{t('hotel.todayOverview')}</p>
        </div>
        <Button variant="gold" icon={<PlusIcon />}>
          {t('hotel.newBooking')}
        </Button>
      </div>

      {/* Safety Record Banner */}
      <div className="safety-banner animate-fade-in-up">
        <div className="safety-banner-content">
          <SafetyBadge days={DEMO_STATS.safetyDays} />
          <span className="safety-banner-text">
            Congratulations! Your hotel maintains an excellent safety record.
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid animate-fade-in-up stagger-1">
        <StatCard
          icon={<CalendarIcon />}
          label={t('hotel.totalBookings')}
          value={DEMO_STATS.todayBookings}
          subValue={`${DEMO_STATS.pendingBookings} ${t('status.pending').toLowerCase()}`}
          color="primary"
        />
        <StatCard
          icon={<LiveIcon />}
          label={t('hotel.activeSessions')}
          value={DEMO_STATS.activeNow}
          subValue={t('status.inProgress')}
          color="warning"
        />
        <StatCard
          icon={<CheckIcon />}
          label={t('status.completed')}
          value={DEMO_STATS.completedToday}
          color="success"
        />
        <StatCard
          icon={<CurrencyIcon />}
          label={t('hotel.totalRevenue')}
          value={formatCurrency(DEMO_STATS.todayRevenue)}
          color="gold"
        />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Today's Bookings */}
        <Card className="animate-fade-in-up stagger-2">
          <CardHeader action={
            <Link to="/hotel/bookings" className="card-link">
              {t('parent.viewAll')} <ArrowRightIcon />
            </Link>
          }>
            <CardTitle subtitle="Upcoming and in-progress bookings">
              Today's Bookings
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="booking-list">
              {DEMO_TODAY_BOOKINGS.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-item-main">
                    <div className="booking-item-header">
                      <span className="booking-code">{booking.confirmationCode}</span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="booking-item-details">
                      <span>🕐 {booking.time}</span>
                      <span>🚪 Room {booking.room}</span>
                      <span>👤 {booking.parent}</span>
                    </div>
                    <div className="booking-item-children">
                      {booking.children.map((child, i) => (
                        <Badge key={i} variant="neutral" size="sm">
                          {child.name} ({child.age}y)
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="booking-item-sitter">
                    {booking.sitter ? (
                      <>
                        <Avatar name={booking.sitter.name} size="sm" variant={booking.sitter.tier === 'gold' ? 'gold' : 'default'} />
                        <div className="sitter-info">
                          <span className="sitter-name">{booking.sitter.name}</span>
                          <TierBadge tier={booking.sitter.tier} />
                        </div>
                      </>
                    ) : (
                      <Button variant="secondary" size="sm">
                        {t('hotel.assign')}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Live Monitor Preview */}
        <Card className="animate-fade-in-up stagger-3">
          <CardHeader action={
            <Link to="/hotel/live" className="card-link">
              {t('nav.liveMonitor')} <ArrowRightIcon />
            </Link>
          }>
            <CardTitle subtitle={t('hotel.recentActivity')}>
              <span className="flex items-center gap-2">
                {t('nav.liveMonitor')}
                <span className="status-dot status-dot-success" />
              </span>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="live-list">
              {DEMO_ACTIVE_SESSIONS.map((session) => (
                <div key={session.id} className="live-item">
                  <div className="live-item-header">
                    <Avatar name={session.sitter.name} size="sm" variant={session.sitter.tier === 'gold' ? 'gold' : 'default'} />
                    <div className="live-item-info">
                      <span className="live-item-name">{session.sitter.name}</span>
                      <span className="live-item-room">Room {session.room}</span>
                    </div>
                    <div className="live-item-time">
                      <span className="live-item-elapsed">{session.elapsed}</span>
                      <span className="live-item-start">Started {session.startTime}</span>
                    </div>
                  </div>
                  <div className="live-item-activity">
                    <span className="status-dot status-dot-success" />
                    {session.lastActivity}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

// ----------------------------------------
// Styles
// ----------------------------------------
const dashboardStyles = `
.dashboard {
  max-width: 1600px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--cream-300);
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--charcoal-900);
}

.dashboard-subtitle {
  color: var(--charcoal-600);
  font-size: 1.125rem;
}

/* Safety Banner */
.safety-banner {
  background: white;
  border: 1px solid var(--success-500);
  border-left: 4px solid var(--success-500);
  border-radius: var(--radius-md);
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.safety-banner-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.safety-banner-text {
  color: var(--success-500);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: white;
  border: 1px solid var(--cream-300);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--gold-300);
}

.stat-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.stat-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--cream-50);
  color: var(--charcoal-500);
}

.stat-card-primary .stat-card-icon { color: var(--charcoal-900); background: var(--cream-200); }
.stat-card-gold .stat-card-icon { color: var(--gold-600); background: var(--gold-100); }
.stat-card-success .stat-card-icon { color: var(--success-500); background: var(--success-bg); }
.stat-card-warning .stat-card-icon { color: var(--warning-500); background: var(--warning-bg); }

.stat-card-value {
  font-size: 2.5rem;
  font-family: var(--font-serif);
  font-weight: 500;
  line-height: 1;
  color: var(--charcoal-900);
  margin-bottom: 0.25rem;
}

.stat-card-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--charcoal-500);
  font-weight: 600;
}

.stat-card-sub {
  font-size: 0.875rem;
  color: var(--charcoal-400);
  margin-top: 0.5rem;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.card-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gold-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.2s;
}

.card-link:hover {
  color: var(--gold-500);
  text-decoration: underline;
}

/* Booking List */
.booking-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.booking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border-bottom: 1px solid var(--cream-200);
  transition: background 0.2s;
}

.booking-item:last-child {
  border-bottom: none;
}

.booking-item:hover {
  background: var(--cream-50);
}

.booking-item-main {
    flex: 1;
}

.booking-item-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.booking-code {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  color: var(--charcoal-400);
  letter-spacing: 0.05em;
}

.booking-item-details {
  display: flex;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: var(--charcoal-600);
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.booking-item-details span {
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.booking-item-children {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.booking-item-sitter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  padding-left: 1rem;
  border-left: 1px solid var(--cream-300);
}

.sitter-info {
  display: flex;
  flex-direction: column;
}

.sitter-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--charcoal-900);
}

/* Live List */
.live-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.live-item {
  padding: 1.25rem;
  background: var(--cream-50);
  border-radius: var(--radius-sm);
  border: 1px solid var(--cream-300);
}

.live-item-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.live-item-info {
  flex: 1;
}

.live-item-name {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--charcoal-900);
}

.live-item-room {
  font-size: 0.75rem;
  color: var(--charcoal-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.live-item-time {
  text-align: right;
}

.live-item-elapsed {
  display: block;
  font-size: 1.25rem;
  font-family: var(--font-serif);
  font-weight: 600;
  color: var(--gold-600);
}

.live-item-start {
  font-size: 0.75rem;
  color: var(--charcoal-400);
}

.live-item-activity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--charcoal-600);
  padding-top: 0.75rem;
  border-top: 1px solid var(--cream-200);
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}
.status-dot-success { background-color: var(--success-500); }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = dashboardStyles;
  document.head.appendChild(styleSheet);
}
