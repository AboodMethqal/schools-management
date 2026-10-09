"use client";
import React from 'react';
import {
    Megaphone,
    Calendar,
    ChevronRight,
    Search,
    Pin,
    Bell,
    Clock,
    Plus,
    X,
    MessageSquare,
    Users,
    Edit,
    Trash2
} from 'lucide-react';

import { TeacherHeader } from "../TeacherHeader";
import { useLanguage } from "@/context/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import { createTeacherNotice, getTeacherNotices, updateTeacherNotice, deleteTeacherNotice, getSchoolAnnouncements } from "@/app/actions/teacher/createTeacherNotice";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';

export default function NoticesPage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const [showPostModal, setShowPostModal] = React.useState(false);
    const [selectedNotice, setSelectedNotice] = React.useState<any | null>(null);
    const [activeFilter, setActiveFilter] = React.useState("all");
    const [selectedClassFilter, setSelectedClassFilter] = React.useState("");
    const [editNotice, setEditNotice] = React.useState<any | null>(null);
    const [searchQuery, setSearchQuery] = React.useState("");

    // Form states
    const { user } = useAuth();
    const [title, setTitle] = React.useState("");
    const [audience, setAudience] = React.useState("All Faculty & Students");
    const [targetClass, setTargetClass] = React.useState("");
    const [category, setCategory] = React.useState("Academic");
    const [content, setContent] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const schoolId = user?.user_metadata?.schoolId || "";
    const authorName = user?.user_metadata?.name || user?.email || "Teacher";
    const authorId = user?.id || "";

    // Data states
    const [notices, setNotices] = React.useState<any[]>([]);
    const [isLoadingNotices, setIsLoadingNotices] = React.useState(true);
    const [assignedClasses, setAssignedClasses] = React.useState<any[]>([]);

    const fetchInitialData = async () => {
        setIsLoadingNotices(true);
        try {
            const [noticesRes, schoolAnnRes, classesRes] = await Promise.all([
                getTeacherNotices(schoolId || undefined),
                getSchoolAnnouncements(schoolId || undefined),
                import('@/app/actions/teacher/results').then(m => m.getClasses())
            ]);

            let combinedNotices: any[] = [];
            if (noticesRes.success) {
                combinedNotices = [...(noticesRes.data || []).map((n: any) => ({ ...n, type: 'teacher' }))];
            }
            if (schoolAnnRes.success) {
                combinedNotices = [...combinedNotices, ...(schoolAnnRes.data || []).map((n: any) => ({ ...n, type: 'admin', audience: 'Full School' }))];
            }
            
            // Sort by date
            combinedNotices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
            setNotices(combinedNotices);

            if (classesRes.success) {
                setAssignedClasses(classesRes.data || []);
            }
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setIsLoadingNotices(false);
        }
    };

    React.useEffect(() => {
        fetchInitialData();
    }, [schoolId]);

    const openEditModal = (notice: any) => {
        setEditNotice(notice);
        setTitle(notice.title);
        setContent(notice.content);
        setAudience(notice.audience || "All Faculty & Students");
        setTargetClass(notice.targetClass || "");
        setCategory(notice.category || "Academic");
        setShowPostModal(true);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!',
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a'
        });

        if (result.isConfirmed) {
            const deleteResult = await deleteTeacherNotice(id);
            if (deleteResult.success) {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'The notice has been deleted.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                    color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a'
                });
                fetchInitialData();
            } else {
                toast.error(deleteResult.error || "Failed to delete notice");
            }
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error("Title and Content are required");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = {
                title,
                content,
                audience: audience === "All Faculty & Students" ? "all" : "students",
                targetClass: audience === "All Faculty & Students" ? null : audience, // The audience dropdown is bound to class names for teachers
                category,
                priority: editNotice?.priority || "normal", 
                schoolId,
                authorId,
                authorName
            };

            const result = editNotice
                ? await updateTeacherNotice(editNotice.id, formData)
                : await createTeacherNotice(formData);

            if (result.success) {
                Swal.fire({
                    title: editNotice ? 'Updated!' : 'Published!',
                    text: editNotice ? 'Notice updated successfully.' : 'Notice published successfully!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                    color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a'
                });
                setShowPostModal(false);
                setEditNotice(null);
                setTitle("");
                setContent("");
                setAudience("All Faculty & Students");
                setTargetClass("");
                setCategory("Academic");
                // Reload notices after successful post
                fetchInitialData();
            } else {
                toast.error(result.error || "Failed to publish notice");
            }
        } catch (error) {
            console.error("Error submitting notice:", error);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Formatting Dates
    const formatDate = (isoString?: string | Date | null) => {
        if (!isoString) return "N/A";
        const date = new Date(isoString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const getRelativeTime = (isoString?: string | Date | null) => {
        if (!isoString) return "Just now";
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.round(diffMs / 60000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} mins ago`;
        if (diffMins < 1440) return `${Math.round(diffMins / 60)} hours ago`;
        return `${Math.round(diffMins / 1440)} days ago`;
    };

    const getTagColor = (category: string) => {
        switch (category?.toLowerCase()) {
            case "academic": return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
            case "event": return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
            case "urgent": return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
            case "update": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
            default: return "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300";
        }
    };

    const filteredNotices = notices.filter(notice => {
        // 1. Filter by category/type
        let matchesFilter = true;
        
        if (activeFilter === "General") {
            matchesFilter = notice.type === 'teacher' && (notice.audience === 'all' || !notice.targetClass);
        } else if (activeFilter === "Administration") {
            matchesFilter = notice.type === 'admin';
        } else if (activeFilter === "Class") {
            if (selectedClassFilter) {
                matchesFilter = notice.targetClass === selectedClassFilter;
            } else {
                matchesFilter = !!notice.targetClass && notice.type === 'teacher';
            }
        }

        // 2. Filter by search query
        const matchesSearch =
            notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-fadeIn">
            <TeacherHeader
                title="Notice"
                highlight="Board"
                emoji="📢"
                subtitle="View official announcements and post class notices."
                rightElement={
                    <button
                        onClick={() => setShowPostModal(true)}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95"
                    >
                        <Plus size={18} /> {isAr ? 'نشر إعلان' : 'Post Notice'}
                    </button>
                }
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-bg-card p-1.5 rounded-2xl border border-border-light overflow-x-auto scrollbar-hide">
                        {["all", "General", "Administration", "Class"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => {
                                    setActiveFilter(filter);
                                    if (filter !== "Class") setSelectedClassFilter("");
                                }}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeFilter === filter ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-muted hover:text-text-secondary"}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {activeFilter === "Class" && (
                        <div className="relative animate-slideInRight">
                            <select
                                value={selectedClassFilter}
                                onChange={(e) => setSelectedClassFilter(e.target.value)}
                                className="ps-4 pe-10 py-3 bg-bg-card border border-border-light rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-secondary appearance-none cursor-pointer"
                            >
                                <option value="">Select Class</option>
                                {assignedClasses.map(cls => (
                                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                                ))}
                            </select>
                            <div className="absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                <ChevronRight size={14} className="rotate-90" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" size={18} />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full ps-12 pe-4 py-4 md:py-3.5 bg-bg-card border border-border-light rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-secondary shadow-sm"
                    />
                </div>
            </div>

            <div className="grid gap-6">
                {isLoadingNotices ? (
                    <div className="flex flex-col items-center justify-center p-12 text-text-muted">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-bold animate-pulse">Loading notices...</p>
                    </div>
                ) : filteredNotices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-bg-card rounded-3xl border border-dashed border-border-light text-center">
                        <MessageSquare className="w-12 h-12 text-primary/30 mb-4" />
                        <h3 className="text-lg font-bold text-text-primary mb-2">No Notices Found</h3>
                        <p className="text-sm text-text-muted max-w-sm">There are currently no active announcements matching your filters. Click '{isAr ? 'نشر إعلان' : 'Post Notice'}' to create one.</p>
                    </div>
                ) : (
                    filteredNotices.map((notice) => (
                        <div
                            key={notice.id}
                            className="group bg-bg-card p-6 rounded-3xl border border-border-light shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 relative overflow-hidden"
                        >
                            {notice.priority === "high" || notice.priority === "urgent" ? (
                                <div className="absolute top-0 end-0 p-4">
                                    <Pin size={18} className="text-red-500 rotate-45" />
                                </div>
                            ) : null}

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="space-y-3 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${getTagColor(notice.category)}`}>
                                            {notice.category}
                                        </span>
                                        {notice.type === 'admin' && (
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-amber-500 text-white shadow-sm shadow-amber-500/20">
                                                Administration
                                            </span>
                                        )}
                                        <div className="flex items-center gap-1.5 text-text-muted">
                                            <Calendar size={12} />
                                            <span className="text-xs font-bold">{formatDate(notice.createdAt)}</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors leading-snug">
                                        {notice.title}
                                    </h3>

                                    <p className="text-text-secondary text-sm leading-relaxed max-w-3xl whitespace-pre-wrap">
                                        {notice.content.length > 200
                                            ? `${notice.content.substring(0, 200)}...`
                                            : notice.content}
                                    </p>
                                </div>

                                <div className="flex items-center justify-end">
                                    <button
                                        onClick={() => setSelectedNotice(notice)}
                                        className="flex items-center gap-2 text-sm font-bold text-primary group/btn"
                                    >
                                        Read More
                                        <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                    {notice.type === 'teacher' && (
                                        <div className="flex items-center gap-2 ms-4">
                                            <button
                                                onClick={() => openEditModal(notice)}
                                                className="p-2 hover:bg-primary/10 rounded-lg text-text-muted hover:text-primary transition-all"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(notice.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-text-muted hover:text-red-500 transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border-light/50 flex items-center justify-between">
                                <div className="flex flex-wrap items-center gap-4 text-text-muted">
                                    <div className="flex items-center gap-1.5 bg-bg-page px-3 py-1 rounded-lg border border-border-light/30">
                                        <Users size={12} className="text-primary/70" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">
                                            {notice.audience === 'all' || notice.audience === 'All Faculty & Students' ? 'All Faculty & Students' : `Target: ${notice.targetClass || notice.audience}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">{getRelativeTime(notice.createdAt)}</span>
                                    </div>
                                    {notice.authorName && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-black text-text-muted">By: {notice.authorName} {notice.type === 'admin' ? '(Principal/Admin)' : ''}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-primary/40 uppercase tracking-widest" title={notice.id}>
                                    ID: {notice.type === 'admin' ? 'ADM' : 'TCH'}-{notice.id.slice(-6).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* {isAr ? 'نشر إعلان' : 'Post Notice'} Modal */}
            {showPostModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" onClick={() => { setShowPostModal(false); setEditNotice(null); }}></div>
                    <div className="bg-bg-card w-full max-w-2xl max-h-[90vh] rounded-[3rem] overflow-hidden relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-slideInBottom border border-white/5 flex flex-col">
                        <div className="px-8 md:px-12 py-8 bg-gradient-to-r from-primary to-indigo-700 text-white flex items-center justify-between shrink-0">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-[0.2em]">{editNotice ? 'Update Notice' : 'New Notice'}</h3>
                                <p className="text-white/70 text-[10px] font-bold mt-1 uppercase tracking-widest">{editNotice ? 'Modify your announcement' : 'Broadcast to classes or school'}</p>
                            </div>
                            <button onClick={() => { setShowPostModal(false); setEditNotice(null); }} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 md:p-12 space-y-8 overflow-y-auto flex-1">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">Announcement Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-6 py-4.5 bg-bg-page border border-border-light rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-secondary"
                                    placeholder="e.g. Schedule for Practical Exams"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">{isAr ? "الفئة المستهدفة" : "Target Audience"}</label>
                                    <div className="relative">
                                        <select
                                            value={audience}
                                            onChange={(e) => setAudience(e.target.value)}
                                            className="w-full px-6 py-4 bg-bg-page border border-border-light rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-primary cursor-pointer appearance-none shadow-sm text-text-secondary"
                                        >
                                            <option value="All Faculty & Students">All Faculty & Students</option>
                                            {assignedClasses.map((cls) => (
                                                <option key={cls.id} value={cls.name}>Target: {cls.name}</option>
                                            ))}
                                        </select>
                                        <ChevronRight size={14} className="absolute end-6 top-1/2 -translate-y-1/2 rotate-90 text-text-muted pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">Category</label>
                                    <div className="relative">
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-6 py-4 bg-bg-page border border-border-light rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:border-primary cursor-pointer appearance-none shadow-sm text-text-secondary"
                                        >
                                            <option value="Academic">Academic</option>
                                            <option value="Event">Event</option>
                                            <option value="Urgent">Urgent</option>
                                            <option value="Update">Update</option>
                                        </select>
                                        <ChevronRight size={14} className="absolute end-6 top-1/2 -translate-y-1/2 rotate-90 text-text-muted pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-1">Notice Content</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-6 py-4.5 bg-bg-page border border-border-light rounded-[2rem] text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary min-h-[150px] resize-none text-text-secondary shadow-inner"
                                    placeholder="Detailed announcement goes here..."
                                ></textarea>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setShowPostModal(false)}
                                    disabled={isSubmitting}
                                    className="w-full sm:flex-1 py-5 bg-bg-page border-2 border-border-light text-text-muted rounded-2xl font-black text-[11px] uppercase tracking-widest hover:text-text-primary transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full sm:flex-[2] py-5 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-primary-dark transition-all shadow-2xl shadow-primary/40 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : null}
                                    {isSubmitting ? "Processing..." : editNotice ? "Update Announcement" : "Publish Announcement"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* View Notice Modal */}
            {selectedNotice && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedNotice(null)}></div>
                    <div className="bg-bg-card w-full max-w-3xl max-h-[90vh] rounded-[3rem] overflow-hidden relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-slideInBottom border border-white/5 flex flex-col">
                        <div className="px-8 md:px-12 py-10 bg-gradient-to-r from-bg-card to-bg-card border-b border-border-light/50 flex items-center justify-between shrink-0">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getTagColor(selectedNotice.category)}`}>
                                        {selectedNotice.category}
                                    </span>
                                    <span className="text-[11px] font-bold text-text-muted flex items-center gap-1.5 bg-bg-page px-3 py-1 rounded-full border border-border-light/40">
                                        <Clock size={12} className="text-primary/70" />
                                        {formatDate(selectedNotice.createdAt)}
                                    </span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-text-primary leading-tight tracking-tight">{selectedNotice.title}</h3>
                            </div>
                            <button onClick={() => setSelectedNotice(null)} className="p-3.5 bg-bg-page hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all self-start border border-border-light/50 group">
                                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        <div className="p-8 md:p-12 overflow-y-auto flex-1 space-y-10 custom-scrollbar">
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <p className="text-text-secondary text-base md:text-xl leading-relaxed whitespace-pre-wrap font-medium border-s-4 border-primary/20 ps-6 italic">
                                    {selectedNotice.content}
                                </p>
                            </div>

                            <div className="pt-10 border-t border-border-light/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="bg-bg-page/50 p-5 rounded-3xl border border-border-light/40 space-y-2">
                                    <div className="flex items-center gap-2 text-primary/60">
                                        <Users size={14} />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Audience</p>
                                    </div>
                                    <p className="text-sm font-black text-text-primary truncate">{selectedNotice.audience}</p>
                                </div>
                                <div className="bg-bg-page/50 p-5 rounded-3xl border border-border-light/40 space-y-2">
                                    <div className="flex items-center gap-2 text-primary/60">
                                        <Bell size={14} />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Audience</p>
                                    </div>
                                    <p className="text-sm font-black text-text-primary truncate">{selectedNotice.targetClass || selectedNotice.audience}</p>
                                </div>
                                <div className="bg-bg-page/50 p-5 rounded-3xl border border-border-light/40 space-y-2">
                                    <div className="flex items-center gap-2 text-primary/60">
                                        <Megaphone size={14} />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Posted By</p>
                                    </div>
                                    <p className="text-sm font-black text-text-primary truncate break-all" title={selectedNotice.authorName || (selectedNotice.type === 'admin' ? "Principal/Admin" : "Teacher")}>
                                        {selectedNotice.authorName || (selectedNotice.type === 'admin' ? "Principal/Admin" : "Teacher")}
                                    </p>
                                </div>
                                <div className="bg-bg-page/50 p-5 rounded-3xl border border-border-light/40 space-y-2">
                                    <div className="flex items-center gap-2 text-primary/60">
                                        <Clock size={14} />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Exact Time</p>
                                    </div>
                                    <p className="text-sm font-black text-text-primary">
                                        {selectedNotice.createdAt ? new Date(selectedNotice.createdAt).toLocaleTimeString() : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="px-12 py-8 bg-bg-page/50 border-t border-border-light/50 flex justify-end shrink-0 backdrop-blur-md">
                            <button
                                onClick={() => setSelectedNotice(null)}
                                className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:bg-primary-dark transition-all active:scale-95 shadow-primary/20"
                            >
                                Close Announcement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
