
import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { SignaturePad } from '../../components/common/SignaturePad';
import type { SignaturePadRef } from '../../components/common/SignaturePad';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_MODE } from '../../hooks/useDemo';
import { storageService } from '../../services/storage';
import { bookingService, sessionService } from '../../services/firestore';

export default function TrustCheckIn() {
    const navigate = useNavigate();
    const { id: bookingId } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const { user } = useAuth();
    const { success, error } = useToast();
    const signatureRef = useRef<SignaturePadRef>(null);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        allergies: 'None',
        medications: 'None',
        emergencyContact: '+82-10-1234-5678', // Pre-filled from profile in real app
        emergencyName: 'John Doe',
        rulesAccepted: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => {
        if (step === 3 && !formData.rulesAccepted) {
            error('Action Required', 'Please accept the safety protocols.');
            return;
        }
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        if (signatureRef.current?.isEmpty()) {
            error('Signature Required', 'Please sign to acknowledge transfer of care.');
            return;
        }

        setIsSubmitting(true);
        try {
            if (DEMO_MODE) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else {
                const signatureDataUrl = signatureRef.current?.toDataURL() || '';

                // Upload signature
                let signatureUrl = '';
                if (bookingId && signatureDataUrl) {
                    signatureUrl = await storageService.uploadSignature(bookingId, 'parent', signatureDataUrl);
                }

                // Update booking with trust protocol data
                if (bookingId) {
                    await bookingService.updateBooking(bookingId, {
                        trustProtocol: {
                            safeWord: '',
                            checkIn: {
                                timestamp: new Date(),
                                sitterVerified: true,
                                parentVerified: true,
                                roomSafetyChecked: true,
                                childConditionNoted: true,
                                emergencyConsentSigned: formData.rulesAccepted,
                                signatures: {
                                    parent: signatureUrl,
                                    sitter: '',
                                },
                            },
                        },
                        status: 'in_progress',
                    });

                    // Start care session
                    await sessionService.startSession({
                        bookingId,
                        hotelId: '',
                        sitterId: '',
                        parentId: user?.id || '',
                        status: 'active',
                        timeline: [{
                            id: `evt_${Date.now()}`,
                            type: 'check_in',
                            timestamp: new Date(),
                            description: 'Trust check-in completed',
                            isPrivate: false,
                        }],
                        checklist: {
                            roomSafety: { windowsSecured: false, balconyLocked: false, hazardsRemoved: false, emergencyExitKnown: false },
                            childInfo: { allergiesConfirmed: true, medicationNoted: true, sleepScheduleNoted: false },
                            supplies: { diapersProvided: false, snacksProvided: false, toysAvailable: false, emergencyKitReady: false },
                        },
                        emergencyLog: [],
                        actualTimes: { checkInAt: new Date(), startedAt: new Date() },
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                }
            }

            success('Check-in Complete', 'Care session has officially started.');
            navigate('/parent');
        } catch (err) {
            console.error('Check-in failed:', err);
            error('Check-in Failed', 'Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep1_Medical = () => (
        <div className="animate-fade-in">
            <h2 className="section-title">{t('trustCheckin.medicalWellbeing')}</h2>
            <p className="section-subtitle">{t('trustCheckin.confirmHealthStatus')}</p>

            <div className="space-y-6">
                <Input
                    label={t('trustCheckin.allergiesLabel')}
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
                <Input
                    label={t('trustCheckin.currentMedications')}
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                />
            </div>
        </div>
    );

    const renderStep2_Emergency = () => (
        <div className="animate-fade-in">
            <h2 className="section-title">{t('trustCheckin.emergencyProtocol')}</h2>
            <p className="section-subtitle">{t('trustCheckin.whoToContactFirst')}</p>

            <div className="space-y-6">
                <Input
                    label={t('trustCheckin.emergencyContactName')}
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                />
                <Input
                    label={t('trustCheckin.emergencyPhone')}
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
                <div className="info-box">
                    <span className="info-icon">ℹ️</span>
                    <p>{t('trustCheckin.emsInfo')}</p>
                </div>
            </div>
        </div>
    );

    const renderStep3_Rules = () => (
        <div className="animate-fade-in">
            <h2 className="section-title">{t('trustCheckin.safetyProtocols')}</h2>
            <p className="section-subtitle">{t('trustCheckin.agreedBoundaries')}</p>

            <div className="rules-list">
                <label className="checkbox-row">
                    <input
                        type="checkbox"
                        checked={formData.rulesAccepted}
                        onChange={(e) => setFormData({ ...formData, rulesAccepted: e.target.checked })}
                    />
                    <span className="checkbox-text">
                        {t('trustCheckin.firstAidConsent')}
                    </span>
                </label>
            </div>
            <div className="signature-section mt-8">
                <label className="form-label mb-2 block">{t('trustCheckin.parentSignature')}</label>
                <SignaturePad ref={signatureRef} />
                <button
                    className="text-xs text-charcoal-500 mt-2 hover:text-charcoal-900 underline"
                    onClick={() => signatureRef.current?.clear()}
                >
                    {t('trustCheckin.clearSignature')}
                </button>
            </div>
        </div>
    );

    return (
        <div className="trust-checkin-page">
            <div className="max-w-md mx-auto py-8 px-4">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl text-charcoal-900 mb-2">{t('trustCheckin.careHandover')}</h1>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1 w-8 rounded-full transition-colors ${step >= i ? 'background-gold' : 'bg-gray-200'}`} />
                        ))}
                    </div>
                </div>

                <Card className="checkin-card" padding="lg">
                    <CardBody>
                        {step === 1 && renderStep1_Medical()}
                        {step === 2 && renderStep2_Emergency()}
                        {step === 3 && renderStep3_Rules()}

                        <div className="flex justify-between mt-8 pt-6 border-t border-cream-200">
                            {step > 1 ? (
                                <Button variant="ghost" onClick={handleBack}>{t('common.back')}</Button>
                            ) : (
                                <div /> /* Spacer */
                            )}

                            {step < 3 ? (
                                <Button onClick={handleNext} variant="gold">
                                    {t('trustCheckin.nextStep')}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    variant="gold"
                                    isLoading={isSubmitting}
                                >
                                    {t('trustCheckin.confirmHandover')}
                                </Button>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>

            <style>{`
                .trust-checkin-page {
                    min-height: 100vh;
                    background-color: var(--cream-100);
                }
                .section-title {
                    font-family: var(--font-serif);
                    font-size: 1.5rem;
                    color: var(--charcoal-900);
                    margin-bottom: 0.5rem;
                }
                .section-subtitle {
                    color: var(--charcoal-500);
                    margin-bottom: 2rem;
                    font-size: 0.95rem;
                }
                .background-gold {
                    background-color: var(--gold-500);
                }
                .info-box {
                    background: var(--cream-50);
                    border: 1px solid var(--cream-200);
                    padding: 1rem;
                    border-radius: 4px;
                    display: flex;
                    gap: 0.75rem;
                    align-items: flex-start;
                    font-size: 0.875rem;
                    color: var(--charcoal-600);
                }
                .checkbox-row {
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                    cursor: pointer;
                    padding: 1rem;
                    border: 1px solid var(--cream-300);
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                .checkbox-row:hover {
                    border-color: var(--gold-400);
                    background: white;
                }
                .checkbox-text {
                    font-size: 0.9rem;
                    line-height: 1.5;
                    color: var(--charcoal-700);
                }
                input[type="checkbox"] {
                    margin-top: 0.25rem;
                    accent-color: var(--gold-500);
                    width: 1.25rem;
                    height: 1.25rem;
                }
            `}</style>
        </div>
    );
}
