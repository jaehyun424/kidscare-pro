// ============================================
// KidsCare Pro - Hotel Dashboard
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, StatusBadge, TierBadge, SafetyBadge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Skeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { useHotelBookings } from '../../hooks/useBookings';
import { useHotelSessions } from '../../hooks/useSessions';
import '../../styles/pages/hotel-dashboard.css';

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
    <div className={`stat-card ${colorClasses[color]}`} role="group" aria-label={label}>
      <div className="stat-card-icon" aria-hidden="true">{icon}</div>
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
  const { user } = useAuth();
  const { bookings: todayBookings, stats, isLoading: bookingsLoading } = useHotelBookings(user?.hotelId);
  const { sessions: activeSessions, isLoading: sessionsLoading } = useHotelSessions(user?.hotelId);
  const isLoading = bookingsLoading || sessionsLoading;

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
          <SafetyBadge days={stats.safetyDays} />
          <span className="safety-banner-text">
            {t('hotel.safetyRecordCongrats')}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid animate-stagger">
        <StatCard
          icon={<CalendarIcon />}
          label={t('hotel.totalBookings')}
          value={stats.todayBookings}
          subValue={`${stats.pendingBookings} ${t('status.pending').toLowerCase()}`}
          color="primary"
        />
        <StatCard
          icon={<LiveIcon />}
          label={t('hotel.activeSessions')}
          value={stats.activeNow}
          subValue={t('status.inProgress')}
          color="warning"
        />
        <StatCard
          icon={<CheckIcon />}
          label={t('status.completed')}
          value={stats.completedToday}
          color="success"
        />
        <StatCard
          icon={<CurrencyIcon />}
          label={t('hotel.totalRevenue')}
          value={formatCurrency(stats.todayRevenue)}
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
            <CardTitle subtitle={t('hotel.upcomingAndInProgress')}>
              {t('hotel.todaysBookings')}
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="booking-list">
              {todayBookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-item-main">
                    <div className="booking-item-header">
                      <span className="booking-code">{booking.confirmationCode}</span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="booking-item-details">
                      <span>🕐 {booking.time}</span>
                      <span>🚪 {t('common.room')} {booking.room}</span>
                      <span>👤 {booking.parent.name}</span>
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
                <span className="status-dot status-dot-success" aria-hidden="true" />
              </span>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="live-list">
              {activeSessions.map((session) => (
                <div key={session.id} className="live-item">
                  <div className="live-item-header">
                    <Avatar name={session.sitter.name} size="sm" variant={session.sitter.tier === 'gold' ? 'gold' : 'default'} />
                    <div className="live-item-info">
                      <span className="live-item-name">{session.sitter.name}</span>
                      <span className="live-item-room">{t('common.room')} {session.room}</span>
                    </div>
                    <div className="live-item-time">
                      <span className="live-item-elapsed">{session.elapsed}</span>
                      <span className="live-item-start">{t('hotel.started')} {session.startTime}</span>
                    </div>
                  </div>
                  <div className="live-item-activity">
                    <span className="status-dot status-dot-success" aria-hidden="true" />
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
