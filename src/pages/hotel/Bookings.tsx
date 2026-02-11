// ============================================
// KidsCare Pro - Hotel Bookings Page
// ============================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge, StatusBadge, TierBadge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useHotelBookings } from '../../hooks/useBookings';
import type { DemoBooking } from '../../data/demo';

// Icons
const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export default function Bookings() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { bookings } = useHotelBookings(user?.hotelId);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<DemoBooking | null>(null);

    const STATUS_OPTIONS = [
        { value: '', label: t('common.allStatuses') },
        { value: 'pending', label: t('status.pending') },
        { value: 'confirmed', label: t('status.confirmed') },
        { value: 'in_progress', label: t('status.inProgress') },
        { value: 'completed', label: t('status.completed') },
        { value: 'cancelled', label: t('status.cancelled') },
    ];

    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            booking.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.room.includes(searchTerm);
        const matchesStatus = !statusFilter || booking.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="bookings-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('nav.bookings')}</h1>
                    <p className="page-subtitle">{t('hotel.manageBookings')}</p>
                </div>
                <Button variant="gold" icon={<PlusIcon />}>
                    {t('hotel.newBooking')}
                </Button>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardBody>
                    <div className="filters-row">
                        <Input
                            placeholder={t('hotel.searchByCodeNameRoom')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<SearchIcon />}
                        />
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={STATUS_OPTIONS}
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Bookings Table */}
            <Card>
                <CardBody>
                    <div className="bookings-table">
                        <div className="table-header">
                            <span>{t('hotel.bookingCode')}</span>
                            <span>{t('hotel.guestRoom')}</span>
                            <span>{t('hotel.childrenInfo')}</span>
                            <span>{t('auth.sitter')}</span>
                            <span>{t('hotel.status')}</span>
                            <span>{t('hotel.amount')}</span>
                        </div>
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="table-row"
                                onClick={() => setSelectedBooking(booking)}
                            >
                                <div className="table-cell">
                                    <span className="booking-code">{booking.confirmationCode}</span>
                                    <span className="booking-date">{booking.date}</span>
                                    <span className="booking-time">{booking.time}</span>
                                </div>
                                <div className="table-cell">
                                    <span className="guest-name">{booking.parent.name}</span>
                                    <span className="room-number">{t('common.room')} {booking.room}</span>
                                </div>
                                <div className="table-cell">
                                    {booking.children.map((child, i) => (
                                        <Badge key={i} variant="neutral" size="sm">
                                            {child.name} ({child.age}y)
                                        </Badge>
                                    ))}
                                </div>
                                <div className="table-cell">
                                    {booking.sitter ? (
                                        <div className="sitter-cell">
                                            <Avatar name={booking.sitter.name} size="sm" />
                                            <div>
                                                <span className="sitter-name">{booking.sitter.name}</span>
                                                <TierBadge tier={booking.sitter.tier} />
                                            </div>
                                        </div>
                                    ) : (
                                        <Button variant="secondary" size="sm">{t('hotel.assign')}</Button>
                                    )}
                                </div>
                                <div className="table-cell">
                                    <StatusBadge status={booking.status} />
                                </div>
                                <div className="table-cell">
                                    <span className="amount">{formatCurrency(booking.totalAmount)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Booking Detail Modal */}
            <Modal
                isOpen={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
                title={`Booking ${selectedBooking?.confirmationCode}`}
                size="lg"
            >
                {selectedBooking && (
                    <div className="booking-detail">
                        <div className="detail-section">
                            <h4>Guest Information</h4>
                            <p><strong>Name:</strong> {selectedBooking.parent.name}</p>
                            <p><strong>Phone:</strong> {selectedBooking.parent.phone}</p>
                            <p><strong>Room:</strong> {selectedBooking.room}</p>
                        </div>
                        <div className="detail-section">
                            <h4>Children</h4>
                            {selectedBooking.children.map((child, i) => (
                                <p key={i}>
                                    {child.name} ({child.age} years)
                                    {'allergies' in child && child.allergies && ` - Allergies: ${child.allergies.join(', ')}`}
                                </p>
                            ))}
                        </div>
                        <div className="detail-section">
                            <h4>Schedule</h4>
                            <p><strong>Date:</strong> {selectedBooking.date}</p>
                            <p><strong>Time:</strong> {selectedBooking.time}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

// Styles
const bookingsStyles = `
.bookings-page {
  max-width: 1600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--cream-300);
}

.page-title {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--charcoal-900);
}

.page-subtitle {
  color: var(--charcoal-600);
  font-size: 1.125rem;
}

.mb-6 { margin-bottom: 2rem; }

/* Filters */
.filters-row {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .filters-row {
    grid-template-columns: 1fr;
  }
}

/* Table Redesign */
.bookings-table {
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.2fr 1fr 0.8fr 0.8fr;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  background: var(--cream-100);
  border-bottom: 1px solid var(--cream-300);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--charcoal-500);
  margin-bottom: 0;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.2fr 1fr 0.8fr 0.8fr;
  gap: 1.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--cream-200);
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: var(--cream-50);
}

.table-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}

.booking-code {
  font-family: var(--font-mono, monospace);
  font-weight: 600;
  color: var(--charcoal-900);
  font-size: 0.875rem;
}

.booking-date {
  font-size: 0.875rem;
  color: var(--charcoal-600);
}

.booking-time {
  font-size: 0.75rem;
  color: var(--charcoal-400);
}

.room-number {
  font-size: 0.875rem;
  color: var(--charcoal-600);
  font-weight: 500;
}

.guest-name {
  font-family: var(--font-serif);
  font-weight: 600;
  color: var(--charcoal-900);
  font-size: 1rem;
}

.sitter-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sitter-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--charcoal-900);
}

.amount {
  font-family: var(--font-serif);
  font-weight: 600;
  color: var(--gold-600);
  font-size: 1rem;
}

/* Detail Modal Styles */
.booking-detail {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--cream-200);
}

.detail-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-section h4 {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--charcoal-400);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.detail-section p {
  color: var(--charcoal-700);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.detail-section strong {
  color: var(--charcoal-900);
  font-weight: 600;
  margin-right: 0.5rem;
}

@media (max-width: 1024px) {
  .table-header { display: none; }
  .table-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: white;
    margin-bottom: 1rem;
    border: 1px solid var(--cream-300);
    border-radius: var(--radius-md);
  }
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = bookingsStyles;
    document.head.appendChild(styleSheet);
}
