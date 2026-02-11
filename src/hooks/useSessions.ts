// ============================================
// KidsCare Pro - Session Hooks
// ============================================

import { useState, useEffect } from 'react';
import { DEMO_MODE } from './useDemo';
import {
    DEMO_ACTIVE_SESSIONS,
    DEMO_LIVE_STATUS_LOGS,
    DEMO_LIVE_SESSION,
    DEMO_ACTIVE_SESSION_INFO,
    DEMO_CHECKLIST_ITEMS,
    type DemoActiveSession,
    type DemoActivityLog,
    type DemoLiveSession,
    type DemoActiveSessionInfo,
    type DemoChecklistItem,
} from '../data/demo';
import { sessionService } from '../services/firestore';

// ----------------------------------------
// Hotel Active Sessions Hook (for Dashboard + LiveMonitor)
// ----------------------------------------
export function useHotelSessions(hotelId?: string) {
    const [sessions, setSessions] = useState<DemoActiveSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (DEMO_MODE) {
            const timer = setTimeout(() => {
                setSessions(DEMO_ACTIVE_SESSIONS);
                setIsLoading(false);
            }, 600);
            return () => clearTimeout(timer);
        }

        if (!hotelId) {
            setIsLoading(false);
            return;
        }

        // Use real-time subscription for live monitor
        const unsubscribe = sessionService.subscribeToHotelSessions(
            hotelId,
            (fbSessions) => {
                const mapped: DemoActiveSession[] = fbSessions.map((s) => ({
                    id: s.id,
                    sitter: { name: s.sitterId, avatar: null, tier: 'silver' as const },
                    room: '',
                    children: [],
                    childrenText: '',
                    startTime: s.actualTimes.startedAt
                        ? new Date(s.actualTimes.startedAt as unknown as string).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                        : '',
                    elapsed: '',
                    lastUpdate: '',
                    lastActivity: s.timeline.length > 0 ? s.timeline[s.timeline.length - 1].description : '',
                    activities: s.timeline.map((t) => ({
                        time: t.timestamp instanceof Date
                            ? t.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                            : '',
                        activity: t.description,
                        type: t.type,
                    })),
                    vitals: { mood: 'happy', energy: 'medium' },
                    status: 'active',
                }));
                setSessions(mapped);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [hotelId]);

    return { sessions, isLoading };
}

// ----------------------------------------
// Parent Live Status Hook (for LiveStatus page)
// ----------------------------------------
export function useLiveStatus(sessionId?: string) {
    const [logs, setLogs] = useState<DemoActivityLog[]>([]);
    const [sessionInfo, setSessionInfo] = useState<DemoLiveSession>(DEMO_LIVE_SESSION);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (DEMO_MODE) {
            const timer = setTimeout(() => {
                setLogs(DEMO_LIVE_STATUS_LOGS);
                setSessionInfo(DEMO_LIVE_SESSION);
                setIsLoading(false);
            }, 400);
            return () => clearTimeout(timer);
        }

        if (!sessionId) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                const session = await sessionService.getActiveSession(sessionId!);
                if (cancelled || !session) {
                    setIsLoading(false);
                    return;
                }

                setLogs(session.timeline.map((t: { id: string; type: string; timestamp: Date | unknown; description: string; mediaUrl?: string }) => ({
                    id: t.id,
                    timestamp: t.timestamp instanceof Date ? t.timestamp : new Date(),
                    type: t.type === 'check_in' ? 'checkin' as const
                        : t.type === 'meal' ? 'meal' as const
                        : t.type === 'photo' ? 'photo' as const
                        : 'status' as const,
                    content: t.description,
                    metadata: { photoUrl: t.mediaUrl },
                })));

                setSessionInfo({
                    sitterName: session.sitterId,
                    sitterTier: 'gold',
                    sitterLanguages: 'English/Korean',
                    elapsedTime: '',
                });

                setIsLoading(false);
            } catch (err) {
                console.error('Failed to load live status:', err);
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [sessionId]);

    return { logs, sessionInfo, isLoading };
}

// ----------------------------------------
// Sitter Active Session Hook
// ----------------------------------------
export function useActiveSession(sessionId?: string) {
    const [sessionInfo, setSessionInfo] = useState<DemoActiveSessionInfo>(DEMO_ACTIVE_SESSION_INFO);
    const [checklist, setChecklist] = useState<DemoChecklistItem[]>(DEMO_CHECKLIST_ITEMS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (DEMO_MODE) {
            const timer = setTimeout(() => {
                setSessionInfo(DEMO_ACTIVE_SESSION_INFO);
                setChecklist(DEMO_CHECKLIST_ITEMS);
                setIsLoading(false);
            }, 400);
            return () => clearTimeout(timer);
        }

        if (!sessionId) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                const session = await sessionService.getActiveSession(sessionId!);
                if (cancelled || !session) {
                    setIsLoading(false);
                    return;
                }

                setSessionInfo({
                    room: '',
                    children: '',
                    parent: session.parentId,
                    endTime: '',
                    elapsedTime: '',
                });

                // Map checklist from session data
                const cl = session.checklist;
                setChecklist([
                    { id: '1', label: 'Pre-session: Wash hands', completed: true },
                    { id: '2', label: 'Verify child identity with photo', completed: cl.childInfo.allergiesConfirmed },
                    { id: '3', label: 'Review allergies & medical info', completed: cl.childInfo.allergiesConfirmed },
                    { id: '4', label: 'Check emergency contact info', completed: cl.roomSafety.emergencyExitKnown },
                    { id: '5', label: 'First activity started', completed: session.timeline.length > 0 },
                    { id: '6', label: 'Snack served (if applicable)', completed: false },
                    { id: '7', label: 'Document any incidents', completed: false },
                ]);

                setIsLoading(false);
            } catch (err) {
                console.error('Failed to load active session:', err);
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [sessionId]);

    const toggleChecklistItem = (id: string) => {
        setChecklist((prev) =>
            prev.map((item) => item.id === id ? { ...item, completed: !item.completed } : item)
        );
    };

    return { sessionInfo, checklist, isLoading, toggleChecklistItem };
}
