'use client'
import { FileText, Download, Mail, PieChart, Search, Filter, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import { useLanguage } from '@/context/LanguageProvider';

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

export default function ReportsPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const reports = [
    {
      name: 'Attendance Summary (February)',
      date: '28 Feb, 2026',
      type: 'Attendance',
      size: '1.2 MB',
      color: 'blue',
    },
    { 
      name: 'Performance Card (Term 1)', 
      date: '15 Feb, 2026', 
      type: 'Academic', 
      size: '2.5 MB',
      color: 'emerald',
    },
    { 
      name: 'Annual Fee Statement', 
      date: '01 Jan, 2026', 
      type: 'Finance', 
      size: '0.8 MB',
      color: 'amber',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Academic & Financial Reports
          </h1>
          <p className="text-sm text-text-muted mt-2 leading-relaxed">
            Access and download your child's progress reports and financial statements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="ps-11 pe-5 py-3 bg-bg-card border border-border-light rounded-2xl text-sm w-full md:w-64 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
            />
          </div>
          <button className="p-3 bg-bg-card border border-border-light rounded-2xl text-text-muted hover:bg-bg-page hover:text-blue-600 transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 gap-4">
        {reports.map((report, i) => (
          <Card
            key={i}
            className="p-1 group overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm border",
                  report.color === 'blue' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                  report.color === 'emerald' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                  report.color === 'amber' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                )}>
                  <FileText size={28} />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-text-primary group-hover:text-blue-600 transition-colors">
                    {report.name}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">
                    <span className={cn(
                      "px-2 py-1 rounded-lg border leading-none shadow-sm",
                      report.color === 'blue' && "bg-blue-500/10 border-blue-500/20 text-blue-500",
                      report.color === 'emerald' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
                      report.color === 'amber' && "bg-amber-500/10 border-amber-500/20 text-amber-500",
                    )}>
                      {report.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-text-muted" /> {report.date}
                    </span>
                    <span className="border-l border-border-light ps-3 text-text-muted">
                      {report.size}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                <button
                  onClick={() => Swal.fire({
                    title: 'Email Sent',
                    text: `A copy of ${report.name} has been sent to your registered email.`,
                    icon: 'success',
                    confirmButtonColor: '#3b82f6',
                  })}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-page border border-border-light text-text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/20 transition-all shadow-sm"
                  title="Email Copy"
                >
                  <Mail size={16} />
                  EMAIL
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-blue-600/30 transition-all active:scale-[0.98] group/btn"
                  title="Download PDF"
                >
                  <Download size={16} className="transition-transform group-hover/btn:translate-y-0.5" />
                  DOWNLOAD
                </button>
              </div>
            </div>
            
            {/* Hover bar */}
            <div className={cn(
              "h-1 w-0 group-hover:w-full transition-all duration-700",
              report.color === 'blue' && "bg-blue-500",
              report.color === 'emerald' && "bg-emerald-500",
              report.color === 'amber' && "bg-amber-500",
            )} />
          </Card>
        ))}
      </div>

      {/* Stats Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Card className="p-6 bg-slate-900 border-none relative overflow-hidden group">
          <div className="absolute -end-6 -bottom-6 text-white/5 group-hover:scale-110 transition-transform duration-700">
             <PieChart size={140} />
          </div>
          <div className="relative z-10 space-y-4">
            <h5 className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Academic Overview</h5>
            <p className="text-white text-sm font-medium leading-relaxed max-w-[240px]">
              Visualize your child's progress throughout the semester with our new analytics tool.
            </p>
            <button className="text-xs font-bold text-blue-400 flex items-center gap-2 hover:text-blue-300 transition-colors">
              Open Analytics <PieChart size={16} />
            </button>
          </div>
        </Card>

        <Card className="p-6 bg-blue-600 border-none relative overflow-hidden group">
           <div className="absolute end-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
           <div className="relative z-10 space-y-4">
             <h5 className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">Secure Access</h5>
             <p className="text-white text-sm font-medium leading-relaxed">
               All reports are encrypted and can only be accessed with your primary guardian account.
             </p>
             <div className="bg-black/20 backdrop-blur-md rounded-xl p-3 inline-block border border-white/10">
               <p className="text-[10px] font-mono text-white/80 uppercase">Last Accessed: Today, 09:15 AM</p>
             </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
