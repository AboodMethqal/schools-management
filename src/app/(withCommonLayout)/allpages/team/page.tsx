'use client';

import React from 'react';
import { Code2, Database, Palette, ShieldCheck, Cloud, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageProvider';

const teamEn = [
  { title: 'Platform Development', description: 'Building and developing the Methqal Tech platform and UX for all school roles.', icon: Code2 },
  { title: 'User Experience', description: 'Modern, responsive interface design for principals, teachers, students, and parents.', icon: Palette },
  { title: 'Data & Security', description: 'Database management, role-based access control, tenant isolation, and data protection.', icon: Database },
  { title: 'Cloud Infrastructure', description: 'Preparing platform for cloud deployment, high performance, backups, and monitoring.', icon: Cloud },
  { title: 'Security & Permissions', description: 'Role-based access enforcement ensuring users access only their authorized data.', icon: ShieldCheck },
  { title: 'Educational Solutions', description: 'Translating school requirements into practical tools for monitoring, assessment, and communication.', icon: GraduationCap },
];

const teamAr = [
  { title: 'تطوير المنصة', description: 'بناء وتطوير منصة مثقال تك وتجربة المستخدم لجميع أدوار المدرسة.', icon: Code2 },
  { title: 'تجربة المستخدم', description: 'تصميم واجهات عربية حديثة ومتجاوبة للمدير والمعلم والطالب وولي الأمر.', icon: Palette },
  { title: 'البيانات والأمان', description: 'إدارة قاعدة البيانات والصلاحيات والعزل بين المدارس وحماية البيانات.', icon: Database },
  { title: 'البنية السحابية', description: 'تهيئة المنصة للنشر السحابي والأداء والنسخ الاحتياطي والمراقبة.', icon: Cloud },
  { title: 'الأمان والصلاحيات', description: 'تطبيق الصلاحيات حسب الدور وضمان وصول كل مستخدم إلى بياناته فقط.', icon: ShieldCheck },
  { title: 'الحلول التعليمية', description: 'تحويل احتياجات المدرسة إلى أدوات عملية للمتابعة والتقييم والتواصل.', icon: GraduationCap },
];

export default function TeamPage() {
  const { language } = useLanguage();
  const team = language === 'ar' ? teamAr : teamEn;

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-6 py-20">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">Methqal Tech</p>
        <h1 className="mt-4 text-4xl font-black text-text-primary md:text-5xl">
          {language === 'ar' ? 'فريق ومنهجية مثقال تك' : 'Methqal Tech Team & Methodology'}
        </h1>
        <p className="mt-5 text-lg leading-8 text-text-muted">
          {language === 'ar'
            ? 'نطوّر حلولًا رقمية تجعل إدارة المدرسة ومتابعة الطالب والتواصل مع الأسرة في منصة واحدة.'
            : 'We build digital solutions that unite school administration, student monitoring, and family communication in one platform.'}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {team.map(({ title, description, icon: Icon }) => (
          <article key={title} className="rounded-3xl border border-border-light bg-bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon size={25} /></div>
            <h2 className="mt-6 text-xl font-black text-text-primary">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-text-muted">{description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
