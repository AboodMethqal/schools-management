"use client";
import StudentProgressClient from './_components/StudentProgressClient';
import { useLanguage } from "@/context/LanguageProvider";

const ProgressPage = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <main className="min-h-screen py-8 px-4 md:px-8 bg-bg-page">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 rounded-4xl bg-bg-card border border-border-light p-6 md:p-8 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
            {isAr ? "مسار " : "Learning "}<span className="text-primary italic">{isAr ? "التقدم الدراسي" : "Progress"}</span>
          </h1>
          <p className="text-text-secondary mt-2 text-sm">
            {isAr ? "تحليل مفصل لأدائك في الاختبارات على مدار العام الدراسي." : "Detailed analysis of your exam performance over time."}
          </p>
        </header>
        <StudentProgressClient />
      </div>
    </main>
  );
};

export default ProgressPage;
