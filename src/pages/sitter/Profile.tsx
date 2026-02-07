// Sitter Profile Page

import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { TierBadge, Badge } from '../../components/common/Badge';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
    const navigate = useNavigate();
    const { signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="sitter-profile animate-fade-in">
            {/* Profile Header */}
            <Card variant="gold">
                <CardBody>
                    <div className="profile-header">
                        <Avatar name="Kim Minjung" size="xl" variant="gold" />
                        <div className="profile-info">
                            <h2>Kim Minjung</h2>
                            <TierBadge tier="gold" />
                            <div className="profile-rating">⭐ 4.9 (247 reviews)</div>
                        </div>
                    </div>
                    <div className="profile-stats">
                        <div className="pstat"><span className="pvalue">247</span><span className="plabel">Sessions</span></div>
                        <div className="pstat"><span className="pvalue">365</span><span className="plabel">Safe Days</span></div>
                        <div className="pstat"><span className="pvalue">98%</span><span className="plabel">On-Time</span></div>
                    </div>
                </CardBody>
            </Card>

            {/* Verification Status - NEW */}
            <Card className="mb-4">
                <CardBody>
                    <h3 className="section-title">Identity Verification</h3>
                    <div className="verification-grid">
                        <div className="verify-item verified">
                            <span className="verify-icon">🏨</span>
                            <div className="verify-text">
                                <span className="verify-label">Hotel Partner Verified</span>
                                <span className="verify-sub">Grand Hyatt • 2024</span>
                            </div>
                            <span className="verify-check">✓</span>
                        </div>
                        <div className="verify-item verified">
                            <span className="verify-icon">🆔</span>
                            <div className="verify-text">
                                <span className="verify-label">Gov. ID Checked</span>
                                <span className="verify-sub">National Registry</span>
                            </div>
                            <span className="verify-check">✓</span>
                        </div>
                        <div className="verify-item verified">
                            <span className="verify-icon">⚖️</span>
                            <div className="verify-text">
                                <span className="verify-label">Background Clear</span>
                                <span className="verify-sub">Valid until Dec 2025</span>
                            </div>
                            <span className="verify-check">✓</span>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Certifications */}
            <Card>
                <CardBody>
                    <h3 className="section-title">Certifications</h3>
                    <div className="certs-list">
                        <Badge variant="success">✓ CPR Certified</Badge>
                        <Badge variant="success">✓ First Aid</Badge>
                        <Badge variant="success">✓ Child Psychology</Badge>
                        <Badge variant="success">✓ Background Checked</Badge>
                    </div>
                </CardBody>
            </Card>

            {/* Languages */}
            <Card>
                <CardBody>
                    <h3 className="section-title">Languages</h3>
                    <div className="lang-list">
                        <span>🇰🇷 Korean (Native)</span>
                        <span>🇺🇸 English (Fluent)</span>
                        <span>🇯🇵 Japanese (Basic)</span>
                    </div>
                </CardBody>
            </Card>

            {/* Settings */}
            <Card>
                <CardBody>
                    <div className="settings-menu">
                        <button className="menu-btn">🔔 Notifications</button>
                        <button className="menu-btn">📅 Availability</button>
                        <button className="menu-btn">💰 Bank Account</button>
                        <button className="menu-btn">📄 Documents</button>
                        <button className="menu-btn">❓ Help</button>
                    </div>
                </CardBody>
            </Card>

            <Button variant="secondary" fullWidth onClick={handleSignOut}>Sign Out</Button>
        </div>
    );
}

// Styles
const profileStyles = `
.sitter-profile { max-width: 480px; margin: 0 auto; }

.profile-header { display: flex; gap: var(--space-4); align-items: center; margin-bottom: var(--space-4); }
.profile-info h2 { font-size: var(--text-xl); font-weight: var(--font-bold); }
.profile-rating { font-size: var(--text-sm); color: var(--text-secondary); margin-top: var(--space-1); }

.profile-stats {
  display: flex;
  justify-content: space-around;
  padding: var(--space-4);
  background: rgba(0,0,0,0.1);
  border-radius: var(--radius-lg);
}

.pstat { text-align: center; }
.pvalue { display: block; font-size: var(--text-xl); font-weight: var(--font-bold); }
.plabel { font-size: var(--text-xs); color: var(--text-tertiary); }

.section-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}

.certs-list { display: flex; flex-wrap: wrap; gap: var(--space-2); }

.lang-list { display: flex; flex-direction: column; gap: var(--space-2); font-size: var(--text-sm); }

.settings-menu { display: flex; flex-direction: column; }
.menu-btn {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: none;
  border: none;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-sm);
}
.menu-btn:last-child { border-bottom: none; }
.menu-btn:hover { background: var(--glass-bg); }

.verification-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

.verify-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    background: white;
    border: 1px solid var(--cream-300);
    border-radius: var(--radius-md);
}

.verify-item.verified {
    background: linear-gradient(to right, #F0FDF4, white);
    border-color: #BBF7D0;
}

.verify-icon { font-size: 1.25rem; }

.verify-text { flex: 1; }

.verify-label {
    display: block;
    font-weight: var(--font-semibold);
    font-size: var(--text-sm);
    color: var(--charcoal-900);
}

.verify-sub {
    display: block;
    font-size: var(--text-xs);
    color: var(--text-tertiary);
}

.verify-check {
    color: #10B981;
    font-weight: bold;
}
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = profileStyles; document.head.appendChild(s);
}
