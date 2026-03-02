// ============================================
// Petit Stay - Payment Method Card Component
// ============================================

import { useTranslation } from 'react-i18next';
import { CreditCard } from 'lucide-react';
import { Button } from './Button';
import type { PaymentMethodCard as PaymentMethodType } from '../../types';

const BRAND_LABELS: Record<string, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'Amex',
    other: 'Card',
};

interface PaymentMethodCardProps {
    card: PaymentMethodType;
    onRemove?: (id: string) => void;
}

export function PaymentMethodCardDisplay({ card, onRemove }: PaymentMethodCardProps) {
    const { t } = useTranslation();

    return (
        <div className="payment-card-item">
            <span className="payment-card-icon"><CreditCard size={20} strokeWidth={1.75} /></span>
            <div className="payment-card-info">
                <span className="payment-card-brand">
                    {BRAND_LABELS[card.brand]} **** {card.last4}
                </span>
                <span className="payment-card-expiry">
                    {t('profile.expiry')}: {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                </span>
            </div>
            {card.isDefault && <span className="payment-card-default">Default</span>}
            {onRemove && (
                <Button variant="ghost" size="sm" onClick={() => onRemove(card.id)}>
                    {t('common.remove')}
                </Button>
            )}
        </div>
    );
}
