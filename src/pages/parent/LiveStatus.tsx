// Parent Live Status Page - Quiet Luxury Redesign

import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button, IconButton } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { TierBadge } from '../../components/common/Badge';
import { ActivityFeed } from '../../components/parent/ActivityFeed';
import type { ActivityLog } from '../../components/parent/ActivityFeed';
import { useAuth } from '../../contexts/AuthContext';
import { useLiveStatus } from '../../hooks/useSessions';

export default function LiveStatus() {
    const { id } = useParams();
    useAuth();
    const { logs, sessionInfo } = useLiveStatus(id);

    return (
        <div className="live-status-page">
            <div className="max-w-md mx-auto py-6 px-4">

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="font-serif text-2xl text-charcoal-900">Live Session</h1>
                    <p className="text-sm text-charcoal-500">Updates from the playroom</p>
                </div>

                {/* Status Banner */}
                <div className="status-pulse-card mb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-green-700 font-semibold text-sm uppercase tracking-wide">Active Care</span>
                        </div>
                        <span className="font-serif text-xl text-green-800">{sessionInfo.elapsedTime}</span>
                    </div>
                </div>

                {/* Sitter Profile (Mini) */}
                <Card className="mb-6" padding="sm">
                    <div className="flex items-center gap-4">
                        <Avatar name={sessionInfo.sitterName} size="lg" variant="gold" />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-serif font-bold text-charcoal-900">{sessionInfo.sitterName}</h3>
                                <TierBadge tier="gold" />
                            </div>
                            <p className="text-xs text-charcoal-500">Certified Specialist • English/Korean</p>
                        </div>
                        <IconButton
                            variant="ghost"
                            size="md"
                            aria-label="Call Sitter"
                            icon={<span className="text-xl">📞</span>}
                        />
                    </div>
                </Card>

                {/* Main Feed */}
                <div className="mb-8">
                    <h3 className="section-header">Activity Timeline</h3>
                    <div className="bg-white rounded-xl border border-cream-300 p-4 shadow-sm">
                        <ActivityFeed logs={logs as ActivityLog[]} />
                    </div>
                </div>

                {/* Emergency Actions */}
                <div className="space-y-3">
                    <Button variant="danger" fullWidth className="justify-center">
                        Emergency Contact
                    </Button>
                    <Link to="/parent" className="block">
                        <Button variant="secondary" fullWidth className="justify-center">
                            Return Home
                        </Button>
                    </Link>
                </div>

            </div>

            <style>{`
                .live-status-page {
                    min-height: 100vh;
                    background-color: var(--cream-100);
                }

                .status-pulse-card {
                    background: linear-gradient(to right, #DEF7EC, #ECFDF5);
                    border: 1px solid #A7F3D0;
                    border-radius: 12px;
                    padding: 1rem 1.5rem;
                    box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.1);
                }

                .section-header {
                    font-family: var(--font-serif);
                    font-size: 1.1rem;
                    color: var(--charcoal-700);
                    margin-bottom: 1rem;
                    padding-left: 0.5rem;
                }
            `}</style>
        </div>
    );
}
