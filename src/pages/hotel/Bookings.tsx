// ============================================
// KidsCare Pro - Hotel Bookings Page
// ============================================

import { useState } from 'react';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge, StatusBadge, TierBadge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Modal } from '../../components/common/Modal';

// Demo Data
const BOOKINGS_DATA = [
    {
        id: '1',
        confirmationCode: 'KCP-2025-0042',
        date: '2025-01-15',
        time: '18:00 - 22:00',
        room: '2305',
        parent: { name: 'Sarah Johnson', phone: '+1 555-0123' },
        children: [{ name: 'Emma', age: 5, allergies: ['peanuts'] }],
        sitter: { name: 'Kim Minjung', tier: 'gold' as const },
        status: 'confirmed' as const,
        totalAmount: 280000,
    },
    {
        id: '2',
        confirmationCode: 'KCP-2025-0043',
        date: '2025-01-15',
        time: '19:00 - 23:00',
        room: '1102',
        parent: { name: 'Tanaka Yuki', phone: '+81 90-1234-5678' },
        children: [{ name: 'Sota', age: 3 }, { name: 'Yui', age: 6 }],
        sitter: { name: 'Park Sooyeon', tier: 'gold' as const },
        status: 'in_progress' as const,
        totalAmount: 420000,
    },
    {
        id: '3',
        confirmationCode: 'KCP-2025-0044',
        date: '2025-01-15',
        time: '20:00 - 24:00',
        room: '3501',
        parent: { name: 'Michael Chen', phone: '+86 138-0000-0000' },
        children: [{ name: 'Lucas', age: 4 }],
        sitter: null,
        status: 'pending' as const,
        totalAmount: 280000,
    },
    {
        id: '4',
        confirmationCode: 'KCP-2025-0045',
        date: '2025-01-14',
        time: '17:00 - 21:00',
        room: '2108',
        parent: { name: 'Emily Davis', phone: '+1 555-0456' },
        children: [{ name: 'Oliver', age: 7 }],
        sitter: { name: 'Lee Jihye', tier: 'silver' as const },
        status: 'completed' as const,
        totalAmount: 280000,
    },
];

const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

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
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<typeof BOOKINGS_DATA[0] | null>(null);

    const filteredBookings = BOOKINGS_DATA.filter((booking) => {
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
                    <h1 className="page-title">Bookings</h1>
                    <p className="page-subtitle">Manage all childcare bookings</p>
                </div>
                <Button variant="gold" icon={<PlusIcon />}>
                    New Booking
                </Button>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardBody>
                    <div className="filters-row">
                        <Input
                            placeholder="Search by code, name, or room..."
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
                            <span>Booking</span>
                            <span>Guest / Room</span>
                            <span>Children</span>
                            <span>Sitter</span>
                            <span>Status</span>
                            <span>Amount</span>
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
                                    <span className="room-number">Room {booking.room}</span>
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
                                        <Button variant="secondary" size="sm">Assign</Button>
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
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-1);
}

.page-subtitle {
  color: var(--text-secondary);
}

.mb-6 { margin-bottom: var(--space-6); }

.filters-row {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: var(--space-4);
}

@media (max-width: 640px) {
  .filters-row {
    grid-template-columns: 1fr;
  }
}

.bookings-table {
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 0.8fr 0.8fr;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--glass-bg);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 0.8fr 0.8fr;
  gap: var(--space-4);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.table-row:hover {
  background: var(--glass-bg);
}

.table-cell {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.booking-code {
  font-family: monospace;
  font-weight: var(--font-medium);
}

.booking-date, .booking-time, .room-number {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.guest-name {
  font-weight: var(--font-medium);
}

.sitter-cell {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sitter-name {
  font-size: var(--text-sm);
  display: block;
}

.amount {
  font-weight: var(--font-semibold);
  color: var(--gold-500);
}

.booking-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.detail-section h4 {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
}

.detail-section p {
  color: var(--text-secondary);
  margin-bottom: var(--space-1);
}

@media (max-width: 1024px) {
  .table-header { display: none; }
  .table-row {
    display: flex;
    flex-direction: column;
    background: var(--glass-bg);
    margin-bottom: var(--space-3);
  }
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = bookingsStyles;
    document.head.appendChild(styleSheet);
}
