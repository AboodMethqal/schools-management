"use client";
import React, { useState, useEffect } from 'react';
import { TeacherHeader } from "../TeacherHeader";
import { useLanguage } from "@/context/LanguageProvider";
import {
    MessageSquare,

    Send,
    User,
    Star,
    BookOpen,
  
    CheckCircle2,
    Users,
    Loader2
} from 'lucide-react';
import { getTeacherDashboardData } from '@/app/actions/teacher/dashboard';
import { getStudentsByClass } from '@/app/actions/teacher/results';
import { addFeedback, getStudentFeedback } from '@/app/actions/teacher/feedback';
import toast from 'react-hot-toast';

export default function FeedbackPage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [assignedClasses, setAssignedClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingStudents, setIsFetchingStudents] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Feedback states
    const [academicRating, setAcademicRating] = useState(0);
    const [behaviorRating, setBehaviorRating] = useState(0);
    const [participationRating, setParticipationRating] = useState(0);
    const [comment, setComment] = useState("");
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [isFetchingHistory, setIsFetchingHistory] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);
            const res = await getTeacherDashboardData();
            if (res.success && res.data) {
                setAssignedClasses(res.data.assignedClasses || []);
                if (res.data.assignedClasses?.length > 0) {
                    setSelectedClass(res.data.assignedClasses[0].id);
                }
            }
            setIsLoading(false);
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            fetchStudents(selectedClass);
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedStudent) {
            fetchFeedbackHistory(selectedStudent);
        } else {
            setFeedbacks([]);
        }
    }, [selectedStudent]);

    const fetchStudents = async (classId: string) => {
        setIsFetchingStudents(true);
        const res = await getStudentsByClass(classId);
        if (res.success) {
            setStudents(res.data || []);
        } else {
            toast.error(res.error || "Failed to fetch students");
        }
        setIsFetchingStudents(false);
    };

    const fetchFeedbackHistory = async (studentId: string) => {
        setIsFetchingHistory(true);
        const res = await getStudentFeedback(studentId);
        if (res.success) {
            setFeedbacks(res.data || []);
        } else {
            toast.error(res.error || "Failed to fetch history");
        }
        setIsFetchingHistory(false);
    };

    const currentStudent = students.find(s => s.id === selectedStudent);

    const handleSubmit = async () => {
        if (!selectedStudent) return;
        if (academicRating === 0 || behaviorRating === 0 || participationRating === 0) {
            toast.error("Please provide ratings for all categories.");
            return;
        }

        setIsSubmitting(true);
        const res = await addFeedback({
            studentId: selectedStudent,
            academic: academicRating,
            behavior: behaviorRating,
            participation: participationRating,
            comment: comment
        });

        if (res.success) {
            toast.success("Feedback submitted successfully!");
            // Reset form
            setAcademicRating(0);
            setBehaviorRating(0);
            setParticipationRating(0);
            setComment("");
            // Refresh history
            fetchFeedbackHistory(selectedStudent);
        } else {
            toast.error(res.error || "Failed to submit feedback");
        }
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <TeacherHeader
                title={isAr ? "ملاحظات" : "Student"}
                highlight={isAr ? "الطلاب" : "Feedback"}
                emoji="💬"
                subtitle="Review and respond to parent concerns and student feedback."
                rightElement={
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="px-4 py-2 bg-bg-card border border-border-light rounded-xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-primary cursor-pointer text-text-secondary"
                    >
                        {assignedClasses.map((cls, idx) => (
                            <option key={idx} value={cls.id}>{cls.name}</option>
                        ))}
                    </select>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Student List Sidebar */}
                <div className="bg-bg-card rounded-3xl border border-border-light shadow-sm p-6 space-y-6 lg:h-[80vh] flex flex-col">
                    <div className="flex-1 overflow-y-auto pe-2 space-y-2 custom-scrollbar">
                        {isFetchingStudents ? (
                            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>
                        ) : students.length > 0 ? (
                            students.map((student) => (
                                <button
                                    key={student.id}
                                    onClick={() => setSelectedStudent(student.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${selectedStudent === student.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-bg-page/50 text-text-secondary hover:bg-bg-page'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${selectedStudent === student.id ? 'bg-white/20' : 'bg-primary/10 text-primary'
                                        }`}>
                                        {student.firstName[0]}{student.lastName[0]}
                                    </div>
                                    <div className="text-start overflow-hidden">
                                        <p className="font-bold text-sm truncate">{student.firstName} {student.lastName}</p>
                                        <p className={`text-[10px] uppercase font-black tracking-widest ${selectedStudent === student.id ? 'text-white/70' : 'text-text-muted'
                                            }`}>
                                            Roll: {student.rollNo}
                                        </p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <p className="text-center text-xs text-text-muted py-10">No students found.</p>
                        )}
                    </div>
                </div>

                {/* Feedback Form and History Area */}
                <div className="lg:col-span-2 space-y-8">
                    {selectedStudent && currentStudent ? (
                        <>
                            {/* History Section */}
                            <div className="bg-bg-card rounded-3xl border border-border-light shadow-sm p-6">
                                <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                    Feedback History
                                </h3>

                                {isFetchingHistory ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Loader2 className="animate-spin text-primary mb-4" />
                                        <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Loading records...</p>
                                    </div>
                                ) : feedbacks.length > 0 ? (
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pe-2 custom-scrollbar">
                                        {feedbacks.map((fb, idx) => (
                                            <div key={idx} className="p-4 bg-bg-page/40 border border-border-light rounded-2xl hover:bg-bg-page transition-colors">
                                                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
                                                            <Star size={12} fill="currentColor" />
                                                            <span className="text-[10px] font-bold">{fb.academic}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600">
                                                            <CheckCircle2 size={12} />
                                                            <span className="text-[10px] font-bold">{fb.behavior}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
                                                            <Users size={12} />
                                                            <span className="text-[10px] font-bold">{fb.participation}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-text-muted font-medium">
                                                        {new Date(fb.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-text-secondary leading-relaxed italic">"{fb.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center bg-bg-page/20 rounded-2xl border-2 border-dashed border-border-light">
                                        <p className="text-xs text-text-muted font-medium italic">No previous feedback records found for this student.</p>
                                    </div>
                                )}
                            </div>

                            {/* Evaluation Form */}
                            <div className="bg-bg-card rounded-3xl border border-border-light shadow-sm p-8 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-primary/20">
                                        {currentStudent.firstName[0]}{currentStudent.lastName[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-text-primary">
                                            {currentStudent.firstName} {currentStudent.lastName}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 bg-primary/5 text-primary rounded-md text-[10px] font-black uppercase tracking-widest">
                                                Roll: {currentStudent.rollNo}
                                            </span>
                                            <span className="text-xs text-text-muted font-medium">New Performance Evaluation</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Star size={14} className="text-amber-500" /> Academic
                                        </label>
                                        <div className="flex bg-bg-page border border-border-light p-2 rounded-2xl justify-between">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setAcademicRating(s)}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${academicRating >= s ? 'text-amber-500 scale-110' : 'text-text-muted hover:bg-bg-card'}`}>
                                                    <Star size={18} fill={academicRating >= s ? "currentColor" : "none"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-emerald-500" /> Behavior
                                        </label>
                                        <div className="flex bg-bg-page border border-border-light p-2 rounded-2xl justify-between">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setBehaviorRating(s)}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${behaviorRating >= s ? 'text-emerald-500 scale-110' : 'text-text-muted hover:bg-bg-card'}`}>
                                                    <Star size={18} fill={behaviorRating >= s ? "currentColor" : "none"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Users size={14} className="text-indigo-500" /> Participation
                                        </label>
                                        <div className="flex bg-bg-page border border-border-light p-2 rounded-2xl justify-between">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setParticipationRating(s)}
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${participationRating >= s ? 'text-indigo-500 scale-110' : 'text-text-muted hover:bg-bg-card'}`}>
                                                    <Star size={18} fill={participationRating >= s ? "currentColor" : "none"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                        <MessageSquare size={14} className="text-primary" /> Personalized Comments
                                    </label>
                                    <textarea
                                        className="w-full bg-bg-page border-2 border-border-light rounded-[2rem] p-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary min-h-[140px] resize-none shadow-inner transition-all"
                                        placeholder="Provide detailed feedback for the student and parents..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-border-light/50">
                                    <div className="flex items-center gap-3 text-text-muted text-[10px] font-black uppercase tracking-widest bg-bg-page px-6 py-3 rounded-full border border-border-light/50">
                                        <BookOpen size={14} className="text-primary/60" />
                                        Transparency: Visible to Parents
                                    </div>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto bg-primary text-white px-10 py-4.5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/30 hover:bg-primary-dark hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                        {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-bg-page/10 border-4 border-dashed border-border-light/40 rounded-[3rem] min-h-[400px] lg:h-[80vh] flex flex-col items-center justify-center text-center p-8 md:p-12 group transition-all hover:bg-bg-page/20">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-bg-card rounded-[2rem] flex items-center justify-center text-text-muted mb-8 shadow-2xl border border-border-light group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                <User size={48} className="text-primary/40 group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-widest">Select Student</h3>
                            <p className="text-text-muted mt-3 max-w-xs mx-auto text-xs md:text-sm font-medium leading-relaxed">
                                Pick a student from the directory to start their performance evaluation.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
