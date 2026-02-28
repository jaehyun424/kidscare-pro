// ============================================
// KidsCare Pro - Sitter Management Page
// ============================================


import { Card, CardBody } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { TierBadge, Badge, SafetyBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useHotelSitters } from '../../hooks/useSitters';
import '../../styles/pages/hotel-sitter-mgmt.css';

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
          <Card key={sitter.id} className="sitter-card" aria-label={`Sitter: ${sitter.name}`}>
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
