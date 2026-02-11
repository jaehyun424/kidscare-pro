// ============================================
// KidsCare Pro - Booking QR Code Component
// ============================================

import { QRCodeSVG } from 'qrcode.react';

interface BookingQRProps {
    bookingId: string;
    confirmationCode: string;
    parentId?: string;
    hotelId?: string;
    size?: number;
}

export function BookingQR({
    bookingId,
    confirmationCode,
    parentId = '',
    hotelId = '',
    size = 200,
}: BookingQRProps) {
    const payload = JSON.stringify({
        type: 'kidscare_checkin',
        bookingId,
        confirmationCode,
        parentId,
        hotelId,
        timestamp: new Date().toISOString(),
    });

    return (
        <div className="booking-qr">
            <QRCodeSVG
                value={payload}
                size={size}
                level="M"
                includeMargin
                bgColor="#FFFFFF"
                fgColor="#1a1a2e"
            />
            <span className="booking-qr-code">{confirmationCode}</span>
        </div>
    );
}

// Styles
const qrStyles = `
.booking-qr {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
}

.booking-qr-code {
    font-size: var(--text-sm);
    font-weight: var(--font-bold);
    letter-spacing: 0.1em;
    color: var(--text-secondary);
}
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = qrStyles; document.head.appendChild(s);
}
