// ============================================
// Petit Stay - Hotel Dashboard
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, StatusBadge, TierBadge, SafetyBadge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Skeleton } from '../../components/common/Skeleton';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { PeriodSelector } from '../../components/common/DatePicker';
import ErrorBanner from '../../components/common/ErrorBanner';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useHotelBookings } from '../../hooks/useBookings';
import { useHotelSessions } from '../../hooks/useSessions';
import { useHotelSitters } from '../../hooks/useSitters';
import type { DemoBooking } from '../../data/demo';
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
  to?: string;
}

function StatCard({ icon, label, value, subValue, color, to }: StatCardProps) {
  const navigate = useNavigate();
  const colorClasses = {
    primary: 'stat-card-primary',
    gold: 'stat-card-gold',
    success: 'stat-card-success',
    warning: 'stat-card-warning',
  };

  return (
    <div
      className={`stat-card ${colorClasses[color]} ${to ? 'stat-card-clickable' : ''}`}
      role="group"
      aria-label={label}
      onClick={to ? () => navigate(to) : undefined}
      style={to ? { cursor: 'pointer' } : undefined}
    >
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
  const { bookings: todayBookings, stats, isLoading: bookingsLoading, error: bookingsError, retry: retryBookings } = useHotelBookings(user?.hotelId);
  const { sessions: activeSessions, isLoading: sessionsLoading, error: sessionsError, retry: retrySessions } = useHotelSessions(user?.hotelId);
  const { sitters } = useHotelSitters(user?.hotelId);
  const toast = useToast();
  const isLoading = bookingsLoading || sessionsLoading;
  const [period, setPeriod] = useState('today');

  // New Booking modal
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [newBookingForm, setNewBookingForm] = useState({ guestName: '', room: '', date: '', time: '18:00', duration: '4', childrenCount: '1' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateBookingForm = () => {
    const errors: Record<string, string> = {};
    if (!newBookingForm.guestName.trim()) errors.guestName = t('common.required', 'This field is required');
    if (!newBookingForm.room.trim()) errors.room = t('common.required', 'This field is required');
    if (!newBookingForm.date) {
      errors.date = t('common.required', 'This field is required');
    } else if (newBookingForm.date < new Date().toISOString().split('T')[0]) {
      errors.date = t('booking.dateMustBeFuture', 'Date must be today or later');
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateBooking = () => {
    if (!validateBookingForm()) return;
    const code = `KCP-${Date.now().toString(36).toUpperCase()}`;
    toast.success(t('booking.bookingConfirmed'), `${t('hotel.bookingCode')}: ${code}`);
    setShowNewBooking(false);
    setNewBookingForm({ guestName: '', room: '', date: '', time: '18:00', duration: '4', childrenCount: '1' });
    setFormErrors({});
  };

  // Assign sitter modal
  const [assignTarget, setAssignTarget] = useState<DemoBooking | null>(null);

  const handleAssignSitter = (sitterName: string) => {
    toast.success(t('hotel.assign'), `${sitterName} → ${assignTarget?.confirmationCode}`);
    setAssignTarget(null);
  };

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
        <div className="dashboard-header-actions">
          <PeriodSelector value={period} onChange={setPeriod} />
          <Button variant="gold" icon={<PlusIcon />} onClick={() => setShowNewBooking(true)}>
            {t('hotel.newBooking')}
          </Button>
        </div>
      </div>

      {/* Error Banners */}
      {bookingsError && <ErrorBanner error={bookingsError} onRetry={retryBookings} />}
      {sessionsError && <ErrorBanner error={sessionsError} onRetry={retrySessions} />}

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
          to="/hotel/bookings"
        />
        <StatCard
          icon={<LiveIcon />}
          label={t('hotel.activeSessions')}
          value={stats.activeNow}
          subValue={t('status.inProgress')}
          color="warning"
          to="/hotel/live"
        />
        <StatCard
          icon={<CheckIcon />}
          label={t('status.completed')}
          value={stats.completedToday}
          color="success"
          to="/hotel/reports"
        />
        <StatCard
          icon={<CurrencyIcon />}
          label={t('hotel.totalRevenue')}
          value={formatCurrency(stats.todayRevenue)}
          color="gold"
          to="/hotel/reports"
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
              {todayBookings.length === 0 ? (
                <div className="empty-state">
                  <CalendarIcon />
                  <p className="empty-state-text">{t('parent.noUpcomingBookings')}</p>
                  <Button variant="gold" size="sm" onClick={() => setShowNewBooking(true)}>
                    {t('hotel.newBooking')}
                  </Button>
                </div>
              ) : (
                todayBookings.map((booking) => (
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
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setAssignTarget(booking); }}>
                          {t('hotel.assign')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
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
              <span className="live-monitor-title-row">
                {t('nav.liveMonitor')}
                <span className="status-dot status-dot-success" aria-hidden="true" />
              </span>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="live-list">
              {activeSessions.length === 0 ? (
                <div className="empty-state">
                  <LiveIcon />
                  <p className="empty-state-text">{t('liveMonitor.noActiveSessions')}</p>
                  <p className="empty-state-sub">{t('liveMonitor.noActiveSessionsDesc')}</p>
                </div>
              ) : (
                activeSessions.map((session) => (
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
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* New Booking Modal */}
      <Modal
        isOpen={showNewBooking}
        onClose={() => setShowNewBooking(false)}
        title={t('hotel.newBooking')}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowNewBooking(false); setFormErrors({}); }}>{t('common.cancel')}</Button>
            <Button variant="gold" onClick={handleCreateBooking} disabled={!newBookingForm.guestName.trim() || !newBookingForm.room.trim() || !newBookingForm.date}>{t('common.confirm')}</Button>
          </>
        }
      >
        <div className="modal-form-stack">
          <Input label={t('hotel.guestInfo')} value={newBookingForm.guestName} onChange={(e) => { setNewBookingForm({ ...newBookingForm, guestName: e.target.value }); if (formErrors.guestName) setFormErrors((prev) => { const { guestName: _, ...rest } = prev; return rest; }); }} placeholder="e.g. Sarah Johnson" error={formErrors.guestName} />
          <Input label={t('common.room')} value={newBookingForm.room} onChange={(e) => { setNewBookingForm({ ...newBookingForm, room: e.target.value }); if (formErrors.room) setFormErrors((prev) => { const { room: _, ...rest } = prev; return rest; }); }} placeholder={t('booking.roomPlaceholder')} error={formErrors.room} />
          <Input label={t('common.date')} type="date" value={newBookingForm.date} onChange={(e) => { setNewBookingForm({ ...newBookingForm, date: e.target.value }); if (formErrors.date) setFormErrors((prev) => { const { date: _, ...rest } = prev; return rest; }); }} min={new Date().toISOString().split('T')[0]} error={formErrors.date} />
          <Select label={t('booking.startTime')} value={newBookingForm.time} onChange={(e) => setNewBookingForm({ ...newBookingForm, time: e.target.value })} options={[{ value: '18:00', label: '18:00' }, { value: '19:00', label: '19:00' }, { value: '20:00', label: '20:00' }, { value: '21:00', label: '21:00' }]} />
          <Select label={t('booking.duration')} value={newBookingForm.duration} onChange={(e) => setNewBookingForm({ ...newBookingForm, duration: e.target.value })} options={[{ value: '2', label: '2h' }, { value: '3', label: '3h' }, { value: '4', label: '4h' }, { value: '5', label: '5h' }]} />
          <Select label={t('hotel.childrenInfo')} value={newBookingForm.childrenCount} onChange={(e) => setNewBookingForm({ ...newBookingForm, childrenCount: e.target.value })} options={[{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }]} />
        </div>
      </Modal>

      {/* Assign Sitter Modal */}
      <Modal
        isOpen={!!assignTarget}
        onClose={() => setAssignTarget(null)}
        title={`${t('hotel.assign')} - ${assignTarget?.confirmationCode || ''}`}
        size="md"
      >
        <div className="modal-form-stack-sm">
          {sitters.filter((s) => s.availability === 'Available').map((sitter) => (
            <div key={sitter.id} className="sitter-option-row" onClick={() => handleAssignSitter(sitter.name)}>
              <Avatar name={sitter.name} size="sm" variant={sitter.tier === 'gold' ? 'gold' : 'default'} />
              <div className="sitter-option-info">
                <div className="sitter-option-name">{sitter.name}</div>
                <div className="sitter-option-detail">{sitter.languages.join(', ')}</div>
              </div>
              <TierBadge tier={sitter.tier} />
            </div>
          ))}
          {sitters.filter((s) => s.availability === 'Available').length === 0 && (
            <p className="no-sitters-message">No available sitters</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
