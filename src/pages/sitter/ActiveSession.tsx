// Sitter Active Session Page
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { useActiveSession } from '../../hooks/useSessions';
import { DEMO_MODE } from '../../hooks/useDemo';
import { activityService, sessionService, bookingService } from '../../services/firestore';
import { storageService } from '../../services/storage';
import '../../styles/pages/sitter-active-session.css';

export default function ActiveSession() {
    const { success, error } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { sessionInfo, checklist, toggleChecklistItem, sessionId } = useActiveSession(user?.id);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const logActivity = async () => {
        if (!DEMO_MODE && sessionId) {
            try {
                await activityService.logActivity({
                    sessionId,
                    type: 'activity',
                    description: 'Activity update logged by sitter',
                });
            } catch (err) {
                console.error('Failed to log activity:', err);
            }
        }
        success('Activity Logged', 'Your activity update has been recorded.');
    };

    const handleAddPhoto = async () => {
        if (DEMO_MODE) {
            success('Photo Added', 'Photo has been uploaded.');
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !sessionId) return;
        try {
            const photoUrl = await storageService.uploadActivityPhoto(sessionId, file);
            await activityService.logActivity({
                sessionId,
                type: 'photo',
                description: 'Photo uploaded',
                mediaUrl: photoUrl,
            });
            success('Photo Added', 'Photo has been uploaded.');
        } catch (err) {
            console.error('Failed to upload photo:', err);
            error('Upload Failed', 'Could not upload photo.');
        }
        e.target.value = '';
    };

    const logSnack = async () => {
        if (!DEMO_MODE && sessionId) {
            try {
                await activityService.logActivity({
                    sessionId,
                    type: 'meal',
                    description: 'Snack served',
                });
            } catch (err) {
                console.error('Failed to log snack:', err);
            }
        }
        success('Snack Logged', 'Snack has been recorded.');
    };

    const completeSession = async () => {
        if (DEMO_MODE) {
            success('Session Complete', 'The care session has been completed.');
            navigate('/sitter');
            return;
        }
        if (!sessionId) return;
        try {
            await sessionService.endSession(sessionId);
            // Also update booking status if we have bookingId info
            await bookingService.updateBookingStatus(sessionId, 'completed');
            success('Session Complete', 'The care session has been completed.');
            navigate('/sitter');
        } catch (err) {
            console.error('Failed to complete session:', err);
            error('Error', 'Could not complete session.');
        }
    };

    return (
        <div className="active-session animate-fade-in">
            {/* Status Banner */}
            <div className="active-banner" role="status" aria-label={`Session active, elapsed time: ${sessionInfo.elapsedTime}`}>
                <div className="banner-left">
                    <span className="pulse-dot" aria-hidden="true" />
                    <span className="banner-text">Session Active</span>
                </div>
                <span className="banner-time">{sessionInfo.elapsedTime}</span>
            </div>

            {/* Session Info */}
            <Card>
                <CardBody>
                    <div className="info-grid">
                        <div><span className="label">Room</span><span className="value">{sessionInfo.room}</span></div>
                        <div><span className="label">Children</span><span className="value">{sessionInfo.children}</span></div>
                        <div><span className="label">Parent</span><span className="value">{sessionInfo.parent}</span></div>
                        <div><span className="label">End Time</span><span className="value">{sessionInfo.endTime}</span></div>
                    </div>
                </CardBody>
            </Card>

            {/* Quick Actions */}
            <div className="quick-actions-grid">
                <Button variant="primary" onClick={logActivity}>📝 Log Activity</Button>
                <Button variant="secondary" onClick={handleAddPhoto}>📸 Add Photo</Button>
                <Button variant="secondary" onClick={logSnack}>🍎 Log Snack</Button>
                <Button variant="danger">🚨 Report Issue</Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileSelected}
                    aria-label="Upload activity photo"
                />
            </div>

            {/* Checklist */}
            <Card>
                <CardBody>
                    <h3 className="section-title">Care Checklist</h3>
                    <div className="checklist">
                        {checklist.map((item) => (
                            <label key={item.id} className="check-item">
                                <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() => toggleChecklistItem(item.id)}
                                />
                                <span className={item.completed ? 'completed' : ''}>{item.label}</span>
                            </label>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* End Session */}
            <Button variant="gold" fullWidth onClick={completeSession}>
                Complete Session
            </Button>
        </div>
    );
}
