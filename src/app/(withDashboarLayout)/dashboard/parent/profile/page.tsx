'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Edit3,
  Settings,
  Loader2,
  GraduationCap,
  Shield,
} from 'lucide-react';
import { getParentProfileData } from '@/app/actions/parent/profile';
import { useLanguage } from '@/context/LanguageProvider';

// Simple className merger
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Card Component
const Card = ({
  children,
  className = '',
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={cn(
      'bg-bg-card rounded-2xl border border-border-light shadow-sm hover:shadow-xl hover:border-blue-200/60 transition-all duration-500',
      className,
    )}
    style={style}
  >
    {children}
  </div>
);

export default function ParentProfile() {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);


  console.log(data)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getParentProfileData();
        console.log("DEBUG: ParentProfile server response:", res);
        
        if (res.success) {
          setData(res.data);
        } else {
          console.error("DEBUG: ParentProfile Error:", res.error);
        }
      } catch (err) {
        console.error("DEBUG: ParentProfile Critical Error:", err);
      } finally {
        setLoading(false);
      }
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
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  const profileInfo = [
    {
      label: 'Full Name',
      value: data?.name || 'N/A',
      icon: User,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Email Address',
      value: data?.email || 'N/A',
      icon: Mail,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Phone Number',
      value: data?.phone || 'N/A',
      icon: Phone,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Linked Student ID',
      value: data?.studentId || 'N/A',
      icon: Shield,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn p-2 md:p-6">
      {/* Header with Profile Cover */}
      <Card className="overflow-hidden border-none shadow-blue-100/50">
        <div className="h-40 bg-linear-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

          <div className="absolute -bottom-16 start-1/2 -translate-x-1/2 md:start-12 md:translate-x-0">
            <div className="w-32 h-32 rounded-3xl bg-bg-card p-1.5 shadow-2xl shadow-blue-900/20 border border-border-light">
              <div className="w-full h-full rounded-[1.25rem] bg-bg-page flex items-center justify-center text-4xl font-black text-blue-500 border border-border-light">
                {data?.name
                  ?.split(' ')
                  .map((n: string) => n[0])
                  .join('') || 'RA'}
              </div>
            </div>
          </div>

          <div className="absolute top-6 end-6 flex gap-2">
            <Link href="/dashboard/parent/settings" className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all border border-white/10 group">
              <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </Link>
            <Link href="/dashboard/parent/settings" className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-all border border-white/10">
              <Edit3 size={20} />
            </Link>
          </div>
        </div>

        <div className="pt-20 pb-10 px-8 text-center md:text-start flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-text-primary tracking-tight">
              {data?.name || 'Parent Name'}
            </h2>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-lg border border-emerald-500/20 uppercase tracking-widest shadow-sm leading-none">
                <ShieldCheck size={12} className="text-emerald-500" />
                Verified Parent
              </span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest border-l border-border-light ps-3">
                ID: {data?.studentId || 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-3 border-t md:border-t-0 pt-6 md:pt-0">
            <div className="text-center md:text-end">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">
                Last Update
              </p>
              <p className="text-xs font-bold text-text-primary">
                12 March 2026
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileInfo.map((item, i) => (
          <Card
            key={i}
            className="p-6 group hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-start gap-5">
              <div
                className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border group-hover:shadow-md',
                  item.bg,
                  item.color,
                  'border-current/5',
                )}
              >
                <item.icon
                  size={26}
                  className="transition-transform group-hover:scale-110"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black text-text-muted tracking-[0.2em]">
                  {item.label}
                </p>
                <p className="text-base font-bold text-text-primary">
                  {item.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer Note */}
      <Card className="p-6 bg-bg-page border-border-light relative overflow-hidden group">
        <div className="absolute top-0 end-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-blue-500/10 transition-colors" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <MapPin size={16} />
            </div>
            <p className="text-xs text-text-secondary font-medium italic">
              Please contact the school administration if any information needs
              to be updated.
            </p>
          </div>
          <button className="px-5 py-2.5 bg-bg-card border border-border-light text-text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm">
            Contact Admin
          </button>
        </div>
      </Card>
    </div>
  );
}
