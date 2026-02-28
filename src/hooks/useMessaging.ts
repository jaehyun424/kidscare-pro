// ============================================
// KidsCare Pro - Messaging Hook
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { DEMO_MODE } from './useDemo';
import { messagingService, type Message, type Conversation } from '../services/messaging';

// ----------------------------------------
// Demo Messages
// ----------------------------------------
const DEMO_MESSAGES: Message[] = [
    { id: '1', senderId: 'demo-sitter-1', senderName: 'Kim Minjung', text: 'Hello! Emma is doing great, playing with blocks now.', type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 30) },
    { id: '2', senderId: 'demo-parent-1', senderName: 'Sarah Johnson', text: 'Great to hear! Has she had her snack?', type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 25) },
    { id: '3', senderId: 'demo-sitter-1', senderName: 'Kim Minjung', text: 'Yes, she had apple slices and juice about 20 minutes ago.', type: 'text', createdAt: new Date(Date.now() - 1000 * 60 * 20) },
];

// ----------------------------------------
// Hook
// ----------------------------------------
export function useMessaging(userId?: string, conversationId?: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeConversationId, setActiveConversationId] = useState(conversationId);

    // Subscribe to conversations list
    useEffect(() => {
        if (DEMO_MODE || !userId) {
            setIsLoading(false);
            return;
        }

        const unsubscribe = messagingService.subscribeToConversations(userId, (convs) => {
            setConversations(convs);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    // Subscribe to messages in active conversation
    useEffect(() => {
        if (DEMO_MODE) {
            setMessages(DEMO_MESSAGES);
            setIsLoading(false);
            return;
        }

        if (!activeConversationId) return;

        const unsubscribe = messagingService.subscribeToMessages(activeConversationId, (msgs) => {
            setMessages(msgs);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [activeConversationId]);

    // Send a message
    const sendMessage = useCallback(async (text: string, senderName: string) => {
        if (DEMO_MODE) {
            const newMsg: Message = {
                id: `demo-${Date.now()}`,
                senderId: userId || 'demo-user',
                senderName,
                text,
                type: 'text',
                createdAt: new Date(),
            };
            setMessages((prev) => [...prev, newMsg]);
            return;
        }

        if (!activeConversationId || !userId) return;
        await messagingService.sendMessage(activeConversationId, userId, senderName, text);
    }, [activeConversationId, userId]);

    // Open or create a conversation
    const openConversation = useCallback(async (
        otherUserId: string,
        names: Record<string, string>,
        bookingId?: string,
    ) => {
        if (DEMO_MODE) {
            setActiveConversationId('demo-conversation-1');
            return 'demo-conversation-1';
        }

        if (!userId) return '';
        const convId = await messagingService.getOrCreateConversation(
            userId, otherUserId, names, bookingId
        );
        setActiveConversationId(convId);
        return convId;
    }, [userId]);

    return {
        messages,
        conversations,
        isLoading,
        sendMessage,
        openConversation,
        activeConversationId,
        setActiveConversationId,
    };
}
