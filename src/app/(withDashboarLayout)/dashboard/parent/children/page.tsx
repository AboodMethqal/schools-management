'use client';

import { useEffect, useState } from 'react';
import { User, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getParentChildren } from '@/app/actions/parent/children';
import { useLanguage } from '@/context/LanguageProvider';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-bg-card rounded-2xl border border-border-light shadow-sm hover:shadow-xl hover:border-blue-200/60 transition-all duration-500 ${className}`}>
    {children}
  </div>
);

export default function ChildrenListPage() {
  const { t, language } = useLanguage();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getParentChildren().then((res) => {
      if (res.success) setChildren(res.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={44} /></div>;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-8 animate-fadeIn">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Methqal Tech</p>
        <h1 className="mt-2 text-3xl font-black text-text-primary">{t('My Children')}</h1>
        <p className="mt-2 text-sm text-text-muted">{t('Select a student to view academic profile, attendance, results, and evaluations.')}</p>
      </div>

      {children.length === 0 ? (
        <Card className="p-10 text-center">
          <User className="mx-auto text-text-muted" size={42} />
          <h3 className="mt-4 text-lg font-black text-text-primary">{t('No students linked to this account')}</h3>
          <p className="mt-2 text-sm text-text-muted">{t('Please contact the school administration to link your children to your parent account.')}</p>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {children.map((child) => (
            <Link href={`/dashboard/parent/children/${child.id}`} key={child.id} className="group block">
              <Card className="relative overflow-hidden p-6">
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/10 group-hover:scale-105 transition-transform">
                    <User size={30} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xl font-black text-text-primary group-hover:text-blue-600">{child.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-text-muted">
                      {child.class} • {child.section} • {language === 'ar' ? `رقم ${child.roll}` : `Roll #${child.roll}`}
                    </p>
                  </div>
                  <ChevronRight className="shrink-0 text-text-muted rtl:rotate-180" size={22} />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-bg-page p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">{t('Student ID')}</p>
                    <p className="mt-1 font-bold text-text-primary">{child.registrationNo}</p>
                  </div>
                  <div className="rounded-2xl bg-bg-page p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-text-muted">{t('Guardian')}</p>
                    <p className="mt-1 font-bold text-text-primary">{child.guardian || '—'}</p>
                  </div>
                </div>
                <div className="absolute -bottom-10 -end-10 h-28 w-28 rounded-full bg-blue-500/5 blur-2xl" />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
