"use client";

import React from 'react';
import Link from 'next/link';
import { MailCheck, LogIn, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageProvider';

export default function VerifyEmailPage() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page px-6 py-24 relative overflow-hidden text-text-primary">
      <div className="max-w-md w-full bg-bg-card/90 backdrop-blur-2xl border border-border-light rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6">
          <MailCheck size={32} />
        </div>

        <h1 className="text-2xl md:text-3xl font-black mb-3">
          {isAr ? 'تحقق من بريدك الإلكتروني' : 'Verify Your Email'}
        </h1>

        <p className="text-text-muted text-sm md:text-base font-medium leading-relaxed mb-8">
          {isAr
            ? 'لقد أرسلنا رسالة تأكيد إلى بريدك الإلكتروني. يرجى النقر على الرابط الموجود في الرسالة لتفعيل حسابك.'
            : 'We have sent a verification link to your email address. Please click the link inside to activate your account.'}
        </p>

        <Link
          href="/login"
          className="w-full h-14 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-wider hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          <LogIn size={16} />
          <span>{isAr ? 'العودة لتسجيل الدخول' : 'Go to Login'}</span>
          <ArrowRight size={16} className={isAr ? 'rotate-180' : ''} />
        </Link>
      </div>
    </div>
  );
}
