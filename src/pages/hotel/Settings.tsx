// ============================================
// KidsCare Pro - Hotel Settings Page
// ============================================

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from '../../components/common/Card';
import { Input, Select, Textarea } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useToast } from '../../contexts/ToastContext';

export default function Settings() {
    const { success } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        setIsLoading(false);
        success('Settings saved', 'Your hotel settings have been updated.');
    };

    return (
        <div className="settings-page animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage your hotel's childcare service configuration</p>
            </div>

            <div className="settings-grid">
                <Card>
                    <CardHeader>
                        <CardTitle subtitle="Basic information about your hotel">Hotel Profile</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="form-stack">
                            <Input label="Hotel Name" defaultValue="Grand Hyatt Seoul" />
                            <Input label="Contact Email" type="email" defaultValue="childcare@grandhyattseoul.com" />
                            <Input label="Contact Phone" defaultValue="+82-2-797-1234" />
                            <Textarea label="Address" defaultValue="322 Sowol-ro, Yongsan-gu, Seoul, South Korea" />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle subtitle="Customize service availability">Service Settings</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="form-stack">
                            <Select
                                label="Default Service Hours"
                                defaultValue="18-24"
                                options={[
                                    { value: '18-24', label: '18:00 - 24:00 (Evening)' },
                                    { value: '09-18', label: '09:00 - 18:00 (Daytime)' },
                                    { value: '00-24', label: '24 Hours' },
                                ]}
                            />
                            <Input label="Minimum Booking Hours" type="number" defaultValue="2" />
                            <Input label="Maximum Booking Hours" type="number" defaultValue="8" />
                            <Select
                                label="Default Booking Notice"
                                defaultValue="4"
                                options={[
                                    { value: '2', label: '2 hours advance notice' },
                                    { value: '4', label: '4 hours advance notice' },
                                    { value: '24', label: '24 hours advance notice' },
                                ]}
                            />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle subtitle="Set your hotel's pricing">Pricing Configuration</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="form-stack">
                            <Input label="Base Hourly Rate (KRW)" type="number" defaultValue="70000" />
                            <Input label="Additional Child Rate (KRW)" type="number" defaultValue="20000" />
                            <Input label="Night Premium (22:00+) %" type="number" defaultValue="20" />
                            <Input label="Weekend Premium %" type="number" defaultValue="10" />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle subtitle="Manage notification preferences">Notifications</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="notification-settings">
                            <label className="toggle-option">
                                <input type="checkbox" defaultChecked />
                                <span>New booking notifications</span>
                            </label>
                            <label className="toggle-option">
                                <input type="checkbox" defaultChecked />
                                <span>Session start/end alerts</span>
                            </label>
                            <label className="toggle-option">
                                <input type="checkbox" defaultChecked />
                                <span>Emergency alerts</span>
                            </label>
                            <label className="toggle-option">
                                <input type="checkbox" />
                                <span>Daily summary email</span>
                            </label>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="settings-actions">
                <Button variant="secondary">Cancel</Button>
                <Button variant="gold" onClick={handleSave} isLoading={isLoading}>
                    Save Changes
                </Button>
            </div>
        </div>
    );
}

// Styles
const settingsStyles = `
.settings-page { max-width: 1200px; margin: 0 auto; }

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-6);
}

@media (max-width: 768px) {
  .settings-grid { grid-template-columns: 1fr; }
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.notification-settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--glass-bg);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.toggle-option input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--gold-500);
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-color);
}
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = settingsStyles; document.head.appendChild(s);
}
