'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageProvider';
import {
  Loader2,
  CheckCircle2,
  Clock,
  User,
  Hash,
  Trophy,
  CalendarDays,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';

const StudentExams = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('joined');
  const [allExams, setAllExams] = useState([]);
  const [joinedExams, setJoinedExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      fetchData(user?.email);
    }
  }, [user, authLoading]);

  const fetchData = async (email) => {
    try {
      setLoading(true);
      const resAll = await fetch('/api/exams/create');
      const dataAll = await resAll.json();

      let dataJoined = { success: true, data: [] };
      if (email) {
        const resJoined = await fetch(`/api/exams/submit?email=${email}`);
        dataJoined = await resJoined.json();
      }

      if (dataAll.success) setAllExams(dataAll.data);
      if (dataJoined.success) setJoinedExams(dataJoined.data);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  const averageScore =
    joinedExams.length > 0
      ? Math.round(
          (joinedExams.reduce((sum, item) => sum + item.totalMark, 0) /
            joinedExams.reduce((sum, item) => sum + item.totalQuestions, 0)) *
            100,
        )
      : 0;

  return (
    <div className="p-4 md:p-8 bg-bg-page min-h-screen space-y-8">
      <div className="rounded-4xl bg-bg-card border border-border-light p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              Student Panel
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight mt-1">
              My Exams & Results
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              All submitted exams and available active rooms in one place.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 min-w-32">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">
                Attempts
              </p>
              <p className="text-2xl font-black text-primary">
                {joinedExams.length}
              </p>
            </div>
            <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/40 min-w-32">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700/80 dark:text-emerald-300/90">
                Avg. Score
              </p>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                {averageScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-bg-card p-1 rounded-2xl border border-border-light w-fit shadow-sm">
        {/* <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
          ${
            activeTab === 'all'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-text-secondary hover:bg-bg-page'
          }`}
        >
          <BookOpen size={16} /> All Available Exams
        </button> */}

        <button
          onClick={() => setActiveTab('joined')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
          ${
            activeTab === 'joined'
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-text-secondary hover:bg-bg-page'
          }`}
        >
          <CheckCircle2 size={16} /> My Results ({joinedExams.length})
        </button>
      </div>

      <div className="bg-bg-card border border-border-light rounded-4xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'all' ? (
            <table className="w-full text-start border-collapse">
              <thead className="bg-slate-50/70 dark:bg-slate-800/60">
                <tr className="border-b border-border-light">
                  <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
                    Exam Title
                  </th>
                  <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
                    Category
                  </th>
                  <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
                    Duration
                  </th>
                  <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
                    Created Date
                  </th>
                  <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allExams.map((exam) => (
                  <tr
                    key={exam._id}
                    className="border-b border-border-light last:border-0 hover:bg-[#f0fdf4]/30 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="p-5">
                      <div className="font-bold text-text-primary group-hover:text-primary transition-colors">
                        {exam.examTitle || exam.roomTitle}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-200 rounded-lg text-[11px] font-bold">
                        {exam.category || 'Science'}
                      </span>
                    </td>
                    <td className="p-5 text-sm text-text-secondary font-medium">
                      <div className="flex items-center gap-2">
                        <Clock
                          size={14}
                          className="text-slate-300 dark:text-slate-500"
                        />{' '}
                        {exam.duration}
                      </div>
                    </td>
                    <td className="p-5 text-sm text-text-secondary font-medium">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={14}
                          className="text-slate-300 dark:text-slate-500"
                        />
                        {new Date(exam.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="p-5">
                      <Link
                        href="/dashboard/student/take-exam"
                        className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80"
                      >
                        Take Exam <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-start border-collapse">
              <thead className="bg-slate-50/70 dark:bg-slate-800/60">
                <tr className="border-b border-border-light">
                  <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
                    Exam Subject
                  </th>
                  <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
                    Teacher
                  </th>

                  <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
                    Final Score
                  </th>
                  <th className="p-5 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">
                    Verification
                  </th>
                </tr>
              </thead>
              <tbody>
                {joinedExams.map((result) => (
                  <tr
                    key={result._id}
                    className="border-b border-border-light last:border-0 hover:bg-[#f0fdf4]/30 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="p-5">
                      <div className="font-bold text-text-primary">
                        {result.examSubject}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
                        <User
                          size={14}
                          className="text-slate-300 dark:text-slate-500"
                        />{' '}
                        {result.teacherEmail}
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex items-center gap-2 font-black text-text-primary">
                        <Trophy size={16} className="text-primary" />
                        {result.totalMark}{' '}
                        <span className="text-slate-300 dark:text-slate-500 font-bold">
                          / {result.totalQuestions}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase bg-primary/5 w-fit px-3 py-1 rounded-full border border-primary/10">
                        <CheckCircle2 size={12} /> Verified
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {((activeTab === 'all' && allExams.length === 0) ||
        (activeTab === 'joined' && joinedExams.length === 0)) && (
        <div className="text-center py-20 bg-bg-card border border-dashed border-border-light rounded-4xl">
          <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Hash className="text-slate-300 dark:text-slate-500" size={30} />
          </div>
          <p className="text-text-secondary font-bold uppercase tracking-widest text-xs">
            No data recorded yet
          </p>
        </div>
      )}

      <div className="text-end">
        <Link
          href="/dashboard/student/progress"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border-light text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary hover:border-primary/30 transition"
        >
          View Progress Analytics <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
};

export default StudentExams;
