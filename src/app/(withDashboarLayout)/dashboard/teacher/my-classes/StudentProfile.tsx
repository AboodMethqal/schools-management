"use client";
import React from 'react';
import {
    User,
    Calendar,
    Award,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Clock,
    TrendingUp,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { getStudentDetail } from '@/app/actions/teacher/classes';
import { useLanguage } from "@/context/LanguageProvider";

interface StudentProfileProps {
    student: {
        id: string;
        name: string;
        roll: string;
        attendance: string;
        performance: string;
        grade: string;
    };
    onBack: () => void;
}

export default function StudentProfile({ student, onBack }: StudentProfileProps) {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const [fullData, setFullData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            const res = await getStudentDetail(student.id);
            if (res.success) {
                setFullData(res.data);
            }
            setIsLoading(false);
        };
        fetchDetails();
    }, [student.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    const attendanceHistory: { date: string; status: string }[] = fullData?.attendance?.map((a: any) => ({
        date: new Date(a.date).toLocaleDateString(),
        status: a.status.toLowerCase()
    })) || [];

    const groupedResults = fullData?.results?.reduce((acc: any, r: any) => {
        const type = r.examType || r.exam?.name || "Academic Assessment";
        if (!acc[type]) acc[type] = [];
        
        const marksValue = Number(r.marks) || 0;
        acc[type].push({
            subject: r.subject || r.subjectRef?.name || "General",
            marks: `${marksValue}/100`,
            grade: marksValue >= 80 ? "A+" : marksValue >= 70 ? "A" : marksValue >= 60 ? "A-" : marksValue >= 50 ? "B" : marksValue >= 40 ? "C" : marksValue >= 33 ? "D" : "F"
        });
        return acc;
    }, {}) || {};

    const feedbacks: { date: string; note: string; teacher: string }[] = fullData?.feedbacks?.map((f: any) => ({
        date: new Date(f.createdAt).toLocaleDateString(),
        note: f.comment,
        teacher: "Teacher" // We could fetch teacher name if info available
    })) || [];

    return (
        <div className="space-y-6 animate-fadeIn">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm font-bold text-primary hover:underline group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                {isAr ? 'العودة إلى قائمة الطلاب' : 'Back to Student List'}
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Header Card */}
                <div className="lg:col-span-3 bg-bg-card rounded-3xl border border-border-light shadow-sm p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 end-0 w-64 h-64 bg-primary/5 rounded-full -me-32 -mt-32 blur-3xl"></div>

                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary to-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl rotate-3">
                            {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="absolute -bottom-2 -end-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-bg-card flex items-center justify-center text-white">
                            <CheckCircle2 size={12} fill="currentColor" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-start">
                        <h2 className="text-3xl font-black text-text-primary mb-2 line-clamp-1">{student.name}</h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg border border-primary/20">Roll: {student.roll}</span>
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-text-secondary rounded-lg border border-border-light">ID: {student.id}</span>
                            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                                <CheckCircle2 size={14} /> Active Student
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-center px-6 py-4 bg-bg-page rounded-2xl border border-border-light">
                            <p className="text-[10px] uppercase tracking-widest font-black text-text-muted mb-1">Attendance</p>
                            <p className="text-xl font-black text-emerald-500">{student.attendance}</p>
                        </div>
                        <div className="text-center px-6 py-4 bg-bg-page rounded-2xl border border-border-light">
                            <p className="text-[10px] uppercase tracking-widest font-black text-text-muted mb-1">Performance</p>
                            <p className="text-xl font-black text-primary">{student.grade}</p>
                        </div>
                    </div>
                </div>

                {/* Left Column: History & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Attendance History */}
                    <div className="bg-bg-card rounded-3xl border border-border-light shadow-sm p-6">
                        <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                            <Calendar size={20} className="text-primary" /> Attendance History
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {attendanceHistory.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-bg-page rounded-xl border border-border-light/50">
                                    <span className="text-sm font-bold text-text-secondary">{item.date}</span>
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${item.status === 'present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                                        item.status === 'late' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                                            'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 text-xs font-bold text-text-muted hover:text-primary transition-colors border-t border-border-light">View Full History</button>
                    </div>

                    {/* Result History */}
                    <div className="bg-bg-card rounded-3xl border border-border-light shadow-sm p-6">
                        <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                            <Award size={20} className="text-primary" /> Recent Results
                        </h3>
                        <div className="space-y-4">
                            {Object.keys(groupedResults).length > 0 ? (
                                Object.entries(groupedResults).map(([examType, results]: [string, any]) => (
                                    <div key={examType} className="overflow-hidden rounded-2xl border border-border-light">
                                        <div className="bg-bg-page px-4 py-2 border-b border-border-light">
                                            <span className="text-[10px] font-black uppercase text-primary tracking-widest">{examType}</span>
                                        </div>
                                        <table className="w-full text-start">
                                            <thead>
                                                <tr className="bg-white dark:bg-slate-900/50">
                                                    <th className="py-2.5 px-4 text-[9px] font-black uppercase text-text-muted">Subject</th>
                                                    <th className="py-2.5 px-4 text-[9px] font-black uppercase text-text-muted">Marks</th>
                                                    <th className="py-2.5 px-4 text-[9px] font-black uppercase text-text-muted text-end">Grade</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border-light/30">
                                                {results.map((res: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-primary/[0.02] transition-colors">
                                                        <td className="py-3 px-4 text-xs font-bold text-text-secondary">{res.subject}</td>
                                                        <td className="py-3 px-4 text-xs font-bold text-text-primary">{res.marks}</td>
                                                        <td className="py-3 px-4 text-end">
                                                            <span className={`text-xs font-black italic ${res.grade === 'F' ? 'text-red-500' : 'text-primary'}`}>{res.grade}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center bg-bg-page/50 rounded-2xl border border-dashed border-border-light">
                                    <p className="text-xs font-bold text-text-muted italic">No results found for this student.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Feedback & Profile Info */}
                <div className="space-y-6">
                    {/* Performance Note */}
                    <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-primary/20">
                        <TrendingUp className="mb-4 opacity-50" size={32} />
                        <h3 className="text-lg font-bold mb-2">Performance Trend</h3>
                        <p className="text-primary-100/80 text-sm leading-relaxed mb-6 font-medium">
                            Student is showing consistent improvement in Mathematics. Recommended for Advanced Algebra group.
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <span className="text-xs font-bold">85%</span>
                        </div>
                    </div>

                    {/* Feedback History */}
                    <div className="bg-bg-card rounded-3xl border border-border-light shadow-sm p-6">
                        <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                            <MessageSquare size={18} className="text-primary" /> Teacher Feedback
                        </h3>
                        <div className="space-y-6">
                            {feedbacks.map((fb, idx) => (
                                <div key={idx} className="relative ps-6 border-s-2 border-primary/20">
                                    <div className="absolute -start-[5px] top-0 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(79,70,229,0.8)]"></div>
                                    <p className="text-sm font-bold text-text-primary leading-snug mb-2">{fb.note}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-text-muted italic">{fb.teacher}</span>
                                        <span className="text-[10px] font-bold text-primary">{fb.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest text-center italic">Personal information is read-only.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
