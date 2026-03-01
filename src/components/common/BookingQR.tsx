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