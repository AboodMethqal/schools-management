"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAnnouncementById } from "@/app/actions/announcement";
import Link from "next/link";
import { Calendar, Users, ArrowLeft, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

export default function NoticeDetails() {
  const params = useParams();
  const id = params?.id as string;
  const { language } = useLanguage();
  const isAr = language === "ar";

  const [notice, setNotice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getAnnouncementById(id).then((res) => {
        if (res.success && res.data) setNotice(res.data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="p-10 text-center text-red-500 dark:text-red-400">
        {isAr ? "الإعلان غير موجود أو تم حذفه." : "Notice not found"}
      </div>
    );
  }

  const categoryColor =
    notice.category?.toLowerCase() === "academic"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      : notice.category?.toLowerCase() === "exam"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      : notice.category?.toLowerCase() === "event"
      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
      : notice.category?.toLowerCase() === "emergency"
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  const priorityColor =
    notice.priority === "urgent"
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      : notice.priority === "high"
      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Link
        href="/dashboard/student/notices"
        className="inline-flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 mb-4"
      >
        <ArrowLeft className="h-4 w-4 me-1" />
        {isAr ? "العودة إلى الإعلانات" : "Back to notices"}
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColor}`}>
            {notice.category || (isAr ? "عام" : "General")}
          </span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${priorityColor}`}>
            {notice.priority}
          </span>
          <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <Users className="h-3 w-3 me-1" />
            {notice.audience}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3">
          {notice.title}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 me-1" />
            {isAr ? "نُشر في: " : "Published: "}
            {new Date(notice.publishDate || notice.createdAt).toLocaleDateString()}
          </span>
          {notice.expiryDate && (
            <span className="flex items-center">
              <Calendar className="h-4 w-4 me-1" />
              {isAr ? "ينتهي في: " : "Expiry: "}
              {new Date(notice.expiryDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
          {notice.content}
        </div>
      </div>
    </div>
  );
}
