// ============================================
// Petit Stay - Modal Component
// ============================================

import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './Button';

// ----------------------------------------
// Types
// ----------------------------------------
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    children: React.ReactNode;
    footer?: React.ReactNode;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
}

// ----------------------------------------
// Component
// ----------------------------------------
export function Modal({
    isOpen,
    onClose,
    title,
    size = 'md',
    children,
    footer,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
}: ModalProps) {
    // Handle escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape) {
            onClose();
        }
    }, [closeOnEscape, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const sizeClass = `modal-${size}`;

    return (
        <div className="modal-root">
            <div
                className="overlay"
                onClick={closeOnOverlayClick ? onClose : undefined}
                aria-hidden="true"
            />
            <div
                className={`modal ${sizeClass}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                {(title || showCloseButton) && (
                    <div className="modal-header">
                        {title && <h2 id="modal-title" className="modal-title">{title}</h2>}
                        {showCloseButton && (
                            <IconButton
                                icon={<X size={20} strokeWidth={1.75} />}
                                onClick={onClose}
                                aria-label="Close modal"
                                variant="ghost"
                            />
                        )}
                    </div>
                )}
                <div className="modal-body">{children}</div>
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    );
}

// ----------------------------------------
// Confirm Modal Helper
// ----------------------------------------
interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary',
    isLoading = false,
}: ConfirmModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </button>
                    <button
                        className={`btn btn-${variant}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : confirmText}
                    </button>
                </>
            }
        >
            <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
        </Modal>
    );
}