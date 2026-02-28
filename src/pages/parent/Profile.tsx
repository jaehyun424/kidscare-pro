// Parent Profile Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { Modal, ConfirmModal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useChildren } from '../../hooks/useChildren';
import { useToast } from '../../contexts/ToastContext';
import type { DemoChild } from '../../data/demo';
import '../../styles/pages/parent-profile.css';

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
];

const GENDER_OPTIONS = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'other', label: 'Other' },
];

const GENDER_AVATAR: Record<string, string> = {
    female: '👧',
    male: '👦',
    other: '🧒',
};

type ChildFormData = {
    name: string;
    age: string;
    gender: 'male' | 'female' | 'other';
    allergies: string;
};

const EMPTY_FORM: ChildFormData = { name: '', age: '', gender: 'female', allergies: '' };

export default function Profile() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { t, i18n } = useTranslation();
    const { children, isLoading, addChild, updateChild, removeChild } = useChildren(user?.id);
    const toast = useToast();

    // Modal state
    const [showChildModal, setShowChildModal] = useState(false);
    const [editingChild, setEditingChild] = useState<DemoChild | null>(null);
    const [childForm, setChildForm] = useState<ChildFormData>(EMPTY_FORM);
    const [formErrors, setFormErrors] = useState<Partial<ChildFormData>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Remove confirmation
    const [removeTarget, setRemoveTarget] = useState<DemoChild | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    // Language picker
    const [showLanguagePicker, setShowLanguagePicker] = useState(false);

    // --- Child modal helpers ---

    const openAddModal = () => {
        setEditingChild(null);
        setChildForm(EMPTY_FORM);
        setFormErrors({});
        setShowChildModal(true);
    };

    const openEditModal = (child: DemoChild) => {
        setEditingChild(child);
        setChildForm({
            name: child.name,
            age: String(child.age),
            gender: child.gender,
            allergies: child.allergies.join(', '),
        });
        setFormErrors({});
        setShowChildModal(true);
    };

    const closeChildModal = () => {
        setShowChildModal(false);
        setEditingChild(null);
        setChildForm(EMPTY_FORM);
        setFormErrors({});
    };

    const validateForm = (): boolean => {
        const errors: Partial<ChildFormData> = {};
        if (!childForm.name.trim()) errors.name = t('common.required') || 'Required';
        const ageNum = Number(childForm.age);
        if (!childForm.age || isNaN(ageNum) || ageNum < 0 || ageNum > 17) {
            errors.age = t('common.invalid') || 'Enter a valid age (0-17)';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChildSubmit = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            const allergiesArr = childForm.allergies
                .split(',')
                .map((a) => a.trim())
                .filter(Boolean);

            if (editingChild) {
                await updateChild(editingChild.id, {
                    name: childForm.name.trim(),
                    age: Number(childForm.age),
                    gender: childForm.gender,
                    allergies: allergiesArr,
                });
                toast.success(t('common.save'), childForm.name.trim());
            } else {
                await addChild({
                    name: childForm.name.trim(),
                    age: Number(childForm.age),
                    gender: childForm.gender,
                    allergies: allergiesArr,
                });
                toast.success(t('parent.addChild'), childForm.name.trim());
            }
            closeChildModal();
        } catch (err) {
            console.error('Failed to save child:', err);
            toast.error(t('common.error') || 'Error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveChild = async () => {
        if (!removeTarget) return;
        setIsRemoving(true);
        try {
            await removeChild(removeTarget.id);
            toast.success(t('common.remove') || 'Removed', removeTarget.name);
            setRemoveTarget(null);
        } catch (err) {
            console.error('Failed to remove child:', err);
            toast.error(t('common.error') || 'Error');
        } finally {
            setIsRemoving(false);
        }
    };

    // --- Language picker ---

    const handleLanguageChange = (code: string) => {
        i18n.changeLanguage(code);
        setShowLanguagePicker(false);
        const lang = LANGUAGES.find((l) => l.code === code);
        toast.success(t('auth.preferredLanguage'), lang?.label || code);
    };

    // --- Sign out ---

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    // --- Render ---

    const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

    return (
        <div className="profile-page animate-fade-in">
            {/* User Info */}
            <Card className="profile-card">
                <CardBody>
                    <div className="profile-header">
                        <Avatar name={`${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`} size="xl" />
                        <div className="profile-info">
                            <h2>{user?.profile?.firstName} {user?.profile?.lastName}</h2>
                            <span className="email">{user?.email || ''}</span>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Children */}
            <Card>
                <CardBody>
                    <h3 className="section-title">{t('parent.myChildren')}</h3>
                    <div className="children-list">
                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                                <span className="spinner" />
                            </div>
                        ) : children.length === 0 ? (
                            <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-4)' }}>
                                {t('common.none') || 'None'}
                            </p>
                        ) : (
                            children.map((child) => (
                                <div className="child-item" key={child.id}>
                                    <span className="child-avatar">{GENDER_AVATAR[child.gender] || '🧒'}</span>
                                    <div className="child-info">
                                        <span className="child-name">{child.name}</span>
                                        <span className="child-age">{t('common.yearsOld', { count: child.age })}</span>
                                        {child.allergies.length > 0 && (
                                            <span className="child-allergies">
                                                {t('common.allergies') || 'Allergies'}: {child.allergies.join(', ')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="child-actions">
                                        <Button variant="ghost" size="sm" onClick={() => openEditModal(child)}>
                                            {t('common.edit')}
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(child)}>
                                            {t('common.remove') || 'Remove'}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <Button variant="secondary" fullWidth onClick={openAddModal}>
                        + {t('parent.addChild')}
                    </Button>
                </CardBody>
            </Card>

            {/* Settings Menu */}
            <Card>
                <CardBody>
                    <div className="settings-menu" role="navigation" aria-label="Settings">
                        <button className="menu-item"><span aria-hidden="true">🔔</span> {t('parent.notifications')}</button>
                        <button className="menu-item" onClick={() => setShowLanguagePicker(true)}>
                            <span aria-hidden="true">🌐</span> {t('auth.preferredLanguage')}
                            <span style={{ marginLeft: 'auto', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                                {currentLang.flag} {currentLang.label}
                            </span>
                        </button>
                        <button className="menu-item"><span aria-hidden="true">💳</span> {t('parent.paymentMethods')}</button>
                        <button className="menu-item"><span aria-hidden="true">📄</span> {t('parent.termsOfService')}</button>
                        <button className="menu-item"><span aria-hidden="true">🔒</span> {t('parent.privacyPolicy')}</button>
                        <button className="menu-item"><span aria-hidden="true">❓</span> {t('parent.help')}</button>
                    </div>
                </CardBody>
            </Card>

            <Button variant="secondary" fullWidth onClick={handleSignOut}>
                {t('auth.signOut')}
            </Button>

            {/* Add/Edit Child Modal */}
            <Modal
                isOpen={showChildModal}
                onClose={closeChildModal}
                title={editingChild ? t('common.edit') : t('parent.addChild')}
                size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={closeChildModal} disabled={isSaving}>
                            {t('common.cancel')}
                        </Button>
                        <Button variant="primary" onClick={handleChildSubmit} disabled={isSaving}>
                            {isSaving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : t('common.save')}
                        </Button>
                    </>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Input
                        label={t('common.name')}
                        value={childForm.name}
                        onChange={(e) => setChildForm((f) => ({ ...f, name: e.target.value }))}
                        error={formErrors.name}
                        placeholder="e.g. Emma"
                    />
                    <Input
                        label={t('common.age')}
                        type="number"
                        min={0}
                        max={17}
                        value={childForm.age}
                        onChange={(e) => setChildForm((f) => ({ ...f, age: e.target.value }))}
                        error={formErrors.age}
                        placeholder="e.g. 5"
                    />
                    <Select
                        label={t('common.gender') || 'Gender'}
                        value={childForm.gender}
                        onChange={(e) => setChildForm((f) => ({ ...f, gender: e.target.value as 'male' | 'female' | 'other' }))}
                        options={GENDER_OPTIONS}
                    />
                    <Input
                        label={t('common.allergies') || 'Allergies'}
                        value={childForm.allergies}
                        onChange={(e) => setChildForm((f) => ({ ...f, allergies: e.target.value }))}
                        placeholder={t('booking.allergiesOrNeeds') || 'e.g. peanuts, dairy'}
                        hint={t('common.commaSeparated') || 'Comma-separated'}
                    />
                </div>
            </Modal>

            {/* Remove Child Confirmation */}
            <ConfirmModal
                isOpen={!!removeTarget}
                onClose={() => setRemoveTarget(null)}
                onConfirm={handleRemoveChild}
                title={t('common.remove') || 'Remove'}
                message={`${t('common.confirmRemove') || 'Are you sure you want to remove'} ${removeTarget?.name || ''}?`}
                confirmText={t('common.remove') || 'Remove'}
                cancelText={t('common.cancel')}
                variant="danger"
                isLoading={isRemoving}
            />

            {/* Language Picker Modal */}
            <Modal
                isOpen={showLanguagePicker}
                onClose={() => setShowLanguagePicker(false)}
                title={t('auth.preferredLanguage')}
                size="sm"
            >
                <div className="language-picker-list">
                    {LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            className={`language-picker-item ${lang.code === i18n.language ? 'active' : ''}`}
                            onClick={() => handleLanguageChange(lang.code)}
                        >
                            <span className="language-picker-flag">{lang.flag}</span>
                            <span className="language-picker-label">{lang.label}</span>
                            {lang.code === i18n.language && (
                                <span className="language-picker-check" aria-hidden="true">&#10003;</span>
                            )}
                        </button>
                    ))}
                </div>
            </Modal>
        </div>
    );
}
