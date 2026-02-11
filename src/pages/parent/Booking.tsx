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
import { useAuth } from '../../contexts/AuthContext';
import { useChildren } from '../../hooks/useChildren';
import { useHotels } from '../../hooks/useHotel';

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
    const { user } = useAuth();
    const { children } = useChildren(user?.id);
    const { hotels } = useHotels();
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
                                options={hotels}
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
                            {children.map((child) => (
                                <label key={child.id} className="child-option">
                                    <input type="checkbox" defaultChecked={true} />
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
                                <span>{hotels.find((h) => h.value === formData.hotel)?.label || 'Grand Hyatt Seoul'}</span>
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
                                <span>{children.map(c => c.name + ' (' + c.age + 'y)').join(', ')}</span>
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

// Styles
const bookingStyles = `
.booking-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  color: var(--charcoal-900);
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 500;
}

/* Progress Steps */
.progress-steps {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 14px; /* Half of step-number height (28px) */
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: var(--cream-300);
  z-index: -1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  opacity: 0.5;
  transition: opacity 0.3s;
  background: var(--cream-100); /* To hide the line behind */
  padding: 0 0.5rem;
}

.step-active {
  opacity: 1;
}

.step-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid var(--charcoal-300);
  color: var(--charcoal-500);
  background: white;
  transition: all 0.3s;
}

.step-active .step-number {
  border-color: var(--gold-500);
  background: var(--gold-500);
  color: white;
  box-shadow: 0 0 0 4px var(--cream-200);
}

.step-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  color: var(--charcoal-900);
}

/* Card Overrides for "Paper" Look */
.booking-card {
  background: white !important;
  border: 1px solid var(--cream-300) !important;
  box-shadow: var(--shadow-sm) !important;
  border-radius: var(--radius-sm) !important;
}

.booking-card h2 {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--charcoal-900);
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 500;
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.time-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

/* Children Selection */
.children-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.child-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--cream-300);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.child-option:hover {
  border-color: var(--gold-300);
  background: var(--cream-50);
}

.child-option input {
  width: 20px;
  height: 20px;
  accent-color: var(--gold-500);
}

.child-name {
  display: block;
  font-weight: 600;
  color: var(--charcoal-900);
  font-size: 1rem;
}

.child-age {
  font-size: 0.875rem;
  color: var(--charcoal-500);
}

/* Summary "Receipt" */
.confirmation-summary {
  background: var(--cream-50);
  border: 1px solid var(--cream-300);
  border-radius: var(--radius-sm); /* jagged edge effect could be added here creatively */
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px dashed var(--cream-300);
  font-size: 0.95rem;
  color: var(--charcoal-700);
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row span:first-child {
  color: var(--charcoal-500);
}

.summary-row.total {
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--charcoal-900);
  border-bottom: none;
}

.summary-row.total span {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--charcoal-900);
}

.summary-row.total .price {
  color: var(--gold-600);
}

.terms-note {
  font-size: 0.75rem;
  color: var(--charcoal-400);
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.button-row {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.button-row > * {
  flex: 1;
}
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = bookingStyles; document.head.appendChild(s);
}
