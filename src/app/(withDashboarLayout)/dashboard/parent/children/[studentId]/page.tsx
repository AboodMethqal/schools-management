'use client';

import { useEffect, useState } from 'react';
import { User, GraduationCap, Calendar, BookOpen, ShieldCheck, ArrowRight, IdCard, Droplets, Phone, MapPin, CalendarCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getParentChild } from '@/app/actions/parent/children';
import { useLanguage } from '@/context/LanguageProvider';

export default function ChildDetailPage() {
  const params = useParams<{ studentId: string }>();
  const { t, language } = useLanguage();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.studentId) getParentChild(params.studentId).then((res) => { if (res.success) setStudent(res.data); setLoading(false); });
  }, [params.studentId]);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={44} /></div>;
  if (!student) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-black text-text-primary">{t('Student not found')}</h2>
        <Link href="/dashboard/parent/children" className="mt-4 inline-block font-bold text-blue-600 hover:underline">
          {t('Back to My Children')}
        </Link>
      </div>
    );
  }

  const localizedGender = student.gender ? t(student.gender) : '—';
  const localizedStatus = t('Active Student');

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8 animate-fadeIn">
      <Link href="/dashboard/parent/children" className="inline-flex items-center gap-2 text-sm font-bold text-text-muted hover:text-blue-600">
        <ArrowRight size={16} className={language === 'ar' ? '' : 'rotate-180'} /> {t('Back to My Children')}
      </Link>
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 p-7 text-white md:p-10">
        <div className="relative z-10 flex flex-col items-start gap-5 md:flex-row md:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 text-3xl font-black backdrop-blur">
            {student.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">{t('Student Profile')}</p>
            <h1 className="mt-2 text-3xl font-black">{student.name}</h1>
            <p className="mt-2 text-sm font-semibold text-blue-100/80">
              {student.class} • {student.section} • {language === 'ar' ? `رقم ${student.roll}` : `Roll #${student.roll}`}
            </p>
          </div>
        </div>
        <GraduationCap className="absolute -bottom-10 -end-8 h-56 w-56 text-white/5" />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard
          title={t('Academic Information')}
          items={[
            [t('Class and Section'), `${student.class} — ${student.section}`, BookOpen],
            [t('Student ID'), student.registrationNo, IdCard],
            [t('Roll No'), String(student.roll), GraduationCap],
            [t('Gender'), localizedGender, User],
            [t('Date of Birth'), new Date(student.dob).toLocaleDateString(language === 'ar' ? 'ar-YE' : 'en-US'), Calendar],
          ]}
        />
        <InfoCard
          title={t('Personal Information')}
          items={[
            [t('Blood Group'), student.bloodGroup, Droplets],
            [t('Guardian'), student.guardian, User],
            [t('Contact Phone'), student.contact, Phone],
            [t('Status'), localizedStatus, ShieldCheck],
          ]}
        />
      </div>
      <div className="rounded-3xl border border-border-light bg-bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
            <MapPin size={20} />
          </span>
          <div>
            <p className="text-xs font-black text-text-muted">{t('Current Address')}</p>
            <p className="mt-2 font-bold text-text-primary">{student.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="rounded-3xl border border-border-light bg-bg-card p-6 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 border-b border-border-light pb-4 font-black text-text-primary">
        <CalendarCheck className="text-blue-600" size={19} />
        {title}
      </h2>
      <div className="space-y-2">
        {items.map(([label, value, Icon]) => (
          <div key={label} className="flex items-center justify-between gap-4 rounded-2xl bg-bg-page p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg-card text-text-muted">
                <Icon size={16} />
              </span>
              <span className="text-xs font-bold text-text-muted">{label}</span>
            </div>
            <span className="text-sm font-black text-text-primary">{value || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
