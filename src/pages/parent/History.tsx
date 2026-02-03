// Parent History Page

import { useTranslation } from 'react-i18next';
import { Card, CardBody } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/Badge';

const HISTORY = [
    { id: '1', date: 'Jan 15, 2025', time: '18:00-22:00', hotel: 'Grand Hyatt Seoul', sitter: 'Kim Minjung', duration: '4h', amount: 280000, rating: 5, status: 'completed' as const },
    { id: '2', date: 'Jan 10, 2025', time: '19:00-23:00', hotel: 'Grand Hyatt Seoul', sitter: 'Park Sooyeon', duration: '4h', amount: 280000, rating: 5, status: 'completed' as const },
    { id: '3', date: 'Dec 28, 2024', time: '20:00-23:00', hotel: 'Park Hyatt Busan', sitter: 'Lee Jihye', duration: '3h', amount: 210000, rating: 4, status: 'completed' as const },
];

export default function History() {
    const { t } = useTranslation();
    const formatCurrency = (amount: number) => `₩${amount.toLocaleString()}`;

    return (
        <div className="history-page animate-fade-in">
            <h1 className="page-title">{t('parent.bookingHistory')}</h1>
            <p className="page-subtitle">{HISTORY.length} {t('sitter.completedSessions').toLowerCase()}</p>

            <div className="history-list">
                {HISTORY.map((item) => (
                    <Card key={item.id} className="history-item">
                        <CardBody>
                            <div className="history-header">
                                <div>
                                    <span className="history-date">{item.date}</span>
                                    <span className="history-time">{item.time}</span>
                                </div>
                                <StatusBadge status={item.status} />
                            </div>
                            <div className="history-details">
                                <span>🏨 {item.hotel}</span>
                                <span>👩‍🍼 {item.sitter}</span>
                            </div>
                            <div className="history-footer">
                                <span className="history-rating">{'⭐'.repeat(item.rating)}</span>
                                <span className="history-amount">{formatCurrency(item.amount)}</span>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Styles
const historyStyles = `
.history-page { max-width: 480px; margin: 0 auto; }
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); margin-bottom: var(--space-1); }
.page-subtitle { color: var(--text-secondary); margin-bottom: var(--space-6); }

.history-list { display: flex; flex-direction: column; gap: var(--space-4); }

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-3);
}

.history-date { display: block; font-weight: var(--font-semibold); }
.history-time { font-size: var(--text-sm); color: var(--text-tertiary); }

.history-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
}

.history-footer {
  display: flex;
  justify-content: space-between;
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-color);
}

.history-amount { font-weight: var(--font-semibold); color: var(--gold-500); }
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = historyStyles; document.head.appendChild(s);
}
