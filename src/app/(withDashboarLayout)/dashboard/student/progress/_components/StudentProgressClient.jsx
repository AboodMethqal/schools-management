'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  TrendingUp,
  Award,
  BookOpen,
  Zap,
  Target,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageProvider';

const getStatus = (score) => {
  if (score >= 80) {
    return {
      label: 'Excellent',
      comment: 'Outstanding',
      color: 'text-emerald-600 dark:text-emerald-300',
    };
  }
  if (score >= 60) {
    return {
      label: 'Good Job',
      comment: 'Improving',
      color: 'text-amber-600 dark:text-amber-300',
    };
  }
  return {
    label: 'Keep Practicing',
    comment: 'Needs Effort',
    color: 'text-rose-600 dark:text-rose-300',
  };
};

const tooltipScoreStyle = {
  Excellent: 'text-emerald-600 dark:text-emerald-300',
  'Good Job': 'text-amber-600 dark:text-amber-300',
  'Keep Practicing': 'text-rose-600 dark:text-rose-300',
};

const CustomProgressTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const score = payload[0]?.value ?? 0;
  const subject = payload[0]?.payload?.subject || 'Exam';
  const state = getStatus(score);

  return (
    <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 px-3.5 py-2.5 shadow-xl backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-[0.16em] font-black text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="text-xs font-bold text-text-secondary mt-0.5">{subject}</p>
      <div className="flex items-end gap-2 mt-1.5">
        <p
          className={`text-lg leading-none font-black ${tooltipScoreStyle[state.label]}`}
        >
          {score}%
        </p>
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 pb-0.5">
          {state.comment}
        </p>
      </div>
    </div>
  );
};

const StudentProgressClient = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (authLoading) return;

      if (!user?.email) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/exams/submit?email=${encodeURIComponent(user.email)}`,
        );
        const data = await res.json();

        if (data.success) {
          const mapped = data.data.map((item, idx) => {
            const percentage = item.totalQuestions
              ? Math.round((item.totalMark / item.totalQuestions) * 100)
              : 0;

            return {
              name: `Exam ${idx + 1}`,
              score: percentage,
              subject: item.examSubject || 'Exam',
              submittedAt: item.submittedAt,
            };
          });

          setResults(mapped);
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user, authLoading]);

  const averageScore = useMemo(() => {
    if (results.length === 0) return 0;
    return Math.round(
      results.reduce((sum, r) => sum + r.score, 0) / results.length,
    );
  }, [results]);

  const bestScore = useMemo(() => {
    if (results.length === 0) return 0;
    return Math.max(...results.map((r) => r.score));
  }, [results]);

  const lowestScore = useMemo(() => {
    if (results.length === 0) return 0;
    return Math.min(...results.map((r) => r.score));
  }, [results]);

  const status = getStatus(averageScore);

  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-bg-card rounded-4xl border border-border-light">
        <Loader2 className="animate-spin mb-3 text-primary" size={30} />
        <p className="text-text-secondary text-sm font-semibold">
          Analyzing your progress...
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-bg-card rounded-4xl border border-border-light p-12 text-center">
        <BookOpen
          size={36}
          className="text-slate-300 dark:text-slate-500 mx-auto mb-3"
        />
        <p className="text-text-primary font-bold mb-1">No exam data yet</p>
        <p className="text-text-secondary text-sm">
          Complete at least one exam to see your performance analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 rounded-4xl border border-border-light bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
          <p className="text-[10px] uppercase tracking-[0.18em] font-black text-blue-100">
            Performance Summary
          </p>
          <p className="text-4xl font-black mt-3">{averageScore}%</p>
          <p className={`mt-2 text-sm font-bold text-white/90`}>
            {status.label}
          </p>
          <p className="text-xs text-blue-100 mt-1">{status.comment}</p>
        </div>

        {[
          { icon: Target, label: 'Exams Taken', value: `${results.length}` },
          { icon: Zap, label: 'Best Score', value: `${bestScore}%` },
          { icon: Award, label: 'Lowest Score', value: `${lowestScore}%` },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-4xl border border-border-light bg-bg-card p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 text-text-muted mb-3">
              <card.icon size={14} />
              <p className="text-[10px] uppercase tracking-[0.15em] font-black">
                {card.label}
              </p>
            </div>
            <p className="text-3xl font-black text-text-primary">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-4xl border border-border-light bg-bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={16} className="text-primary" />
          <p className="text-xs font-black uppercase tracking-[0.15em] text-text-secondary">
            Score Trend
          </p>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={results}
              margin={{ top: 18, right: 12, left: 2, bottom: 4 }}
            >
              <defs>
                <linearGradient
                  id="scoreAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="55%" stopColor="#2563eb" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="rgba(148, 163, 184, 0.22)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                tickFormatter={(value) => `${value}%`}
                width={36}
              />
              <ReferenceLine
                y={averageScore}
                stroke="#64748b"
                strokeDasharray="5 5"
                strokeOpacity={0.7}
              />
              <Tooltip cursor={false} content={<CustomProgressTooltip />} />
              <Area
                dataKey="score"
                type="monotone"
                stroke="none"
                fill="url(#scoreAreaGradient)"
              />
              <Line
                dataKey="score"
                type="monotone"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: '#ffffff',
                  stroke: '#2563eb',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: '#2563eb',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-4xl border border-border-light bg-bg-card p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-text-muted mb-4">
          Latest Attempts
        </p>
        <div className="space-y-3">
          {results.slice(0, 5).map((item) => (
            <div
              key={`${item.name}-${item.submittedAt}`}
              className="flex items-center justify-between rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-transparent dark:border-slate-700/60 px-4 py-3"
            >
              <div>
                <p className="font-bold text-text-primary text-sm">
                  {item.subject}
                </p>
                <p className="text-xs text-text-muted">
                  {new Date(item.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <p
                className={`font-black text-base ${getStatus(item.score).color}`}
              >
                {item.score}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProgressClient;
