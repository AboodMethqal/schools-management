'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  UserCheck,
  GraduationCap,
  FileText,
  Bell,
  Calendar,
  Clock,
  Loader2,
  Users,
  X,
  CheckCircle2,
  XCircle,
  BarChart3,
} from 'lucide-react';
import { TeacherHeader } from './TeacherHeader';
import { getTeacherDashboardData } from '@/app/actions/teacher/dashboard';
import { getStudentsByClass } from '@/app/actions/teacher/results';
import {
  getAttendance,
  saveAttendance,
} from '@/app/actions/teacher/attendance';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageProvider';

export default function TeacherOverview() {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState<
    any | null
  >(null);
  const [selectedDateForAttendance, setSelectedDateForAttendance] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getTeacherDashboardData();
      if (res.success) {
        setData(res.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleOpenQuickAttendance = async (cls: any, date?: string) => {
    const targetDate = date || selectedDateForAttendance;
    if (!date) setSelectedClassForAttendance(cls);
    setIsAttendanceLoading(true);

    const [studentsRes, attendanceRes] = await Promise.all([
      getStudentsByClass(cls.id),
      getAttendance(cls.id, targetDate),
    ]);

    if (studentsRes.success) {
      setStudents(studentsRes.data || []);
      const attMap: Record<string, string> = {};
      if (attendanceRes.success && attendanceRes.data) {
        attendanceRes.data.forEach((rec: any) => {
          attMap[rec.studentId] = rec.status;
        });
      }
      setAttendance(attMap);
    } else {
      toast.error(studentsRes.error || 'Failed to load students');
    }
    setIsAttendanceLoading(false);
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClassForAttendance) return;
    setIsSaving(true);
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status: status as any,
      date: selectedDateForAttendance,
      classId: selectedClassForAttendance.id,
    }));

    const res = await saveAttendance(records);
    if (res.success) {
      toast.success('Attendance saved!');
      setSelectedClassForAttendance(null);
      // Refresh dashboard data to update stats
      const refreshRes = await getTeacherDashboardData();
      if (refreshRes.success) setData(refreshRes.data);
    } else {
      toast.error(res.error || 'Failed to save attendance');
    }
    setIsSaving(false);
  };

  const isDatePast = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dateStr);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  const stats = [
    {
      title: t('Assigned Classes'),
      value: data?.stats?.totalClasses?.toString() || '0',
      subValue: `${data?.assignedClasses?.length || 0} ${t('active classes')}`,
      icon: Calendar,
      color: 'from-blue-600 to-indigo-600',
      lightColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: t("Today's Attendance"),
      value: data?.stats?.todayAttendance?.toString() || '0',
      subValue: t('Recorded today'),
      icon: UserCheck,
      color: 'from-orange-600 to-amber-600',
      lightColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: t('Total Students'),
      value: data?.stats?.totalStudents?.toString() || '0',
      subValue: t('Under your classes'),
      icon: Users,
      color: 'from-emerald-600 to-teal-600',
      lightColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: t('Total Notices'),
      value: data?.notices?.length?.toString() || '0',
      subValue: t('Active notices'),
      icon: Bell,
      color: 'from-rose-600 to-pink-600',
      lightColor: 'bg-rose-50 dark:bg-rose-900/20',
      textColor: 'text-rose-600 dark:text-rose-400',
    },
  ];

  const cn = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <TeacherHeader
        title="Welcome,"
        highlight={data?.profile?.name || 'Teacher'}
        emoji="👋"
        subtitle={`${data?.profile?.designation || 'Faculty'} | ${data?.profile?.department || 'Department'}`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-bg-card p-6 rounded-2xl border border-border-light shadow-sm hover:shadow-md transition-all duration-200"
          >
            {stat.title === "Today's Attendance" ? (
              <Link
                href="/dashboard/teacher/attendance"
                className="flex flex-col gap-4"
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                    stat.lightColor,
                  )}
                >
                  <stat.icon className={stat.textColor} size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <div className="flex flex-col mt-1">
                    <h3 className="text-2xl font-bold text-text-primary leading-tight">
                      {stat.value}
                    </h3>
                    <p
                      className={cn(
                        'text-[9px] font-bold uppercase tracking-tighter mt-0.5',
                        stat.textColor,
                      )}
                    >
                      {stat.subValue}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex flex-col gap-4">
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                    stat.lightColor,
                  )}
                >
                  <stat.icon className={stat.textColor} size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <div className="flex flex-col mt-1">
                    <h3 className="text-2xl font-bold text-text-primary leading-tight">
                      {stat.value}
                    </h3>
                    <p
                      className={cn(
                        'text-[9px] font-bold uppercase tracking-tighter mt-0.5',
                        stat.textColor,
                      )}
                    >
                      {stat.subValue}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-bg-card rounded-3xl border border-border-light shadow-sm p-6">
        <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-primary rounded-full"></div>
          {t('Quick Actions')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <Link
            href="/dashboard/teacher/attendance"
            className="flex flex-col items-center justify-center p-4 bg-bg-page border border-border-light rounded-2xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all group"
          >
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-3 group-hover:scale-110 transition-transform">
              <UserCheck size={24} />
            </div>
            <span className="text-xs font-bold text-text-secondary group-hover:text-primary">
              {t('Mark Attendance')}
            </span>
          </Link>
          <Link
            href="/dashboard/teacher/results"
            className="flex flex-col items-center justify-center p-4 bg-bg-page border border-border-light rounded-2xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all group"
          >
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform">
              <GraduationCap size={24} />
            </div>
            <span className="text-xs font-bold text-text-secondary group-hover:text-primary">
              {t('Enter Result')}
            </span>
          </Link>
          <Link
            href="/dashboard/teacher/study-materials"
            className="flex flex-col items-center justify-center p-4 bg-bg-page border border-border-light rounded-2xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all group"
          >
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <span className="text-xs font-bold text-text-secondary group-hover:text-primary">
              {t('Upload Material')}
            </span>
          </Link>
          <Link
            href="/dashboard/teacher/assignments"
            className="flex flex-col items-center justify-center p-4 bg-bg-page border border-border-light rounded-2xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all group"
          >
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <span className="text-xs font-bold text-text-secondary group-hover:text-primary">
              {t('Post Assignment')}
            </span>
          </Link>
          <Link
            href="/dashboard/teacher/create-exam"
            className="flex flex-col items-center justify-center p-4 bg-bg-page border border-border-light rounded-2xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all group"
          >
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
            <span className="text-xs font-bold text-text-secondary group-hover:text-primary">
              {t('Create Exam')}
            </span>
          </Link>
          <Link
            href="/dashboard/teacher/my-exams"
            className="flex flex-col items-center justify-center p-4 bg-bg-page border border-border-light rounded-2xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all group"
          >
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3 group-hover:scale-110 transition-transform">
              <Bell size={24} />
            </div>
            <span className="text-xs font-bold text-text-secondary group-hover:text-primary">
              {t('My Exams')}
            </span>
          </Link>
          <Link
            href="/dashboard/teacher/mcq-results"
            className="flex flex-col items-center justify-center p-4 bg-bg-page border border-border-light rounded-2xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all group"
          >
            <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/20 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
            <span className="text-xs font-bold text-text-secondary group-hover:text-primary text-center leading-tight">
              {t('MCQ Results')}
            </span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assigned Classes List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Calendar size={20} />
              </div>
              <h2 className="text-xl font-bold text-text-primary">
                {t('Your Classes')}
              </h2>
            </div>
          </div>

          <div className="grid gap-4">
            {data?.assignedClasses?.length > 0 ? (
              data.assignedClasses.map((cls: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => handleOpenQuickAttendance(cls)}
                  className="group bg-bg-card p-5 rounded-2xl border border-border-light shadow-sm hover:border-indigo-500/40 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-primary group-hover:text-primary transition-colors">
                        {cls.name}
                      </h4>
                      <p className="text-xs text-text-muted font-medium mt-0.5">
                        {t('Click to view attendance')}
                      </p>
                    </div>
                  </div>
                  <div className="bg-primary/5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('Quick View')}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-bg-card border border-border-light rounded-3xl">
                <p className="text-text-muted font-bold text-sm">
                  {t('No classes assigned to you.')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Cards for Dashboard */}
        <div className="space-y-8">
          {/* Notices Section */}
          <div className="bg-bg-card rounded-3xl p-6 border border-border-light shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Bell size={18} className="text-indigo-600" /> {t('Notice Board')}
              </h3>
            </div>
            <div className="space-y-5">
              {data?.notices?.length > 0 ? (
                data.notices.map((notice: any, idx: number) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-bold text-text-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {t(notice.title)}
                      </h4>
                      <span
                        className={cn(
                          'shrink-0 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600',
                        )}
                      >
                        {t(notice.priority)}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-1.5 font-medium">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                    {idx !== data.notices.length - 1 && (
                      <div className="h-px bg-border-light mt-5"></div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-muted text-center py-4">
                  {t('No recent notices.')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Attendance Modal */}
      {selectedClassForAttendance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isSaving && setSelectedClassForAttendance(null)}
          ></div>
          <div className="bg-bg-card w-full max-w-2xl rounded-3xl p-8 relative z-10 shadow-2xl animate-slideInBottom border border-border-light max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    {t('Attendance')}: {selectedClassForAttendance.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-text-muted font-medium italic">
                      {t('Record for:')}
                    </p>
                    <input
                      type="date"
                      value={selectedDateForAttendance}
                      onChange={(e) => {
                        setSelectedDateForAttendance(e.target.value);
                        handleOpenQuickAttendance(
                          selectedClassForAttendance,
                          e.target.value,
                        );
                      }}
                      className="bg-bg-page border border-border-light rounded-lg px-2 py-0.5 text-[10px] font-bold text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedClassForAttendance(null)}
                className="p-2 hover:bg-bg-page rounded-xl text-text-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {isAttendanceLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary mb-4" size={32} />
                <p className="text-sm text-text-muted">{t('Loading students...')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3 max-h-100 overflow-y-auto pe-2 custom-scrollbar">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-bg-page/50 rounded-2xl border border-border-light/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-text-muted w-6">
                          {student.rollNo}
                        </span>
                        <span className="text-sm font-bold text-text-primary">
                          {student.firstName} {student.lastName}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          disabled={isDatePast(selectedDateForAttendance)}
                          onClick={() =>
                            handleStatusChange(student.id, 'PRESENT')
                          }
                          className={cn(
                            'p-2 rounded-lg transition-all',
                            attendance[student.id] === 'PRESENT'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-bg-card text-emerald-600 border border-emerald-100 hover:bg-emerald-50',
                            isDatePast(selectedDateForAttendance) &&
                              'opacity-50 cursor-not-allowed',
                          )}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          disabled={isDatePast(selectedDateForAttendance)}
                          onClick={() =>
                            handleStatusChange(student.id, 'ABSENT')
                          }
                          className={cn(
                            'p-2 rounded-lg transition-all',
                            attendance[student.id] === 'ABSENT'
                              ? 'bg-red-500 text-white'
                              : 'bg-bg-card text-red-600 border border-red-100 hover:bg-red-50',
                            isDatePast(selectedDateForAttendance) &&
                              'opacity-50 cursor-not-allowed',
                          )}
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {students.length === 0 && (
                    <p className="text-center py-10 text-text-muted">
                      {t('No students in this class.')}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    disabled={isSaving}
                    onClick={() => setSelectedClassForAttendance(null)}
                    className="flex-1 py-3 border border-border-light text-text-secondary rounded-xl font-bold text-sm hover:bg-bg-page transition-colors"
                  >
                    {t('Cancel')}
                  </button>
                  <button
                    disabled={
                      isSaving ||
                      students.length === 0 ||
                      isDatePast(selectedDateForAttendance)
                    }
                    onClick={handleSaveAttendance}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : null}
                    {isSaving
                      ? t('Saving...')
                      : isDatePast(selectedDateForAttendance)
                        ? t('Read Only')
                        : t('Save Attendance')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
