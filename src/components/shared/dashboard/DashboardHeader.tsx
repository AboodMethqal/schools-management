'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, Menu, LogOut, X, AlertCircle, Search, UserRound, Sparkles } from 'lucide-react';
import { UserProfile } from './types';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { NotificationDropdown } from './NotificationDropdown';
import { getNotifications, markAllAsRead, markAsRead } from '@/app/actions/notification';
import { toast } from 'sonner';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageProvider';

type DashboardHeaderProps = { onMenuClick: () => void; title?: string; user?: UserProfile };
type NotificationItem = { id: string; title: string; message: string; type: string; isRead: boolean; link?: string | null; createdAt: Date };

export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
  const { t, language } = useLanguage();
  const { user, role, signOut } = useAuth();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const userEmail = user?.email || '—';
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || userEmail.split('@')[0] || 'User';
  const initials = userName.split(' ').filter(Boolean).slice(0, 2).map((part: string) => part[0]?.toUpperCase() || '').join('') || 'U';
  const roleLabel = role ? role.split('_').map((segment: string) => segment.charAt(0).toUpperCase() + segment.slice(1)).join(' ') : 'Unknown Role';

  useEffect(() => {
    const load = async () => {
      const res = await getNotifications(5);
      if (res.success) {
        setNotifications((res.data ?? []).map((item) => ({
          id: item.id, title: item.title ?? 'Notification', message: item.message ?? 'No details available', type: item.type ?? 'general', isRead: Boolean(item.isRead), link: item.link ?? null, createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        })));
        setUnreadCount(res.unreadCount ?? 0);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    const onLogout = () => setShowLogoutModal(true);
    window.addEventListener('methqal:logout', onLogout);
    return () => window.removeEventListener('methqal:logout', onLogout);
  }, []);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const res = await markAsRead(id);
    if (res.success) {
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } else toast.error(t('Failed to mark as read'));
  };

  const handleMarkAllAsRead = async () => {
    const res = await markAllAsRead();
    if (res.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success(t('All caught up!'));
    } else toast.error(t('Failed to mark all as read'));
  };

  const handleLogout = async () => {
    await signOut();
    setShowLogoutModal(false);
    router.replace('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--color-border-light)]/80 bg-[var(--color-bg-page)]/85 px-4 py-3 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3">
          <button onClick={onMenuClick} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] text-text-secondary shadow-sm md:hidden" aria-label={language === 'ar' ? 'فتح القائمة' : 'Open menu'}>
            <Menu size={21} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="hidden h-8 w-8 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 sm:flex"><Sparkles size={15} /></span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold text-text-muted">{language === 'ar' ? 'مثقال تك' : 'Methqal Tech'}</p>
                <h1 className="truncate text-lg font-black tracking-tight text-text-primary md:text-xl">{t(title || 'Dashboard')}</h1>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <div className="hidden h-11 w-56 items-center gap-2 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] px-3 text-text-muted xl:flex">
              <Search size={17} />
              <span className="text-xs font-semibold">{language === 'ar' ? 'بحث سريع...' : 'Quick search...'}</span>
              <kbd className="ms-auto rounded-lg bg-slate-100 px-1.5 py-0.5 text-[9px] font-black text-slate-500 dark:bg-slate-800">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <ThemeToggle />
            <div className="relative">
              <button onClick={() => setIsNotificationsOpen((v) => !v)} className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] text-text-secondary shadow-sm transition hover:border-blue-300 hover:text-blue-600" aria-label={language === 'ar' ? 'الإشعارات' : 'Notifications'}>
                <Bell size={18} />
                {unreadCount > 0 && <span className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-black text-white ring-2 ring-[var(--color-bg-page)]">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </button>
              <NotificationDropdown isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} notifications={notifications} unreadCount={unreadCount} onMarkAsRead={handleMarkAsRead} onMarkAllAsRead={handleMarkAllAsRead} />
            </div>

            <div className="relative" ref={profileMenuRef}>
              <button onClick={() => setIsProfileOpen((v) => !v)} className="flex items-center gap-2 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] p-1.5 pe-2.5 shadow-sm transition hover:border-blue-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-black text-white">{initials}</span>
                <span className="hidden max-w-28 text-start md:block">
                  <span className="block truncate text-xs font-black text-text-primary">{userName}</span>
                  <span className="block truncate text-[10px] font-bold text-text-muted">{t(roleLabel)}</span>
                </span>
                <ChevronDown size={15} className={`text-text-muted transition ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div initial={{ opacity: 0, y: 6, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: .98 }} className="absolute end-0 top-[calc(100%+10px)] z-[80] w-64 overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] p-2 shadow-2xl">
                    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
                      <p className="text-xs font-black text-text-primary">{userName}</p>
                      <p className="mt-1 truncate text-[10px] font-medium text-text-muted">{userEmail}</p>
                    </div>
                    <button onClick={() => setShowLogoutModal(true)} className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-black text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20">
                      <LogOut size={17} /> {t('Log out')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.button aria-label="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogoutModal(false)} className="absolute inset-0 bg-slate-950/65 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: .94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .94, y: 12 }} className="relative w-full max-w-md rounded-[28px] border border-[var(--color-border-light)] bg-[var(--color-bg-card)] p-7 shadow-2xl">
              <button onClick={() => setShowLogoutModal(false)} className="absolute end-4 top-4 rounded-xl p-2 text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500"><AlertCircle size={32} /></div>
              <h3 className="mt-5 text-center text-xl font-black text-text-primary">{t('Confirm Logout')}</h3>
              <p className="mt-2 text-center text-sm font-medium leading-6 text-text-muted">{language === 'ar' ? 'هل أنت متأكد أنك تريد تسجيل الخروج من منصة مثقال تك؟' : 'Are you sure you want to sign out of Methqal Tech?'}</p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="rounded-2xl border border-[var(--color-border-light)] py-3 text-sm font-bold text-text-secondary hover:bg-slate-50 dark:hover:bg-slate-800">{t('Cancel')}</button>
                <button onClick={handleLogout} className="rounded-2xl bg-red-500 py-3 text-sm font-black text-white shadow-lg shadow-red-500/20 hover:bg-red-600">{t('Yes, Log Out')}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
