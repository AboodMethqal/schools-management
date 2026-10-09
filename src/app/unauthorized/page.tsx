"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, ArrowRight, Home, LogIn } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

export default function UnauthorizedPage() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page px-6 py-20 relative overflow-hidden text-text-primary">
      {/* Background accents */}
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-md w-full bg-bg-card/90 backdrop-blur-2xl border border-border-light rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-center">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShieldAlert size={40} />
        </div>

        <span className="inline-block px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-widest mb-4">
          403 — {isAr ? "وصول غير مصرح به" : "Access Denied"}
        </span>

        <h1 className="text-2xl md:text-3xl font-black mb-3 text-text-primary">
          {isAr ? "ليس لديك صلاحية الوصول" : "Unauthorized Access"}
        </h1>

        <p className="text-text-muted font-medium text-sm md:text-base leading-relaxed mb-8">
          {isAr
            ? "عذرًا، حسابك الحالي لا يمتلك الصلاحيات الكافية للوصول إلى هذه الصفحة. يرجى تسجيل الدخول بالحساب المناسب أو العودة للرئيسية."
            : "Sorry, your current account does not have sufficient permissions to view this page. Please log in with the correct role or return home."}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            <LogIn size={16} />
            <span>{isAr ? "تسجيل دخول بحساب آخر" : "Login Different Account"}</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-bg-page border border-border-light text-text-secondary hover:text-text-primary font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Home size={16} />
            <span>{isAr ? "الصفحة الرئيسية" : "Back to Home"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
