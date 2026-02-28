// ============================================
// KidsCare Pro - Hotel Settings Page
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Input, Select, Textarea } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { useHotel } from '../../hooks/useHotel';
import { useToast } from '../../contexts/ToastContext';
import type { Currency, CancellationPolicy } from '../../types';
import '../../styles/pages/hotel-settings.css';

export default function Settings() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { hotel, isLoading, updateHotel } = useHotel(user?.hotelId);
    const { success, error: toastError } = useToast();

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
    // Validation state
    // ----------------------------------------
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // ----------------------------------------
    // Populate form from hotel data
    // ----------------------------------------
    const populateForm = useCallback(() => {
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
            setFormErrors({});
        }
    }, [hotel]);

    useEffect(() => {
        populateForm();
    }, [populateForm]);

    // ----------------------------------------
    // Clear a single field error
    // ----------------------------------------
    const clearError = (field: string) => {
        setFormErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    // ----------------------------------------
    // Validate form
    // ----------------------------------------
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name.trim()) {
            errors.name = 'Hotel name is required';
        }
        if (!email.trim() || !emailRegex.test(email)) {
            errors.email = 'Valid email is required';
        }
        if (!phone.trim()) {
            errors.phone = 'Phone number is required';
        }
        if (commission < 0 || commission > 100) {
            errors.commission = 'Commission must be between 0 and 100';
        }
        if (minBookingHours < 1) {
            errors.minBookingHours = 'Minimum 1 hour';
        }
        if (maxAdvanceBookingDays < 1) {
            errors.maxAdvanceBookingDays = 'Minimum 1 day';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ----------------------------------------
    // Cancel handler
    // ----------------------------------------
    const handleCancel = () => {
        populateForm();
    };

    // ----------------------------------------
    // Save handler
    // ----------------------------------------
    const handleSave = async () => {
        if (!validateForm()) return;

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
            toastError('Save failed', 'Could not update settings.');
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
                <h1 className="page-title">{t('hotel.hotelSettings', 'Hotel Settings')}</h1>
                <p className="page-subtitle">{t('hotel.hotelSettingsSubtitle', "Manage your hotel's childcare service configuration")}</p>
            </div>

            <div className="settings-grid" role="form" aria-label="Hotel settings">
                {/* Hotel Profile */}
                <Card>
                    <CardHeader>
                        <CardTitle subtitle={t('hotel.hotelProfileSubtitle', 'Basic information about your hotel')}>{t('hotel.hotelProfile', 'Hotel Profile')}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="form-stack">
                            <Input
                                label="Hotel Name"
                                value={name}
                                error={formErrors.name}
                                onChange={(e) => { setName(e.target.value); clearError('name'); }}
                                placeholder="Enter hotel name"
                            />
                            <Input
                                label="Contact Email"
                                type="email"
                                value={email}
                                error={formErrors.email}
                                onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
                                placeholder="hotel@example.com"
                            />
                            <Input
                                label="Contact Phone"
                                value={phone}
                                error={formErrors.phone}
                                onChange={(e) => { setPhone(e.target.value); clearError('phone'); }}
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
                        <CardTitle subtitle={t('hotel.serviceSettingsSubtitle', 'Customize service availability')}>{t('hotel.serviceSettings', 'Service Settings')}</CardTitle>
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
                                error={formErrors.minBookingHours}
                                onChange={(e) => { setMinBookingHours(Number(e.target.value)); clearError('minBookingHours'); }}
                                placeholder="2"
                            />
                            <Input
                                label="Max Advance Booking Days"
                                type="number"
                                value={maxAdvanceBookingDays}
                                error={formErrors.maxAdvanceBookingDays}
                                onChange={(e) => { setMaxAdvanceBookingDays(Number(e.target.value)); clearError('maxAdvanceBookingDays'); }}
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
                        <CardTitle subtitle={t('hotel.pricingSettingsSubtitle', "Set your hotel's pricing")}>{t('hotel.pricingSettings', 'Pricing Configuration')}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="form-stack">
                            <Input
                                label="Commission Rate (%)"
                                type="number"
                                value={commission}
                                error={formErrors.commission}
                                onChange={(e) => { setCommission(Number(e.target.value)); clearError('commission'); }}
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
                        <CardTitle subtitle={t('hotel.notificationSettingsSubtitle', 'Manage notification preferences')}>{t('hotel.notificationSettings', 'Notification Settings')}</CardTitle>
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
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                <Button variant="gold" onClick={handleSave} isLoading={isSaving}>
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
