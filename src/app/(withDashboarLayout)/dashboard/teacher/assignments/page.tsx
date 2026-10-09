"use client";
import React, { useState } from 'react';
import {
    Plus,
    Calendar,
 
    Clock,
    Search,
    
    MoreVertical,
  
    Download,
    Eye,
    ChevronRight,
    ClipboardList,
    X,
    Upload,
    ArrowLeft
} from 'lucide-react';
import { TeacherHeader } from "../TeacherHeader";
import { useLanguage } from "@/context/LanguageProvider";

export default function AssignmentPage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeTab, setActiveTab] = useState("active");
    const [reviewMode, setReviewMode] = useState<number | null>(null);

    const assignments = [
        {
            id: 1,
            title: "Trigonometry Equation Solving",
            subject: "Higher Math",
            dueDate: "Feb 28, 2026",
            dueTime: "11:59 PM",
            totalStudents: 45,
            submitted: 32,
            points: 100,
            status: "active"
        },
        {
            id: 2,
            title: "Photosynthesis Experiment Report",
            subject: "Biology",
            dueDate: "Mar 02, 2026",
            dueTime: "04:00 PM",
            totalStudents: 42,
            submitted: 15,
            points: 50,
            status: "active"
        },
        {
            id: 3,
            title: "Arabic Poetry Analysis",
            subject: "Arabic",
            dueDate: "Feb 20, 2026",
            dueTime: "11:59 PM",
            totalStudents: 48,
            submitted: 46,
            points: 20,
            status: "closed"
        }
    ];

    const filteredAssignments = assignments.filter(a => activeTab === "all" || a.status === activeTab);
    const reviewingAssignment = assignments.find(a => a.id === reviewMode);

    const mockSubmissions = [
        { id: "S101", name: "Rahim Ahmed", roll: "101", date: "Feb 24, 2026", time: "10:15 AM", status: "submitted", grade: "", feedback: "" },
        { id: "S102", name: "Fatima Noor", roll: "102", date: "Feb 24, 2026", time: "11:30 AM", status: "submitted", grade: "85", feedback: "Well done!" },
        { id: "S103", name: "Arif Hossein", roll: "103", date: "Feb 25, 2026", time: "09:00 AM", status: "pending", grade: "", feedback: "" },
        { id: "S104", name: "سارة محمد", roll: "104", date: "Feb 25, 2026", time: "01:20 PM", status: "submitted", grade: "", feedback: "" },
    ];

    return (
        <div className="space-y-8 animate-fadeIn">
            <TeacherHeader
                title={reviewMode ? (isAr ? "مراجعة" : "Review") : (isAr ? "إدارة" : "Task")}
                highlight={reviewMode ? (isAr ? "التسليمات" : "Submissions") : (isAr ? "الواجبات" : "Manager")}
                emoji={reviewMode ? "✅" : "📝"}
                subtitle={reviewMode ? `${reviewingAssignment?.title} - ${reviewingAssignment?.subject}` : (isAr ? "إنشاء ومتابعة وتصحيح واجبات الطلاب الأكاديمية." : "Create, track, and grade student assignments.")}
                rightElement={
                    !reviewMode && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
                        >
                            <Plus size={18} /> {isAr ? "واجب جديد" : "New Assignment"}
                        </button>
                    )
                }
            />

            {reviewMode ? (
                <div className="space-y-6">
                    <button
                        onClick={() => setReviewMode(null)}
                        className="flex items-center gap-2 text-sm font-black text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-all uppercase tracking-widest"
                    >
                        <ArrowLeft size={18} /> Back to Tasks
                    </button>

                    <div className="bg-bg-card rounded-[2.5rem] border border-border-light shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-border-light flex flex-col md:flex-row md:items-center justify-between gap-6 bg-bg-page/20">
                            <div>
                                <h3 className="text-2xl font-black text-text-primary uppercase tracking-wider">Submission Review</h3>
                                <p className="text-xs font-bold text-text-muted mt-1 italic">Assign grades and provide feedback for students.</p>
                            </div>
                            <div className="relative group">
                                <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Filter submissions..."
                                    className="ps-12 pe-6 py-3 bg-white dark:bg-slate-900 border border-border-light rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 w-full md:w-80 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {/* Desktop Table View */}
                            <table className="w-full text-start hidden md:table">
                                <thead>
                                    <tr className="border-b border-border-light bg-bg-page/50">
                                        <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">{isAr ? "الطالب" : "Student"}</th>
                                        <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">{isAr ? "تاريخ التسليم" : "Submission Date"}</th>
                                        <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Grade ({reviewingAssignment?.points})</th>
                                        <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">{isAr ? "الملاحظات والتقييم" : "Feedback & Remarks"}</th>
                                        <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-end">{isAr ? "الإجراءات" : "Actions"}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light/50">
                                    {mockSubmissions.map((sub) => (
                                        <tr key={sub.id} className="group hover:bg-bg-page/30 transition-all">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                        {sub.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-text-primary group-hover:text-primary transition-colors">{sub.name}</p>
                                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Roll: {sub.roll}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8 text-xs font-bold text-text-secondary tabular-nums">
                                                {sub.status === 'submitted' ? (
                                                    <div>
                                                        <p>{sub.date}</p>
                                                        <p className="opacity-50 text-[10px]">{sub.time}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-red-500 italic">{isAr ? "لم يتم التسليم" : "Not Submitted"}</span>
                                                )}
                                            </td>
                                            <td className="py-6 px-8">
                                                <div className="flex justify-center">
                                                    <input
                                                        type="number"
                                                        defaultValue={sub.grade}
                                                        placeholder={isAr ? "الدرجة" : "Marks"}
                                                        disabled={sub.status !== 'submitted'}
                                                        className="w-20 px-3 py-3 bg-white dark:bg-slate-900 border-2 border-border-light rounded-2xl text-sm font-black text-center focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none disabled:opacity-30 transition-all"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <input
                                                    type="text"
                                                    defaultValue={sub.feedback}
                                                    placeholder={isAr ? "أضف ملاحظاتك..." : "Add feedback..."}
                                                    disabled={sub.status !== 'submitted'}
                                                    className="w-full min-w-[200px] px-4 py-3 bg-white dark:bg-slate-900 border-2 border-border-light rounded-2xl text-xs font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none disabled:opacity-30 transition-all"
                                                />
                                            </td>
                                            <td className="py-6 px-8 text-end">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2.5 bg-bg-page border border-border-light rounded-xl text-text-muted hover:text-primary hover:border-primary/30 transition-all active:scale-95" title="View Submission File">
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="p-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95">
                                                        Save
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Mobile Card View */}
                            <div className="md:hidden divide-y divide-border-light/50">
                                {mockSubmissions.map((sub) => (
                                    <div key={sub.id} className="p-6 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-bold text-sm uppercase">
                                                    {sub.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-text-primary">{sub.name}</p>
                                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Roll: {sub.roll}</p>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                {sub.status === 'submitted' ? (
                                                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">{isAr ? "تم الاستلام" : "Received"}</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-red-500/10 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-500/20">{isAr ? "مفقود" : "Missing"}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Grade ({reviewingAssignment?.points})</label>
                                                <input
                                                    type="number"
                                                    defaultValue={sub.grade}
                                                    placeholder={isAr ? "الدرجة" : "Marks"}
                                                    disabled={sub.status !== 'submitted'}
                                                    className="w-full px-4 py-3.5 bg-bg-page border-2 border-border-light rounded-2xl text-base font-black text-center focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none disabled:opacity-30"
                                                />
                                            </div>
                                            <div className="space-y-2 text-end">
                                                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Submitted On</label>
                                                <p className="text-xs font-bold text-text-secondary tabular-nums mt-3">{sub.status === 'submitted' ? sub.date : '-'}</p>
                                                <p className="text-[10px] font-bold text-text-muted uppercase mt-0.5">{sub.status === 'submitted' ? sub.time : ''}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Feedback</label>
                                            <textarea
                                                defaultValue={sub.feedback}
                                                placeholder="Add your remarks here..."
                                                disabled={sub.status !== 'submitted'}
                                                rows={2}
                                                className="w-full px-4 py-4 bg-bg-page border-2 border-border-light rounded-2xl text-xs font-bold focus:border-primary outline-none disabled:opacity-30 resize-none"
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <button className="flex-1 py-3.5 bg-bg-page border border-border-light rounded-2xl text-text-muted font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                                <Eye size={16} /> View File
                                            </button>
                                            <button className="flex-1 py-3.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">
                                                Save Grade
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Content Card */
                <div className="bg-bg-card rounded-[2.5rem] border border-border-light shadow-sm p-4 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-2 p-1.5 bg-bg-page rounded-2xl border border-border-light overflow-x-auto scrollbar-hide">
                            <button
                                onClick={() => setActiveTab("active")}
                                className={`px-5 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "active" ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-border-light/50" : "text-text-muted hover:text-text-secondary"
                                    }`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setActiveTab("closed")}
                                className={`px-5 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "closed" ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-border-light/50" : "text-text-muted hover:text-text-secondary"
                                    }`}
                            >
                                Closed
                            </button>
                            <button
                                onClick={() => setActiveTab("all")}
                                className={`px-5 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "all" ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-border-light/50" : "text-text-muted hover:text-text-secondary"
                                    }`}
                            >
                                History
                            </button>
                        </div>

                        <div className="relative w-full lg:max-w-xs group">
                            <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder={isAr ? "البحث في المهام..." : "Search tasks..."}
                                className="w-full ps-12 pe-4 py-4 md:py-3 bg-bg-page border border-border-light rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-secondary shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:gap-6">
                        {filteredAssignments.map((assignment) => (
                            <div
                                key={assignment.id}
                                className="group bg-bg-page/20 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-border-light/50 hover:border-primary/40 hover:bg-bg-card transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col xl:flex-row xl:items-center justify-between gap-6 md:gap-10"
                            >
                                <div className="flex items-start gap-4 md:gap-6 min-w-0 flex-1">
                                    <div className={`shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.25rem] flex items-center justify-center shadow-inner border border-border-light transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${assignment.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        <ClipboardList className="w-6 h-6 md:w-8 md:h-8" />
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2 min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="px-2 py-0.5 bg-primary text-white text-[8px] md:text-[10px] font-black uppercase rounded-lg tracking-widest shadow-lg shadow-primary/20">
                                                {assignment.subject}
                                            </span>
                                            {assignment.status === 'closed' && (
                                                <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] md:text-[10px] font-black uppercase rounded-lg tracking-widest shadow-lg shadow-red-500/20">
                                                    Locked
                                                </span>
                                            )}
                                            <span className="text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest ms-1">{assignment.points} Points</span>
                                        </div>
                                        <h3 className="text-base md:text-xl font-black text-text-primary group-hover:text-primary transition-colors leading-snug truncate pe-4">
                                            {assignment.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-1 md:gap-y-2 text-[10px] md:text-xs font-bold text-text-muted">
                                            <span className="flex items-center gap-1.5 md:gap-2"><Calendar size={14} className="text-primary/60 shrink-0" /> {assignment.dueDate}</span>
                                            <span className="flex items-center gap-1.5 md:gap-2"><Clock size={14} className="text-primary/60 shrink-0" /> {assignment.dueTime}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-5 md:gap-10 xl:w-auto w-full pt-4 xl:pt-0 border-t xl:border-0 border-border-light/30">
                                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                                        <div className="flex items-center justify-between sm:justify-start gap-8">
                                            <span className="text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-widest opacity-60">{isAr ? 'نسبة الإنجاز' : 'Success Rate'}</span>
                                            <span className="text-[10px] md:text-xs font-black text-text-primary tabular-nums">{assignment.submitted}/{assignment.totalStudents}</span>
                                        </div>
                                        <div className="w-full sm:w-36 md:w-48 h-2 md:h-2.5 bg-bg-page rounded-full overflow-hidden border border-border-light shadow-inner">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                                style={{ width: `${(assignment.submitted / assignment.totalStudents) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 md:gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={() => setReviewMode(assignment.id)}
                                            className="flex-1 sm:flex-none px-4 md:px-6 py-3 md:py-3.5 bg-primary text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl md:rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{isAr ? "مراجعة" : "Review"}</button>
                                        <div className="flex items-center p-1 md:p-1.5 bg-bg-page border border-border-light rounded-xl md:rounded-2xl shadow-sm">
                                            <button className="p-2 md:p-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg md:rounded-xl text-text-muted hover:text-primary transition-all active:scale-90">
                                                <Download size={16} />
                                            </button>
                                            <button className="p-2 md:p-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg md:rounded-xl text-text-muted hover:text-primary transition-all active:scale-90">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Create Assignment Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" onClick={() => setShowCreateModal(false)}></div>
                    <div className="bg-bg-card w-full max-w-4xl rounded-[2rem] md:rounded-[3rem] overflow-hidden relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-slideInBottom border border-white/5 max-h-[90vh] md:max-h-[95vh] flex flex-col">
                        <div className="shrink-0 px-6 md:px-12 py-6 md:py-10 bg-gradient-to-r from-primary via-indigo-600 to-indigo-800 text-white flex items-center justify-between">
                            <div>
                                <h3 className="text-xl md:text-3xl font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">{isAr ? "واجب جديد" : "New Assignment"}</h3>
                                <p className="text-white/70 text-[9px] md:text-xs font-bold mt-1 md:mt-2 uppercase tracking-widest">{isAr ? "إعداد مهمة أو واجب دراسي للطلاب" : "Setup task for students"}</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-xl md:rounded-2xl transition-all active:scale-95">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 md:p-12 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                                <div className="space-y-6 md:space-y-8">
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">{isAr ? "عنوان الواجب" : "Assignment Title"}</label>
                                        <input type="text" className="w-full px-5 md:px-6 py-3.5 md:py-4.5 bg-bg-page border border-border-light rounded-xl md:rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-secondary shadow-inner" placeholder={isAr ? "مثال: تقرير مختبر الفيزياء" : "e.g. Physics Lab Report"} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-2 md:space-y-3">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">{isAr ? "المادة" : "Subject"}</label>
                                            <div className="relative">
                                                <select className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-bg-page border border-border-light rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-primary cursor-pointer appearance-none shadow-sm text-text-secondary">
                                                    <option>Higher Math</option>
                                                    <option>Physics</option>
                                                </select>
                                                <ChevronRight className="absolute end-4 top-1/2 -translate-y-1/2 rotate-90 text-text-muted pointer-events-none" size={14} />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:space-y-3">
                                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">{isAr ? "الفصل المستهدف" : "Target Class"}</label>
                                            <div className="relative">
                                                <select className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-bg-page border border-border-light rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-primary cursor-pointer appearance-none shadow-sm text-text-secondary">
                                                    <option>Class X - A</option>
                                                    <option>Class IX - B</option>
                                                </select>
                                                <ChevronRight className="absolute end-4 top-1/2 -translate-y-1/2 rotate-90 text-text-muted pointer-events-none" size={14} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">{isAr ? "موعد التسليم النهائي" : "Submission Deadline"}</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                            <div className="relative">
                                                <Calendar className="absolute start-4 top-1/2 -translate-y-1/2 text-primary/60" size={16} />
                                                <input type="date" className="w-full ps-11 pe-4 py-3.5 md:py-4 bg-bg-page border border-border-light rounded-xl md:rounded-2xl text-xs md:text-sm font-black focus:outline-none focus:border-primary shadow-sm text-text-secondary" />
                                            </div>
                                            <div className="relative">
                                                <Clock className="absolute start-4 top-1/2 -translate-y-1/2 text-primary/60" size={16} />
                                                <input type="time" className="w-full ps-11 pe-4 py-3.5 md:py-4 bg-bg-page border border-border-light rounded-xl md:rounded-2xl text-xs md:text-sm font-black focus:outline-none focus:border-primary shadow-sm text-text-secondary" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 md:space-y-8">
                                    <div className="space-y-2 md:space-y-3">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">{isAr ? "المصادر والإرشادات" : "Resources & Guidelines"}</label>
                                        <div className="border-3 border-dashed border-border-light/60 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 bg-bg-page/40 group transition-all cursor-pointer relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] md:min-h-[280px] hover:border-primary/50 hover:bg-primary/[0.02]">
                                            <div className="w-14 h-14 md:w-20 md:h-20 bg-white dark:bg-slate-800 rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-4 md:mb-6 shadow-2xl border border-border-light group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                                <Upload size={32} className="text-primary" />
                                            </div>
                                            <p className="text-xs md:text-sm font-black text-text-primary uppercase tracking-[0.1em] md:tracking-[0.15em]">{isAr ? "اسحب الملف وأفلته هنا" : "Drag & Drop File"}</p>
                                            <p className="text-[9px] md:text-[10px] font-bold text-text-muted mt-2 md:mt-3 uppercase tracking-widest opacity-60 italic text-center leading-relaxed">Limit 25MB per file.<br />(PDF, ZIP, or JPG)</p>
                                            <div className="absolute inset-0 bg-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <button
                                            onClick={() => setShowCreateModal(false)}
                                            className="py-4 md:py-5 bg-bg-page border border-border-light text-text-muted rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:text-text-primary hover:border-primary/30 transition-all active:scale-95"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            onClick={() => setShowCreateModal(false)}
                                            className="py-4 md:py-5 bg-primary text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest md:tracking-[0.25em] hover:bg-primary-dark transition-all shadow-2xl shadow-primary/40 active:scale-[0.98]"
                                        >
                                            Post Task
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
