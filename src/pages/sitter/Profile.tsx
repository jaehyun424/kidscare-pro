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
import { useReviews } from '../../hooks/useReviews';
import { StarRating } from '../../components/common/ReviewForm';
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
    const { reviews, averageRating, isLoading: reviewsLoading } = useReviews(sitterId);

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
                    <h3 className="section-title">{t('profile.identityVerification')}</h3>
                    <div className="verification-grid">
                        <div className="verify-item verified">
                            <span className="verify-icon" aria-hidden="true">🏨</span>
                            <div className="verify-text">
                                <span className="verify-label">{t('profile.hotelPartnerVerified')}</span>
                                <span className="verify-sub">Grand Hyatt • 2024</span>
                            </div>
                            <span className="verify-check" aria-label="Verified">✓</span>
                        </div>
                        <div className="verify-item verified">
                            <span className="verify-icon" aria-hidden="true">🆔</span>
                            <div className="verify-text">
                                <span className="verify-label">{t('profile.govIdChecked')}</span>
                                <span className="verify-sub">{t('profile.nationalRegistry')}</span>
                            </div>
                            <span className="verify-check" aria-label="Verified">✓</span>
                        </div>
                        <div className="verify-item verified">
                            <span className="verify-icon" aria-hidden="true">⚖️</span>
                            <div className="verify-text">
                                <span className="verify-label">{t('profile.backgroundClear')}</span>
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

            {/* Reviews */}
            <Card>
                <CardBody>
                    <h3 className="section-title">Reviews</h3>
                    {reviewsLoading ? (
                        <p className="text-sm text-charcoal-500">{t('profile.loadingReviews')}</p>
                    ) : reviews.length > 0 ? (
                        <>
                            <div className="reviews-summary">
                                <StarRating rating={averageRating} />
                                <span className="reviews-count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="reviews-list">
                                {reviews.slice(0, 5).map((review) => (
                                    <div key={review.id} className="review-item">
                                        <div className="review-item-header">
                                            <StarRating rating={review.rating} size="sm" />
                                            <span className="review-date">
                                                {review.createdAt.toLocaleDateString()}
                                            </span>
                                        </div>
                                        {review.comment && (
                                            <p className="review-comment-text">{review.comment}</p>
                                        )}
                                        <span className="review-author">{review.parentName || 'Guest'}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-charcoal-500">{t('profile.noReviewsYet')}</p>
                    )}
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
                    <div className="settings-menu" role="navigation" aria-label={t('profile.settings')}>
                        <button className="menu-btn" onClick={() => success(t('profile.notifications'), t('profile.notifComingSoon'))}><span aria-hidden="true">🔔</span> {t('profile.notifications')}</button>
                        <button className="menu-btn" onClick={() => success(t('profile.availability'), t('profile.availComingSoon'))}><span aria-hidden="true">📅</span> {t('profile.availability')}</button>
                        <button className="menu-btn" onClick={() => success(t('profile.bankAccount'), t('profile.bankComingSoon'))}><span aria-hidden="true">💰</span> {t('profile.bankAccount')}</button>
                        <button className="menu-btn" onClick={() => success(t('profile.documents'), t('profile.docsComingSoon'))}><span aria-hidden="true">📄</span> {t('profile.documents')}</button>
                        <button className="menu-btn" onClick={() => success(t('profile.helpLabel'), t('profile.supportEmail'))}><span aria-hidden="true">❓</span> {t('profile.helpLabel')}</button>
                    </div>
                </CardBody>
            </Card>

            <Button variant="secondary" fullWidth onClick={handleSignOut}>{t('profile.signOut')}</Button>

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
                <div className="modal-form-stack">
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
