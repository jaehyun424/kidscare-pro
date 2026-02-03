// Parent Trust Check-In Page
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../contexts/ToastContext';

export default function TrustCheckIn() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { success } = useToast();
    const [step, setStep] = useState(1);
    const [safeWord, setSafeWord] = useState('');

    const handleComplete = () => {
        success('Check-In Complete!', 'Trust Protocol has been verified.');
        navigate(`/parent/live/${bookingId}`);
    };

    return (
        <div className="trust-checkin animate-fade-in">
            <h1 className="page-title">🛡️ Trust Check-In</h1>
            <p className="page-subtitle">Complete the Trust Protocol to start the session</p>

            <div className="checklist">
                {/* Step 1: Badge Verification */}
                <Card className={`checklist-item ${step >= 1 ? 'item-active' : ''}`}>
                    <CardBody>
                        <div className="item-header">
                            <span className="item-icon">{step > 1 ? '✅' : '🔒'}</span>
                            <h3>Digital Badge Verification</h3>
                        </div>
                        {step === 1 && (
                            <div className="item-content">
                                <p>Verify the sitter's digital badge by scanning the QR code or checking the ID.</p>
                                <Button variant="gold" fullWidth onClick={() => setStep(2)}>
                                    I've Verified the Badge
                                </Button>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Step 2: Safe Word */}
                <Card className={`checklist-item ${step >= 2 ? 'item-active' : ''}`}>
                    <CardBody>
                        <div className="item-header">
                            <span className="item-icon">{step > 2 ? '✅' : step === 2 ? '🔑' : '⏳'}</span>
                            <h3>Safe Word Confirmation</h3>
                        </div>
                        {step === 2 && (
                            <div className="item-content">
                                <p>Ask the sitter for the safe word to confirm their identity.</p>
                                <Input
                                    label="Enter Safe Word"
                                    value={safeWord}
                                    onChange={(e) => setSafeWord(e.target.value)}
                                    placeholder="Type the safe word..."
                                />
                                <Button variant="gold" fullWidth onClick={() => setStep(3)} disabled={safeWord.length < 3}>
                                    Confirm Safe Word
                                </Button>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Step 3: Joint Checklist */}
                <Card className={`checklist-item ${step >= 3 ? 'item-active' : ''}`}>
                    <CardBody>
                        <div className="item-header">
                            <span className="item-icon">{step > 3 ? '✅' : step === 3 ? '📋' : '⏳'}</span>
                            <h3>Joint Checklist</h3>
                        </div>
                        {step === 3 && (
                            <div className="item-content">
                                <div className="checklist-items">
                                    <label><input type="checkbox" /> Child's belongings confirmed</label>
                                    <label><input type="checkbox" /> Emergency contacts shared</label>
                                    <label><input type="checkbox" /> Allergies/medical info reviewed</label>
                                    <label><input type="checkbox" /> Special instructions discussed</label>
                                </div>
                                <Button variant="gold" fullWidth onClick={() => setStep(4)}>
                                    Complete Checklist
                                </Button>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Step 4: Consent */}
                <Card className={`checklist-item ${step >= 4 ? 'item-active' : ''}`}>
                    <CardBody>
                        <div className="item-header">
                            <span className="item-icon">{step === 4 ? '✍️' : '⏳'}</span>
                            <h3>Emergency Consent</h3>
                        </div>
                        {step === 4 && (
                            <div className="item-content">
                                <p>By proceeding, you authorize emergency medical care if needed.</p>
                                <Button variant="gold" fullWidth onClick={handleComplete}>
                                    Sign & Complete Check-In
                                </Button>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

// Styles
const trustStyles = `
.trust-checkin { max-width: 480px; margin: 0 auto; }
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); text-align: center; margin-bottom: var(--space-2); }
.page-subtitle { text-align: center; color: var(--text-secondary); margin-bottom: var(--space-6); }

.checklist { display: flex; flex-direction: column; gap: var(--space-4); }

.checklist-item {
  opacity: 0.5;
  transition: opacity var(--transition-base);
}

.item-active { opacity: 1; }

.item-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.item-icon { font-size: 1.5rem; }

.item-header h3 {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

.item-content {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-color);
}

.item-content p {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}

.checklist-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.checklist-items label {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--glass-bg);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.checklist-items input { accent-color: var(--gold-500); width: 18px; height: 18px; }
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = trustStyles; document.head.appendChild(s);
}
