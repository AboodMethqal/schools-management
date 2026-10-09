"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    Users,
  
    ChevronRight,
    Loader2
} from 'lucide-react';
import { TeacherHeader } from "../TeacherHeader";
import { useLanguage } from "@/context/LanguageProvider";
import { getTeacherDashboardData } from '@/app/actions/teacher/dashboard';

export default function MyClassesPage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const res = await getTeacherDashboardData();
            if (res.success) {
                setData(res.data);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const classes = data?.assignedClasses?.map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        subject: "General",
        studentsCount: data?.stats?.totalStudents || 0,
        room: "N/A",
        schedule: "N/A"
    })) || [];

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
                title={isAr ? "فصولي" : "My"}
                highlight={isAr ? "الدراسية" : "Classes"}
                emoji="🏫"
                subtitle={isAr ? "إدارة الفصول الدراسية النشطة وجلسات الطلاب." : "Manage your active classes and student sessions."}
            />

            <div className="bg-bg-card rounded-3xl border border-border-light shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-border-light flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">{isAr ? "الفصول الدراسية النشطة" : "Active Classes"}</h2>
                        <p className="text-xs font-medium text-text-muted mt-1 uppercase tracking-wider">{isAr ? 'العام الأكاديمي 2026' : 'Academic Year 2026'}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {/* Desktop View */}
                    <table className="w-full text-start hidden md:table">
                        <thead>
                            <tr className="border-b border-border-light text-[10px] font-black uppercase tracking-widest text-text-muted">
                                <th className="py-5 px-8">{isAr ? "اسم الفصل" : "Class Name"}</th>
                                <th className="py-5 px-4 font-black">{isAr ? "الشعبة" : "Section"}</th>
                                <th className="py-5 px-4">{isAr ? "المادة" : "Subject"}</th>
                                <th className="py-5 px-4">{isAr ? "إجمالي الطلاب" : "Total Students"}</th>
                                <th className="py-5 px-8 text-end">{isAr ? "الإجراءات" : "Actions"}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light/50">
                            {classes.map((cls: any) => (
                                <tr key={cls.id} className="group hover:bg-bg-page/40 transition-all duration-200">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <BookOpen size={20} />
                                            </div>
                                            <Link href={`/dashboard/teacher/my-classes/${cls.id}`} className="font-bold text-text-primary group-hover:text-primary transition-colors">
                                                {cls.name.includes(' - ') ? cls.name.split(' - ')[0] : cls.name}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4">
                                        <span className="px-3 py-1 bg-bg-page border border-border-light rounded-lg text-xs font-black text-text-secondary uppercase">
                                            {cls.name.includes(' - ') ? cls.name.split(' - ')[1] : "A"}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4">
                                        <span className="text-sm font-semibold text-text-muted">{cls.subject}</span>
                                    </td>
                                    <td className="py-6 px-4 text-center">
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-primary/60" />
                                            <span className="text-sm font-bold text-text-primary tabular-nums">{isAr ? "نشط" : "Active"}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8 text-end flex items-center justify-end gap-3">
                                        <Link
                                            href={`/dashboard/teacher/my-classes/${cls.id}`}
                                            className="px-4 py-2 bg-text-primary/5 text-text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-text-primary hover:text-white transition-all active:scale-95"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            href={`/dashboard/teacher/attendance`}
                                            className="px-5 py-2.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95 inline-flex items-center gap-2"
                                        >
                                            {isAr ? "الحضور " : "Attendance "}<ChevronRight size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="md:hidden p-4 space-y-4">
                        {classes.map((cls: any) => (
                            <Link
                                key={cls.id}
                                href={`/dashboard/teacher/my-classes/${cls.id}`}
                                className="block bg-bg-page/40 p-4 rounded-2xl border border-border-light/50 space-y-4 active:scale-[0.98] transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary ">
                                            <BookOpen size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-primary">{cls.name}</h4>
                                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{cls.subject}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-text-muted" />
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-border-light/30">
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-primary/60" />
                                        <span className="text-xs font-bold text-text-secondary">{isAr ? "دليل الطلاب" : "Students Directory"}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{isAr ? "الحضور" : "Attendance"}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
