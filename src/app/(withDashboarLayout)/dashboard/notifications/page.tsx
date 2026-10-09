"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Bell, CheckCircle, Clock, Trash2, Inbox, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { getAllNotifications, markAsRead, markAllAsRead } from "@/app/actions/notification"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/context/LanguageProvider"
import DashboardLayout from "@/components/shared/dashboard/DashboardLayout"
import { 
    studentMenuItems, 
    teacherMenuItems, 
    superAdminMenuItems, 
    accountantMenuItems, 
    parentMenuItems, 
    principalMenuItems 
} from "@/components/shared/dashboard/menu-items"

export default function NotificationsPage() {
    const { role, user: authUser, loading: authLoading } = useAuth()
    const { t, language } = useLanguage()
    const [notifications, setNotifications] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')

    // Role-based Layout Config
    const getLayoutConfig = () => {
        switch (role) {
            case "student":
                return { menuItems: studentMenuItems, activeColor: "bg-blue-600", title: "Student Dashboard" }
            case "teacher":
                return { menuItems: teacherMenuItems, activeColor: "bg-indigo-600", title: "Teacher Dashboard" }
            case "admin":
                return { menuItems: principalMenuItems, activeColor: "bg-purple-600", title: "Admin Dashboard" }
            case "parent":
                return { menuItems: parentMenuItems, activeColor: "bg-orange-600", title: "Parent Dashboard" }
            case "accountant":
                return { menuItems: accountantMenuItems, activeColor: "bg-emerald-600", title: "Accountant Dashboard" }
            case "super_admin":
                return { menuItems: superAdminMenuItems, activeColor: "bg-slate-900", title: "Super Admin" }
            default:
                return { menuItems: studentMenuItems, activeColor: "bg-blue-600", title: "Dashboard" }
        }
    }

    const { menuItems, activeColor, title: layoutTitle } = getLayoutConfig()
    
    // Role-based dashboard link for the back button
    const dashboardLink = role === "admin" ? "/dashboard/principal" : `/dashboard/${role === "super_admin" ? "super-admin" : role}`

    const fetchNotifications = async () => {
        setLoading(true)
        const res = await getAllNotifications()
        if (res.success) {
            setNotifications(res.data || [])
        } else {
            toast.error("Failed to load notifications")
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleMarkAsRead = async (id: string) => {
        const res = await markAsRead(id)
        if (res.success) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
            toast.success("Marked as read")
        }
    }

    const handleMarkAllAsRead = async () => {
        const res = await markAllAsRead()
        if (res.success) {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            toast.success("All marked as read")
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-page">
                <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    const filteredNotifications = activeTab === 'all' 
        ? notifications 
        : notifications.filter(n => !n.isRead)

    return (
        <DashboardLayout
            title={layoutTitle}
            menuItems={menuItems}
            activeColor={activeColor}
            user={{
                name: authUser?.user_metadata?.name || authUser?.email || "User",
                role: (role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"),
                initials: (authUser?.email ? authUser.email[0].toUpperCase() : "U")
            }}
        >
            <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 pb-20">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <Link 
                            href={dashboardLink}
                            className="p-2 hover:bg-secondary rounded-xl transition-colors text-text-muted shrink-0"
                        >
                            <ArrowLeft size={20} className={language === 'ar' ? 'rotate-180' : ''} />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-xl md:text-2xl font-black text-text-primary tracking-tight truncate">{t('Notifications Center')}</h1>
                            <p className="text-[10px] md:text-xs text-text-muted font-bold uppercase tracking-widest mt-0.5 md:mt-1 truncate">
                                {t('Stay updated with school activities')}
                            </p>
                        </div>
                    </div>
                    {notifications.some(n => !n.isRead) && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary font-black text-[10px] md:text-xs rounded-xl hover:bg-primary/20 transition-all uppercase tracking-widest border border-primary/20 w-full sm:w-auto"
                        >
                            <CheckCircle size={16} /> {t('Mark all read')}
                        </button>
                    )}
                </div>

                {/* Tabs & Content */}
                <div className="bg-bg-card rounded-2xl md:rounded-3xl border border-border-light shadow-xl overflow-hidden min-h-[500px]">
                    <div className="flex items-center border-b border-border-light bg-secondary/10 px-2 md:px-6">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all relative ${
                                activeTab === 'all' ? 'text-primary' : 'text-text-muted hover:text-text-primary'
                            }`}
                        >
                            {t('All')}
                            {activeTab === 'all' && (
                                <motion.div layoutId="tab-underline" className="absolute bottom-0 start-0 end-0 h-1 bg-primary rounded-t-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('unread')}
                            className={`py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all relative ${
                                activeTab === 'unread' ? 'text-primary' : 'text-text-muted hover:text-text-primary'
                            }`}
                        >
                            {t('Unread')}
                            <span className="ms-2 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] md:text-[10px]">
                                {notifications.filter(n => !n.isRead).length}
                            </span>
                            {activeTab === 'unread' && (
                                <motion.div layoutId="tab-underline" className="absolute bottom-0 start-0 end-0 h-1 bg-primary rounded-t-full" />
                            )}
                        </button>
                    </div>

                    <div className="divide-y divide-border-light/50">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center gap-4">
                                <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{t('Loading...')}</p>
                            </div>
                        ) : filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notification, index) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={notification.id}
                                    className={`p-4 md:p-6 transition-all group flex items-start justify-between gap-3 md:gap-4 ${
                                        notification.isRead ? 'bg-transparent' : 'bg-primary/5 hover:bg-primary/10'
                                    }`}
                                >
                                    <div className="flex gap-3 md:gap-4 flex-1 min-w-0">
                                        <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center shadow-sm ${
                                            notification.type === 'academic' ? 'bg-blue-100 text-blue-600' :
                                            notification.type === 'payment' ? 'bg-emerald-100 text-emerald-600' :
                                            notification.type === 'alert' ? 'bg-red-100 text-red-600' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            <Bell size={20} className="md:size-6" />
                                        </div>
                                        <div className="flex-1 space-y-1 min-w-0">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <h3 className={`text-sm md:text-base font-bold tracking-tight truncate max-w-full ${notification.isRead ? 'text-text-secondary' : 'text-text-primary'}`}>
                                                    {t(notification.title)}
                                                </h3>
                                                {!notification.isRead && (
                                                    <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[8px] md:text-[9px] font-black uppercase shrink-0">{t('New')}</span>
                                                )}
                                            </div>
                                            <p className="text-xs md:text-sm text-text-muted leading-relaxed line-clamp-3 md:line-clamp-none">
                                                {t(notification.message)}
                                            </p>
                                            <div className="flex items-center gap-4 pt-1 md:pt-2">
                                                <span className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-slate-400 font-bold md:font-black uppercase tracking-wider">
                                                    <Clock size={12} /> {format(new Date(notification.createdAt), 'PPP | p')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {!notification.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="p-2 text-text-muted hover:bg-white dark:hover:bg-slate-800 hover:text-primary rounded-xl transition-all shadow-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shrink-0"
                                            title={t("Mark as read")}
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-24 md:py-32 flex flex-col items-center justify-center gap-4 md:gap-6 opacity-60">
                                <div className="h-16 w-16 md:h-24 md:w-24 bg-secondary/30 rounded-[30px] md:rounded-[40px] flex items-center justify-center text-text-muted rotate-6">
                                    <Inbox size={32} className="md:size-12" />
                                </div>
                                <div className="text-center px-4">
                                    <h3 className="text-base md:text-lg font-black text-text-primary tracking-tight uppercase tracking-widest">{t('All caught up!')}</h3>
                                    <p className="text-[10px] md:text-xs text-text-muted mt-1 md:mt-2 font-medium">
                                        {language === 'ar' ? 'لا توجد إشعارات جديدة في هذا الوقت.' : `You have no ${activeTab === 'unread' ? 'unread' : ''} notifications at this time.`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
