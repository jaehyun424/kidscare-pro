// ============================================
// KidsCare Pro - Safety Dashboard Page
// ============================================

import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { SafetyBadge, Badge } from '../../components/common/Badge';

export default function SafetyDashboard() {
    return (
        <div className="safety-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Safety Record Dashboard</h1>
                    <p className="page-subtitle">Track and maintain your hotel's safety excellence</p>
                </div>
                <SafetyBadge days={127} />
            </div>

            {/* Main Safety Banner */}
            <div className="safety-main-banner">
                <div className="safety-number">127</div>
                <div className="safety-text">
                    <h2>Consecutive Days Without Incidents</h2>
                    <p>Your hotel maintains an excellent safety record. Keep up the great work!</p>
                </div>
            </div>

            {/* Safety Metrics */}
            <div className="safety-grid">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Month</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="safety-stat">
                            <span className="number text-success">0</span>
                            <span className="label">Incidents Reported</span>
                        </div>
                        <div className="safety-stat">
                            <span className="number">156</span>
                            <span className="label">Sessions Completed</span>
                        </div>
                        <div className="safety-stat">
                            <span className="number text-gold">100%</span>
                            <span className="label">Trust Protocol Compliance</span>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Trust Protocol Stats</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="protocol-list">
                            <div className="protocol-item">
                                <span>✅ Digital Badge Verified</span>
                                <Badge variant="success">156/156</Badge>
                            </div>
                            <div className="protocol-item">
                                <span>✅ Safe Word Confirmed</span>
                                <Badge variant="success">156/156</Badge>
                            </div>
                            <div className="protocol-item">
                                <span>✅ Joint Checklist Completed</span>
                                <Badge variant="success">156/156</Badge>
                            </div>
                            <div className="protocol-item">
                                <span>✅ Emergency Consent Signed</span>
                                <Badge variant="success">156/156</Badge>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Incident History</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="empty-incidents">
                            <span className="empty-icon">🛡️</span>
                            <h4>No Incidents</h4>
                            <p>No incidents have been reported in the last 127 days.</p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

// Styles
const safetyStyles = `
.safety-page { max-width: 1400px; margin: 0 auto; }

.safety-main-banner {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-8);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius-2xl);
  margin-bottom: var(--space-6);
}

.safety-number {
  font-size: 5rem;
  font-weight: var(--font-bold);
  color: var(--success-500);
  line-height: 1;
}

.safety-text h2 {
  font-size: var(--text-xl);
  margin-bottom: var(--space-2);
}

.safety-text p {
  color: var(--text-secondary);
}

.safety-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.safety-stat {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-4);
}

.safety-stat .number {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
}

.safety-stat .label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.text-success { color: var(--success-500); }
.text-gold { color: var(--gold-500); }

.protocol-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.protocol-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  background: var(--glass-bg);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
}

.empty-incidents {
  text-align: center;
  padding: var(--space-8);
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--space-4);
}

.empty-incidents h4 {
  margin-bottom: var(--space-2);
}

.empty-incidents p {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = safetyStyles; document.head.appendChild(s);
}
