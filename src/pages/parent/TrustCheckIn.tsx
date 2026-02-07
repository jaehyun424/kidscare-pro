
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { SignaturePad } from '../../components/common/SignaturePad';
import type { SignaturePadRef } from '../../components/common/SignaturePad';
import { useToast } from '../../contexts/ToastContext';

export default function TrustCheckIn() {
    const navigate = useNavigate();
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        success('Check-in Complete', 'Care session has officially started.');
        navigate('/parent'); // Or to the live activity feed
        setIsSubmitting(false);
    };

    const renderStep1_Medical = () => (
        <div className="animate-fade-in">
            <h2 className="section-title">Medical & Well-being</h2>
            <p className="section-subtitle">Please confirm current health status.</p>

            <div className="space-y-6">
                <Input
                    label="Allergies (Food, Drug, Latex)"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
                <Input
                    label="Current Medications"
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                />
            </div>
        </div>
    );

    const renderStep2_Emergency = () => (
        <div className="animate-fade-in">
            <h2 className="section-title">Emergency Protocol</h2>
            <p className="section-subtitle">Who should we contact first?</p>

            <div className="space-y-6">
                <Input
                    label="Primary Emergency Contact Name"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                />
                <Input
                    label="Emergency Phone Number"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
                <div className="info-box">
                    <span className="info-icon">ℹ️</span>
                    <p>In case of a life-threatening emergency, we will contact EMS (119) first, then you immediately.</p>
                </div>
            </div>
        </div>
    );

    const renderStep3_Rules = () => (
        <div className="animate-fade-in">
            <h2 className="section-title">Safety Protocols</h2>
            <p className="section-subtitle">Agreed boundaries for the session.</p>

            <div className="rules-list">
                <label className="checkbox-row">
                    <input
                        type="checkbox"
                        checked={formData.rulesAccepted}
                        onChange={(e) => setFormData({ ...formData, rulesAccepted: e.target.checked })}
                    />
                    <span className="checkbox-text">
                        I authorize the Sitter to administer basic first aid if necessary and confirm that my child has no undisclosed contagious conditions.
                    </span>
                </label>
            </div>
            <div className="signature-section mt-8">
                <label className="form-label mb-2 block">Parent/Guardian Signature</label>
                <SignaturePad ref={signatureRef} />
                <button
                    className="text-xs text-charcoal-500 mt-2 hover:text-charcoal-900 underline"
                    onClick={() => signatureRef.current?.clear()}
                >
                    Clear Signature
                </button>
            </div>
        </div>
    );

    return (
        <div className="trust-checkin-page">
            <div className="max-w-md mx-auto py-8 px-4">
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl text-charcoal-900 mb-2">Care Handover</h1>
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
                                <Button variant="ghost" onClick={handleBack}>Back</Button>
                            ) : (
                                <div /> /* Spacer */
                            )}

                            {step < 3 ? (
                                <Button onClick={handleNext} variant="gold">
                                    Next Step
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    variant="gold"
                                    isLoading={isSubmitting}
                                >
                                    Confirm Handover
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
