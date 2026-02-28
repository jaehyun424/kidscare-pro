// Parent History Page

import { useTranslation } from 'react-i18next';
import { Card, CardBody } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton, SkeletonText } from '../../components/common/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { useParentBookings } from '../../hooks/useBookings';
import '../../styles/pages/parent-history.css';

export default function History() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { history, isLoading } = useParentBookings(user?.id);
    const formatCurrency = (amount: number) => `₩${amount.toLocaleString()}`;

    if (isLoading) {
        return (
            <div className="history-page animate-fade-in">
                <Skeleton width="50%" height="2rem" />
                <Skeleton width="30%" height="1rem" className="mt-2" />
                <div className="history-list mt-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="card" style={{ marginBottom: '0.75rem' }}>
                            <div className="flex justify-between items-center">
                                <div style={{ flex: 1 }}>
                                    <Skeleton width="45%" height="1rem" />
                                    <Skeleton width="30%" height="0.75rem" className="mt-2" />
                                </div>
                                <Skeleton width="80px" height="1.5rem" borderRadius="var(--radius-full)" />
                            </div>
                            <SkeletonText lines={2} className="mt-4" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="history-page animate-fade-in">
            <h1 className="page-title">{t('parent.bookingHistory')}</h1>
            <p className="page-subtitle">{history.length} {t('sitter.completedSessions').toLowerCase()}</p>

            {history.length > 0 ? (
                <div className="history-list">
                    {history.map((item) => (
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
                                    <span className="history-rating" aria-label={`${item.rating} star rating`}>{'⭐'.repeat(item.rating)}</span>
                                    <span className="history-amount">{formatCurrency(item.amount)}</span>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon="📋"
                    title={t('parent.noSessionHistory', 'No session history yet')}
                    description={t('parent.noSessionHistoryDesc', 'Your past bookings and sessions will appear here once completed.')}
                />
            )}
        </div>
    );
}
