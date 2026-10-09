"use client"

import React, { useEffect, useState } from "react"
import { Download, Trophy, TrendingUp, FileText, GraduationCap, Loader2, BookOpen } from "lucide-react"
import { getMyResults } from "@/app/actions/student/results"
import { useLanguage } from "@/context/LanguageProvider";

export default function ResultsPage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        async function fetchResults() {
            const res = await getMyResults()
            if (res.success) {
                setData(res.data)
            }
            setLoading(false)
        }
        fetchResults()
    }, [])

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-text-muted font-bold animate-pulse">{isAr ? 'جارٍ احتساب المعدل التراكمي...' : 'Calculating your GPA...'}</p>
            </div>
        )
    }

    const exams = data?.exams || []
    const cgpa = data?.cgpa || "0.00"
    const cgpaVal = parseFloat(cgpa)

    const getAcademicStanding = (val: number) => {
        if (val >= 3.8) return {
            label: "Elite Standing",
            welcome: "Exceptional Performance!",
            desc: "You are consistent and brilliant. Keep leading the way!",
            color: "from-indigo-700 via-indigo-800 to-purple-900",
            status: "Exceptional"
        }
        if (val >= 3.5) return {
            label: "High Honors",
            welcome: "Outstanding Work!",
            desc: "Your academic record is very strong. Keep up this momentum!",
            color: "from-blue-700 via-blue-800 to-indigo-900",
            status: "Outstanding"
        }
        if (val >= 3.0) return {
            label: "Good Standing",
            welcome: "Great Progress!",
            desc: "You are performing well. Aim for even higher in the next exam!",
            color: "from-emerald-700 via-emerald-800 to-teal-900",
            status: "Solid"
        }
        if (val >= 2.0) return {
            label: "Fair Standing",
            welcome: "Keep Pushing!",
            desc: "You have a solid base. Focused study can boost your grades.",
            color: "from-amber-600 via-amber-700 to-orange-800",
            status: "Improving"
        }
        return {
            label: "Academic Warning",
            welcome: "Stay Focused!",
            desc: "Don't discourage yourself. Let's work together to improve your scores.",
            color: "from-rose-700 via-rose-800 to-red-900",
            status: "Attention Needed"
        }
    }

    const standing = getAcademicStanding(cgpaVal)

    return (
        <div className="space-y-8 pb-20">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
                Results & Grades
            </h1>

            {/* GPA Trend / Highlight */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className={`md:col-span-2 relative bg-gradient-to-br ${standing.color} text-white rounded-3xl overflow-hidden p-8 shadow-xl transition-all duration-500`}>
                    <div className="absolute end-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-widest mb-4">{standing.label}</span>
                            <h2 className="text-3xl font-black mb-3 tracking-tight">{standing.welcome} {data?.studentName?.split(' ')[0]}! 👋</h2>
                            <p className="text-blue-100 max-w-sm font-medium leading-relaxed opacity-90">
                                {standing.desc} You've maintained a consistent <span className="font-black text-white">{cgpa} CGPA</span>.
                            </p>
                            <div className="flex gap-3 mt-8">
                                <button className="bg-white text-blue-900 hover:bg-blue-50 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-950/20">
                                    <Trophy className="h-4 w-4" /> View Analytics
                                </button>
                            </div>
                        </div>
                        <div className="relative h-40 w-40 flex items-center justify-center group">
                            <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
                            <svg className="h-full w-full -rotate-90 transform drop-shadow-2xl" viewBox="0 0 36 36">
                                <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className="text-white" strokeDasharray={`${(cgpaVal / 4) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black tracking-tighter">{cgpa}</span>
                                <span className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mt-1">CGPA</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-card rounded-3xl border border-border-light p-8 shadow-sm flex flex-col justify-center space-y-8 self-stretch">
                    <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Overall Progress</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
                            <span className="text-text-muted">Academic Points</span>
                            <span className="text-text-primary">{(cgpaVal * 25).toFixed(0)}%</span>
                        </div>
                        <div className="h-3 w-full bg-bg-page rounded-full overflow-hidden border border-border-light p-0.5">
                            <div className={`h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000`} style={{ width: `${(cgpaVal / 4) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="pt-4 flex items-center gap-3 text-xs font-bold text-text-muted border-t border-border-light/50">
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                             <TrendingUp className="h-4 w-4" />
                        </div>
                        <span>Academic standing is <span className="text-emerald-600 dark:text-emerald-400 font-black">{standing.status}</span></span>
                    </div>
                </div>
            </div>

            {/* Exam List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                             <GraduationCap className="h-6 w-6" />
                        </div>
                        Exam History
                    </h3>
                </div>

                {exams.length > 0 ? (
                    exams.map((exam: any) => (
                        <div key={exam.examName} className="bg-bg-card border border-border-light rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                            <div className="bg-bg-page/50 px-8 py-5 border-b border-border-light flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-xl font-black text-text-primary tracking-tight group-hover:text-blue-600 transition-colors">{exam.examName}</h4>
                                    <p className="text-xs text-text-muted font-bold flex items-center gap-2 uppercase tracking-widest">
                                        <BookOpen size={12} className="text-blue-500" /> Published: {new Date(exam.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`
                                    px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                                    ${exam.status === "Passed" ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"}
                                `}>
                                    {exam.status}
                                </span>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                                    <div className="p-5 rounded-2xl bg-bg-page/50 border border-border-light group-hover:border-blue-200 transition-colors">
                                        <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black mb-1">Grade Point</p>
                                        <p className="text-3xl font-black text-text-primary tracking-tight">{exam.gpa}</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-bg-page/50 border border-border-light group-hover:border-blue-200 transition-colors">
                                        <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black mb-1">Total Marks</p>
                                        <p className="text-3xl font-black text-text-primary tracking-tight">{exam.totalMarks}</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-bg-page/50 border border-border-light group-hover:border-blue-200 transition-colors">
                                        <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black mb-1">Letter Grade</p>
                                        <p className="text-3xl font-black text-text-primary tracking-tight">{exam.grade}</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 transition-colors">
                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] font-black mb-1">Status</p>
                                        <p className="text-3xl font-black text-blue-700 dark:text-blue-300 tracking-tight italic uppercase">{exam.status}</p>
                                    </div>
                                </div>

                                {exam.subjects && (
                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ps-1">Subject Breakdown</h5>
                                        <div className="overflow-x-auto border border-border-light rounded-2xl">
                                            <table className="w-full text-sm text-start text-text-secondary">
                                                <thead className="text-[10px] text-text-muted uppercase font-black bg-bg-page/50 tracking-wider">
                                                    <tr>
                                                        <th className="px-6 py-4">{isAr ? "المادة" : "Subject"}</th>
                                                        <th className="px-6 py-4">Score</th>
                                                        <th className="px-6 py-4 text-center">Grade</th>
                                                        <th className="px-6 py-4">Instructor</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border-light">
                                                    {exam.subjects.map((subject: any, idx: number) => (
                                                        <tr key={idx} className="bg-bg-card hover:bg-bg-page/30 transition-colors">
                                                            <td className="px-6 py-4 font-bold text-text-primary">{subject.name}</td>
                                                            <td className="px-6 py-4 font-bold">{subject.marks}</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className={`px-2 py-0.5 rounded font-black text-xs ${subject.grade.startsWith('A') ? 'text-emerald-600' :
                                                                    subject.grade.startsWith('B') ? 'text-blue-600' :
                                                                        'text-text-muted'
                                                                    }`}>{subject.grade}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-xs font-medium text-text-muted">{subject.teacherName}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-8 flex justify-end">
                                            <button className="flex items-center gap-2 bg-slate-900 text-white hover:bg-blue-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/10">
                                                <Download className="h-4 w-4" /> {isAr ? 'تحميل كشف الدرجات' : 'Download Transcript'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 bg-bg-card border border-border-light border-dashed rounded-3xl flex flex-col items-center justify-center text-center px-10">
                         <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 text-slate-400">
                             <FileText size={40} />
                         </div>
                         <h3 className="text-xl font-black text-text-primary tracking-tight">No exam results available</h3>
                         <p className="text-text-muted text-sm font-medium mt-2 max-w-xs leading-relaxed">Your results will appear here once the school publishes your term exams and marksheets.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
