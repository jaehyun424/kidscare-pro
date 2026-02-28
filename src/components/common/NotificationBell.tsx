// ============================================
// KidsCare Pro - Notification Bell
// ============================================

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import '../../styles/notification-bell.css';

const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export function NotificationBell() {
    const { user } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user?.id);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const recentNotifications = notifications.slice(0, 5);

    return (
        <div className="notification-bell" ref={dropdownRef}>
            <button
                className="notification-bell-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            >
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-dropdown-header">
                        <span className="notification-dropdown-title">Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                className="notification-mark-all"
                                onClick={() => markAllAsRead()}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {recentNotifications.length === 0 ? (
                            <div className="notification-empty">
                                No notifications yet
                            </div>
                        ) : (
                            recentNotifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`notification-item ${!n.read ? 'notification-unread' : ''}`}
                                    onClick={() => !n.read && markAsRead(n.id)}
                                >
                                    <div className="notification-item-content">
                                        <span className="notification-item-title">{n.title}</span>
                                        <span className="notification-item-body">{n.body}</span>
                                        <span className="notification-item-time">
                                            {timeAgo(n.createdAt instanceof Date ? n.createdAt : new Date(n.createdAt))}
                                        </span>
                                    </div>
                                    {!n.read && <span className="notification-unread-dot" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
