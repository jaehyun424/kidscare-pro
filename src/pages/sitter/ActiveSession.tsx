// Sitter Active Session Page
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { useActiveSession } from '../../hooks/useSessions';

export default function ActiveSession() {
    const { success } = useToast();
    const { user } = useAuth();
    const { sessionInfo, checklist, toggleChecklistItem } = useActiveSession(user?.id);

    const logActivity = () => {
        success('Activity Logged', 'Your activity update has been recorded.');
    };

    return (
        <div className="active-session animate-fade-in">
            {/* Status Banner */}
            <div className="active-banner">
                <div className="banner-left">
                    <span className="pulse-dot" />
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
                <Button variant="secondary">📸 Add Photo</Button>
                <Button variant="secondary">🍎 Log Snack</Button>
                <Button variant="danger">🚨 Report Issue</Button>
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
            <Button variant="gold" fullWidth>
                Complete Session
            </Button>
        </div>
    );
}

// Styles
const activeStyles = `
.active-session { max-width: 480px; margin: 0 auto; }

.active-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1));
  border: 1px solid var(--success-500);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-4);
}

.banner-left { display: flex; align-items: center; gap: var(--space-2); }
.banner-text { font-weight: var(--font-semibold); color: var(--success-500); }
.banner-time { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--success-500); }

.pulse-dot {
  width: 12px; height: 12px;
  background: var(--success-500);
  border-radius: 50%;
  animation: pulse 2s ease infinite;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.info-grid .label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.info-grid .value {
  font-weight: var(--font-medium);
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  margin: var(--space-4) 0;
}

.section-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: var(--space-4);
}

.checklist { display: flex; flex-direction: column; gap: var(--space-2); }

.check-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--glass-bg);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.check-item input { accent-color: var(--success-500); width: 18px; height: 18px; }
.check-item .completed { text-decoration: line-through; color: var(--text-tertiary); }
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = activeStyles; document.head.appendChild(s);
}
