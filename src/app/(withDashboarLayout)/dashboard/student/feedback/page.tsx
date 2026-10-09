"use client"

import React, { useEffect, useState } from "react"
import { MessageSquare, Star, User, Calendar, Loader2, Award, Zap, Heart, ArrowLeft } from "lucide-react"
import { getMyFeedback } from "@/app/actions/student/feedback"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageProvider";

export default function FeedbackPage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const [loading, setLoading] = useState(true)
    const [feedback, setFeedback] = useState<any[]>([])

    useEffect(() => {
        async function loadFeedback() {
            const res = await getMyFeedback()
            if (res.success && res.data) {
                setFeedback(res.data)
            }
            setLoading(false)
        }
        loadFeedback()
    }, [])

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-text-muted font-bold animate-pulse">{isAr ? 'جارٍ قراءة ملاحظات المعلمين...' : "Reading teacher's notes..."}</p>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4">
            <Link
                href="/dashboard/student"
                className="inline-flex items-center gap-2 text-text-muted font-black text-[10px] uppercase tracking-[0.2em] hover:text-blue-600 transition-colors group mb-[-20px]"
            >
                <div className="w-8 h-8 rounded-full bg-bg-card border border-border-light flex items-center justify-center group-hover:border-blue-200 shadow-sm transition-all group-active:scale-90">
                    <ArrowLeft size={14} />
                </div>
                {isAr ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}
            </Link>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight flex items-center gap-3">
                        <MessageSquare className="text-blue-600 w-7 h-7 md:w-8 md:h-8" />
                        {isAr ? 'ملاحظات المعلمين' : "Teacher's Feedback"}
                    </h1>
                    <p className="text-text-muted text-sm md:text-base font-medium mt-1">{isAr ? 'رؤى وتقييمات تفصيلية لأدائك الأكاديمي والسلوكي من معلميك.' : 'Valuable insights and performance reviews from your instructors.'}</p>
                </div>
                <div className="px-5 py-3 md:px-6 md:py-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 self-start md:self-auto">
                    <p className="text-[9px] md:text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">{isAr ? 'إجمالي الملاحظات' : 'Total Reviews'}</p>
                    <p className="text-lg md:text-xl font-black text-blue-900 dark:text-blue-100">{feedback.length} {isAr ? "تقييم" : "Entries"}</p>
                </div>
            </div>

            {feedback.length > 0 ? (
                <div className="grid gap-6 md:gap-8">
                    {feedback.map((item) => (
                        <div key={item.id} className="bg-bg-card border border-border-light rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                            {/* Visual background element */}
                            <div className="absolute top-0 end-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700 hidden md:block"></div>

                            <div className="relative z-10 space-y-6 md:space-y-8">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 md:gap-5">
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-colors shrink-0">
                                            <User className="w-6 h-6 md:w-8 md:h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg md:text-xl font-black text-text-primary tracking-tight">{item.teacherName}</h3>
                                            <p className="text-[10px] md:text-xs text-text-muted font-bold flex items-center gap-2 uppercase tracking-widest mt-1">
                                                <Calendar className="text-blue-500 w-2.5 h-2.5 md:w-3 md:h-3" /> {item.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-bg-page px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-border-light group-hover:border-blue-200 transition-colors">
                                        <Star className="text-amber-500 fill-amber-500 w-4 h-4 md:w-4.5 md:h-4.5" />
                                        <span className="text-lg md:text-xl font-black text-text-primary tracking-tighter">{item.averageRating}</span>
                                        <span className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest ms-1">Avg Score</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                                    <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 flex items-center gap-4 group-hover:bg-blue-50 transition-colors">
                                        <div className="p-2 md:p-3 rounded-xl bg-white dark:bg-slate-800 text-blue-600 shadow-sm shrink-0">
                                            <Award className="w-4.5 h-4.5 md:w-5 md:h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Academic</p>
                                            <p className="text-base md:text-lg font-black text-text-primary tracking-tight">{item.academic}/5</p>
                                        </div>
                                    </div>
                                    <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100/50 flex items-center gap-4 group-hover:bg-amber-50 transition-colors">
                                        <div className="p-2 md:p-3 rounded-xl bg-white dark:bg-slate-800 text-amber-600 shadow-sm shrink-0">
                                            <Zap className="w-4.5 h-4.5 md:w-5 md:h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Behavior</p>
                                            <p className="text-base md:text-lg font-black text-text-primary tracking-tight">{item.behavior}/5</p>
                                        </div>
                                    </div>
                                    <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100/50 flex items-center gap-4 group-hover:bg-rose-50 transition-colors">
                                        <div className="p-2 md:p-3 rounded-xl bg-white dark:bg-slate-800 text-rose-600 shadow-sm shrink-0">
                                            <Heart className="w-4.5 h-4.5 md:w-5 md:h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Participation</p>
                                            <p className="text-base md:text-lg font-black text-text-primary tracking-tight">{item.participation}/5</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-bg-page/50 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-border-light relative overflow-hidden">
                                    <div className="absolute top-0 start-0 w-1 h-full bg-blue-600"></div>
                                    <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-medium italic">
                                        "{item.comment || "No specific comments provided."}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-24 bg-bg-card border border-border-light border-dashed rounded-[3rem] flex flex-col items-center justify-center text-center px-10">
                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-8 text-slate-400 rotate-12 group-hover:rotate-0 transition-transform">
                        <MessageSquare size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-text-primary tracking-tight">No feedback records yet</h3>
                    <p className="text-text-muted text-sm font-medium mt-3 max-w-sm leading-relaxed">
                        Teachers will share their insights about your academic performance and participation here soon.
                    </p>
                </div>
            )}
        </div>
    )
}
