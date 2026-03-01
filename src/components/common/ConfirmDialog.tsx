// ============================================
// KidsCare Pro - Confirm Dialog Component
// ============================================

import { Modal } from './Modal';
import { Button } from './Button';
import '../../styles/components/confirm-dialog.css';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary',
    isLoading = false,
    icon,
}: ConfirmDialogProps) {
    const buttonVariant = variant === 'danger' ? 'danger' : variant === 'warning' ? 'gold' : 'primary';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <div className="confirm-dialog-footer">
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button variant={buttonVariant} onClick={onConfirm} isLoading={isLoading}>
                        {confirmText}
                    </Button>
                </div>
            }
        >
            <div className="confirm-dialog-body">
                {icon && <div className="confirm-dialog-icon">{icon}</div>}
                <p className="confirm-dialog-message">{message}</p>
            </div>
        </Modal>
    );
}
