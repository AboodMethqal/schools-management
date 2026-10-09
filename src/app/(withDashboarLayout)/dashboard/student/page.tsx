'use client';

import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Calendar,
  GraduationCap,
  TrendingUp,
  Clock,
  Bell,
  ArrowRight,
  Loader2,
  MessageSquare,
  FileText,
  ClipboardList,
  LineChart,
} from 'lucide-react';
import { getStudentDashboardData } from '@/app/actions/student/dashboard';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageProvider';

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    async function loadData() {
      const res = await getStudentDashboardData();
      if (res.success) {
        setData(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-600" size={60} />
          <GraduationCap
            className="absolute inset-0 m-auto text-blue-900/20"
            size={30}
          />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-black text-text-primary tracking-tight animate-pulse">
            {t('Setting up your classroom...')}
          </p>
          <p className="text-text-muted text-sm font-medium">
            {t('Fetching your latest updates from the school portal')}
          </p>
        </div>
      </div>
    );
  }

  const getGpaColor = (val: number) => {
    if (val >= 3.8)
      return {
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      };
    if (val >= 3.5)
      return {
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
      };
    if (val >= 3.0)
      return {
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      };
    if (val >= 2.0)
      return {
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
      };
    return {
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
    };
  };

  const gpaVal = parseFloat(data?.stats?.cgpa || '0');
  const gpaStyle = getGpaColor(gpaVal);

  const stats = [
    {
      title: t('Attendance'),
      value: data?.stats?.attendance || '0%',
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      link: '/dashboard/student/attendance',
    },
    {
      title: t('Average GPA'),
      value: data?.stats?.cgpa || '0.00',
      icon: TrendingUp,
      color: gpaStyle.color,
      bg: gpaStyle.bg,
      link: '/dashboard/student/results',
    },
    {
      title: t('Courses'),
      value: data?.stats?.courses || '0',
      icon: BookOpen,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      link: '#',
    },
    {
      title: t('Updates'),
      value: data?.stats?.assignments ? `${data?.stats?.assignments} ${t('New')}` : `0 ${t('New')}`,
      icon: Bell,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      link: '/dashboard/student/notices',
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-5xl font-black mb-3 md:mb-4 tracking-tighter">
            {language === 'ar'
              ? `مرحبًا بعودتك، ${data?.studentName?.split(' ')[0] || ''}! 👋`
              : `Welcome back, ${data?.studentName?.split(' ')[0]}! 👋`}
          </h2>
          <p className="text-blue-100 max-w-md text-base md:text-lg font-medium opacity-90 leading-relaxed">
            {language === 'ar' ? (
              <>
                اليوم هو{' '}
                {new Date().toLocaleDateString('ar-EG', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
                . لديك{' '}
                <span className="text-white font-black underline decoration-blue-400 underline-offset-4">
                  {data?.schedule?.length || 0} حصص
                </span>{' '}
                مجدولة لهذا اليوم.
              </>
            ) : (
              <>
                Today is{' '}
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
                . You have{' '}
                <span className="text-white font-black underline decoration-blue-400 underline-offset-4">
                  {data?.schedule?.length || 0} classes
                </span>{' '}
                scheduled for today.
              </>
            )}
          </p>
        </div>
        <div className="absolute end-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700 hidden md:block">
          <GraduationCap size={320} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <Link
            href={stat.link}
            key={idx}
            className="bg-bg-card border border-border-light rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div
                className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 shadow-inner`}
              >
                <stat.icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <span className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.25em]">
                {t('Live Data')}
              </span>
            </div>
            <p className="text-text-secondary text-xs md:text-sm font-black uppercase tracking-widest">
              {stat.title}
            </p>
            <h3 className="text-3xl md:text-4xl font-black text-text-primary mt-2 tracking-tighter">
              {stat.value}
            </h3>
          </Link>
        ))}
      </div>

      <div className="bg-bg-card border border-border-light rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
              {t('Exam Center')}
            </p>
            <h3 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight mt-2">
              {t('Take, Track, Improve')}
            </h3>
          </div>
          <p className="text-sm text-text-secondary font-medium max-w-lg">
            {t(
              'Join live exams with room code, review your submitted exams, and monitor score trends from one place.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: t('Take Exam'),
              desc: t('Enter teacher room code and start instantly'),
              icon: ClipboardList,
              href: '/dashboard/student/take-exam',
              accent:
                'text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30',
            },
            {
              title: t('My Exams'),
              desc: t('See submitted exams and all published rooms'),
              icon: FileText,
              href: '/dashboard/student/my-exams',
              accent:
                'text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30',
            },
            {
              title: t('Progress'),
              desc: t('View analytics of your exam performance'),
              icon: LineChart,
              href: '/dashboard/student/progress',
              accent:
                'text-violet-600 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/30',
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-3xl border border-border-light p-5 md:p-6 bg-bg-page dark:bg-slate-900/40 hover:shadow-md transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${item.accent} flex items-center justify-center mb-4`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <p className="font-black text-text-primary text-lg tracking-tight group-hover:text-primary transition-colors">
                {item.title}
              </p>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                {item.desc}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-4 text-[10px] uppercase tracking-widest font-black text-primary">
                {t('Open')} <ArrowRight size={12} className={language === 'ar' ? 'rotate-180' : ''} />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Financial Overview & Latest Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Financial Summary */}
        <div className="bg-bg-card border border-border-light rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden group">
          {/* Decorative pattern */}
          <div className="absolute top-0 end-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700 hidden md:block"></div>

          <div className="relative z-10 space-y-6 md:space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
                {t('Financial Overview')}
              </h3>
              <div className="p-2 md:p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl md:rounded-2xl">
                <FileText className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="p-4 md:p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl md:rounded-3xl border border-border-light">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1 text-emerald-600">
                  {t('Total Paid')}
                </p>
                <p className="text-xl md:text-2xl font-black text-text-primary tracking-tighter">
                  {language === 'ar' ? `${data?.financials?.paid} ر.ي` : `$${data?.financials?.paid}`}
                </p>
              </div>
              <div className="p-4 md:p-6 bg-rose-50/50 dark:bg-rose-900/10 rounded-2xl md:rounded-3xl border border-rose-100/30">
                <p className="text-[9px] md:text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">
                  {t('Due Amount')}
                </p>
                <p className="text-xl md:text-2xl font-black text-rose-700 dark:text-rose-400 tracking-tighter">
                  {language === 'ar' ? `${data?.financials?.pending} ر.ي` : `$${data?.financials?.pending}`}
                </p>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between text-[10px] md:text-xs font-black uppercase tracking-wider">
                <span className="text-text-muted">{t('Payment Progress')}</span>
                <span className="text-emerald-600">
                  {data?.financials?.progress}%
                </span>
              </div>
              <div className="h-3 md:h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-border-light p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 shadow-sm shadow-emerald-500/20"
                  style={{ width: `${data?.financials?.progress}%` }}
                ></div>
              </div>
              <p className="text-[9px] md:text-[10px] text-text-muted font-bold tracking-tight">
                {t('Total Yearly Fee:')}{' '}
                <span className="text-text-primary underline">
                  {language === 'ar' ? `ر.ي ${data?.financials?.total}` : `$${data?.financials?.total}`}
                </span>
              </p>
            </div>

            <Link
              href="/dashboard/student/payments"
              className="w-full flex items-center justify-center gap-2 py-3 md:py-4 rounded-xl md:rounded-2xl bg-slate-900 text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] transform active:scale-[0.98] transition-all hover:bg-slate-800 hover:shadow-xl shadow-lg shadow-slate-900/10"
            >
              {t('Pay Now')} <ArrowRight size={14} className={language === 'ar' ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>

        {/* Feedback Hero */}
        <div className="bg-bg-card border border-border-light rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden group">
          {/* Decorative pattern */}
          <div className="absolute top-0 end-0 w-64 h-64 bg-purple-50 dark:bg-purple-900/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700 hidden md:block"></div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
                {t('Latest Feedback')}
              </h3>
              <div className="p-2 md:p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl md:rounded-2xl">
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </div>

            <div className="flex-1 space-y-4 md:space-y-6">
              {data?.feedback?.length > 0 ? (
                data.feedback.map((fb: any) => (
                  <div
                    key={fb.id}
                    className="p-4 md:p-6 bg-slate-50/50 dark:bg-slate-800/20 rounded-[1.5rem] md:rounded-[2rem] border border-border-light relative"
                  >
                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center font-black text-xs md:text-sm">
                        {fb.teacher?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs md:text-sm font-black text-text-primary leading-none">
                          {fb.teacher}
                        </p>
                        <p className="text-[8px] md:text-[9px] font-black text-text-muted uppercase tracking-widest mt-1">
                          {fb.date}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] md:text-xs text-text-secondary leading-relaxed line-clamp-2 font-medium italic">
                      "{fb.comment}"
                    </p>
                    <div className="flex gap-1 mt-3 md:mt-4">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                            i < Math.round((fb.academic + fb.behavior + fb.participation) / 3)
                              ? 'bg-amber-400'
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 md:py-10 opacity-30 h-full">
                  <MessageSquare className="w-9 h-9 md:w-12 md:h-12 mb-3 md:mb-4" />
                  <p className="font-black uppercase tracking-widest text-[9px] md:text-[10px]">
                    {t('No feedback yet')}
                  </p>
                </div>
              )}
            </div>

            <Link
              href="/dashboard/student/feedback"
              className="w-full mt-6 py-3 md:py-4 rounded-full border-2 border-dashed border-border-light text-text-muted text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:bg-bg-page hover:border-purple-300 hover:text-purple-600 transition-all text-center"
            >
              {t('See Performance Stats')}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-text-primary tracking-tight ms-2">
              {t('Recent Campus Feed')}
            </h3>
            <Link
              href="/dashboard/student/notices"
              className="text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-2 group px-5 py-2.5 bg-blue-50 dark:bg-blue-900/40 rounded-full transition-all hover:shadow-md uppercase tracking-widest"
            >
              {t('View Bulletin')}{' '}
              <ArrowRight
                size={14}
                className={`group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`}
              />
            </Link>
          </div>

          <div className="bg-bg-card border border-border-light rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              {data?.activities?.length > 0 ? (
                data.activities.map((activity: any) => (
                  <Link
                    key={activity.id}
                    href={
                      activity.type === 'notice'
                        ? '/dashboard/student/notices'
                        : activity.type === 'result'
                          ? '/dashboard/student/results'
                          : '/dashboard/student/feedback'
                    }
                    className="p-5 md:p-8 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group border-b border-border-light last:border-0 min-w-[400px] md:min-w-0"
                  >
                    <div className="flex items-center gap-4 md:gap-6 text-start">
                      <div
                        className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg shrink-0 ${
                          activity.type === 'notice'
                            ? 'bg-amber-500'
                            : activity.type === 'result'
                              ? 'bg-blue-500'
                              : 'bg-purple-500'
                        }`}
                      >
                        {activity.type === 'notice' && (
                          <Bell className="text-white w-5 h-5 md:w-6 md:h-6" />
                        )}
                        {activity.type === 'result' && (
                          <FileText className="text-white w-5 h-5 md:w-6 md:h-6" />
                        )}
                        {activity.type === 'feedback' && (
                          <MessageSquare className="text-white w-5 h-5 md:w-6 md:h-6" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-text-primary text-base md:text-lg tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                          {t(activity.title)}
                        </h4>
                        <p className="text-[10px] md:text-sm text-text-muted font-bold flex items-center gap-1.5 md:gap-2">
                          <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />{' '}
                          {new Date(activity.time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[8px] md:text-[10px] font-black px-3 md:px-5 py-1.5 md:py-2 rounded-full border uppercase tracking-widest shrink-0 ${
                        activity.type === 'notice'
                          ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20'
                          : activity.type === 'result'
                            ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20'
                            : 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20'
                      }`}
                    >
                      {t(activity.status)}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="p-10 md:p-20 text-center opacity-30">
                  <Bell className="mx-auto mb-3 md:mb-4 w-10 h-10 md:w-12 md:h-12" />
                  <p className="font-black uppercase tracking-widest text-[10px] md:text-xs">
                    {t('No recent updates')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-6">
          <h3 className="text-xl md:text-2xl font-black text-text-primary tracking-tight ms-2">
            {t('Daily Routine')}
          </h3>
          <div className="bg-bg-card border border-border-light rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 end-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity hidden md:block">
              <Clock size={100} />
            </div>
            <div className="space-y-6 md:space-y-10 relative z-10">
              {data?.schedule?.length > 0 ? (
                data.schedule.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 md:gap-6 relative">
                    {i !== data.schedule.length - 1 && (
                      <div className="absolute start-[19px] md:start-[23px] top-10 md:top-12 bottom-[-30px] md:bottom-[-40px] w-0.5 bg-border-light" />
                    )}
                    <div className="z-10 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm shrink-0 font-black border border-blue-100 dark:border-blue-800 transition-transform group-hover:scale-105 text-sm md:text-base">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-text-primary text-base md:text-lg tracking-tight">
                        {t(item.subject)}
                      </h4>
                      <p className="text-[11px] md:text-sm text-text-muted font-black mt-1 uppercase tracking-wider">
                        {item.time} •{' '}
                        <span className="text-blue-600 dark:text-blue-400">
                          {item.instructor}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 md:py-10 opacity-40">
                  <Calendar className="mx-auto mb-3 md:mb-4 w-9 h-9 md:w-10 md:h-10" />
                  <p className="font-black uppercase tracking-widest text-[9px] md:text-[10px]">
                    {t('No Classes Today')}
                  </p>
                </div>
              )}
            </div>
            <Link
              href="#"
              className="w-full mt-8 md:mt-12 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-dashed border-border-light text-text-muted text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:bg-bg-page hover:border-blue-300 hover:text-blue-600 transition-all active:scale-[0.98] block text-center"
            >
              {t('Full Calendar')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
