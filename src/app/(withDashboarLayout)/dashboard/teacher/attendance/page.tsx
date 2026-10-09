"use client";
import React, { useState, useEffect } from 'react';
import {
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronRight,
    BookOpen,
    Calendar as CalendarIcon,
    Loader2
} from 'lucide-react';
import { TeacherHeader } from "../TeacherHeader";
import { useLanguage } from "@/context/LanguageProvider";
import { getClasses } from '@/app/actions/teacher/results';
import { getAttendance, saveAttendance } from '@/app/actions/teacher/attendance';
import { getStudentsByClass } from '@/app/actions/teacher/results';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

type AttendanceStatusType = 'PRESENT' | 'ABSENT' | 'LATE';

export default function AttendancePage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatusType>>({});
    const [students, setStudents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Fetch Classes
    useEffect(() => {
        const fetchClasses = async () => {
            setIsLoading(true);
            const res = await getClasses();
            if (res.success) {
                setClasses(res.data || []);
            }
            else {
                toast.error(res.error || "Failed to load classes");
            }
            setIsLoading(false);
        };
        fetchClasses();
    }, []);

    // Fetch Students and existing Attendance
    useEffect(() => {
        if (!selectedClass) return;

        const fetchData = async () => {
            setIsLoading(true);
            const [studentsRes, attendanceRes] = await Promise.all([
                getStudentsByClass(selectedClass),
                getAttendance(selectedClass, selectedDate)
            ]);

            if (studentsRes.success) {
                setStudents(studentsRes.data || []);

                // Map existing attendance
                const attendanceMap: Record<string, AttendanceStatusType> = {};
                if (attendanceRes.success && attendanceRes.data) {
                    attendanceRes.data.forEach((rec: any) => {
                        attendanceMap[rec.studentId] = rec.status;
                    });
                }
                setAttendance(attendanceMap);
            } else {
                toast.error(studentsRes.error || "Failed to load students");
            }
            setIsLoading(false);
        };
        fetchData();
    }, [selectedClass, selectedDate]);

    const currentClassDetails = classes.find(c => c.id === selectedClass);

    const handleStatusChange = (studentId: string, status: AttendanceStatusType) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const markAllAsPresent = () => {
        const allPresent = students.reduce((acc, student) => ({ ...acc, [student.id]: 'PRESENT' }), {});
        setAttendance(allPresent);
    };

    const isDatePast = (dateStr: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(dateStr);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate < today;
    };

    const handleSave = async () => {
        if (!selectedClass) return;

        setIsSaving(true);
        const records = Object.entries(attendance).map(([studentId, status]) => ({
            studentId,
            status,
            date: selectedDate,
            classId: selectedClass
        }));

        if (records.length === 0) {
            toast.error("No attendance data to save");
            setIsSaving(false);
            return;
        }

        const res = await saveAttendance(records);
        if (res.success) {
            Swal.fire({
                title: 'Saved!',
                text: 'Attendance has been recorded successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            toast.error(res.error || "Failed to save attendance");
        }
        setIsSaving(false);
    };

    const filteredStudents = students.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toString().includes(searchQuery)
    );

    if (isLoading && !selectedClass) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <TeacherHeader
                title={selectedClass ? (isAr ? "تسجيل" : "Marking") : (isAr ? "تسجيل" : "Take")}
                highlight={isAr ? "الحضور" : "Attendance"}
                emoji="✔️"
                subtitle={selectedClass ? `${currentClassDetails?.name}` : (isAr ? "اختر فصلاً دراسياً لتسجيل حضور وغياب الطلاب." : "Select a class to record student attendance.")}
                rightElement={
                    selectedClass && (
                        <button
                            onClick={() => setSelectedClass(null)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-bg-card border border-border-light rounded-2xl text-sm font-bold text-text-secondary hover:bg-bg-page transition-all active:scale-95 shadow-sm"
                        >
                            <ChevronRight className="rotate-180" size={18} /> {isAr ? 'خروج' : 'Exit Sheet'}
                        </button>
                    )
                }
            />

            {!selectedClass ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {classes.map((cls) => (
                        <div
                            key={cls.id}
                            onClick={() => setSelectedClass(cls.id)}
                            className="group bg-bg-card p-6 rounded-3xl border border-border-light shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                                        {cls.name}
                                    </h3>
                                    <p className="text-xs font-black text-text-muted uppercase tracking-widest mt-0.5">{isAr ? 'الفصول والحضور' : 'Classes & Attendance'}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-text-muted">
                                    <Clock size={16} className="text-primary/60" />
                                    <span className="text-sm font-bold">{isAr ? 'جلسة اعتيادية' : 'Standard Session'}</span>
                                </div>
                                <div className="bg-primary/5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                                    {isAr ? 'فتح الكشف' : 'Open Sheet'}
                                </div>
                            </div>

                            <div className="absolute end-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {classes.length === 0 && (
                        <div className="col-span-full p-12 text-center bg-bg-card border border-border-light rounded-3xl">
                            <p className="text-text-muted font-bold">No classes found. Please contact admin to assign classes.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <button
                            onClick={() => setSelectedClass(null)}
                            className="flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                        >
                            {isAr ? '← العودة إلى الاختيار' : '← Back to Selection'}
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={markAllAsPresent}
                                disabled={isDatePast(selectedDate)}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAr ? 'تحضير الكل' : 'Mark All Present'}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || isDatePast(selectedDate)}
                                className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={14} /> : null}
                                {isSaving ? (isAr ? "جارٍ الحفظ..." : "Saving...") : isDatePast(selectedDate) ? (isAr ? "للقراءة فقط" : "Read Only") : (isAr ? "حفظ الحضور" : "Save Attendance")}
                            </button>
                        </div>
                    </div>

                    <div className="bg-bg-card rounded-3xl border border-border-light shadow-sm p-6 overflow-hidden relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-20 flex items-center justify-center backdrop-blur-[1px]">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        )}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <CalendarIcon size={20} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-text-primary">
                                        {isAr ? 'حضور' : 'Attendance for'} {currentClassDetails?.name}
                                    </h2>
                                    <p className="text-xs text-text-muted font-medium italic">{isAr ? 'سجل الحضور اليومي للطلاب أدناه.' : 'Record daily attendance below.'}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="relative">
                                    <CalendarIcon className="absolute start-3 top-1/2 -translate-y-1/2 text-primary" size={16} />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="ps-10 pe-4 py-2 bg-bg-page border border-border-light rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-secondary"
                                    />
                                </div>
                                <div className="relative">
                                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                    <input
                                        type="text"
                                        placeholder={isAr ? "البحث عن طالب..." : "Search student..."}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="ps-10 pe-4 py-2 bg-bg-page border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/40 p-4 rounded-2xl mb-6 flex items-start gap-3">
                            <Clock className="text-amber-600 shrink-0" size={18} />
                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-snug">
                                {isAr ? 'قاعدة الأمان: يمكن تعديل سجلات الحضور في نفس يوم تسجيلها فقط. سجلات التواريخ السابقة متاحة للقراءة فقط.' : 'Security Rule: Attendance records can only be edited on the same day they are created. Records from previous dates are read-only for teachers.'}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {filteredStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className="group bg-bg-page/40 p-4 rounded-2xl border border-border-light/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/20 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-bold text-text-muted w-8">{student.rollNo}</span>
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                                            {student.firstName[0]}{student.lastName[0]}
                                        </div>
                                        <span className="font-bold text-text-primary">{student.firstName} {student.lastName}</span>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                                        <button
                                            disabled={isDatePast(selectedDate)}
                                            onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${attendance[student.id] === 'PRESENT'
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                                : 'bg-bg-card text-emerald-600 border border-emerald-100 hover:bg-emerald-50'
                                                } ${isDatePast(selectedDate) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <CheckCircle2 size={16} />
                                            Present
                                        </button>
                                        <button
                                            disabled={isDatePast(selectedDate)}
                                            onClick={() => handleStatusChange(student.id, 'LATE')}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${attendance[student.id] === 'LATE'
                                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                                : 'bg-bg-card text-amber-600 border border-amber-100 hover:bg-amber-50'
                                                } ${isDatePast(selectedDate) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <Clock size={16} />
                                            Late
                                        </button>
                                        <button
                                            disabled={isDatePast(selectedDate)}
                                            onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${attendance[student.id] === 'ABSENT'
                                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                                : 'bg-bg-card text-red-600 border border-red-100 hover:bg-red-50'
                                                } ${isDatePast(selectedDate) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <XCircle size={16} />
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredStudents.length === 0 && (
                                <div className="py-20 text-center text-text-muted font-bold">
                                    {isAr ? 'لم يتم العثور على طلاب يطابقون بحثك.' : 'No students found matching your search.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
