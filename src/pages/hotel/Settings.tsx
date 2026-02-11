// ============================================
// KidsCare Pro - Hotel Settings Page
// ============================================

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Input, Select, Textarea } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { useHotel } from '../../hooks/useHotel';
import { useToast } from '../../contexts/ToastContext';
import type { Currency, CancellationPolicy } from '../../types';

export default function Settings() {
    const { user } = useAuth();
    const { hotel, isLoading, updateHotel } = useHotel(user?.hotelId);
    const { success, error } = useToast();

    // ----------------------------------------
    // Hotel Profile state
    // ----------------------------------------
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    // ----------------------------------------
    // Service Settings state
    // ----------------------------------------
    const [autoAssign, setAutoAssign] = useState(false);
    const [requireGoldForInfant, setRequireGoldForInfant] = useState(false);
    const [minBookingHours, setMinBookingHours] = useState(2);
    const [maxAdvanceBookingDays, setMaxAdvanceBookingDays] = useState(30);
    const [cancellationPolicy, setCancellationPolicy] = useState<CancellationPolicy>('moderate');

    // ----------------------------------------
    // Pricing state
    // ----------------------------------------
    const [commission, setCommission] = useState(15);
    const [currency, setCurrency] = useState<Currency>('KRW');

    // ----------------------------------------
    // Notification state
    // ----------------------------------------
    const [notifyNewBooking, setNotifyNewBooking] = useState(true);
    const [notifySessionAlerts, setNotifySessionAlerts] = useState(true);
    const [notifyEmergency, setNotifyEmergency] = useState(true);
    const [notifyDailySummary, setNotifyDailySummary] = useState(false);

    // ----------------------------------------
    // Save state
    // ----------------------------------------
    const [isSaving, setIsSaving] = useState(false);

    // ----------------------------------------
    // Populate form from hotel data
    // ----------------------------------------
    useEffect(() => {
        if (hotel) {
            setName(hotel.name);
            setEmail(hotel.contactEmail);
            setPhone(hotel.contactPhone);
            setAddress(hotel.address);
            setAutoAssign(hotel.settings.autoAssign);
            setRequireGoldForInfant(hotel.settings.requireGoldForInfant);
            setMinBookingHours(hotel.settings.minBookingHours);
            setMaxAdvanceBookingDays(hotel.settings.maxAdvanceBookingDays);
            setCancellationPolicy(hotel.settings.cancellationPolicy);
            setCommission(hotel.commission);
            setCurrency(hotel.currency);
        }
    }, [hotel]);

    // ----------------------------------------
    // Save handler
    // ----------------------------------------
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateHotel({
                name,
                contactEmail: email,
                contactPhone: phone,
                address,
                commission,
                currency: currency as Currency,
                settings: {
                    autoAssign,
                    requireGoldForInfant,
                    minBookingHours,
                    maxAdvanceBookingDays,
                    cancellationPolicy,
                },
            });
            success('Settings saved', 'Your hotel settings have been updated.');
        } catch {
            error('Save failed', 'Could not update settings.');
        }
        setIsSaving(false);
    };

    // ----------------------------------------
    // Loading skeleton
    // ----------------------------------------
    if (isLoading) {
        return (
            <div className="settings-page animate-fade-in">
                <div className="page-header">
                    <Skeleton width="200px" height="2rem" />
                    <Skeleton width="350px" height="1rem" />
                </div>
                <div className="settings-grid">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton width="50%" height="1.25rem" />
                            </CardHeader>
                            <CardBody>
                                <div className="form-stack">
                                    <Skeleton height="2.5rem" />
                                    <Skeleton height="2.5rem" />
                                    <Skeleton height="2.5rem" />
                                    <Skeleton height="2.5rem" />
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // ----------------------------------------
    // Render
    // ----------------------------------------
    return (
        <div className="settings-page animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage your hotel's childcare service configuration</p>
            </div>

            <div className="settings-grid">
                {/* Hotel Profile */}
                <Card>
                    <CardHeader>
                        <CardTitle subtitle="Basic information about your hotel">Hotel Profile</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="form-stack">
                            <Input
                                label="Hotel Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter hotel name"
                            />
                            <Input
                                label="Contact Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="hotel@example.com"
                            />
                            <Input
                                label="Contact Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+82-2-000-0000"
                            />
                            <Textarea
                                label="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter full address"
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* Service Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle subtitle="Customize service availability">Service Settings</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="form-stack">
                            <label className="toggle-option">
                                <input
                                    type="checkbox"
                                    checked={autoAssign}
                                    onChange={(e) => setAutoAssign(e.target.checked)}
                                />
                                <span>Auto-Assign Sitters</span>
                            </label>
                            <label className="toggle-option">
                                <input
                                    type="checkbox"
                                    checked={requireGoldForInfant}
                                    onChange={(e) => setRequireGoldForInfant(e.target.checked)}
                                />
                                <span>Require Gold Tier for Infants</span>
                            </label>
                            <Input
                                label="Min Booking Hours"
                                type="number"
                                value={minBookingHours}
                                onChange={(e) => setMinBookingHours(Number(e.target.value))}
                                placeholder="2"
                            />
                            <Input
                                label="Max Advance Booking Days"
                                type="number"
                                value={maxAdvanceBookingDays}
                                onChange={(e) => setMaxAdvanceBookingDays(Number(e.target.value))}
                                placeholder="30"
                            />
                            <Select
                                label="Cancellation Policy"
                                value={cancellationPolicy}
                                onChange={(e) => setCancellationPolicy(e.target.value as CancellationPolicy)}
                                options={[
                                    { value: 'flexible', label: 'Flexible' },
                                    { value: 'moderate', label: 'Moderate' },
                                    { value: 'strict', label: 'Strict' },
                                ]}
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* Pricing */}
                <Card>
                    <CardHeader>
                        <CardTitle subtitle="Set your hotel's pricing">Pricing Configuration</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="form-stack">
                            <Input
                                label="Commission Rate (%)"
                                type="number"
                                value={commission}
                                onChange={(e) => setCommission(Number(e.target.value))}
                                placeholder="15"
                            />
                            <Select
                                label="Currency"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as Currency)}
                                options={[
                                    { value: 'KRW', label: 'KRW - Korean Won' },
                                    { value: 'USD', label: 'USD - US Dollar' },
                                    { value: 'JPY', label: 'JPY - Japanese Yen' },
                                ]}
                            />
                        </div>
                    </CardBody>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle subtitle="Manage notification preferences">Notifications</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="notification-settings">
                            <label className="toggle-option">
                                <input
                                    type="checkbox"
                                    checked={notifyNewBooking}
                                    onChange={(e) => setNotifyNewBooking(e.target.checked)}
                                />
                                <span>New booking notifications</span>
                            </label>
                            <label className="toggle-option">
                                <input
                                    type="checkbox"
                                    checked={notifySessionAlerts}
                                    onChange={(e) => setNotifySessionAlerts(e.target.checked)}
                                />
                                <span>Session start/end alerts</span>
                            </label>
                            <label className="toggle-option">
                                <input
                                    type="checkbox"
                                    checked={notifyEmergency}
                                    onChange={(e) => setNotifyEmergency(e.target.checked)}
                                />
                                <span>Emergency alerts</span>
                            </label>
                            <label className="toggle-option">
                                <input
                                    type="checkbox"
                                    checked={notifyDailySummary}
                                    onChange={(e) => setNotifyDailySummary(e.target.checked)}
                                />
                                <span>Daily summary email</span>
                            </label>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="settings-actions">
                <Button variant="secondary">Cancel</Button>
                <Button variant="gold" onClick={handleSave} isLoading={isSaving}>
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
