'use client';

import { useLanguage } from '@/context/LanguageProvider';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ---------------- Data ---------------- */
const academicData = [
  { month: 'Jan', average: 65 },
  { month: 'Feb', average: 68 },
  { month: 'Mar', average: 72 },
  { month: 'Apr', average: 75 },
  { month: 'May', average: 78 },
  { month: 'Jun', average: 82 },
];

const attendanceData = [
  { class: 'Class VI', attendance: 88 },
  { class: 'Class VII', attendance: 85 },
  { class: 'Class VIII', attendance: 90 },
  { class: 'Class IX', attendance: 87 },
  { class: 'Class X', attendance: 92 },
];

const performanceInsights = {
  improving: [
    { class: 'Class XII', subject: 'Science', change: '+4.2%' },
    { class: 'Class XI', subject: 'Mathematics', change: '+3.8%' },
    { class: 'Class VI', subject: 'Overall', change: '+2.1%' },
  ],
  attention: [
    { class: 'Class VIII', subject: 'English', change: '-2.4%' },
    { class: 'Class X', subject: 'Social Studies', change: '-1%' },
  ],
};

export default function SchoolPerformancePage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  return (
    <div className="space-y-8 p-6 bg-bg-page min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          School Performance
        </h1>
        <p className="text-sm text-text-muted">
          Academic progress & attendance insights
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-card p-6 rounded-xl border border-border-light">
          <h3 className="text-sm text-text-muted">{isAr ? 'النتيجة الإجمالية' : 'Overall Result'}</h3>
          <p className="text-2xl font-bold text-primary mt-1">78%</p>
          <p className="text-xs text-text-muted mt-1">
            Based on last 6 months
          </p>
        </div>

        <div className="bg-bg-card p-6 rounded-xl border border-border-light">
          <h3 className="text-sm text-text-muted">
            Average Attendance
          </h3>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            88%
          </p>
          <p className="text-xs text-text-muted mt-1">
            Stable trend
          </p>
        </div>

        <div className="bg-bg-card p-6 rounded-xl border border-border-light">
          <h3 className="text-sm text-text-muted">
            Top Performing Class
          </h3>
          <p className="text-2xl font-bold text-indigo-400 mt-1">
            Class X
          </p>
          <p className="text-xs text-text-muted mt-1">
            Highest attendance & result
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-bg-card p-6 rounded-xl border border-border-light">
          <h3 className="font-semibold text-text-primary mb-4">
            Academic Performance Trend
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={academicData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,.2)"
                />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line
                  dataKey="average"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-bg-card p-6 rounded-xl border border-border-light">
          <h3 className="font-semibold text-text-primary mb-4">
            Class-wise Attendance
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,.2)"
                />
                <XAxis dataKey="class" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[80, 100]} />
                <Tooltip />
                <Bar
                  dataKey="attendance"
                  fill="var(--color-primary)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Performance Insights (PREMIUM) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Improving */}
        <div className="relative overflow-hidden bg-bg-card p-6 rounded-2xl border border-border-light shadow-lg">
          {/* subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />

          <h3 className="flex items-center gap-2 font-semibold text-text-primary mb-6">
            <span className="text-emerald-400 text-lg">↗</span>
            Improving
            <span className="ms-auto text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
              Positive Trend
            </span>
          </h3>

          <div className="space-y-4">
            {performanceInsights.improving.map((item, i) => (
              <div
                key={i}
                className="group flex items-center justify-between p-4 rounded-xl 
                     bg-bg-page border border-border-light
                     hover:border-emerald-500/40 hover:bg-emerald-500/5
                     transition-all duration-200"
              >
                <div>
                  <p className="font-semibold text-text-primary">
                    {item.class}
                  </p>
                  <p className="text-sm text-text-muted">
                    {item.subject}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                    Growth
                  </span>
                  <p className="font-semibold text-emerald-400 text-lg">
                    {item.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="relative overflow-hidden bg-bg-card p-6 rounded-2xl border border-border-light shadow-lg">
          {/* subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none" />

          <h3 className="flex items-center gap-2 font-semibold text-text-primary mb-6">
            <span className="text-yellow-400 text-lg">↘</span>
            Needs Attention
            <span className="ms-auto text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
              Action Required
            </span>
          </h3>

          <div className="space-y-4">
            {performanceInsights.attention.map((item, i) => (
              <div
                key={i}
                className="group flex items-center justify-between p-4 rounded-xl 
                     bg-bg-page border border-border-light
                     hover:border-yellow-500/40 hover:bg-yellow-500/5
                     transition-all duration-200"
              >
                <div>
                  <p className="font-semibold text-text-primary">
                    {item.class}
                  </p>
                  <p className="text-sm text-text-muted">
                    {item.subject}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
                    Risk
                  </span>
                  <p className="font-semibold text-yellow-400 text-lg">
                    {item.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
