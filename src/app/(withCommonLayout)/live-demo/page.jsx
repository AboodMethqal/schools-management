"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Settings,
  ShieldCheck,
  Users,
  Wallet,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageProvider';
import { DEMO_ACCOUNTS } from '@/lib/demo-accounts';

const AllLogin = () => {
  const { signIn } = useAuth();
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [loadingRole, setLoadingRole] = useState(null);

  const demoCredentials = {
    super_admin: {
      email: DEMO_ACCOUNTS.super_admin.email,
      password: DEMO_ACCOUNTS.super_admin.password,
    },
    admin: {
      email: DEMO_ACCOUNTS.admin.email,
      password: DEMO_ACCOUNTS.admin.password,
    },
    student: {
      email: DEMO_ACCOUNTS.student.email,
      password: DEMO_ACCOUNTS.student.password,
    },
    parent: {
      email: DEMO_ACCOUNTS.parent.email,
      password: DEMO_ACCOUNTS.parent.password,
    },
    teacher: {
      email: DEMO_ACCOUNTS.teacher.email,
      password: DEMO_ACCOUNTS.teacher.password,
    },
    accountant: {
      email: DEMO_ACCOUNTS.accountant.email,
      password: DEMO_ACCOUNTS.accountant.password,
    },
  };

  const handleDemoLogin = async (roleKey, destination) => {
    const creds = demoCredentials[roleKey];
    if (!creds) {
      toast.error(
        isAr
          ? 'بيانات الحساب التجريبي غير متوفرة لهذا الدور.'
          : 'Demo credentials not configured for this role.'
      );
      return;
    }

    setLoadingRole(roleKey);
    try {
      const { error } = await signIn(creds.email, creds.password);

      if (error) {
        toast.error(
          error.message ||
            (isAr
              ? 'فشل تسجيل الدخول بالحساب التجريبي.'
              : 'Failed to login to demo account.')
        );
        setLoadingRole(null);
      } else {
        toast.success(
          isAr
            ? 'تم تسجيل الدخول بنجاح! جارٍ تحويلك إلى لوحة التحكم...'
            : 'Logged in successfully! Redirecting to dashboard...'
        );
        // Direct navigation to destination dashboard
        window.location.href = destination;
      }
    } catch (err) {
      toast.error(
        isAr ? 'حدث خطأ أثناء الدخول.' : 'An error occurred during entry.'
      );
      setLoadingRole(null);
    }
  };

  const loginOptions = [
    {
      title: isAr ? 'بوابة مدير المدرسة' : 'School Principal Portal',
      desc: isAr
        ? 'التحكم في العمليات الإدارية، شؤون المعلمين والطلاب، القبول، والتقارير الأكاديمية والمالية.'
        : 'Manage administrative operations, teacher & student affairs, admissions, and institutional reports.',
      icon: <Settings />,
      type: 'standard',
      color: 'emerald',
      roleKey: 'admin',
      link: '/dashboard/principal',
    },
    {
      title: isAr ? 'بوابة المعلم' : 'Teacher Portal',
      desc: isAr
        ? 'إدارة الفصول الدراسية، تسجيل الحضور والغياب، إدخال الدرجات والنتائج، وجداول الحصص.'
        : 'Manage classrooms, student attendance records, grade entry, and lesson schedules.',
      icon: <BookOpen />,
      type: 'standard',
      color: 'indigo',
      roleKey: 'teacher',
      link: '/dashboard/teacher',
    },
    {
      title: isAr ? 'بوابة الطالب' : 'Student Portal',
      desc: isAr
        ? 'الوصول إلى لوحة التحكم، الحضور، النتائج الدراسية، المواد التعليمية، والاختبارات.'
        : 'Access your courses, attendance tracking, exam grades, study materials, and tests.',
      icon: <GraduationCap />,
      type: 'standard',
      color: 'blue',
      roleKey: 'student',
      link: '/dashboard/student',
    },
    {
      title: isAr ? 'بوابة ولي الأمر' : 'Parent Portal',
      desc: isAr
        ? 'متابعة أداء الأبناء الدراسي، الحضور والغياب، والرسوم والمدفوعات، والتواصل مع المدرسة.'
        : "Track your children's performance, daily attendance, fee invoices, and school notices.",
      icon: <Users />,
      type: 'standard',
      color: 'amber',
      roleKey: 'parent',
      link: '/dashboard/parent',
    },
    {
      title: isAr ? 'بوابة المحاسب' : 'Accountant Portal',
      desc: isAr
        ? 'إدارة القوائم المالية، الرواتب، المصروفات، السندات، وتحصيل الرسوم المدرسية.'
        : 'Manage financial ledgers, staff payroll, school expenses, and fee collection.',
      icon: <Wallet />,
      type: 'standard',
      color: 'cyan',
      roleKey: 'accountant',
      link: '/dashboard/accountant',
    },
    {
      title: isAr ? 'المدير العام للنظام' : 'Super Admin Portal',
      desc: isAr
        ? 'التحكم الشامل بإعدادات منصة مثقال تك، إدارة المدارس المشتركة، والاشتراكات والأمان.'
        : 'Global control over SaaS platform settings, multi-school management, and subscriptions.',
      icon: <ShieldCheck />,
      type: 'special',
      color: 'rose',
      roleKey: 'super_admin',
      link: '/dashboard/super-admin',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow relative overflow-hidden bg-bg-page pt-32 pb-20 px-6">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 start-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[10%] -start-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-[20%] -end-[5%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] start-[20%] w-[25%] h-[25%] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm">
              <Sparkles size={16} className="text-primary" />
              <span className="text-primary font-bold tracking-wider text-xs uppercase">
                {isAr ? 'منصة مثقال تك المدرسية' : 'Methqal Tech Platform'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-text-primary mb-6 tracking-tight leading-tight">
              {isAr ? (
                <>
                  البوابات التجريبية <span className="text-primary">التفاعلية</span>
                </>
              ) : (
                <>
                  Interactive <span className="text-primary">Demo Portals</span>
                </>
              )}
            </h1>
            <p className="text-text-muted max-w-2xl mx-auto text-base md:text-xl font-medium leading-relaxed">
              {isAr
                ? 'اختر دورك لتجربة كافة مميزات نظام إدارة المدارس واستكشاف المستقبل الرقمي للتعليم بكل سلاسة وببيانات واقعية.'
                : 'Select your role to explore all school management system features with realistic live data.'}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <CheckCircle2 size={16} />
              <span>
                {isAr
                  ? 'جميع الحسابات التجريبية جاهزة ومربوطة بالبيانات الواقعية'
                  : 'All demo accounts are ready with live database relations'}
              </span>
            </div>
          </header>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loginOptions.map((item, idx) => (
              <div
                key={idx}
                className={`group relative p-8 md:p-10 rounded-[2.5rem] border border-border-light bg-bg-card/90 backdrop-blur-md
                  hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 
                  flex flex-col items-center text-center overflow-hidden
                  ${item.type === 'special' ? 'ring-2 ring-rose-500/20' : ''}`}
              >
                {/* Visual Accent */}
                <div
                  className={`absolute top-0 start-0 w-full h-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r 
                  ${
                    item.color === 'rose'
                      ? 'from-rose-500 to-rose-400'
                      : item.color === 'emerald'
                      ? 'from-emerald-500 to-teal-400'
                      : item.color === 'amber'
                      ? 'from-amber-500 to-orange-400'
                      : item.color === 'cyan'
                      ? 'from-cyan-500 to-blue-400'
                      : item.color === 'indigo'
                      ? 'from-indigo-500 to-violet-400'
                      : 'from-primary to-blue-400'
                  }`}
                />

                {/* Icon Container */}
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3
                  ${
                    item.type === 'special'
                      ? 'bg-rose-500 text-white shadow-[0_10px_30px_rgba(244,63,94,0.3)]'
                      : item.color === 'emerald'
                      ? 'bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)]'
                      : item.color === 'amber'
                      ? 'bg-amber-500 text-white shadow-[0_10px_30px_rgba(245,158,11,0.3)]'
                      : item.color === 'indigo'
                      ? 'bg-indigo-500 text-white shadow-[0_10px_30px_rgba(99,102,241,0.3)]'
                      : item.color === 'cyan'
                      ? 'bg-cyan-600 text-white shadow-[0_10px_30px_rgba(8,145,178,0.3)]'
                      : 'bg-primary text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)]'
                  }`}
                >
                  {React.cloneElement(item.icon, { size: 36, strokeWidth: 1.5 })}
                </div>

                <h2 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h2>

                <p className="text-text-muted text-sm md:text-base leading-relaxed mb-8 font-medium">
                  {item.desc}
                </p>

                <div className="w-full mt-auto pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDemoLogin(item.roleKey, item.link);
                    }}
                    disabled={loadingRole !== null}
                    className={`relative z-20 pointer-events-auto px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center gap-3 w-full justify-center shadow-md active:scale-95
                      ${
                        loadingRole === item.roleKey
                          ? 'bg-primary/20 text-primary cursor-wait'
                          : item.type === 'special'
                          ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/20'
                          : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'
                      }`}
                  >
                    {loadingRole === item.roleKey ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>{isAr ? 'جارٍ تسجيل الدخول...' : 'Entering...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isAr ? 'دخول البوابة' : 'Enter Portal'}</span>
                        <ArrowRight
                          size={18}
                          className={`transition-transform group-hover:translate-x-1 ${
                            isAr ? 'rotate-180 group-hover:-translate-x-1' : ''
                          }`}
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Hint */}
          <div className="mt-16 text-center">
            <p className="text-text-muted text-sm font-semibold bg-bg-card/50 backdrop-blur-sm border border-border-light inline-block px-8 py-4 rounded-full shadow-sm">
              {isAr ? (
                <>
                  ترغب في استخدام مثقال تك لمدرستك؟{' '}
                  <Link href="/login/apply" className="text-primary hover:underline font-bold">
                    قدم طلب انضمام مؤسستك الآن
                  </Link>{' '}
                  أو{' '}
                  <Link href="/Support" className="text-primary hover:underline font-bold">
                    تواصل مع الدعم الفني
                  </Link>
                  .
                </>
              ) : (
                <>
                  Want to use Methqal Tech for your institution?{' '}
                  <Link href="/login/apply" className="text-primary hover:underline font-bold">
                    Apply for School Access
                  </Link>{' '}
                  or{' '}
                  <Link href="/Support" className="text-primary hover:underline font-bold">
                    Contact Support
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllLogin;
