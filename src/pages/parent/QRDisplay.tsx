// ============================================
// KidsCare Pro - Parent QR Display Page
// Full-screen QR code for hotel check-in
// ============================================

import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookingQR } from '../../components/common/BookingQR';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useParentBookings } from '../../hooks/useBookings';
import { Skeleton } from '../../components/common/Skeleton';

export default function QRDisplay() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const { t } = useTranslation();
    const { user } = useAuth();
    const { upcomingBooking, isLoading } = useParentBookings(user?.id);

    if (isLoading) {
        return (
            <div className="qr-display-page animate-fade-in">
                <Skeleton width="250px" height="250px" />
                <Skeleton width="200px" height="1.5rem" />
            </div>
        );
    }

    // Find the booking (use upcoming if matching or as fallback)
    const booking = upcomingBooking && (
        !bookingId || upcomingBooking.id === bookingId
    ) ? upcomingBooking : null;

    if (!booking) {
        return (
            <div className="qr-display-page animate-fade-in">
                <div className="qr-empty">
                    <span className="qr-empty-icon">📱</span>
                    <h2>{t('parent.noActiveBooking')}</h2>
                    <p>No booking found to generate a QR code.</p>
                    <Link to="/parent">
                        <Button variant="primary">{t('common.goBack')}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="qr-display-page animate-fade-in">
            <div className="qr-display-card">
                <h2 className="qr-display-title">Check-in QR Code</h2>
                <p className="qr-display-subtitle">
                    Show this QR code to the hotel concierge
                </p>

                <div className="qr-display-qr">
                    <BookingQR
                        bookingId={booking.id}
                        confirmationCode={booking.confirmationCode}
                        parentId={user?.id}
                        hotelId={booking.hotel}
                        size={260}
                    />
                </div>

                <div className="qr-display-details">
                    <div className="qr-detail-row">
                        <span className="qr-detail-label">Booking</span>
                        <span className="qr-detail-value">{booking.confirmationCode}</span>
                    </div>
                    <div className="qr-detail-row">
                        <span className="qr-detail-label">Hotel</span>
                        <span className="qr-detail-value">{booking.hotel}</span>
                    </div>
                    <div className="qr-detail-row">
                        <span className="qr-detail-label">Room</span>
                        <span className="qr-detail-value">{booking.room}</span>
                    </div>
                    <div className="qr-detail-row">
                        <span className="qr-detail-label">Time</span>
                        <span className="qr-detail-value">{booking.time}</span>
                    </div>
                </div>

                <Link to="/parent" className="qr-back-link">
                    <Button variant="secondary" fullWidth>
                        {t('common.goBack')}
                    </Button>
                </Link>
            </div>
        </div>
    );
}

// Styles
const qrDisplayStyles = `
.qr-display-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: var(--space-4);
}

.qr-display-card {
    background: white;
    border: 1px solid var(--cream-300);
    border-radius: var(--radius-2xl);
    padding: var(--space-8);
    max-width: 400px;
    width: 100%;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.qr-display-title {
    font-family: var(--font-serif);
    font-size: var(--text-2xl);
    font-weight: 600;
    margin-bottom: var(--space-2);
}

.qr-display-subtitle {
    color: var(--text-secondary);
    font-size: var(--text-sm);
    margin-bottom: var(--space-6);
}

.qr-display-qr {
    display: flex;
    justify-content: center;
    padding: var(--space-6);
    background: var(--cream-50);
    border-radius: var(--radius-xl);
    margin-bottom: var(--space-6);
}

.qr-display-details {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-4);
    background: var(--cream-50);
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-6);
}

.qr-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--text-sm);
}

.qr-detail-label {
    color: var(--text-tertiary);
    text-transform: uppercase;
    font-size: var(--text-xs);
    letter-spacing: 0.05em;
    font-weight: var(--font-medium);
}

.qr-detail-value {
    font-weight: var(--font-semibold);
}

.qr-back-link {
    text-decoration: none;
}

.qr-empty {
    text-align: center;
    padding: var(--space-8);
}

.qr-empty-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: var(--space-4);
}

.qr-empty h2 {
    margin-bottom: var(--space-2);
}

.qr-empty p {
    color: var(--text-tertiary);
    margin-bottom: var(--space-6);
}
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = qrDisplayStyles; document.head.appendChild(s);
}
