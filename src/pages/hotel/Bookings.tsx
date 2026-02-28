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
import '../../styles/pages/hotel-bookings.css';

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
                    <div className="bookings-table" role="table" aria-label="Bookings list">
                        <div className="table-header" role="row">
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
                                role="row"
                                tabIndex={0}
                                aria-label={`Booking ${booking.confirmationCode}, ${booking.parent.name}, Room ${booking.room}`}
                                onClick={() => setSelectedBooking(booking)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedBooking(booking); } }}
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
