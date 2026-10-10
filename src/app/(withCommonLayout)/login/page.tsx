'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  LockKeyhole,
  School,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import ForgotPasswordModal from '@/components/shared/auth/ForgotPasswordModal';
import { useLanguage } from '@/context/LanguageProvider';

const UnifiedLoginPage = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const { user, role, signIn, resetPassword, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Auto-redirect if already logged in
  React.useEffect(() => {
    if (!authLoading && user && role) {
      const roleRoutes: Record<string, string> = {
        super_admin: '/dashboard/super-admin',
        admin: '/dashboard/principal',
        teacher: '/dashboard/teacher',
        parent: '/dashboard/parent',
        accountant: '/dashboard/accountant',
        student: '/dashboard/student',
      };
      
      const destination = roleRoutes[role] || '/dashboard';
      window.location.href = destination;
    }
  }, [user, role, authLoading]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-page">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error: authError, role, mustChangePassword } = await signIn(identifier, password);

    if (authError) {
      setError(
        authError.message ||
          'Authentication failed. Please check your credentials.',
      );
      setIsLoading(false);
      return;
    }

    if (mustChangePassword) {
      window.location.href = '/login/change-password';
      return;
    }

    // Determine role-based destination
    const roleRoutes: Record<string, string> = {
      super_admin: '/dashboard/super-admin',
      admin: '/dashboard/principal',
      teacher: '/dashboard/teacher',
      parent: '/dashboard/parent',
      accountant: '/dashboard/accountant',
      student: '/dashboard/student',
    };

    const destination = (role && roleRoutes[role]) || '/dashboard';

    // Hard navigation so the server receives the fresh session cookie
    // before the /dashboard redirect logic runs
    window.location.href = destination;
  };


  const openForgotModal = () => {
    // Pre-fill with whatever is typed in the login email field
    setResetEmail(identifier.trim());
    setResetError('');
    setResetSuccess(false);
    setShowForgotModal(true);
  };

  const handleSendResetLink = async () => {
    const email = resetEmail.trim();
    if (!email) {
      setResetError('Please enter your email address.');
      return;
    }

    setResetLoading(true);
    setResetError('');

    const { error } = await resetPassword(email);

    setResetLoading(false);

    if (error) {
      setResetError(error.message);
    } else {
      setResetSuccess(true);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setResetEmail('');
    setResetError('');
    setResetSuccess(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-page relative overflow-hidden text-text-primary">
      {/* Subtle Dynamic Background */}
      <div className="absolute top-0 start-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] start-[15%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] end-[15%] w-[20%] h-[20%] bg-indigo-500/5 rounded-full blur-[80px]" />
      </div>

      <main className="flex-grow flex items-center justify-center pt-24 pb-16 px-6">
        <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side: Branding */}
          <div className="lg:w-1/2 text-center lg:text-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-[9px] uppercase tracking-[0.25em] mb-6"
            >
              {language === 'ar' ? 'البنية التحتية التعليمية الموحدة' : 'Universal Educational Infrastructure'}
            </motion.div>
            {language === 'ar' ? (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black tracking-tight leading-[1.15] mb-6"
              >
                سجل دخولك إلى <br />
                <span className="text-primary font-medium">الحرم المدرسي الذكي</span>
              </motion.h1>
            ) : (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] mb-6"
              >
                Connect to your <br />
                <span className="text-primary font-medium">Digital Campus</span>
              </motion.h1>
            )}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-text-muted font-bold text-lg max-w-lg mx-auto lg:mx-0 opacity-70 leading-relaxed"
            >
              {language === 'ar'
                ? 'بوابة واحدة متكاملة للطلاب والمعلمين وأولياء الأمور والإدارة لمتابعة المسار الأكاديمي والمالي والأنشطة المدرسية بكل سهولة وموثوقية.'
                : 'One unified gateway for students, teachers, and admins to manage academics, finance, and institutional growth.'}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <div className="px-6 py-3 rounded-2xl bg-bg-card/50 backdrop-blur-sm border border-border-light flex items-center gap-3">
                <ShieldCheck size={20} className="text-emerald-500" />
                <span className="text-xs font-black uppercase tracking-widest">
                  {language === 'ar' ? 'دخول آمن ومحمي' : 'Secure Access'}
                </span>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-bg-card/50 backdrop-blur-sm border border-border-light flex items-center gap-3">
                <Building2 size={20} className="text-blue-500" />
                <span className="text-xs font-black uppercase tracking-widest">
                  {language === 'ar' ? 'نظام سحابي متكامل' : 'Multi-Tenant'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Login Form */}
          <div className="lg:w-[450px] w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-bg-card/80 backdrop-blur-3xl rounded-[2.5rem] border border-border-light shadow-2xl overflow-hidden relative"
            >
              <div className="absolute top-6 end-8">
                <Link
                  href="/login/super-admin"
                  className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted hover:text-rose-500 transition-colors flex items-center gap-2"
                >
                  {language === 'ar' ? 'دخول المدير العام' : 'SaaS Login'} <LockKeyhole size={10} />
                </Link>
              </div>

              <div className="p-10">
                <div className="mb-10">
                  <h2 className="text-3xl font-black tracking-tight">{language === 'ar' ? 'تسجيل الدخول' : 'Login'}</h2>
                  <p className="text-text-muted font-bold text-sm mt-2 opacity-70">
                    {language === 'ar' ? 'أدخل بيانات حسابك للوصول إلى لوحتك المدرسية.' : 'Enter your credentials to access your portal.'}
                  </p>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-primary ms-1">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Identity (Email)'}
                    </label>
                    <div className="relative group">
                      <div className="absolute start-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                        <Mail size={16} />
                      </div>
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        autoComplete="username"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="yourname@school.com"
                        className="w-full h-12 ps-12 pe-6 rounded-2xl bg-bg-page border border-border-light focus:bg-bg-card focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center ms-1">
                      <label htmlFor="login-password" className="text-[10px] font-black uppercase tracking-widest text-text-primary">
                        {language === 'ar' ? 'كلمة المرور' : 'Password'}
                      </label>
                      {/* Opens modal instead of calling API directly */}
                      <button
                        type="button"
                        onClick={openForgotModal}
                        className="text-[10px] font-black text-red-500 hover:underline"
                      >
                        {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot your password?'}
                      </button>
                    </div>
                    <div className="relative group">
                      <div className="absolute start-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                        <Lock size={16} />
                      </div>
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 ps-12 pe-12 rounded-2xl bg-bg-page border border-border-light focus:bg-bg-card focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute end-5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group mt-4 relative overflow-hidden"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{language === 'ar' ? 'دخول إلى لوحة التحكم' : 'Enter Dashboard'}</span>
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-border-light text-center">
                  <p className="text-text-muted text-[11px] font-bold uppercase tracking-widest mb-4">
                    {language === 'ar' ? 'ترغب في تطبيق النظام في مدرستك؟' : 'Want to Use our system for your school?'}
                  </p>
                  <Link
                    href="/login/apply"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest group"
                  >
                    <School size={16} />
                    {language === 'ar' ? 'طلب انضمام مدرسة جديدة' : 'Apply for Institution Admin'}
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-10 start-1/2 -translate-x-1/2 flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-2">
            <Building2 size={16} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
              SaaS Infrastructure v2.0
            </span>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal - rendered into document.body */}
      <ForgotPasswordModal
        showForgotModal={showForgotModal}
        closeForgotModal={closeForgotModal}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        resetLoading={resetLoading}
        resetError={resetError}
        resetSuccess={resetSuccess}
        handleSendResetLink={handleSendResetLink}
      />
    </div>
  );
};

export default UnifiedLoginPage;
