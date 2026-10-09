'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, ArrowUpLeft, Bell, BookOpen, CalendarCheck, CheckCircle2, ChevronLeft, GraduationCap, Loader2, MessageCircle, Wallet, Users, TrendingUp } from 'lucide-react';
import { getParentDashboardData } from '@/app/actions/parent/dashboard';
import { useRoleGuard } from '@/hooks/useRoleGurad';
import { useLanguage } from '@/context/LanguageProvider';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-3xl border border-border-light bg-bg-card shadow-sm ${className}`}>{children}</div>
);

export default function ParentDashboard() {
  const { user, loading: authLoading } = useRoleGuard('parent');
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  useEffect(() => {
    getParentDashboardData().then((res) => {
      if (res.success && res.data) {
        setData(res.data);
        if (Array.isArray(res.data.children) && res.data.children.length > 0) {
          setSelectedChildId(res.data.children[0].id);
        }
      }
      setLoading(false);
    });
  }, []);

  if (authLoading || loading) return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={44} /></div>;

  const children = data?.children || [];
  const activeChild = children.find((c: any) => c.id === selectedChildId) || children[0];
  const parentName = data?.parentName || user?.name || (language === 'ar' ? 'ولي الأمر' : 'Parent');

  const currencySymbol = language === 'ar' ? 'ر.ي' : '$';

  return (
    <div className="space-y-7 animate-fadeIn">
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 p-7 text-white shadow-2xl md:p-10">
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-200">Methqal Tech</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
            {language === 'ar' ? `مرحبًا ${parentName} 👋` : `Welcome, ${parentName} 👋`}
          </h1>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-blue-100/80 md:text-base">
            {t("Track your children's academic progress, attendance, results, fees, and teacher notes from a single dashboard.")}
          </p>
        </div>
        <GraduationCap className="absolute -bottom-12 -end-8 h-56 w-56 rotate-12 text-white/5 md:h-72 md:w-72" />
      </section>

      {/* Interactive Child Switcher Tabs */}
      {children.length > 1 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-3xl border border-blue-200/50 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-white dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-bg-card shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Users size={18} />
            </span>
            <div>
              <p className="text-xs font-black text-text-primary">{t('Child Switcher')}</p>
              <p className="text-[11px] font-semibold text-text-muted">{t('Select a student to view live records and statistics from the database')}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {children.map((child: any) => {
              const isSelected = activeChild?.id === child.id;
              return (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                      : 'bg-bg-card text-text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-border-light'
                  }`}
                >
                  <GraduationCap size={15} />
                  <span>{child.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-600'}`}>
                    {child.currentClass}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label={t('Linked Children')} value={children.length} tone="blue" />
        <StatCard
          icon={CalendarCheck}
          label={language === 'ar' ? `حضور ${activeChild?.name ? activeChild.name.split(' ')[0] : 'الطالب'}` : `Attendance (${activeChild?.name ? activeChild.name.split(' ')[0] : 'Student'})`}
          value={activeChild?.attendance || '0%'}
          tone="emerald"
        />
        <StatCard
          icon={TrendingUp}
          label={language === 'ar' ? `المعدل (${activeChild?.name ? activeChild.name.split(' ')[0] : ''})` : `GPA (${activeChild?.name ? activeChild.name.split(' ')[0] : ''})`}
          value={activeChild?.cgpa || '0.00'}
          tone="violet"
        />
        <StatCard
          icon={Wallet}
          label={t('Outstanding Fees')}
          value={language === 'ar' ? `${currencySymbol} ${activeChild?.pendingFees?.toLocaleString('ar-YE') || '0'}` : `${currencySymbol}${activeChild?.pendingFees?.toLocaleString('en-US') || '0'}`}
          tone="amber"
        />
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-text-primary">{t('My Children')}</h2>
            <p className="mt-1 text-sm text-text-muted">{t('Select a student to follow up on their details and complete academic profile.')}</p>
          </div>
          <Link href="/dashboard/parent/children" className="text-xs font-black text-blue-600 hover:underline">
            {t('View all')}
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {children.map((child: any) => {
            const isSelected = activeChild?.id === child.id;
            return (
              <div
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className="cursor-pointer"
              >
                <Card className={`group overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-xl ${isSelected ? 'border-2 border-blue-500 ring-2 ring-blue-500/20' : 'border-border-light'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-500/10 text-blue-600'}`}>
                      <GraduationCap size={28} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-lg font-black text-text-primary">{child.name}</h3>
                        {isSelected && <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black">{t('Currently Active')}</span>}
                      </div>
                      <p className="mt-1 text-xs font-semibold text-text-muted">
                        {child.currentClass} • {t('Class Section')} {child.section}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/parent/children/${child.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl text-text-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                      title={t('View full profile')}
                    >
                      <ChevronLeft size={20} className={language === 'ar' ? '' : 'rotate-180'} />
                    </Link>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <Metric label={t('GPA')} value={child.cgpa} />
                    <Metric label={t('Attendance')} value={child.attendance} />
                    <Metric label={t('Outstanding Fees')} value={language === 'ar' ? `${currencySymbol} ${child.pendingFees?.toLocaleString('ar-YE')}` : `${currencySymbol}${child.pendingFees?.toLocaleString('en-US')}`} />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-black text-text-primary">{t('Recent Activities')}</h2>
              <p className="mt-1 text-xs text-text-muted">{t('Latest updates recorded for your children.')}</p>
            </div>
            <Activity className="text-blue-600" size={20} />
          </div>
          <div className="space-y-3">
            {(data?.activities || []).map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-bg-page p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  {item.type === 'notice' ? <Bell size={17} /> : item.type === 'feedback' ? <MessageCircle size={17} /> : <BookOpen size={17} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-text-primary">{t(item.title)}</p>
                  <p className="mt-1 truncate text-xs text-text-muted">{t(item.status)}</p>
                </div>
                <span className="text-[10px] font-bold text-text-muted">
                  {new Date(item.time).toLocaleDateString(language === 'ar' ? 'ar-YE' : 'en-US')}
                </span>
              </div>
            ))}
            {(!data?.activities || data.activities.length === 0) && <EmptyState text={t('No recent activities.')} />}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-black text-text-primary">{t('Quick Access')}</h2>
          <div className="mt-5 space-y-2">
            <QuickLink href="/dashboard/parent/results" icon={TrendingUp} label={t('Results & Performance')} language={language} />
            <QuickLink href="/dashboard/parent/attendance" icon={CalendarCheck} label={t('Attendance & Absence')} language={language} />
            <QuickLink href="/dashboard/parent/communication" icon={MessageCircle} label={t('School Communication')} language={language} />
            <QuickLink href="/dashboard/parent/fees" icon={Wallet} label={t('Fees & Payments')} language={language} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }: any) {
  const tones: any = { blue: 'bg-blue-500/10 text-blue-600', emerald: 'bg-emerald-500/10 text-emerald-600', violet: 'bg-violet-500/10 text-violet-600', amber: 'bg-amber-500/10 text-amber-600' };
  return (
    <Card className="p-4 md:p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon size={19} /></div>
      <p className="mt-3 text-[10px] font-black text-text-muted">{label}</p>
      <p className="mt-1 truncate text-xl font-black text-text-primary md:text-2xl">{value}</p>
    </Card>
  );
}

function Metric({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-bg-page p-3">
      <p className="text-[9px] font-black text-text-muted">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-text-primary">{value}</p>
    </div>
  );
}

function QuickLink({ href, icon: Icon, label, language }: any) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl border border-border-light p-3 transition hover:border-blue-300 hover:bg-blue-500/5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600"><Icon size={16} /></span>
      <span className="flex-1 text-xs font-black text-text-primary">{label}</span>
      <ArrowUpLeft size={15} className={`text-text-muted ${language === 'ar' ? '' : '-scale-x-100'}`} />
    </Link>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border-light p-8 text-center text-sm font-bold text-text-muted">
      <CheckCircle2 className="mx-auto mb-2 opacity-50" size={22} />
      {text}
    </div>
  );
}
