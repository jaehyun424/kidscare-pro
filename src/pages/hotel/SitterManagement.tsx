// ============================================
// KidsCare Pro - Sitter Management Page
// ============================================


import { Card, CardBody } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { TierBadge, Badge, SafetyBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useHotelSitters } from '../../hooks/useSitters';

export default function SitterManagement() {
  const { user } = useAuth();
  const { sitters } = useHotelSitters(user?.hotelId);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="sitter-management-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sitter Management</h1>
          <p className="page-subtitle">{sitters.length} sitters registered at your hotel</p>
        </div>
        <Button variant="gold">Add New Sitter</Button>
      </div>

      <div className="sitters-grid">
        {sitters.map((sitter) => (
          <Card key={sitter.id} className="sitter-card">
            <CardBody>
              <div className="sitter-header">
                <Avatar name={sitter.name} size="xl" variant={sitter.tier === 'gold' ? 'gold' : 'default'} />
                <div className="sitter-info">
                  <h3 className="sitter-name">{sitter.name}</h3>
                  <TierBadge tier={sitter.tier} />
                  <div className="sitter-rating">
                    ⭐ {sitter.rating} ({sitter.sessionsCompleted} sessions)
                    {sitter.tier === 'gold' && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="sitter-status">
                <Badge variant={sitter.availability === 'Available' ? 'success' : 'warning'}>
                  {sitter.availability}
                </Badge>
                <SafetyBadge days={sitter.safetyDays} />
              </div>

              <div className="sitter-details">
                <div className="detail-row">
                  <span className="detail-label">Languages</span>
                  <span className="detail-value">{sitter.languages.join(', ')}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Certifications</span>
                  <span className="detail-value">{sitter.certifications.join(', ')}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Hourly Rate</span>
                  <span className="detail-value rate">{formatCurrency(sitter.hourlyRate)}/hr</span>
                </div>
              </div>

              <div className="sitter-actions">
                <Button variant="secondary" size="sm" fullWidth>
                  View Profile
                </Button>
                <Button variant="primary" size="sm" fullWidth disabled={sitter.availability !== 'Available'}>
                  Assign to Booking
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Styles
const sitterStyles = `
.sitter-management-page {
  max-width: 1400px;
  margin: 0 auto;
}

.sitters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-6);
}

.sitter-card {
  transition: transform var(--transition-base);
}

.sitter-card:hover {
  transform: translateY(-4px);
}

.sitter-header {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.sitter-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.sitter-name {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
}

.sitter-rating {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.sitter-status {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.sitter-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--glass-bg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
}

.detail-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.detail-value {
  font-size: var(--text-sm);
  text-align: right;
}

.detail-value.rate {
  font-weight: var(--font-semibold);
  color: var(--gold-500);
}

.sitter-actions {
  display: flex;
  gap: var(--space-3);
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sitterStyles;
  document.head.appendChild(styleSheet);
}
