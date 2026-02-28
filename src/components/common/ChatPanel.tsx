// ============================================
// KidsCare Pro - Chat Panel Component
// Real-time messaging UI
// ============================================

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMessaging } from '../../hooks/useMessaging';
import type { Message } from '../../services/messaging';

interface ChatPanelProps {
    isOpen: boolean;
    onClose: () => void;
    otherUserId?: string;
    otherUserName?: string;
    bookingId?: string;
}

export function ChatPanel({ isOpen, onClose, otherUserId, otherUserName, bookingId }: ChatPanelProps) {
    const { user } = useAuth();
    const userName = user ? `${user.profile.firstName} ${user.profile.lastName}` : 'User';
    const { messages, sendMessage, openConversation } = useMessaging(user?.id);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Open/create conversation when panel opens
    useEffect(() => {
        if (isOpen && otherUserId && user?.id) {
            const names: Record<string, string> = {
                [user.id]: userName,
            };
            if (otherUserId) names[otherUserId] = otherUserName || 'User';
            openConversation(otherUserId, names, bookingId);
        }
    }, [isOpen, otherUserId, user?.id, userName, otherUserName, bookingId, openConversation]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text) return;
        setInput('');
        await sendMessage(text, userName);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-panel-overlay" onClick={onClose}>
            <div className="chat-panel" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="chat-header">
                    <div className="chat-header-info">
                        <h3>{otherUserName || 'Chat'}</h3>
                        <span className="chat-status">Online</span>
                    </div>
                    <button className="chat-close" onClick={onClose} aria-label="Close chat">
                        &times;
                    </button>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                    {messages.map((msg: Message) => (
                        <div
                            key={msg.id}
                            className={`chat-message ${msg.senderId === user?.id ? 'chat-message-own' : 'chat-message-other'} ${msg.type === 'emergency' ? 'chat-message-emergency' : ''}`}
                        >
                            <div className="chat-bubble">
                                {msg.senderId !== user?.id && (
                                    <span className="chat-sender">{msg.senderName}</span>
                                )}
                                <p>{msg.text}</p>
                                <span className="chat-time">{formatTime(msg.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="chat-input-area">
                    <input
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                    />
                    <button className="chat-send-btn" onClick={handleSend} disabled={!input.trim()}>
                        Send
                    </button>
                </div>
            </div>

            <style>{`
                .chat-panel-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(4px);
                    z-index: var(--z-modal);
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                }

                .chat-panel {
                    background: var(--bg-primary, white);
                    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
                    width: 100%;
                    max-width: 480px;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: var(--shadow-xl);
                }

                .chat-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    border-bottom: 1px solid var(--border-color, #E6E5DE);
                }

                .chat-header h3 {
                    font-family: var(--font-serif);
                    font-size: 1.1rem;
                    margin: 0;
                }

                .chat-status {
                    font-size: 0.75rem;
                    color: var(--success-500);
                }

                .chat-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--text-secondary, #767676);
                    padding: 0.25rem;
                }

                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    min-height: 300px;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .chat-message {
                    display: flex;
                }

                .chat-message-own {
                    justify-content: flex-end;
                }

                .chat-message-other {
                    justify-content: flex-start;
                }

                .chat-bubble {
                    max-width: 75%;
                    padding: 0.75rem 1rem;
                    border-radius: var(--radius-lg);
                    font-size: 0.9rem;
                    line-height: 1.4;
                }

                .chat-message-own .chat-bubble {
                    background: var(--charcoal-900, #1C1C1C);
                    color: white;
                    border-bottom-right-radius: 2px;
                }

                :root[data-theme="dark"] .chat-message-own .chat-bubble {
                    background: var(--gold-600);
                    color: white;
                }

                .chat-message-other .chat-bubble {
                    background: var(--cream-200, #F0EFEA);
                    color: var(--charcoal-900, #1C1C1C);
                    border-bottom-left-radius: 2px;
                }

                :root[data-theme="dark"] .chat-message-other .chat-bubble {
                    background: #333;
                    color: #E8E8E8;
                }

                .chat-message-emergency .chat-bubble {
                    background: var(--error-500) !important;
                    color: white !important;
                }

                .chat-sender {
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                    display: block;
                    margin-bottom: 0.25rem;
                    opacity: 0.7;
                }

                .chat-bubble p {
                    margin: 0;
                    color: inherit;
                }

                .chat-time {
                    font-size: 0.65rem;
                    opacity: 0.6;
                    display: block;
                    margin-top: 0.25rem;
                    text-align: right;
                }

                .chat-input-area {
                    display: flex;
                    gap: 0.5rem;
                    padding: 1rem;
                    border-top: 1px solid var(--border-color, #E6E5DE);
                }

                .chat-input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--border-color, #E6E5DE);
                    border-radius: var(--radius-full);
                    font-size: 0.9rem;
                    background: var(--cream-50, #FBFBF9);
                    color: var(--charcoal-900, #1C1C1C);
                    outline: none;
                }

                :root[data-theme="dark"] .chat-input {
                    background: #1A1A1A;
                    border-color: #3A3A3A;
                    color: #E8E8E8;
                }

                .chat-input:focus {
                    border-color: var(--gold-500);
                }

                .chat-send-btn {
                    padding: 0.75rem 1.25rem;
                    background: var(--charcoal-900, #1C1C1C);
                    color: white;
                    border: none;
                    border-radius: var(--radius-full);
                    font-family: var(--font-action);
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: background var(--transition-fast);
                }

                :root[data-theme="dark"] .chat-send-btn {
                    background: var(--gold-500);
                }

                .chat-send-btn:hover:not(:disabled) {
                    background: var(--charcoal-800, #2A2A2A);
                }

                .chat-send-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
