"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  Calendar,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  FileUp,
  Settings2,
  Edit,
  Trash2
} from "lucide-react";
import { getTeachers, deleteTeacher } from "@/app/actions/teacher";
import { motion, AnimatePresence } from 'framer-motion';

import { useLanguage } from "@/context/LanguageProvider";

function TeacherActions({ teacher, onDeleted }: { teacher: any, onDeleted: () => void }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const handleDelete = async () => {
    if (!confirm(isAr ? `هل أنت متأكد من حذف ${teacher.name}؟` : `Are you sure you want to delete ${teacher.name}?`)) return;
    const res = await deleteTeacher(teacher.id);
    if (res.success) onDeleted();
    else alert(res.error);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 hover:bg-primary/10 rounded-2xl transition-all text-text-muted hover:text-primary active:scale-90"
      >
        <MoreVertical className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute end-0 mt-2 w-48 bg-bg-card border border-border-light rounded-2xl shadow-2xl z-40 overflow-hidden"
            >
              <button
                onClick={() => router.push(`/dashboard/principal/teachers/edit/${teacher.dbId}`)}
                className="w-full px-5 py-4 text-start text-xs font-black uppercase tracking-widest text-text-primary hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
              >
                <Edit size={16} /> {isAr ? "تعديل الملف" : "Edit Profile"}
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-5 py-4 text-start text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-border-light/50"
              >
                <Trash2 size={16} /> {isAr ? "حذف السجل" : "Delete Record"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TeachersPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<any[]>([]);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    async function fetchData() {
      const result = await getTeachers();
      if (result.success && result.data) {
        setTeachers(result.data.map((t: any) => ({
          id: t.teacherId, // The public teacher ID used for routing
          dbId: t.id,      // The internal UUID
          name: t.user?.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'Unknown',
          designation: t.designation,
          department: t.department,
          phone: t.phone,
          status: t.isActive ? "Active" : "Inactive",
        })));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Derived state for filtering
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || teacher.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.status === "Active").length;

  const currentStats = [
    {
      title: "Total Teachers",
      value: totalTeachers.toString(),
      subtitle: "Across all departments",
      icon: Users,
      colorClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      title: "Active Staff",
      value: activeTeachers.toString(),
      subtitle: "Currently on duty",
      icon: GraduationCap,
      colorClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
    },
    {
      title: "Attendance Rate",
      value: "96.4%",
      subtitle: "Last 30 days",
      icon: Calendar,
      colorClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
    },
  ];

  if (loading) return <p className="p-10 font-black animate-pulse text-primary tracking-widest text-xs uppercase">SYNCING FACULTY DATA...</p>;

  return (
    <div className="space-y-8 p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight flex items-center gap-3">
            <GraduationCap className="w-10 h-10 text-primary" />
            Teachers Directory
          </h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic opacity-70">
            Professional faculty roster and profile management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/principal/teachers/add")}
            className="px-8 py-4 bg-primary text-white rounded-2xl text-[11px] font-black hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 hover:-translate-y-2 flex items-center gap-3 uppercase tracking-widest"
          >
            <UserPlus size={20} />
            Onboard New Faculty
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentStats.map((stat, i) => (
          <div key={i} className="bg-bg-card p-8 rounded-3xl border border-border-light shadow-sm flex items-center gap-6">
            <div className={`p-5 rounded-2xl ${stat.colorClass} shadow-inner`}>
              <stat.icon size={32} />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">{stat.title}</h3>
              <p className="text-3xl font-black text-text-primary mt-1 tracking-tighter">{stat.value}</p>
              <p className="text-[10px] text-text-muted font-bold italic opacity-60">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Directory Table */}
      <div className="bg-bg-card rounded-[2.5rem] border border-border-light overflow-hidden shadow-2xl shadow-black/5">
        <div className="p-8 border-b border-border-light flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="space-y-1">
            <h3 className="font-black text-text-primary uppercase tracking-widest text-[11px]">Faculty Inventory</h3>
            <p className="text-[10px] text-text-muted font-bold opacity-50 uppercase tracking-tighter">Real-time database records</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute start-5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 opacity-40" />
              <input
                type="text"
                placeholder="Search by ID, Name or Dept..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ps-14 pe-8 py-3 bg-bg-page/50 border-2 border-border-light rounded-2xl text-sm font-bold focus:outline-none focus:border-primary/30 transition-all w-full md:w-80"
              />
            </div>

            <div className="relative select-wrapper">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none p-4 pe-10 bg-bg-card border-2 border-border-light rounded-2xl text-text-muted hover:bg-bg-page transition-all shadow-sm font-bold text-sm focus:outline-none focus:border-primary/30"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>
              <Filter className="w-4 h-4 absolute end-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start border-collapse">
            <thead className="bg-bg-page/30 text-text-muted uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-10 py-6">ID Profile</th>
                <th className="px-10 py-6">Faculty Name</th>
                <th className="px-10 py-6">Designation</th>
                <th className="px-10 py-6">Dept.</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light/50">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.dbId} className="hover:bg-primary/[0.01] transition-colors group">
                    <td className="px-10 py-8 font-mono text-[11px] font-black text-primary/70">{teacher.id}</td>
                    <td className="px-10 py-8">
                      <div className="font-black text-text-primary text-base leading-none mb-1 group-hover:text-primary transition-colors">{teacher.name}</div>
                      <div className="text-[10px] text-text-muted font-bold opacity-60 uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-primary/20 rounded-full"></span>
                        {teacher.phone}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-text-secondary font-black text-sm tracking-tight">{teacher.designation}</td>
                    <td className="px-10 py-8">
                      <span className="px-4 py-1.5 bg-bg-page border border-border-light rounded-xl text-[10px] font-black uppercase text-text-muted shadow-sm">
                        {teacher.department}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-max ${teacher.status === "Active"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-100"
                        : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${teacher.status === "Active" ? "bg-emerald-500" : "bg-red-500"}`}></span>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-end">
                      <TeacherActions teacher={teacher} onDeleted={() => {
                        setTeachers(prev => prev.filter(t => t.dbId !== teacher.dbId))
                      }} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center">
                    <div className="space-y-3 opacity-30">
                      <Users size={48} className="mx-auto" />
                      <p className="font-black uppercase tracking-[0.2em] text-[10px]">Registry is empty</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
