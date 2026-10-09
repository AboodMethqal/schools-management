"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Users,
    ClipboardCheck,
    BarChart3,
    FileText,
    ArrowLeft,
    Search,
    Info,
    Award,
    TrendingUp,
    ChevronRight
} from 'lucide-react';
import { TeacherHeader } from "../../TeacherHeader";
import { useLanguage } from "@/context/LanguageProvider";
import StudentProfile from "../StudentProfile";
import { getClassStudents } from '@/app/actions/teacher/classes';
import { Loader2 } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    roll: string;
    attendance: string;
    performance: string;
    grade: string;
}

export default function ClassDetailPage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const params = useParams();
    const router = useRouter();
    const classId = params.classId as string;

    const [activeTab, setActiveTab] = useState<'students' | 'attendance' | 'results' | 'assignments'>('students');
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const res = await getClassStudents(classId);
            if (res.success) {
                setData(res.data);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [classId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    const classInfo = {
        name: data?.name || "Unknown Class",
        subject: data?.subjects?.[0]?.name || "General"
    };

    const studentList = data?.students?.map((s: any) => ({
        id: s.id,
        name: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
        roll: s.rollNo?.toString() || "N/A",
        attendance: s.attendance?.length > 0
            ? `${Math.round((s.attendance.filter((a: any) => a.status === 'PRESENT').length / s.attendance.length) * 100)}%`
            : "0%",
        performance: "Good",
        grade: s.results?.[0]?.marks ? (s.results[0].marks >= 80 ? "A+" : s.results[0].marks >= 70 ? "A" : s.results[0].marks >= 60 ? "A-" : "B") : "N/A"
    })) || [];

    const filteredStudents = studentList.filter((s: any) => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.roll.includes(searchQuery)
    );

    if (selectedStudent) {
        return <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
    }

    const tabs = [
        { id: 'students', label: 'Student List', icon: Users },
        { id: 'attendance', label: 'Attendance Summary', icon: ClipboardCheck },
        { id: 'results', label: 'Result Overview', icon: BarChart3 },
        { id: 'assignments', label: 'Assignments', icon: FileText },
    ];

    // Stats calculations
    const totalStudents = data?.students?.length || 0;
    const avgAttendance = totalStudents > 0 
        ? Math.round(studentList.reduce((acc: number, s: any) => acc + parseInt(s.attendance), 0) / totalStudents)
        : 0;
    
    const highMarks = data?.students?.reduce((max: number, s: any) => {
        const studentMax = s.results?.reduce((m: number, r: any) => Math.max(m, r.marks), 0) || 0;
        return Math.max(max, studentMax);
    }, 0);

    const aPlusCount = data?.students?.filter((s: any) => s.results?.some((r: any) => r.marks >= 80)).length || 0;

    const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

    return (
        <div className="space-y-8 animate-fadeIn">
            <TeacherHeader
                title="Class"
                highlight="Details"
                emoji="📊"
                subtitle={`${classInfo.name} • ${classInfo.subject}`}
                rightElement={
                    <button
                        onClick={() => router.push('/dashboard/teacher/my-classes')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border-light rounded-2xl text-sm font-bold text-text-secondary hover:bg-bg-page transition-all active:scale-95 shadow-sm"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                }
            />

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-bg-card border border-border-light rounded-2xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === tab.id
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-text-muted hover:bg-bg-page hover:text-text-primary"
                        )}
                    >
                        <tab.icon size={16} />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {activeTab === 'students' && (
                <div className="bg-bg-card rounded-3xl border border-border-light shadow-sm overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-border-light flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-text-primary">Student Directory</h2>
                            <p className="text-xs font-medium text-text-muted mt-1 uppercase tracking-wider">Total {totalStudents} Students Enrolled</p>
                        </div>
                        <div className="relative">
                            <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name or roll..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="ps-10 pe-4 py-2.5 bg-bg-page border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-start">
                            <thead>
                                <tr className="border-b border-border-light text-[10px] font-black uppercase tracking-widest text-text-muted">
                                    <th className="py-5 px-8">{isAr ? "رقم الجلوس" : "Roll"}</th>
                                    <th className="py-5 px-4 font-black">Name</th>
                                    <th className="py-5 px-4">Attendance %</th>
                                    <th className="py-5 px-4">{isAr ? "المستوى" : "Performance"}</th>
                                    <th className="py-5 px-8 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light/50">
                                {filteredStudents.map((student: any) => (
                                    <tr key={student.id} className="group hover:bg-bg-page/40 transition-all duration-200">
                                        <td className="py-6 px-8">
                                            <span className="text-sm font-black text-text-muted tabular-nums">{student.roll}</span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xs">
                                                    {student.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <span className="font-bold text-text-primary group-hover:text-primary transition-colors">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-20 h-1.5 bg-bg-page rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: student.attendance }}></div>
                                                </div>
                                                <span className="text-xs font-black text-text-secondary tabular-nums">{student.attendance}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp size={14} className="text-primary" />
                                                <span className="text-xs font-black uppercase tracking-tighter text-text-muted">
                                                    <span className="text-primary italic me-1">{student.grade}</span>
                                                    {student.performance}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8 text-end">
                                            <button
                                                onClick={() => setSelectedStudent(student)}
                                                className="w-10 h-10 bg-bg-page border border-border-light rounded-xl flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/30 transition-all shadow-sm group-hover:scale-105 active:scale-95"
                                            >
                                                <Info size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredStudents.length === 0 && (
                            <div className="p-12 text-center text-text-muted font-bold">No students found.</div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'attendance' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-bg-card rounded-3xl border border-border-light shadow-sm p-8">
                        <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                            <ClipboardCheck size={20} className="text-emerald-500" /> Attendance Trends
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: "Total Students", value: totalStudents, color: "text-text-primary" },
                                { label: "Average Attendance", value: `${avgAttendance}%`, color: "text-primary" },
                                { label: "Class Section", value: classInfo.name.split(' - ')[1] || "A", color: "text-amber-500" }
                            ].map((stat, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-bg-page rounded-2xl border border-border-light/50">
                                    <span className="text-sm font-bold text-text-secondary">{stat.label}</span>
                                    <span className={cn("text-lg font-black", stat.color)}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20">
                        <TrendingUp className="mb-4 opacity-50" size={32} />
                        <h3 className="text-xl font-bold mb-2">Class Stability</h3>
                        <p className="text-emerald-50/80 text-sm leading-relaxed mb-6 font-medium">
                            Attendance trends are calculated based on all historical records for the current students.
                        </p>
                    </div>
                </div>
            )}

            {activeTab === 'results' && (
                <div className="bg-bg-card rounded-3xl border border-border-light shadow-sm p-8">
                    <h3 className="text-lg font-bold text-text-primary mb-8 flex items-center gap-2">
                        <BarChart3 size={20} className="text-purple-500" /> Recent Assessment Overview
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Highest Marks", value: `${highMarks}/100`, sub: "Across all subjects" },
                            { label: "Class Average", value: "TBD", sub: "Performance Index" },
                            { label: "A+ Count", value: aPlusCount, sub: "Top Performers" },
                            { label: "Enrolled", value: totalStudents, sub: "Calculated students" }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-bg-page/50 p-6 rounded-3xl border border-border-light/60 text-center">
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">{item.label}</p>
                                <p className="text-2xl font-black text-primary mb-1">{item.value}</p>
                                <p className="text-[10px] font-bold text-text-muted italic">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'assignments' && (
                <div className="grid gap-6">
                    {[
                        { title: "Calculus Homework", dueDate: "Today", status: "Evaluation Pending", submission: "42/45" },
                        { title: "Trigonometry Project", dueDate: "Oct 30, 2026", status: "Ongoing", submission: "18/45" },
                        { title: "Weekly Quiz - Algebra", dueDate: "Oct 22, 2026", status: "Closed", submission: "45/45" }
                    ].map((asm, idx) => (
                        <div key={idx} className="group bg-bg-card p-6 rounded-3xl border border-border-light shadow-sm hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-primary">{asm.title}</h4>
                                    <p className="text-xs text-text-muted font-medium mt-0.5">Due: {asm.dueDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-end">
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Submissions</p>
                                    <p className="font-bold text-text-primary">{asm.submission}</p>
                                </div>
                                <div className={cn(
                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    asm.status === 'Ongoing' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                                        asm.status === 'Closed' ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" :
                                            "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                )}>
                                    {asm.status}
                                </div>
                                <button className="w-10 h-10 bg-bg-page border border-border-light rounded-xl flex items-center justify-center text-text-muted hover:text-primary transition-all">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
