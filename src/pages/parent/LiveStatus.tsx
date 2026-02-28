// Parent Live Status Page - Quiet Luxury Redesign

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/common/Card';
import { Button, IconButton } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { TierBadge } from '../../components/common/Badge';
import { ActivityFeed } from '../../components/parent/ActivityFeed';
import type { ActivityLog } from '../../components/parent/ActivityFeed';
import { ChatPanel } from '../../components/common/ChatPanel';
import { useAuth } from '../../contexts/AuthContext';
import { useLiveStatus } from '../../hooks/useSessions';
import '../../styles/pages/parent-live-status.css';

export default function LiveStatus() {
    const { id } = useParams();
    const { t } = useTranslation();
    useAuth();
    const { logs, sessionInfo } = useLiveStatus(id);
    const [chatOpen, setChatOpen] = useState(false);

    return (
        <div className="live-status-page">
            <div className="max-w-md mx-auto py-6 px-4">

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="font-serif text-2xl text-charcoal-900">{t('parent.liveSession')}</h1>
                    <p className="text-sm text-charcoal-500">{t('parent.updatesFromPlayroom')}</p>
                </div>

                {/* Status Banner */}
                <div className="status-pulse-card mb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-green-700 font-semibold text-sm uppercase tracking-wide">{t('parent.activeCare')}</span>
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
                            <p className="text-xs text-charcoal-500">{t('parent.certifiedSpecialist')} • English/Korean</p>
                        </div>
                        <IconButton
                            variant="ghost"
                            size="md"
                            aria-label="Message Sitter"
                            icon={<span className="text-xl">💬</span>}
                            onClick={() => setChatOpen(true)}
                        />
                    </div>
                </Card>

                {/* Main Feed */}
                <div className="mb-8">
                    <h3 className="section-header">{t('parent.activityTimeline')}</h3>
                    <div className="bg-white rounded-xl border border-cream-300 p-4 shadow-sm">
                        <ActivityFeed logs={logs as ActivityLog[]} />
                    </div>
                </div>

                {/* Contact & Emergency Actions */}
                <div className="space-y-3">
                    <Button variant="gold" fullWidth className="justify-center" onClick={() => setChatOpen(true)}>
                        {t('parent.contactSitter')}
                    </Button>
                    <Button
                        variant="danger"
                        fullWidth
                        className="justify-center"
                        onClick={() => window.location.href = 'tel:119'}
                    >
                        {t('parent.emergencyCall119')}
                    </Button>
                    <Link to="/parent" className="block">
                        <Button variant="secondary" fullWidth className="justify-center">
                            {t('parent.returnHome')}
                        </Button>
                    </Link>
                </div>

                {/* Chat Panel */}
                <ChatPanel
                    isOpen={chatOpen}
                    onClose={() => setChatOpen(false)}
                    otherUserId={sessionInfo.sitterId}
                    otherUserName={sessionInfo.sitterName}
                    bookingId={id}
                />

            </div>

        </div>
    );
}
