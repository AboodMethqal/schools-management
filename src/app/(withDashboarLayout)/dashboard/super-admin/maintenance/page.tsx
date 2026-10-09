"use client";
import { useLanguage } from "@/context/LanguageProvider";

export default function Maintenance() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold">{isAr ? 'الصيانة والنظام' : 'System Maintenance'}</h1>
    </div>
  );
}
