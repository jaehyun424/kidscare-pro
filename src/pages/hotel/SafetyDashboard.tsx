// ============================================
// KidsCare Pro - Safety Dashboard Page
// ============================================

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SafetyBadge, Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Select, Textarea, Input } from '../../components/common/Input';
import { Skeleton } from '../../components/common/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import { useHotel } from '../../hooks/useHotel';
import { useHotelIncidents } from '../../hooks/useIncidents';
import { useHotelBookings } from '../../hooks/useBookings';
import { useToast } from '../../contexts/ToastContext';

// ----------------------------------------
// Types
// ----------------------------------------
type FilterTab = 'all' | 'open' | 'investigating' | 'resolved' | 'closed';

// ----------------------------------------
// Icons
// ----------------------------------------
const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9,12 11,14 15,10" />
    </svg>
);

// ----------------------------------------
// Helpers
// ----------------------------------------
function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
}

function getSeverityColor(severity: string): string {
    switch (severity) {
        case 'low': return 'var(--success-500)';
        case 'medium': return 'var(--warning-500)';
        case 'high': return 'var(--error-500)';
        case 'critical': return '#dc2626';
        default: return 'var(--text-tertiary)';
    }
}

function getStatusVariant(status: string): 'warning' | 'primary' | 'success' | 'neutral' {
    switch (status) {
        case 'open': return 'warning';
        case 'investigating': return 'primary';
        case 'resolved': return 'success';
        case 'closed': return 'neutral';
        default: return 'neutral';
    }
}

function formatCategory(category: string): string {
    return category
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// ----------------------------------------
// Severity Options
// ----------------------------------------
const SEVERITY_OPTIONS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
];

const CATEGORY_OPTIONS = [
    { value: 'injury', label: 'Injury' },
    { value: 'illness', label: 'Illness' },
    { value: 'property_damage', label: 'Property Damage' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'safety_concern', label: 'Safety Concern' },
    { value: 'other', label: 'Other' },
];

const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'open', label: 'Open' },
    { key: 'investigating', label: 'Investigating' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'closed', label: 'Closed' },
];

// ----------------------------------------
// Component
// ----------------------------------------
export default function SafetyDashboard() {
    const { user } = useAuth();
    const hotelId = user?.hotelId;
    const { hotel, isLoading: hotelLoading } = useHotel(hotelId);
    const { incidents, isLoading: incidentsLoading, createIncident, updateIncidentStatus } = useHotelIncidents(hotelId);
    const { stats, isLoading: bookingsLoading } = useHotelBookings(hotelId);
    const toast = useToast();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formSeverity, setFormSeverity] = useState('low');
    const [formCategory, setFormCategory] = useState('injury');
    const [formSitterName, setFormSitterName] = useState('');
    const [formSummary, setFormSummary] = useState('');

    // Filter state
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

    // Derived data
    const safetyDays = hotel?.stats?.safetyDays ?? 0;
    const isLoading = hotelLoading || incidentsLoading || bookingsLoading;

    const filteredIncidents = useMemo(() => {
        if (activeFilter === 'all') return incidents;
        return incidents.filter((inc) => inc.status === activeFilter);
    }, [incidents, activeFilter]);

    const monthlyIncidentCount = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return incidents.filter((inc) => inc.reportedAt >= startOfMonth).length;
    }, [incidents]);

    const complianceRate = monthlyIncidentCount === 0 ? 100 : Math.max(0, Math.round(100 - (monthlyIncidentCount * 2)));

    // Handlers
    const openModal = () => {
        setFormSeverity('low');
        setFormCategory('injury');
        setFormSitterName('');
        setFormSummary('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async () => {
        if (!formSummary.trim()) {
            toast.warning('Missing Information', 'Please provide a summary of the incident.');
            return;
        }

        setIsSubmitting(true);
        try {
            await createIncident({
                severity: formSeverity as 'low' | 'medium' | 'high' | 'critical',
                category: formCategory as 'injury' | 'illness' | 'property_damage' | 'complaint' | 'safety_concern' | 'other',
                sitterId: formSitterName,
                report: {
                    summary: formSummary.trim(),
                    details: '',
                    reportedBy: 'hotel',
                    reportedAt: new Date(),
                },
            });
            toast.success('Incident Reported', 'The incident has been recorded successfully.');
            closeModal();
        } catch {
            toast.error('Failed', 'Could not create incident report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusChange = async (incidentId: string, newStatus: 'investigating' | 'resolved' | 'closed') => {
        try {
            await updateIncidentStatus(incidentId, newStatus);
            toast.success('Status Updated', `Incident status changed to ${newStatus}.`);
        } catch {
            toast.error('Failed', 'Could not update incident status.');
        }
    };

    // ----------------------------------------
    // Render Loading State
    // ----------------------------------------
    if (isLoading) {
        return (
            <div className="safety-page animate-fade-in">
                <div className="page-header">
                    <div>
                        <Skeleton width="300px" height="2rem" />
                        <Skeleton width="250px" height="1rem" />
                    </div>
                </div>
                <Skeleton width="100%" height="140px" borderRadius="var(--radius-2xl)" />
                <div className="safety-grid" style={{ marginTop: 'var(--space-6)' }}>
                    <Skeleton width="100%" height="200px" borderRadius="var(--radius-xl)" />
                    <Skeleton width="100%" height="200px" borderRadius="var(--radius-xl)" />
                    <Skeleton width="100%" height="200px" borderRadius="var(--radius-xl)" />
                </div>
            </div>
        );
    }

    // ----------------------------------------
    // Render
    // ----------------------------------------
    return (
        <div className="safety-page animate-fade-in">
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Safety Record Dashboard</h1>
                    <p className="page-subtitle">Track and maintain your hotel's safety excellence</p>
                </div>
                <div className="safety-header-actions">
                    <SafetyBadge days={safetyDays} />
                    <Button
                        variant="danger"
                        size="sm"
                        icon={<PlusIcon />}
                        onClick={openModal}
                    >
                        Report Incident
                    </Button>
                </div>
            </div>

            {/* Main Safety Banner */}
            <div className="safety-main-banner">
                <div className="safety-number">{safetyDays}</div>
                <div className="safety-text">
                    <h2>Consecutive Days Without Incidents</h2>
                    <p>
                        {safetyDays >= 100
                            ? 'Your hotel maintains an excellent safety record. Keep up the great work!'
                            : safetyDays >= 30
                                ? 'Good progress on safety. Stay vigilant to reach the 100-day milestone!'
                                : 'Building your safety record. Every safe day counts!'}
                    </p>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="safety-stats-row">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Month</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="safety-stat">
                            <span className="number">{stats.completedToday}</span>
                            <span className="label">Sessions Completed</span>
                        </div>
                        <div className="safety-stat">
                            <span className={`number ${monthlyIncidentCount === 0 ? 'text-success' : 'text-error'}`}>
                                {monthlyIncidentCount}
                            </span>
                            <span className="label">Incidents This Month</span>
                        </div>
                        <div className="safety-stat">
                            <span className="number text-gold">{complianceRate}%</span>
                            <span className="label">Compliance Rate</span>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Trust Protocol Stats</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="protocol-list">
                            <div className="protocol-item">
                                <span>Digital Badge Verified</span>
                                <Badge variant="success">156/156</Badge>
                            </div>
                            <div className="protocol-item">
                                <span>Safe Word Confirmed</span>
                                <Badge variant="success">156/156</Badge>
                            </div>
                            <div className="protocol-item">
                                <span>Joint Checklist Completed</span>
                                <Badge variant="success">154/156</Badge>
                            </div>
                            <div className="protocol-item">
                                <span>Emergency Consent Signed</span>
                                <Badge variant="success">156/156</Badge>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Incident List Section */}
            <Card>
                <CardHeader
                    action={
                        <Button variant="ghost" size="sm" icon={<PlusIcon />} onClick={openModal}>
                            New Report
                        </Button>
                    }
                >
                    <CardTitle subtitle={`${incidents.length} total incidents on record`}>
                        Incident History
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    {/* Filter Tabs */}
                    <div className="incident-filter-tabs">
                        {FILTER_TABS.map((tab) => (
                            <button
                                key={tab.key}
                                className={`incident-filter-tab ${activeFilter === tab.key ? 'incident-filter-tab-active' : ''}`}
                                onClick={() => setActiveFilter(tab.key)}
                            >
                                {tab.label}
                                {tab.key !== 'all' && (
                                    <span className="incident-filter-count">
                                        {incidents.filter((i) => i.status === tab.key).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Incident List */}
                    {filteredIncidents.length === 0 ? (
                        <div className="empty-incidents">
                            <span className="empty-icon"><ShieldIcon /></span>
                            <h4>No Incidents</h4>
                            <p>
                                {activeFilter === 'all'
                                    ? `No incidents have been reported in the last ${safetyDays} days.`
                                    : `No ${activeFilter} incidents found.`}
                            </p>
                        </div>
                    ) : (
                        <div className="incident-list">
                            {filteredIncidents.map((incident) => (
                                <div key={incident.id} className="incident-row">
                                    <div className="incident-row-left">
                                        <span
                                            className="incident-severity-dot"
                                            style={{ backgroundColor: getSeverityColor(incident.severity) }}
                                            title={incident.severity}
                                        />
                                        <div className="incident-row-info">
                                            <div className="incident-row-header">
                                                <span className="incident-category">{formatCategory(incident.category)}</span>
                                                <Badge variant={getStatusVariant(incident.status)} size="sm">
                                                    {incident.status}
                                                </Badge>
                                            </div>
                                            <p className="incident-summary">{incident.summary}</p>
                                            <div className="incident-meta">
                                                {incident.sitterName && (
                                                    <span className="incident-meta-item">Sitter: {incident.sitterName}</span>
                                                )}
                                                {incident.childName && (
                                                    <span className="incident-meta-item">Child: {incident.childName}</span>
                                                )}
                                                <span className="incident-meta-item">
                                                    {getRelativeTime(incident.reportedAt)}
                                                </span>
                                                <span className="incident-meta-item incident-date-full">
                                                    {incident.reportedAt.toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="incident-row-actions">
                                        {incident.status === 'open' && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleStatusChange(incident.id, 'investigating')}
                                            >
                                                Investigate
                                            </Button>
                                        )}
                                        {incident.status === 'investigating' && (
                                            <Button
                                                variant="gold"
                                                size="sm"
                                                onClick={() => handleStatusChange(incident.id, 'resolved')}
                                            >
                                                Resolve
                                            </Button>
                                        )}
                                        {incident.status === 'resolved' && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleStatusChange(incident.id, 'closed')}
                                            >
                                                Close
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Incident Report Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Report New Incident"
                size="md"
                footer={
                    <>
                        <Button variant="secondary" onClick={closeModal} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleSubmit} isLoading={isSubmitting}>
                            Submit Report
                        </Button>
                    </>
                }
            >
                <div className="incident-form">
                    <div className="incident-form-row">
                        <Select
                            label="Severity"
                            options={SEVERITY_OPTIONS}
                            value={formSeverity}
                            onChange={(e) => setFormSeverity(e.target.value)}
                        />
                        <Select
                            label="Category"
                            options={CATEGORY_OPTIONS}
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value)}
                        />
                    </div>
                    <Input
                        label="Sitter Name (optional)"
                        placeholder="Enter sitter name if applicable"
                        value={formSitterName}
                        onChange={(e) => setFormSitterName(e.target.value)}
                    />
                    <Textarea
                        label="Incident Summary"
                        placeholder="Describe what happened, when, and any actions taken..."
                        value={formSummary}
                        onChange={(e) => setFormSummary(e.target.value)}
                        rows={5}
                    />
                </div>
            </Modal>
        </div>
    );
}

// ----------------------------------------
// Styles
// ----------------------------------------
const safetyStyles = `
.safety-page { max-width: 1400px; margin: 0 auto; }

.safety-header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.safety-main-banner {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-8);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius-2xl);
  margin-bottom: var(--space-6);
}

.safety-number {
  font-size: 5rem;
  font-weight: var(--font-bold);
  color: var(--success-500);
  line-height: 1;
}

.safety-text h2 {
  font-size: var(--text-xl);
  margin-bottom: var(--space-2);
}

.safety-text p {
  color: var(--text-secondary);
}

.safety-stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-6);
}

.safety-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.safety-stat {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-4);
}

.safety-stat:last-child {
  margin-bottom: 0;
}

.safety-stat .number {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
}

.safety-stat .label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.text-success { color: var(--success-500); }
.text-error { color: var(--error-500); }
.text-gold { color: var(--gold-500); }

.protocol-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.protocol-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  background: var(--glass-bg);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
}

/* Incident Filter Tabs */
.incident-filter-tabs {
  display: flex;
  gap: var(--space-1);
  padding: var(--space-1);
  background: var(--glass-bg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
  overflow-x: auto;
}

.incident-filter-tab {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-family: inherit;
}

.incident-filter-tab:hover {
  color: var(--text-primary);
  background: rgba(0,0,0,0.03);
}

.incident-filter-tab-active {
  background: var(--bg-card);
  color: var(--primary-400);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.incident-filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--glass-bg);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.incident-filter-tab-active .incident-filter-count {
  background: rgba(79, 70, 187, 0.1);
  color: var(--primary-400);
}

/* Incident List */
.incident-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.incident-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.incident-row:hover {
  border-color: var(--primary-400);
  box-shadow: 0 2px 8px rgba(79, 70, 187, 0.06);
}

.incident-row-left {
  display: flex;
  gap: var(--space-3);
  flex: 1;
  min-width: 0;
}

.incident-severity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 6px;
}

.incident-row-info {
  flex: 1;
  min-width: 0;
}

.incident-row-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

.incident-category {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.incident-summary {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
  line-height: 1.5;
}

.incident-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.incident-meta-item {
  display: inline-flex;
  align-items: center;
}

.incident-date-full {
  opacity: 0.7;
}

.incident-row-actions {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
  align-self: center;
}

/* Empty State */
.empty-incidents {
  text-align: center;
  padding: var(--space-8);
}

.empty-icon {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-4);
  color: var(--success-500);
  opacity: 0.6;
}

.empty-incidents h4 {
  margin-bottom: var(--space-2);
}

.empty-incidents p {
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

/* Modal Form */
.incident-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.incident-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

@media (max-width: 600px) {
  .incident-form-row {
    grid-template-columns: 1fr;
  }

  .safety-main-banner {
    flex-direction: column;
    text-align: center;
    gap: var(--space-4);
    padding: var(--space-6);
  }

  .safety-number {
    font-size: 3.5rem;
  }

  .safety-header-actions {
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-2);
  }

  .incident-row {
    flex-direction: column;
  }

  .incident-row-actions {
    align-self: flex-start;
  }
}
`;

if (typeof document !== 'undefined') {
    const s = document.createElement('style'); s.textContent = safetyStyles; document.head.appendChild(s);
}
