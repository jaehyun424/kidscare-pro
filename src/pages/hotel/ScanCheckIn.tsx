// ============================================
// KidsCare Pro - Hotel QR Scan Check-In Page
// ============================================

import { useState, useRef, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/pages/hotel-scan-checkin.css';

// ----------------------------------------
// Types
// ----------------------------------------
interface QRPayload {
    type: string;
    bookingId: string;
    confirmationCode: string;
    parentId: string;
    hotelId: string;
    timestamp: string;
}

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

// ----------------------------------------
// Component
// ----------------------------------------
export default function ScanCheckIn() {
    const toast = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animFrameRef = useRef<number>(0);

    const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
    const [scannedData, setScannedData] = useState<QRPayload | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);

    // ---- Start Camera ----
    const startCamera = useCallback(async () => {
        try {
            setCameraError(null);
            setScanStatus('scanning');
            setScannedData(null);

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: 640, height: 480 },
            });
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (err) {
            console.error('Camera access failed:', err);
            setCameraError('Camera access denied. Please allow camera permissions.');
            setScanStatus('idle');
        }
    }, []);

    // ---- Stop Camera ----
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = 0;
        }
    }, []);

    // ---- QR Scan Loop ----
    useEffect(() => {
        if (scanStatus !== 'scanning') return;

        const scan = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
                animFrameRef.current = requestAnimationFrame(scan);
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });

            if (code) {
                try {
                    const parsed: QRPayload = JSON.parse(code.data);
                    if (parsed.type === 'kidscare_checkin' && parsed.bookingId) {
                        setScannedData(parsed);
                        setScanStatus('success');
                        stopCamera();
                        toast.success('QR Code Scanned', `Booking ${parsed.confirmationCode} verified!`);
                        return;
                    }
                } catch {
                    // Not a valid QR — continue scanning
                }
            }

            animFrameRef.current = requestAnimationFrame(scan);
        };

        animFrameRef.current = requestAnimationFrame(scan);

        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [scanStatus, stopCamera, toast]);

    // ---- Cleanup on unmount ----
    useEffect(() => {
        return () => stopCamera();
    }, [stopCamera]);

    // ---- Confirm Check-In ----
    const handleConfirmCheckIn = () => {
        if (!scannedData) return;
        toast.success('Check-In Confirmed', `Booking ${scannedData.confirmationCode} has been checked in.`);
        setScanStatus('idle');
        setScannedData(null);
    };

    // ---- Reset ----
    const handleReset = () => {
        setScanStatus('idle');
        setScannedData(null);
        setCameraError(null);
    };

    // ----------------------------------------
    // Render
    // ----------------------------------------
    return (
        <div className="scan-page animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">QR Check-In</h1>
                <p className="page-subtitle">Scan a guest's QR code to verify their booking</p>
            </div>

            <div className="scan-content">
                {/* Scanner Area */}
                <Card className="scan-card">
                    <CardHeader>
                        <CardTitle subtitle="Point camera at the guest's QR code">
                            Scanner
                        </CardTitle>
                    </CardHeader>
                    <CardBody>
                        {scanStatus === 'idle' && !cameraError && (
                            <div className="scan-idle">
                                <div className="scan-icon">
                                    <QRIcon />
                                </div>
                                <p>Tap the button below to start scanning</p>
                                <Button variant="gold" onClick={startCamera}>
                                    Start Scanner
                                </Button>
                            </div>
                        )}

                        {cameraError && (
                            <div className="scan-idle scan-error-state">
                                <div className="scan-icon error">
                                    <CameraOffIcon />
                                </div>
                                <p>{cameraError}</p>
                                <Button variant="primary" onClick={startCamera}>
                                    Try Again
                                </Button>
                            </div>
                        )}

                        {scanStatus === 'scanning' && (
                            <div className="scan-active">
                                <div className="scan-video-wrapper">
                                    <video
                                        ref={videoRef}
                                        className="scan-video"
                                        playsInline
                                        muted
                                        aria-label="Camera feed for QR code scanning"
                                    />
                                    <div className="scan-overlay">
                                        <div className="scan-corners" />
                                    </div>
                                </div>
                                <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />
                                <Button
                                    variant="secondary"
                                    onClick={() => { stopCamera(); setScanStatus('idle'); }}
                                    fullWidth
                                >
                                    Cancel
                                </Button>
                            </div>
                        )}

                        {scanStatus === 'success' && scannedData && (
                            <div className="scan-result">
                                <div className="scan-success-icon">
                                    <CheckCircleIcon />
                                </div>
                                <h3>Booking Verified</h3>
                                <Badge variant="success" size="sm">Valid QR Code</Badge>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Scanned Data */}
                {scannedData && (
                    <Card className="scan-data-card animate-fade-in-up">
                        <CardHeader>
                            <CardTitle>Booking Details</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="scan-data-grid">
                                <div className="scan-data-item">
                                    <span className="scan-data-label">Confirmation</span>
                                    <span className="scan-data-value">{scannedData.confirmationCode}</span>
                                </div>
                                <div className="scan-data-item">
                                    <span className="scan-data-label">Booking ID</span>
                                    <span className="scan-data-value">{scannedData.bookingId}</span>
                                </div>
                                <div className="scan-data-item">
                                    <span className="scan-data-label">Hotel</span>
                                    <span className="scan-data-value">{scannedData.hotelId || 'N/A'}</span>
                                </div>
                                <div className="scan-data-item">
                                    <span className="scan-data-label">Scanned At</span>
                                    <span className="scan-data-value">
                                        {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            <div className="scan-actions">
                                <Button variant="secondary" onClick={handleReset}>
                                    Scan Another
                                </Button>
                                <Button variant="gold" onClick={handleConfirmCheckIn}>
                                    Confirm Check-In
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    );
}

// ----------------------------------------
// Icons
// ----------------------------------------
function QRIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="3" height="3" />
            <line x1="21" y1="14" x2="21" y2="21" />
            <line x1="14" y1="21" x2="21" y2="21" />
        </svg>
    );
}

function CameraOffIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v9" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    );
}

function CheckCircleIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success-500)" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="9,12 11,14 15,10" />
        </svg>
    );
}
