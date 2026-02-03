// ============================================
// KidsCare Pro - Parent Booking Page
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { useToast } from '../../contexts/ToastContext';

const HOTELS = [
    { value: 'grand-hyatt-seoul', label: 'Grand Hyatt Seoul' },
    { value: 'park-hyatt-busan', label: 'Park Hyatt Busan' },
    { value: 'four-seasons-seoul', label: 'Four Seasons Seoul' },
];

const CHILDREN = [
    { id: '1', name: 'Emma', age: 5, selected: true },
];

const TIME_SLOTS = [
    { value: '18:00', label: '18:00' },
    { value: '19:00', label: '19:00' },
    { value: '20:00', label: '20:00' },
    { value: '21:00', label: '21:00' },
];

export default function Booking() {
    const navigate = useNavigate();
    const { success } = useToast();
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        hotel: '',
        room: '',
        date: '',
        startTime: '',
        duration: '4',
        children: ['1'],
        notes: '',
    });

    const DURATION_OPTIONS = [
        { value: '2', label: `2 ${t('common.hours')}` },
        { value: '3', label: `3 ${t('common.hours')}` },
        { value: '4', label: `4 ${t('common.hours')}` },
        { value: '5', label: `5 ${t('common.hours')}` },
        { value: '6', label: `6 ${t('common.hours')}` },
    ];

    const STEP_LABELS = [
        t('booking.bookingDetails'),
        t('parent.children'),
        t('common.confirm')
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        setIsLoading(false);
        success(t('booking.bookingConfirmed'), t('booking.bookingConfirmed'));
        navigate('/parent');
    };

    const calculatePrice = () => {
        const baseRate = 70000;
        const hours = parseInt(formData.duration) || 4;
        return baseRate * hours;
    };

    return (
        <div className="booking-page animate-fade-in">
            <h1 className="page-title">{t('booking.newBooking')}</h1>

            {/* Progress Steps */}
            <div className="progress-steps">
                {STEP_LABELS.map((label, i) => (
                    <div key={i} className={`step ${i + 1 <= step ? 'step-active' : ''}`}>
                        <span className="step-number">{i + 1}</span>
                        <span className="step-label">{label}</span>
                    </div>
                ))}
            </div>

            {/* Step 1: Details */}
            {step === 1 && (
                <Card className="booking-card animate-fade-in">
                    <CardBody>
                        <h2>{t('booking.bookingDetails')}</h2>
                        <div className="form-stack">
                            <Select
                                label={t('booking.selectHotel')}
                                name="hotel"
                                value={formData.hotel}
                                onChange={handleInputChange}
                                options={HOTELS}
                                placeholder={t('booking.chooseHotel')}
                            />
                            <Input
                                label={t('common.room')}
                                name="room"
                                value={formData.room}
                                onChange={handleInputChange}
                                placeholder="e.g., 2305"
                            />
                            <Input
                                label={t('common.date')}
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleInputChange}
                            />
                            <div className="time-row">
                                <Select
                                    label={t('booking.startTime')}
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    options={TIME_SLOTS}
                                    placeholder={t('common.search') + '...'}
                                />
                                <Select
                                    label={t('booking.duration')}
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    options={DURATION_OPTIONS}
                                />
                            </div>
                        </div>
                        <Button variant="gold" fullWidth onClick={() => setStep(2)}>
                            {t('common.next')}
                        </Button>
                    </CardBody>
                </Card>
            )}

            {/* Step 2: Children */}
            {step === 2 && (
                <Card className="booking-card animate-fade-in">
                    <CardBody>
                        <h2>{t('booking.selectChildren')}</h2>
                        <div className="children-selection">
                            {CHILDREN.map((child) => (
                                <label key={child.id} className="child-option">
                                    <input type="checkbox" defaultChecked={child.selected} />
                                    <div className="child-info">
                                        <span className="child-name">{child.name}</span>
                                        <span className="child-age">{child.age} {t('common.age')}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <Input
                            label={t('booking.specialRequests')}
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder={t('booking.allergiesOrNeeds')}
                        />
                        <div className="button-row">
                            <Button variant="secondary" onClick={() => setStep(1)}>{t('common.back')}</Button>
                            <Button variant="gold" onClick={() => setStep(3)}>{t('common.next')}</Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
                <Card className="booking-card animate-fade-in">
                    <CardBody>
                        <h2>{t('booking.reviewBooking')}</h2>
                        <div className="confirmation-summary">
                            <div className="summary-row">
                                <span>{t('booking.selectHotel')}</span>
                                <span>{HOTELS.find((h) => h.value === formData.hotel)?.label || 'Grand Hyatt Seoul'}</span>
                            </div>
                            <div className="summary-row">
                                <span>{t('common.room')}</span>
                                <span>{formData.room || '2305'}</span>
                            </div>
                            <div className="summary-row">
                                <span>{t('booking.dateTime')}</span>
                                <span>{formData.date || t('time.today')} {formData.startTime || '18:00'}</span>
                            </div>
                            <div className="summary-row">
                                <span>{t('booking.duration')}</span>
                                <span>{formData.duration} {t('common.hours')}</span>
                            </div>
                            <div className="summary-row">
                                <span>{t('parent.children')}</span>
                                <span>Emma (5y)</span>
                            </div>
                            <div className="summary-row total">
                                <span>{t('booking.totalCost')}</span>
                                <span className="price">₩{calculatePrice().toLocaleString()}</span>
                            </div>
                        </div>
                        <p className="terms-note">
                            {t('auth.termsAgreement')}
                        </p>
                        <div className="button-row">
                            <Button variant="secondary" onClick={() => setStep(2)}>{t('common.back')}</Button>
                            <Button variant="gold" onClick={handleSubmit} isLoading={isLoading}>
                                {t('booking.confirmBooking')}
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}

// Styles
const bookingStyles = `
.booking-page { max-width: 480px; margin: 0 auto; }
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); margin-bottom: var(--space-6); text-align: center; }

.progress-steps {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.step {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  opacity: 0.4;
  transition: opacity var(--transition-fast);
}

.step-active { opacity: 1; }

.step-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-bg);
  border-radius: 50%;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
}

.step-active .step-number {
  background: var(--gold-500);
  color: var(--navy-900);
}

.step-label { font-size: var(--text-sm); }

.booking-card { margin-bottom: var(--space-4); }
.booking-card h2 { font-size: var(--text-lg); font-weight: var(--font-semibold); margin-bottom: var(--space-4); }

.form-stack { display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-6); }

.time-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }

.children-selection {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.child-option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--glass-bg);
  border-radius: var(--radius-lg);
  cursor: pointer;
}

.child-option input { width: 20px; height: 20px; accent-color: var(--gold-500); }

.child-name { display: block; font-weight: var(--font-medium); }
.child-age { font-size: var(--text-sm); color: var(--text-tertiary); }

.button-row { display: flex; gap: var(--space-3); margin-top: var(--space-4); }
.button-row > * { flex: 1; }

.confirmation-summary {
  background: var(--glass-bg);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--border-color);
}

.summary-row:last-child { border-bottom: none; }

.summary-row.total {
  margin-top: var(--space-2);
  padding-top: var(--space-3);
  border-top: 2px solid var(--border-color);
  font-weight: var(--font-bold);
}

.price { color: var(--gold-500); font-size: var(--text-lg); }

.terms-note {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-align: center;
  margin-bottom: var(--space-4);
}
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = bookingStyles; document.head.appendChild(s);
}
