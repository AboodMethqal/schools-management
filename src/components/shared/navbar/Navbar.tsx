'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // ACTIVE ROUTE TRACKER
import Logo from '@/components/shared/logo/logo';
import {
  LucideLayoutDashboard,
  Menu,
  X,
  ChevronDown,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageProvider';

const Navbar = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // current URL path niteche

  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const profileToggleRef = useRef<HTMLButtonElement | null>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const rawRole = (role || user?.user_metadata?.role || 'user') as string;
  const displayRole = rawRole
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char: string) => char.toUpperCase());

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (typeof user?.email === 'string' ? user.email.split('@')[0] : 'User');

  const userInitials = (displayName || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() || '')
    .join('') || 'U';

  const handleLogout = async () => {
    await signOut();
    setShowLogoutModal(false);
    router.replace('/');
  };

  const handleClickLogo = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (
        isOpen &&
        !mobileMenuRef.current?.contains(target) &&
        !mobileToggleRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }

      if (
        isProfileOpen &&
        !profileMenuRef.current?.contains(target) &&
        !profileToggleRef.current?.contains(target)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isProfileOpen]);

  // Nav Links Data
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Why Choose Us", href: "/why-choose-us" },
    { label: "Pricing", href: "/pricing" },
    { label: "Support", href: "/support" },
    { label: "Privacy", href: "/privacy" }
  ];

  return (
    <>
    <nav className="fixed top-0 start-0 end-0 z-50 bg-[var(--color-bg-card)]/80 backdrop-blur-xl border-b border-[var(--color-border-light)] shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              ref={mobileToggleRef}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-[var(--color-bg-page)] text-[var(--color-primary)] transition-all"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" onClick={handleClickLogo} className="hover:opacity-90 transition-opacity">
              <Logo variant="dark" />
            </Link>
          </div>

          {/* CENTER: Desktop nav links WITH ACTIVE STATE */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-bold transition-all relative group ${
                    isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  {t(item.label)}
                  <span className={`absolute -bottom-1 start-0 h-0.5 bg-[var(--color-primary)] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </Link>
              );
            })}
          </div>

          {/* RIGHT: Theme + Profile/Login */}
          <div className="flex items-center gap-3 sm:gap-5">
            <LanguageSwitcher />
            <ThemeToggle />

            {!user ? (
              <>
                <Link href="/login" className="hidden sm:block text-[var(--color-primary)] font-bold hover:opacity-80 px-4 py-2 transition-colors text-sm">
                  {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </Link>
                <Link href="/live-demo">
                  <button className="hidden md:block bg-[var(--color-primary)] hover:opacity-90 text-white px-6 py-2.5 rounded-full font-bold shadow-md active:scale-95 transition-all text-sm">
                    {language === 'ar' ? 'تجربة المنصة' : 'Live Demo'}
                  </button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  ref={profileToggleRef}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pe-2 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-page)] shadow-sm min-w-[75px] justify-center hover:border-[var(--color-primary)]/40 transition-all"
                >
                  <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-[10px] font-black shadow-md">
                    {userInitials || 'SR'}
                  </div>
                  <div className="hidden md:flex flex-col items-start leading-tight pe-1">
                    <span className="text-xs font-bold text-[var(--color-text-primary)] max-w-[110px] truncate">{displayName}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">{displayRole}</span>
                  </div>
                  <ChevronDown className={`h-3 w-3 text-[var(--color-text-muted)] transition-transform ${isProfileOpen ? 'rotate-180 text-[var(--color-primary)]' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <div ref={profileMenuRef} className="absolute end-0 mt-2 z-[70]">
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="w-52 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] p-2 shadow-2xl backdrop-blur-lg"
                      >
                        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] border-b border-[var(--color-border-light)] mb-1">{language === 'ar' ? 'الحساب' : 'Account'}</div>
                        <div className="px-3 py-2 mb-1 rounded-xl bg-[var(--color-bg-page)]/50 border border-[var(--color-border-light)]">
                          <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">{displayName}</p>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)] mt-0.5">{displayRole}</p>
                        </div>
                        <Link
                          href={
                            role === 'parent' ? '/dashboard/parent' : 
                            role === 'student' ? '/dashboard/student' : 
                            role === 'teacher' ? '/dashboard/teacher' : 
                            role === 'super_admin' ? '/dashboard/super-admin' : 
                            role === 'admin' ? '/dashboard/principal' : 
                            role === 'accountant' ? '/dashboard/accountant' : '/dashboard'
                          }
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 w-full px-3 py-3 text-sm font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-page)] rounded-xl transition-all"
                        >
                          <LucideLayoutDashboard size={18} className="text-[var(--color-primary)]" /> {t('Dashboard')}
                        </Link>
                        <button
                          onClick={() => { setShowLogoutModal(true); setIsProfileOpen(false); }}
                          className="flex items-center gap-3 w-full px-3 py-3 text-sm font-black text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <LogOut size={18} /> {t('Log out')}
                        </button>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown WITH ACTIVE STATE */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden relative z-40">
            <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]" onClick={() => setIsOpen(false)} />
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative z-50 bg-[var(--color-bg-card)] border-b border-[var(--color-border-light)] shadow-xl"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block font-bold py-3 px-2 rounded-lg transition-colors ${
                      pathname === item.href 
                        ? "text-[var(--color-primary)] bg-[var(--color-bg-page)]" 
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-page)]"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {t(item.label)}
                  </Link>
                ))}
                <div className="pt-3 pb-2 flex items-center justify-between border-t border-[var(--color-border-light)]">
                  <span className="text-xs font-bold text-text-secondary">
                    {language === 'ar' ? 'اللغة' : 'Language'}
                  </span>
                  <LanguageSwitcher />
                </div>
                {!user && (
                  <div className="pt-2 flex flex-col gap-3">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <button className="w-full bg-[var(--color-bg-page)] text-[var(--color-primary)] font-bold py-3 rounded-xl border border-[var(--color-border-light)]">{language === 'ar' ? 'تسجيل الدخول' : 'Login'}</button>
                    </Link>
                    <Link href="/live-demo" onClick={() => setIsOpen(false)}>
                      <button className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20">{language === 'ar' ? 'تجربة المنصة' : 'Live Demo'}</button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </nav>

    {/* Logout Modal — outside <nav> so it centers correctly on the viewport */}
    <AnimatePresence>
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-[92%] max-w-[400px] bg-[var(--color-bg-card)] rounded-[32px] p-8 shadow-2xl border border-[var(--color-border-light)] overflow-hidden"
          >
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-5 end-5 p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-page)] rounded-full transition-all"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 bg-rose-100 dark:bg-rose-950/30 rounded-full flex items-center justify-center mb-6 text-rose-500">
                <AlertCircle size={40} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">{t('Confirm Logout')}</h3>
              <p className="text-[var(--color-text-muted)] mt-3 font-medium text-base px-2">
                {language === 'ar' ? 'هل أنت متأكد من رغبتك في تسجيل الخروج من منصة ' : 'Are you sure you want to sign out from '}
                <span className="text-[var(--color-primary)] font-bold">{language === 'ar' ? 'مثقال تك' : 'Methqal Tech'}</span>؟
              </p>
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 w-full mt-10">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="order-2 sm:order-1 py-4 rounded-2xl border-2 border-[var(--color-border-light)] font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-page)] transition-all active:scale-95"
                >
                  {t('Cancel')}
                </button>
                <button
                  onClick={handleLogout}
                  className="order-1 sm:order-2 py-4 rounded-2xl bg-rose-500 text-white font-black shadow-xl shadow-rose-500/30 hover:bg-rose-600 transition-all active:scale-95"
                >
                  {t('Yes, Log Out')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;
