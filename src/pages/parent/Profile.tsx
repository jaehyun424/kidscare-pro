// Parent Profile Page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="profile-page animate-fade-in">
            {/* User Info */}
            <Card className="profile-card">
                <CardBody>
                    <div className="profile-header">
                        <Avatar name="Sarah Johnson" size="xl" />
                        <div className="profile-info">
                            <h2>Sarah Johnson</h2>
                            <span className="email">{user?.email || 'sarah@example.com'}</span>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Children */}
            <Card>
                <CardBody>
                    <h3 className="section-title">My Children</h3>
                    <div className="children-list">
                        <div className="child-item">
                            <span className="child-avatar">👧</span>
                            <div className="child-info">
                                <span className="child-name">Emma</span>
                                <span className="child-age">5 years old</span>
                            </div>
                            <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                    </div>
                    <Button variant="secondary" fullWidth>+ Add Child</Button>
                </CardBody>
            </Card>

            {/* Settings Menu */}
            <Card>
                <CardBody>
                    <div className="settings-menu">
                        <button className="menu-item"><span>🔔</span> Notifications</button>
                        <button className="menu-item"><span>🌐</span> Language</button>
                        <button className="menu-item"><span>💳</span> Payment Methods</button>
                        <button className="menu-item"><span>📄</span> Terms of Service</button>
                        <button className="menu-item"><span>🔒</span> Privacy Policy</button>
                        <button className="menu-item"><span>❓</span> Help & Support</button>
                    </div>
                </CardBody>
            </Card>

            <Button variant="secondary" fullWidth onClick={handleSignOut}>
                Sign Out
            </Button>
        </div>
    );
}

// Styles
const profileStyles = `
.profile-page { max-width: 480px; margin: 0 auto; }

.profile-card { margin-bottom: var(--space-4); }

.profile-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.profile-info h2 {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

.profile-info .email {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.section-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: var(--space-4);
}

.children-list { margin-bottom: var(--space-4); }

.child-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--glass-bg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-3);
}

.child-avatar { font-size: 2rem; }
.child-info { flex: 1; }
.child-name { display: block; font-weight: var(--font-medium); }
.child-age { font-size: var(--text-sm); color: var(--text-tertiary); }

.settings-menu { display: flex; flex-direction: column; }

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-color);
  text-align: left;
  font-size: var(--text-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: background var(--transition-fast);
  font-family: inherit;
}

.menu-item:hover { background: var(--glass-bg); }
.menu-item:last-child { border-bottom: none; }
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = profileStyles; document.head.appendChild(s);
}
