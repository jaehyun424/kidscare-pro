// Sitter Profile Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { TierBadge, Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useSitterProfile } from '../../hooks/useSitters';
import '../../styles/pages/sitter-profile.css';

interface EditForm {
    displayName: string;
    phone: string;
    languages: string;
}

export default function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { signOut, user, updateUserProfile } = useAuth();
    const { success, error: showError } = useToast();
    const sitterId = user?.sitterInfo?.sitterId || user?.id;
    const { profile } = useSitterProfile(sitterId);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState<EditForm>({
        displayName: '',
        phone: '',
        languages: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const openEditModal = () => {
        setEditForm({
            displayName: profile.name,
            phone: user?.profile?.phone || '',
            languages: profile.languages.map((l) => l.name).join(', '),
        });
        setEditModalOpen(true);
    };

    const handleEditSubmit = async () => {
        setIsSaving(true);
        try {
            const nameParts = editForm.displayName.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            await updateUserProfile({
                firstName,
                lastName,
                phone: editForm.phone,
            });
            success(t('common.save'), t('sitter.profile.updateSuccess', 'Profile updated successfully'));
            setEditModalOpen(false);
        } catch (err) {
            showError(t('common.edit'), t('sitter.profile.updateError', 'Failed to update profile'));
        } finally {
            setIsSaving(false);
        }
    };

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
                        <Avatar name={profile.name} size="xl" variant="gold" />
                        <div className="profile-info">
                            <h2>{profile.name}</h2>
                            <TierBadge tier={profile.tier} />
                            <div className="profile-rating">⭐ {profile.rating} ({profile.reviewCount} reviews)</div>
                            <Button variant="ghost" size="sm" onClick={openEditModal}>
                                {t('common.edit')} {t('sitter.profile.title', 'Profile')}
                            </Button>
                        </div>
                    </div>
                    <div className="profile-stats">
                        <div className="pstat"><span className="pvalue">{profile.totalSessions}</span><span className="plabel">Sessions</span></div>
                        <div className="pstat"><span className="pvalue">{profile.safetyDays}</span><span className="plabel">Safe Days</span></div>
                        <div className="pstat"><span className="pvalue">{profile.onTimeRate}</span><span className="plabel">On-Time</span></div>
                    </div>
                </CardBody>
            </Card>

            {/* Verification Status - NEW */}
            <Card className="mb-4">
                <CardBody>
                    <h3 className="section-title">Identity Verification</h3>
                    <div className="verification-grid">
                        <div className="verify-item verified">
                            <span className="verify-icon" aria-hidden="true">🏨</span>
                            <div className="verify-text">
                                <span className="verify-label">Hotel Partner Verified</span>
                                <span className="verify-sub">Grand Hyatt • 2024</span>
                            </div>
                            <span className="verify-check" aria-label="Verified">✓</span>
                        </div>
                        <div className="verify-item verified">
                            <span className="verify-icon" aria-hidden="true">🆔</span>
                            <div className="verify-text">
                                <span className="verify-label">Gov. ID Checked</span>
                                <span className="verify-sub">National Registry</span>
                            </div>
                            <span className="verify-check" aria-label="Verified">✓</span>
                        </div>
                        <div className="verify-item verified">
                            <span className="verify-icon" aria-hidden="true">⚖️</span>
                            <div className="verify-text">
                                <span className="verify-label">Background Clear</span>
                                <span className="verify-sub">Valid until Dec 2025</span>
                            </div>
                            <span className="verify-check" aria-label="Verified">✓</span>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Certifications */}
            <Card>
                <CardBody>
                    <h3 className="section-title">Certifications</h3>
                    <div className="certs-list">
                        {profile.certifications.map((cert, i) => (
                            <Badge key={i} variant="success">✓ {cert}</Badge>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Languages */}
            <Card>
                <CardBody>
                    <h3 className="section-title">Languages</h3>
                    <div className="lang-list">
                        {profile.languages.map((lang, i) => (
                            <span key={i}>{lang.flag} {lang.name} ({lang.level})</span>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Settings */}
            <Card>
                <CardBody>
                    <div className="settings-menu" role="navigation" aria-label="Settings">
                        <button className="menu-btn"><span aria-hidden="true">🔔</span> Notifications</button>
                        <button className="menu-btn"><span aria-hidden="true">📅</span> Availability</button>
                        <button className="menu-btn"><span aria-hidden="true">💰</span> Bank Account</button>
                        <button className="menu-btn"><span aria-hidden="true">📄</span> Documents</button>
                        <button className="menu-btn" onClick={() => success('Help & Support', 'Support: support@kidscarepro.com')}><span aria-hidden="true">❓</span> Help</button>
                    </div>
                </CardBody>
            </Card>

            <Button variant="secondary" fullWidth onClick={handleSignOut}>Sign Out</Button>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title={t('common.edit') + ' ' + t('sitter.profile.title', 'Profile')}
                size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setEditModalOpen(false)} disabled={isSaving}>
                            {t('common.cancel')}
                        </Button>
                        <Button variant="primary" onClick={handleEditSubmit} disabled={isSaving}>
                            {isSaving ? t('common.loading') : t('common.save')}
                        </Button>
                    </>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input
                        label={t('common.name')}
                        value={editForm.displayName}
                        onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                        placeholder="Display Name"
                    />
                    <Input
                        label={t('common.phone')}
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="+82-10-1234-5678"
                    />
                    <Input
                        label={t('sitter.profile.languages', 'Languages')}
                        value={editForm.languages}
                        onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })}
                        hint={t('sitter.profile.languagesHint', 'Comma-separated, e.g. English, Korean')}
                        placeholder="English, Korean"
                    />
                </div>
            </Modal>
        </div>
    );
}
