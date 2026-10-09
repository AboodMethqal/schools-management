"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { getAllUsers } from '@/app/actions/superadmin' 
import { useLanguage } from '@/context/LanguageProvider'
import { Mail, Building, Search, User as UserIcon, Loader2, Filter } from 'lucide-react'

export default function UsersList() {
  const { t, language } = useLanguage()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedSchool, setSelectedSchool] = useState("all")

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getAllUsers()
      if (result.success) {
        setUsers(result.data || [])
      } else {
        setError(result.error || (language === 'ar' ? "فشل تحميل بيانات المستخدمين." : "Failed to load user data."))
      }
    } catch (err) {
      setError(language === 'ar' ? "خطأ في الخادم: تعذر جلب البيانات." : "Server error: Unable to fetch data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // Schools list for dropdown
  const schools = useMemo(() => {
    const schoolNames = users
      .map(u => u.school?.schoolName)
      .filter((name): name is string => !!name)
    return ["all", ...Array.from(new Set(schoolNames))]
  }, [users])

  // Roles list for dropdown
  const roles = useMemo(() => {
    const userRoles = users.map(u => u.role).filter(Boolean)
    return ["all", ...Array.from(new Set(userRoles))]
  }, [users])

  // Multi-level filtering
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    
    const matchesSchool = selectedSchool === "all" || user.school?.schoolName === selectedSchool

    return matchesSearch && matchesRole && matchesSchool
  })

  return (
    <div className="space-y-6 p-4">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--color-text-primary)] uppercase tracking-tight">
            {language === 'ar' ? 'مستخدمو النظام' : 'System Users'}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            {language === 'ar' ? 'إدارة وتصفية متقدمة لجميع حسابات المدارس والمشرفين.' : 'Advanced filtering for school administrators.'}
          </p>
        </div>
        <div className="px-4 py-2 bg-[var(--color-primary)]/10 rounded-2xl border border-[var(--color-primary)]/20">
            <span className="text-[var(--color-primary)] font-bold text-sm">
              {language === 'ar' ? `الإجمالي: ${filteredUsers.length} مستخدم` : `Total: ${filteredUsers.length} Users`}
            </span>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--color-bg-card)] p-4 rounded-3xl border border-[var(--color-border-light)]">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder={language === 'ar' ? "البحث بالاسم أو البريد..." : "Search name or email..."} 
            className="w-full ps-10 pe-4 py-2 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Role Filter */}
        <div className="relative">
          <Filter className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select 
            className="w-full ps-10 pe-4 py-2 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none text-sm appearance-none capitalize"
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">{language === 'ar' ? 'جميع الأدوار' : 'All Roles'}</option>
            {roles.filter(r => r !== "all").map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* School Filter */}
        <div className="relative">
          <Building className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select 
            className="w-full ps-10 pe-4 py-2 bg-[var(--color-bg-page)] border border-[var(--color-border-light)] rounded-xl outline-none text-sm appearance-none"
            onChange={(e) => setSelectedSchool(e.target.value)}
          >
            <option value="all">{language === 'ar' ? 'جميع المؤسسات' : 'All Institutions'}</option>
            {schools.filter(s => s !== "all").map(school => (
              <option key={school} value={school}>{school}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border-light)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead className="bg-[var(--color-bg-page)] text-[10px] uppercase font-black tracking-widest text-[var(--color-text-muted)] border-b border-[var(--color-border-light)]">
              <tr>
                <th className="px-6 py-5 text-start">{language === 'ar' ? 'بيانات المستخدم' : 'User Details'}</th>
                <th className="px-6 py-5 text-start">{language === 'ar' ? 'المؤسسة التعليمية' : 'Institution'}</th>
                <th className="px-6 py-5 text-start">{language === 'ar' ? 'الدور' : 'Role'}</th>
                <th className="px-6 py-5 text-end">{language === 'ar' ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-light)]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-[var(--color-text-muted)]">
                    <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                    <p className="text-xs font-bold uppercase tracking-widest">{language === 'ar' ? 'جارٍ جلب البيانات...' : 'Fetching Data...'}</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-rose-50 rounded-full text-rose-500">
                        <UserIcon size={32} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-rose-600 font-bold tracking-tight">{error}</p>
                        <p className="text-xs text-slate-400">{language === 'ar' ? 'يرجى المحاولة مرة أخرى أو مراجعة المسؤول.' : 'Please try again later or contact support.'}</p>
                      </div>
                      <button 
                        onClick={loadUsers}
                        className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold transition-transform active:scale-95"
                      >
                        {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--color-bg-page)]/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 group-hover:from-[var(--color-primary)] group-hover:to-[var(--color-primary)] group-hover:text-white transition-all duration-300">
                          <UserIcon size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-[var(--color-text-primary)]">{user.name}</span>
                          <span className="text-[11px] text-gray-500 flex items-center gap-1"><Mail size={10}/> {user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-bg-page)] rounded-lg border border-[var(--color-border-light)] text-xs font-semibold text-[var(--color-primary)]">
                        <Building size={12} />
                        {user.school?.schoolName || (language === 'ar' ? "إدارة المنصة المركزية" : "Super Admin")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-bold uppercase tracking-tighter text-[var(--color-text-muted)]">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase inline-block ${
                        user.status === 'active'  ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status === 'active' ? (language === 'ar' ? 'نشط' : 'active') : (language === 'ar' ? 'معطل' : 'inactive')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-400 italic">
                    <div className="flex flex-col items-center gap-2">
                       <Search size={32} className="opacity-20 mb-2" />
                       {language === 'ar' ? 'لا توجد نتائج مطابقة لخيارات التصفية.' : 'No results found for current filters.'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
