"use client";
import React, { useState, useEffect } from "react";
import { 
    Calendar, 
    Plus, 
    Clock, 
    User, 
    Trash2, 
    Edit2, 
    Loader2, 
    ChevronLeft, 
    ChevronRight,
    AlertCircle
} from "lucide-react";
import { TeacherHeader } from "../TeacherHeader";
import { useLanguage } from "@/context/LanguageProvider";
import { 
    getTeacherClassesForSchedule, 
    getClassScheduleForTeacher, 
    saveScheduleEntry, 
    deleteScheduleEntry,
    getScheduleDependencies
} from "@/app/actions/teacher/schedule";
import { getSubjects, addSubject, deleteSubject } from "@/app/actions/teacher/subjects";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"]; // Typical Academic week

export default function TeacherSchedulePage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const dayMap: Record<string, string> = { Sunday: "الأحد", Monday: "الإثنين", Tuesday: "الثلاثاء", Wednesday: "الأربعاء", Thursday: "الخميس" };
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scheduleLoading, setScheduleLoading] = useState(false);
    const [activeDay, setActiveDay] = useState("Sunday");
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [dependencies, setDependencies] = useState<{ subjects: any[], teachers: any[] }>({ subjects: [], teachers: [] });
    const [formData, setFormData] = useState<{
        id?: string,
        subjectId: string,
        teacherId: string,
        day: string,
        startTime: string,
        endTime: string
    }>({
        id: undefined,
        subjectId: "",
        teacherId: "",
        day: "Sunday",
        startTime: "09:00 AM",
        endTime: "10:00 AM"
    });
    const [isSaving, setIsSaving] = useState(false);

    // Time Selection State (local to the modal)
    const [timeSelection, setTimeSelection] = useState({
        startHour: "09", startMin: "00", startPeriod: "AM",
        endHour: "10", endMin: "00", endPeriod: "AM"
    });

    const HOURS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const MINUTES = ["00", "15", "30", "45"];
    const PERIODS = ["AM", "PM"];

    // Subject Form State
    const [newSubject, setNewSubject] = useState({ name: "", code: "" });
    const [isSubjectSaving, setIsSubjectSaving] = useState(false);

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            fetchSchedule(selectedClassId);
            fetchDependencies(selectedClassId);
        }
    }, [selectedClassId]);

    // Update formData when time selection changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            startTime: `${timeSelection.startHour}:${timeSelection.startMin} ${timeSelection.startPeriod}`,
            endTime: `${timeSelection.endHour}:${timeSelection.endMin} ${timeSelection.endPeriod}`
        }));
    }, [timeSelection]);

    const fetchClasses = async () => {
        setLoading(true);
        const res = await getTeacherClassesForSchedule();
        if (res.success && res.data) {
            setClasses(res.data);
            if (res.data.length > 0) setSelectedClassId(res.data[0].id);
        }
        setLoading(false);
    };

    const fetchSchedule = async (classId: string) => {
        setScheduleLoading(true);
        const res = await getClassScheduleForTeacher(classId);
        if (res.success && res.data) {
            // Sort schedules by start time dynamically
            const sortedData = res.data.sort((a: any, b: any) => {
                const timeA = new Date(`1970/01/01 ${a.startTime}`).getTime();
                const timeB = new Date(`1970/01/01 ${b.startTime}`).getTime();
                return timeA - timeB;
            });
            setSchedules(sortedData);
        }
        setScheduleLoading(false);
    };

    const fetchDependencies = async (classId: string) => {
        const res = await getScheduleDependencies(classId);
        if (res.success && res.data) setDependencies(res.data);
    };

    const handleAddSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubject.name) return toast.error("Subject name is required");
        setIsSubjectSaving(true);
        const res = await addSubject(selectedClassId, newSubject.name, newSubject.code);
        if (res.success) {
            toast.success("Subject added!");
            setNewSubject({ name: "", code: "" });
            fetchDependencies(selectedClassId); // Reload dropdown options
        } else {
            toast.error(res.error || "Failed to add");
        }
        setIsSubjectSaving(false);
    };

    const handleDeleteSubject = async (id: string) => {
        const res = await deleteSubject(id);
        if (res.success) {
            toast.success("Subject removed");
            fetchDependencies(selectedClassId);
        } else {
            toast.error("Failed to delete subject");
        }
    };

    const handleOpenModal = (entry?: any) => {
        if (entry) {
            setFormData({
                id: entry.id,
                subjectId: entry.subjectId,
                teacherId: entry.teacherId,
                day: entry.day,
                startTime: entry.startTime,
                endTime: entry.endTime
            });
            
            // Parse existing time
            const startParts = entry.startTime.match(/(\d+):(\d+)\s+(AM|PM)/);
            const endParts = entry.endTime.match(/(\d+):(\d+)\s+(AM|PM)/);
            if (startParts && endParts) {
                setTimeSelection({
                    startHour: startParts[1], startMin: startParts[2], startPeriod: startParts[3],
                    endHour: endParts[1], endMin: endParts[2], endPeriod: endParts[3]
                });
            }
        } else {
            const defaultStart = "09:00 AM";
            const defaultEnd = "10:00 AM";
            setFormData({
                id: undefined,
                subjectId: "",
                teacherId: "",
                day: activeDay,
                startTime: defaultStart,
                endTime: defaultEnd
            });
            setTimeSelection({
                startHour: "09", startMin: "00", startPeriod: "AM",
                endHour: "10", endMin: "00", endPeriod: "AM"
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.subjectId || !formData.teacherId) {
            return toast.error("Please fill all fields");
        }

        setIsSaving(true);
        const res = await saveScheduleEntry({ ...formData, classId: selectedClassId } as any);
        if (res.success) {
            toast.success("Schedule saved!");
            setIsModalOpen(false);
            fetchSchedule(selectedClassId);
        } else {
            toast.error(res.error || "Failed to save");
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        const confirm = await Swal.fire({
            title: 'Delete this slot?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it'
        });

        if (confirm.isConfirmed) {
            const res = await deleteScheduleEntry(id);
            if (res.success) {
                toast.success("Deleted!");
                fetchSchedule(selectedClassId);
            } else {
                toast.error(res.error || "Failed to delete");
            }
        }
    };

    const scheduleByDay = schedules.filter(s => s.day === activeDay);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

    return (
        <div className="space-y-8 animate-fadeIn text-text-primary px-4 sm:px-0">
            <TeacherHeader 
                title={isAr ? "الجدول" : "Class"} 
                highlight="Schedules" 
                emoji="⏲️" 
                subtitle="Manage and organize your weekly time slots for each class."
            />

            {/* Class Selection & Day Tabs */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Class List - Responsive Layout */}
                <div className="w-full lg:w-72 bg-bg-card border border-border-light rounded-3xl p-6 shadow-sm">
                    <h3 className="hidden lg:block text-[10px] font-black text-text-muted uppercase tracking-widest mb-6 px-1">Academy Classes</h3>
                    
                    {/* Desktop View: Vertical List */}
                    <div className="hidden lg:flex flex-col gap-2">
                        {classes.map(cls => (
                            <button
                                key={cls.id}
                                onClick={() => setSelectedClassId(cls.id)}
                                className={`w-full text-start p-5 rounded-2xl font-bold transition-all border ${
                                    selectedClassId === cls.id 
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]" 
                                    : "bg-bg-page/40 hover:bg-bg-page text-text-secondary border-border-light hover:border-primary/20"
                                }`}
                            >
                                <p className="text-sm">{cls.name}</p>
                                <p className={`text-[10px] mt-1 ${selectedClassId === cls.id ? "text-white/70" : "text-text-muted"}`}>Standard Schedule</p>
                            </button>
                        ))}
                    </div>

                    {/* Mobile View: Horizontal Rail */}
                    <div className="lg:hidden flex overflow-x-auto gap-3 pb-2 no-scrollbar -mx-2 px-2">
                        {classes.map(cls => (
                            <button
                                key={cls.id}
                                onClick={() => setSelectedClassId(cls.id)}
                                className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border ${
                                    selectedClassId === cls.id 
                                    ? "bg-primary text-white border-primary shadow-md" 
                                    : "bg-bg-page text-text-secondary border-border-light hover:border-primary/20"
                                }`}
                            >
                                {cls.name}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-border-light">
                         <button 
                            onClick={() => setIsSubjectModalOpen(true)}
                            className="w-full bg-primary/[0.05] text-primary p-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/[0.08] transition-all active:scale-95 border border-primary/10"
                        >
                            <Calendar size={16} /> Manage Subjects
                        </button>
                    </div>
                </div>

                {/* Timetable Content */}
                <div className="flex-1 w-full bg-bg-card border border-border-light rounded-[2.5rem] p-4 sm:p-8 shadow-sm">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
                        {/* Day Selector */}
                        <div className="flex bg-bg-page/50 p-1.5 rounded-2xl border border-border-light overflow-x-auto no-scrollbar">
                            {DAYS.map(day => (
                                <button
                                    key={day}
                                    onClick={() => setActiveDay(day)}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                        activeDay === day 
                                        ? "bg-white dark:bg-bg-card shadow-md text-primary scale-[1.05]" 
                                        : "text-text-muted hover:text-text-primary"
                                    }`}
                                >
                                    {day.substring(0, 3)}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => handleOpenModal()}
                            disabled={dependencies.subjects.length === 0}
                            className={`px-7 py-3.5 rounded-[1.25rem] font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
                                dependencies.subjects.length === 0 
                                ? "bg-bg-page text-text-muted cursor-not-allowed border border-border-light"
                                : "bg-primary text-white hover:bg-primary-dark hover:translate-y-[-2px]"
                            }`}
                        >
                            <Plus size={20} /> New Entry
                        </button>
                    </div>

                    {dependencies.subjects.length === 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
                            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                            <div>
                                <p className="text-sm font-bold text-amber-900 dark:text-amber-400">No subjects found for this class.</p>
                                <p className="text-xs text-amber-700 dark:text-amber-500/80 mt-1">Please use the "Manage Subjects" button in the sidebar to add subjects before creating a schedule.</p>
                            </div>
                        </div>
                    )}

                    {scheduleLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 grayscale opacity-50">
                            <Loader2 className="animate-spin text-primary mb-4" size={32} />
                            <p className="text-sm font-bold text-text-muted">Fetching Timetable...</p>
                        </div>
                    ) : (
                        <div className="grid gap-5">
                            {scheduleByDay.length > 0 ? (
                                scheduleByDay.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="group bg-bg-page/50 border border-border-light rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-primary/40 hover:bg-primary/[0.02] transition-all shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-white dark:bg-bg-card rounded-2xl border border-border-light flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                                                <Clock size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg sm:text-xl font-black text-text-primary group-hover:text-primary transition-colors tracking-tight">
                                                    {item.subject.name}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1.5 text-xs">
                                                    <span className="flex items-center gap-1.5 font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                                        <Clock size={14} /> {item.startTime} - {item.endTime}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 font-bold text-text-muted">
                                                        <User size={14} className="text-orange-600/60" /> {item.teacher.user.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 self-end md:self-center">
                                            <button 
                                                onClick={() => handleOpenModal(item)}
                                                className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-xl transition-all border border-border-light hover:border-blue-200 active:scale-95"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-xl transition-all border border-border-light hover:border-red-200 active:scale-95"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 text-center grayscale opacity-40">
                                    <div className="p-6 bg-bg-page rounded-full mb-6 border border-border-light shadow-inner">
                                        <AlertCircle size={48} className="text-text-muted" />
                                    </div>
                                    <h5 className="text-xl font-black text-text-primary tracking-tight">No sessions today</h5>
                                    <p className="text-sm text-text-muted max-w-[240px] mt-2 font-medium leading-relaxed">Your timetable is a clean slate. Switch days or add a new entry.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Manage Entry Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
                        onClick={() => !isSaving && setIsModalOpen(false)}
                    />
                    <div className="relative bg-bg-card border border-border-light w-full max-w-lg rounded-[2.5rem] p-6 sm:p-10 shadow-2xl animate-slideInBottom overflow-y-auto max-h-[95vh] custom-scrollbar">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                                {formData.id ? 'Edit Session' : 'New Session'}
                            </h3>
                            {formData.id && <span className="text-[10px] bg-primary/10 text-primary px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-sm">Updated</span>}
                        </div>

                        <form onSubmit={handleSave} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                {/* Subject Selector */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2">Academic Subject</label>
                                    <select 
                                        value={formData.subjectId}
                                        onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                        className="w-full bg-bg-page border border-border-light rounded-2xl px-5 py-4 text-sm font-bold text-text-secondary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer appearance-none shadow-sm"
                                    >
                                        <option value="">Select Subject</option>
                                        {dependencies.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>

                                {/* Teacher Selector */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2">Assigned Instructor</label>
                                    <select 
                                        value={formData.teacherId}
                                        onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                        className="w-full bg-bg-page border border-border-light rounded-2xl px-5 py-4 text-sm font-bold text-text-secondary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer appearance-none shadow-sm"
                                    >
                                        <option value="">Select Teacher</option>
                                        {dependencies.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>

                                {/* Day Selector */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2">Day of Week</label>
                                    <select 
                                        value={formData.day}
                                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                        className="w-full bg-bg-page border border-border-light rounded-2xl px-5 py-4 text-sm font-bold text-text-secondary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer appearance-none shadow-sm"
                                    >
                                        {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                                    </select>
                                </div>

                                {/* Start Time Picker */}
                                <div className="space-y-3 md:col-span-2 pt-4 border-t border-border-light/40">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2">Start Time (12-Hour Format)</label>
                                    <div className="flex gap-2 sm:gap-3">
                                        <select 
                                            value={timeSelection.startHour}
                                            onChange={(e) => setTimeSelection({...timeSelection, startHour: e.target.value})}
                                            className="flex-1 min-w-0 bg-bg-page border border-border-light rounded-xl px-2 sm:px-4 py-4 text-sm font-black text-text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        >
                                            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                        <select 
                                            value={timeSelection.startMin}
                                            onChange={(e) => setTimeSelection({...timeSelection, startMin: e.target.value})}
                                            className="flex-1 min-w-0 bg-bg-page border border-border-light rounded-xl px-2 sm:px-4 py-4 text-sm font-black text-text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        >
                                            {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <select 
                                            value={timeSelection.startPeriod}
                                            onChange={(e) => setTimeSelection({...timeSelection, startPeriod: e.target.value})}
                                            className="w-20 sm:w-28 bg-bg-page border border-border-light rounded-xl px-2 sm:px-4 py-4 text-sm font-black text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        >
                                            {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* End Time Picker */}
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2">End Time (12-Hour Format)</label>
                                    <div className="flex gap-2 sm:gap-3">
                                        <select 
                                            value={timeSelection.endHour}
                                            onChange={(e) => setTimeSelection({...timeSelection, endHour: e.target.value})}
                                            className="flex-1 min-w-0 bg-bg-page border border-border-light rounded-xl px-2 sm:px-4 py-4 text-sm font-black text-text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        >
                                            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                        <select 
                                            value={timeSelection.endMin}
                                            onChange={(e) => setTimeSelection({...timeSelection, endMin: e.target.value})}
                                            className="flex-1 min-w-0 bg-bg-page border border-border-light rounded-xl px-2 sm:px-4 py-4 text-sm font-black text-text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        >
                                            {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <select 
                                            value={timeSelection.endPeriod}
                                            onChange={(e) => setTimeSelection({...timeSelection, endPeriod: e.target.value})}
                                            className="w-20 sm:w-28 bg-bg-page border border-border-light rounded-xl px-2 sm:px-4 py-4 text-sm font-black text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        >
                                            {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                                <button 
                                    type="button"
                                    disabled={isSaving}
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-5 border border-border-light rounded-2xl font-bold text-sm text-text-secondary hover:bg-bg-page transition-all"
                                >
                                    Discard Changes
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-2 py-5 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary-dark transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-2 hover:translate-y-[-2px] active:scale-95"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={24} /> : 'Confirm & Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manage Subjects Modal */}
            {isSubjectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isSubjectSaving && setIsSubjectModalOpen(false)} />
                    <div className="relative bg-bg-card border border-border-light w-full max-w-xl rounded-3xl p-8 shadow-2xl animate-slideInBottom overflow-hidden flex flex-col max-h-[90vh]">
                        <h3 className="text-2xl font-black text-text-primary mb-6">Subject Inventory</h3>
                        
                        {/* Add Subject Form */}
                        <form onSubmit={handleAddSubject} className="bg-bg-page p-6 rounded-2xl border border-border-light mb-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4">Add New Subject</h4>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Name (e.g. Physics)" 
                                    value={newSubject.name} 
                                    onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                                    className="flex-1 bg-bg-card border border-border-light rounded-xl px-4 py-2 text-sm font-bold text-text-primary"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Code (Optional)" 
                                    value={newSubject.code} 
                                    onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                                    className="w-full sm:w-32 bg-bg-card border border-border-light rounded-xl px-4 py-2 text-sm font-bold text-text-primary"
                                />
                                <button 
                                    type="submit" 
                                    disabled={isSubjectSaving}
                                    className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-primary-dark transition-all disabled:opacity-50"
                                >
                                    {isSubjectSaving ? "Adding..." : "Add"}
                                </button>
                            </div>
                        </form>

                        {/* Subject List */}
                        <div className="flex-1 overflow-y-auto pe-2 custom-scrollbar">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4">Current Subjects</h4>
                            <div className="space-y-2">
                                {dependencies.subjects.length > 0 ? (
                                    dependencies.subjects.map(sub => (
                                        <div key={sub.id} className="flex items-center justify-between p-4 bg-bg-page/50 rounded-xl border border-border-light group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black">
                                                    {sub.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-primary">{sub.name}</p>
                                                    {sub.code && <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">{sub.code}</p>}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteSubject(sub.id)}
                                                className="p-2 text-text-muted hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-10 text-text-muted text-xs font-bold italic">No subjects added yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-border-light">
                            <button 
                                onClick={() => setIsSubjectModalOpen(false)}
                                className="w-full py-4 text-sm font-bold text-text-secondary hover:bg-bg-page rounded-2xl transition-all"
                            >
                                Close Management
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
