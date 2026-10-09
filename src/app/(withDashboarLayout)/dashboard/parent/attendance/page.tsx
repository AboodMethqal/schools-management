'use client';

import { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  AlertTriangle,
  FileText,
  Loader2,
  GraduationCap,
} from 'lucide-react';
import { getParentAttendanceData } from "@/app/actions/parent/attendance";
import { useLanguage } from "@/context/LanguageProvider";

// Simple className merger
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Card Component
const Card = ({
  children,
  className = "",
  style = {}
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={cn(
      "bg-bg-card rounded-2xl border border-border-light shadow-sm hover:shadow-xl hover:border-blue-200/60 transition-all duration-500",
      className
    )}
    style={style}
  >
    {children}
  </div>
);

export default function AttendancePage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [selectedChildId, setSelectedChildId] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      const res = await getParentAttendanceData();
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
          <GraduationCap className="absolute inset-0 m-auto text-blue-900/20" size={30} />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-black text-text-primary tracking-tight animate-pulse">Fetching Attendance Records...</p>
        </div>
      </div>
    );
  }

  const children = data?.children || [];
  const activeChild = children.find((child: any) => child.id === selectedChildId) || children[0];
  const attendanceLog = activeChild?.attendanceLog || [];
  
  const presentCount = attendanceLog.filter((l: any) => l.status === 'Present').length;
  const absentCount = attendanceLog.filter((l: any) => l.status === 'Absent').length;
  const attendancePercentage = attendanceLog.length > 0 
    ? ((presentCount / attendanceLog.length) * 100).toFixed(0) + '%'
    : '0%';

  return (
    <div className="space-y-8 animate-fadeIn p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Attendance Report
          </h1>
          <p className="text-sm text-text-muted mt-1">
            View detailed daily attendance record of your child
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={activeChild?.id || ''}
            onChange={(event) => setSelectedChildId(event.target.value)}
            className="min-w-[220px] rounded-xl border border-border-light bg-bg-card px-4 py-2.5 text-sm font-bold text-text-primary outline-none focus:border-blue-500"
          >
            {children.map((child: any) => (
              <option key={child.id} value={child.id}>{child.name} — {child.class}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: isAr ? "إجمالي الأيام المسجلة" : "Total Recorded", value: attendanceLog.length, icon: CalendarIcon, bg: 'bg-blue-500/10', color: 'text-blue-500' },
          { label: isAr ? "حاضر" : "Present", value: presentCount, icon: CheckCircle2, bg: 'bg-emerald-500/10', color: 'text-emerald-500' },
          { label: isAr ? "غائب" : "Absent", value: absentCount, icon: XCircle, bg: 'bg-red-500/10', color: 'text-red-500' },
          { label: isAr ? "متوسط الحضور" : "Avg. Rate", value: attendancePercentage, icon: Clock, bg: 'bg-indigo-500/10', color: 'text-indigo-500' },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="p-5 group"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", item.bg)}>
              <item.icon size={20} className={item.color} />
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              {item.label}
            </p>
            <p className="text-2xl font-bold text-text-primary mt-1">
              {item.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border-light flex justify-between items-center bg-bg-page/30">
            <h3 className="font-bold text-text-primary flex items-center gap-2">{isAr ? "السجلات اليومية" : "Daily Logs"}</h3>
            <button 
              onClick={() => alert('Attendance Policy:\n- 85% attendance required for exam eligibility.\n- Late entry after 08:30 AM.\n- Consecutive 3 days absence requires a medical certificate.')}
              className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-lg transition-colors border border-blue-500/10 uppercase tracking-widest"
            >
              <Info size={14} /> View Rules
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="bg-bg-page/50 text-text-muted">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider border-b border-border-light">
                    Date
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider border-b border-border-light">
                    Entry Time
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider border-b border-border-light">
                    Exit Time
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider border-b border-border-light text-end">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border-light">
                {attendanceLog.map((log: any, idx: number) => (
                  <tr
                    key={idx}
                    className="hover:bg-bg-page/80 transition-colors group animate-fadeInSlide"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-text-primary">
                          {log.date}
                        </span>
                        <span className="text-[10px] font-medium text-text-muted">{log.day}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Clock size={14} className="text-text-muted" />
                        {log.entry || "---"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {log.exit || "---"}
                    </td>

                    <td className="px-6 py-4 text-end">
                      <span
                        className={cn(
                          "px-3 py-1 text-[10px] font-black rounded-lg border uppercase tracking-widest leading-none shadow-sm",
                          log.statusColor === 'emerald' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                          log.statusColor === 'red' && "bg-red-500/10 text-red-500 border-red-500/20",
                          log.statusColor === 'orange' && "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}
                      >{isAr ? (log.status === "Present" ? "حاضر" : log.status === "Absent" ? "غائب" : "متأخر") : log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 bg-bg-card border-border-light relative overflow-hidden group">
            <div className="absolute top-0 end-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <h3 className="font-bold text-text-primary mb-6 flex items-center gap-2 text-sm uppercase tracking-widest relative z-10">
              <AlertTriangle size={18} className="text-amber-500" />
              Information
            </h3>

            <div className="space-y-4 text-xs text-text-secondary leading-relaxed">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                <p>
                  Entry after <span className="font-bold text-text-primary">10:15 AM</span> will be marked as <span className="font-bold text-orange-600">Late</span>.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                <p>
                  If absent for <span className="font-bold text-text-primary">3 consecutive days</span>, parents must submit valid justification.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-linear-to-br from-blue-600 to-indigo-700 text-white border-none shadow-blue-200">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <FileText size={24} className="text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">
              Apply for Leave?
            </h4>
            <p className="text-xs text-white/80 mb-6 leading-relaxed">
              Plan to be away? Submit an advance leave request to avoid unmarked absences.
            </p>
            <button 
              onClick={() => alert('Leave Request Form will open in a new window.')}
              className="w-full py-3 bg-white text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Open Request Form
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
