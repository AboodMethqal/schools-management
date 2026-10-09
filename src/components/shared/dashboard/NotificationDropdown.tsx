"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, CheckCircle, Clock, ExternalLink, Inbox, X } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useLanguage } from "@/context/LanguageProvider"

interface Notification {
    id: string
    title: string
    message: string
    type: string
    isRead: boolean
    link?: string | null
    createdAt: Date
}

interface NotificationDropdownProps {
    isOpen: boolean
    onClose: () => void
    notifications: Notification[]
    unreadCount: number
    onMarkAsRead: (id: string) => Promise<void>
    onMarkAllAsRead: () => Promise<void>
}

export function NotificationDropdown({
    isOpen,
    onClose,
    notifications,
    unreadCount,
    onMarkAsRead,
    onMarkAllAsRead
}: NotificationDropdownProps) {
    const { t, language } = useLanguage()
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop for closing */}
                    <div className="fixed inset-0 z-[60]" onClick={onClose} />
                    
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute end-[-0.5rem] sm:end-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-md rounded-2xl border border-border-light bg-bg-card shadow-2xl z-[70] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-border-light flex items-center justify-between bg-secondary/10">
                            <div>
                                <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">{t('Notifications')}</h3>
                                <p className="text-[10px] text-text-muted font-bold">{language === 'ar' ? `لديك ${unreadCount} إشعار غير مقروء` : `You have ${unreadCount} unread alerts`}</p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={onMarkAllAsRead}
                                    className="text-[10px] font-black text-primary hover:text-primary-hover uppercase tracking-widest transition-colors flex items-center gap-1"
                                >
                                    <CheckCircle size={12} /> {t('Mark all read')}
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-border-light/50">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 transition-colors relative group ${notification.isRead ? 'opacity-60 bg-transparent' : 'bg-primary/5 hover:bg-primary/10'}`}
                                        >
                                            <div className="flex gap-3">
                                                {/* Icon based on type */}
                                                <div className={`h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center ${
                                                    notification.type === 'academic' ? 'bg-blue-100 text-blue-600' :
                                                    notification.type === 'payment' ? 'bg-emerald-100 text-emerald-600' :
                                                    notification.type === 'alert' ? 'bg-red-100 text-red-600' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {notification.type === 'academic' ? <Clock size={20} /> :
                                                     notification.type === 'payment' ? <CheckCircle size={20} /> :
                                                     <Bell size={20} />}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-sm font-bold truncate ${notification.isRead ? 'text-text-secondary' : 'text-text-primary'}`}>
                                                            {notification.title}
                                                        </p>
                                                        <span className="text-[10px] text-slate-400 whitespace-nowrap font-medium uppercase mt-0.5">
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-text-muted mt-0.5 line-clamp-2 leading-relaxed">
                                                        {notification.message}
                                                    </p>

                                                    <div className="flex items-center gap-3 mt-3">
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={() => onMarkAsRead(notification.id)}
                                                                className="text-[10px] font-black text-text-muted hover:text-text-secondary uppercase tracking-widest transition-colors"
                                                            >
                                                                {t('Mark as read')}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Unread indicator */}
                                            {!notification.isRead && (
                                                <div className="absolute top-4 end-4 h-2 w-2 rounded-full bg-primary" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="h-16 w-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                                        <Inbox size={32} />
                                    </div>
                                    <p className="text-sm font-bold text-text-primary">{t('No notifications yet')}</p>
                                    <p className="text-xs text-text-muted mt-1">{language === 'ar' ? 'سنخبرك عند حدوث أي جديد.' : "We'll alert you when something happens."}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <Link
                            href="/dashboard/notifications"
                            onClick={onClose}
                            className="block w-full py-3 text-center text-xs font-black text-text-secondary hover:bg-secondary/20 border-t border-border-light uppercase tracking-widest transition-all"
                        >
                            {t('View all notifications')}
                        </Link>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
