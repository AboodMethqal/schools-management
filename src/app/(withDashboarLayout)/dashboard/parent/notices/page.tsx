'use client';

import { useState, useEffect } from 'react';
import {
  Megaphone,
  Search,
  Pin,
  Clock,
  Download,
  ChevronRight,
  Calendar,
  FileText,
  Filter,
  X,
  Loader2,
  GraduationCap,
} from 'lucide-react';
import { getParentNoticesData } from "@/app/actions/parent/notices";
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

export default function NoticesPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadData() {
      const res = await getParentNoticesData();
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
          <p className="text-xl font-black text-text-primary tracking-tight animate-pulse">Fetching Bulletins...</p>
        </div>
      </div>
    );
  }

  const allNotices = data?.notices || [];

  const categories = [
    { name: 'Academic', count: 12, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Exams', count: 4, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'Events', count: 8, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Holidays', count: 5, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
             Notice Board
          </h1>
          <p className="text-sm text-text-muted mt-1 leading-relaxed">
            Stay updated with important school announcements and news
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              className="absolute start-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-blue-600 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder={isAr ? "البحث في الإعلانات..." : "Search notices..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-11 pe-5 py-3 bg-bg-card border border-border-light rounded-2xl text-sm w-full md:w-72 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
            />
          </div>
          <button className="p-3 bg-bg-card border border-border-light rounded-2xl text-text-muted hover:bg-bg-page hover:text-blue-600 transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notice List */}
        <div className="lg:col-span-2 space-y-6">
          {allNotices
            .filter((n: any) => 
              (selectedCategory === 'All' || n.category === selectedCategory) &&
              (n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.desc.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map((notice: any, idx: number) => (
            <Card
              key={notice.id}
              className="p-8 group animate-fadeInSlide relative overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {notice.isPinned && (
                <div className="absolute end-0 top-0 bg-blue-600 text-white p-2 rounded-bl-3xl shadow-lg z-10 transition-transform group-hover:scale-110">
                  <Pin size={16} fill="currentColor" className="-rotate-12" />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border shadow-sm leading-none",
                    notice.category === 'Event' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                    notice.category === 'Holiday' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                    notice.category === 'Exam' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                  )}>
                    {notice.category}
                  </span>

                  <span className="text-[10px] text-text-muted font-bold flex items-center gap-1.5 uppercase tracking-wider">
                    <Clock size={14} className="text-slate-400" /> {notice.date}
                  </span>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl font-bold text-text-primary leading-tight group-hover:text-blue-600 transition-colors">
                    {notice.title}
                  </h3>
                  
                  <button 
                    onClick={() => window.print()}
                    className="shrink-0 p-3 rounded-2xl bg-bg-page border border-border-light text-text-muted group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 shadow-sm"
                  >
                    <Download size={20} />
                  </button>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
                  {notice.desc}
                </p>

                <div className="pt-6 mt-6 border-t border-border-light flex justify-between items-center">
                  <button 
                    onClick={() => alert('Detailed notice view coming soon!')}
                    className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:gap-3 transition-all"
                  >
                    View Details <ChevronRight size={16} />
                  </button>

                  <div className="flex items-center gap-2">
                    {notice.priority === 'Urgent' && (
                       <span className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 leading-none shadow-sm">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                        Urgent
                      </span>
                    )}
                    {notice.priority !== 'Urgent' && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {notice.priority} Priority
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Decorative accent */}
              <div className={cn(
                "absolute start-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5",
                notice.category === 'Event' && "bg-blue-500",
                notice.category === 'Holiday' && "bg-emerald-500",
                notice.category === 'Exam' && "bg-amber-500",
              )} />
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <Card className="p-6">
            <h3 className="font-bold text-text-primary mb-6 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full" />
               Categories
            </h3>

            <div className="space-y-2">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-bg-page transition-all group border border-transparent hover:border-border-light"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", cat.color.replace('text', 'bg'))} />
                    <span className="text-sm text-text-secondary group-hover:text-text-primary font-bold transition-colors">
                      {cat.name}
                    </span>
                  </div>
                  <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all uppercase tracking-widest leading-none", cat.bg, cat.color, "border-transparent group-hover:border-current/20 shadow-sm")}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Calendar Promotion Card */}
          <Card className="p-6 bg-linear-to-br from-blue-600 to-indigo-700 text-white border-none shadow-blue-200 group overflow-hidden relative">
            <div className="absolute -end-6 -bottom-6 text-white/5 rotate-12 transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-12">
              <Calendar size={180} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Calendar size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-lg">
                  School Calendar
                </h3>
              </div>

              <p className="text-xs text-white/80 mb-8 leading-relaxed">
                Download the complete academic calendar for 2026, including holidays and events.
              </p>

              <button 
                onClick={() => window.print()}
                className="w-full py-3.5 bg-white text-blue-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:shadow-xl hover:bg-blue-50 transition-all active:scale-[0.98] group/btn shadow-lg"
              >
                <FileText size={18} className="transition-transform group-hover/btn:-translate-y-0.5" />
                Download PDF
              </button>
            </div>
          </Card>
          
          {/* Quick Notice Card */}
          <Card className="p-6 bg-slate-900 text-white border-none">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Megaphone size={18} className="text-amber-400" />
              Quick Alert
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
              All notifications are also sent to your registered mobile number and email address.
            </p>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[10px] font-bold text-white/70 uppercase mb-1">Last Sync</p>
              <p className="text-xs font-mono">Today, 10:45 AM</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
