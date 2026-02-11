// ============================================
// KidsCare Pro - Children Hooks
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { DEMO_MODE } from './useDemo';
import { DEMO_CHILDREN, type DemoChild } from '../data/demo';
import { childrenService } from '../services/firestore';

// ----------------------------------------
// Parent Children Hook
// ----------------------------------------
export function useChildren(parentId?: string) {
    const [children, setChildren] = useState<DemoChild[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (DEMO_MODE) {
            const timer = setTimeout(() => {
                setChildren(DEMO_CHILDREN);
                setIsLoading(false);
            }, 400);
            return () => clearTimeout(timer);
        }

        if (!parentId) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                const fbChildren = await childrenService.getParentChildren(parentId!);
                if (cancelled) return;

                setChildren(fbChildren.map((c: { id: string; firstName: string; age: number; allergies: string[]; gender: 'male' | 'female' | 'other' }) => ({
                    id: c.id,
                    name: c.firstName,
                    age: c.age,
                    allergies: c.allergies,
                    gender: c.gender,
                })));
                setIsLoading(false);
            } catch (err) {
                console.error('Failed to load children:', err);
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [parentId]);

    const addChild = useCallback(async (data: Omit<DemoChild, 'id'>) => {
        if (DEMO_MODE) {
            const newChild = { ...data, id: 'demo-child-' + Date.now() };
            setChildren((prev) => [...prev, newChild]);
            return newChild.id;
        }

        if (!parentId) return '';
        const id = await childrenService.addChild({
            parentId,
            firstName: data.name,
            age: data.age,
            gender: data.gender,
            allergies: data.allergies,
            consentGiven: true,
            consentTimestamp: new Date(),
            autoDeleteAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // 90 days
            createdAt: new Date(),
        });
        // Reload
        const fbChildren = await childrenService.getParentChildren(parentId);
        setChildren(fbChildren.map((c: { id: string; firstName: string; age: number; allergies: string[]; gender: 'male' | 'female' | 'other' }) => ({
            id: c.id,
            name: c.firstName,
            age: c.age,
            allergies: c.allergies,
            gender: c.gender,
        })));
        return id;
    }, [parentId]);

    return { children, isLoading, addChild };
}
