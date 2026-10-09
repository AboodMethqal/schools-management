"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, Plus, ShieldCheck, ShieldAlert, Edit, Trash2,  Phone, GraduationCap 
} from 'lucide-react'
import { getAllSchools, deleteSchool } from '@/app/actions/school' 
import Swal from 'sweetalert2'
import { useLanguage } from '@/context/LanguageProvider'

export default function SchoolsList() {
  const { language } = useLanguage()
  const isAr = language === 'ar'
  const [searchTerm, setSearchTerm] = useState("")
  const [schools, setSchools] = useState<any[]>([]) 
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const result = await getAllSchools()
    if (result.success) {
      setSchools(result.data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    })

    if (confirm.isConfirmed) {
      const result = await deleteSchool(id)
      if (result.success) {
        Swal.fire(isAr ? 'تم الحذف!' : 'Deleted!', isAr ? 'تم حذف المدرسة بنجاح.' : 'School has been removed.', 'success')
        loadData()
      } else {
        Swal.fire(isAr ? 'خطأ!' : 'Error!', result.error, 'error')
      }
    }
  }

  const filteredSchools = schools.filter((school) =>
    school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight uppercase">{isAr ? 'قائمة المؤسسات والمدارس' : 'Institutions List'}</h2>
          <p className="text-[var(--color-text-muted)] font-medium text-sm">{isAr ? 'مراجعة وإدارة جميع مثيلات وحسابات المدارس.' : 'Review and manage all school instances.'}</p>
        </div>
        <Link href="/dashboard/super-admin/schools/new" className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
          <Plus size={18} /> {isAr ? 'تسجيل مدرسة جديدة' : 'Register School'}
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-[var(--color-bg-card)] p-4 rounded-3xl border border-[var(--color-border-light)] shadow-sm">
        <div className="relative">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
          <input 
            type="text" 
            placeholder={isAr ? "البحث باسم المدرسة أو المعرف..." : "Search by school name or slug..."} 
            className="w-full ps-12 pe-4 py-3 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-2xl outline-none text-sm text-[var(--color-text-primary)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-separate border-spacing-0">
            <thead>
              <tr className="bg-[var(--color-bg-page)] text-[var(--color-text-muted)] text-[10px] uppercase font-black tracking-widest">
                <th className="px-6 py-5 border-b border-[var(--color-border-light)]">{isAr ? 'بيانات المؤسسة' : 'Institution Info'}</th>
                <th className="px-6 py-5 border-b border-[var(--color-border-light)]">{isAr ? 'الهاتف' : 'Phone'}</th>
                <th className="px-6 py-5 border-b border-[var(--color-border-light)]">{isAr ? 'التصنيف' : 'Category'}</th>
                <th className="px-6 py-5 border-b border-[var(--color-border-light)]">{isAr ? 'الباقة' : 'Plan'}</th>
                <th className="px-6 py-5 border-b border-[var(--color-border-light)]">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-5 border-b border-[var(--color-border-light)] text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {loading ? (
                 <tr><td colSpan={6} className="px-6 py-20 text-center font-black text-[var(--color-text-muted)] text-xs uppercase animate-pulse">{isAr ? 'جارٍ تحميل البيانات...' : 'Data Loading...'}</td></tr>
              ) : filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-[var(--color-bg-page)]/40 transition-colors group">
                    <td className="px-6 py-5">
                        <div className="flex flex-col">
                            <span className="font-black text-[var(--color-text-primary)] text-sm tracking-tight">{school.schoolName}</span>
                            <span className="text-[10px] text-[var(--color-primary)] font-bold uppercase tracking-tighter">
                                {school.slug}.yourdomain.com
                            </span>
                        </div>
                    </td>

                    {/* Phone Number Column */}
                    <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-secondary)]">
                            <Phone size={14} className="text-[var(--color-text-muted)]" />
                            {school.phone || "N/A"}
                        </div>
                    </td>

                    <td className="px-6 py-5 uppercase text-[10px] font-black text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-1">
                            <GraduationCap size={14} className="text-[var(--color-primary)]" />
                            {school.schoolCategory}
                        </div>
                    </td>

                    <td className="px-6 py-5">
                       <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                          {school.plan}
                       </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1 w-fit ${
                        school.status === 'Suspended' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {school.status === 'Suspended' ? <ShieldAlert size={12}/> : <ShieldCheck size={12}/>}
                        {school.status || "Active"}
                      </span>
                    </td>

                    {/* Actions: Edit and {isAr ? 'حذف' : 'Delete'} Buttons */}
                    <td className="px-6 py-5 text-end">
                      <div className="flex justify-end items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         {/* Correct Path to your 'update' folder */}
                         <Link 
                            href={`/dashboard/super-admin/schools/update/${school.id}`} 
                            className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-100"
                            title="Edit Institution"
                         >
                            <Edit size={16} />
                         </Link>

                         <button 
                            onClick={() => handleDelete(school.id, school.schoolName)}
                            className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-100"
                            title={isAr ? "حذف المؤسسة" : "Delete Institution"}
                         >
                            <Trash2 size={16} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-6 py-10 text-center font-bold text-[var(--color-text-muted)]">No institutions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
